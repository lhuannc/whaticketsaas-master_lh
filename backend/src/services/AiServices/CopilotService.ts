import Message from "../../models/Message";
import Setting from "../../models/Setting";
import Company from "../../models/Company";
import AiService, { AiMessage } from "./AiService";

type CopilotAction = "suggest" | "correct" | "summarize";

interface CopilotRequest {
  ticketId: number;
  companyId: number;
  action: CopilotAction;
  draft?: string;
  historyLimit?: number;
}

const getToneInstruction = (tone: string): string => {
  switch (tone) {
    case "formal": return "Use linguagem formal e profissional.";
    case "casual": return "Use linguagem casual e descontraída.";
    default: return "Use linguagem cordial e amigável.";
  }
};

const getCompanyTone = async (companyId: number): Promise<string> => {
  const setting = await Setting.findOne({ where: { companyId, key: "aiTone" } });
  return setting?.value || "cordial";
};

const getCompanyPersona = async (companyId: number): Promise<string> => {
  const setting = await Setting.findOne({ where: { companyId, key: "aiPersona" } });
  return setting?.value || "Você é um assistente de atendimento ao cliente.";
};

// RAG básico: base de conhecimento por palavra-chave.
// Setting key "aiKnowledgeBase" guarda JSON array de chunks: [{ keywords: string[], text: string }]
const getRelevantKnowledge = async (companyId: number, query: string): Promise<string> => {
  const setting = await Setting.findOne({ where: { companyId, key: "aiKnowledgeBase" } });
  if (!setting?.value) return "";

  let chunks: Array<{ keywords?: string[]; text: string }>;
  try {
    chunks = JSON.parse(setting.value);
  } catch {
    return "";
  }
  if (!Array.isArray(chunks) || chunks.length === 0) return "";

  const qWords = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/\W+/)
    .filter(w => w.length > 3);

  const scored = chunks
    .map(c => {
      const hay = ((c.keywords || []).join(" ") + " " + c.text)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const score = qWords.reduce((acc, w) => acc + (hay.includes(w) ? 1 : 0), 0);
      return { text: c.text, score };
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (scored.length === 0) return "";

  return "\n\nBase de conhecimento relevante:\n" + scored.map(c => `- ${c.text}`).join("\n");
};

const getTicketHistory = async (ticketId: number, limit = 20): Promise<AiMessage[]> => {
  const messages = await Message.findAll({
    where: { ticketId },
    order: [["createdAt", "ASC"]],
    limit
  });

  return messages.map(m => ({
    role: (m.fromMe ? "assistant" : "user") as "user" | "assistant",
    content: m.body || "(mídia)"
  }));
};

const runCopilot = async ({
  ticketId,
  companyId,
  action,
  draft,
  historyLimit = 20
}: CopilotRequest): Promise<string> => {
  const tone = await getCompanyTone(companyId);
  const persona = await getCompanyPersona(companyId);
  const toneInstruction = getToneInstruction(tone);
  const history = await getTicketHistory(ticketId, historyLimit);

  const baseSystem = `${persona}\n${toneInstruction}\nResponda sempre em português brasileiro.`;

  if (action === "suggest") {
    const lastUserMsg = [...history].reverse().find(m => m.role === "user")?.content || "";
    const knowledge = await getRelevantKnowledge(companyId, lastUserMsg);
    const systemPrompt = `${baseSystem}\nCom base no histórico da conversa, sugira uma resposta adequada para o atendente enviar ao cliente. Seja objetivo e direto. Máximo 3 parágrafos.${knowledge}`;
    return AiService.complete(history, systemPrompt, { maxTokens: 400 });
  }

  if (action === "correct") {
    if (!draft) throw new Error("draft is required for action 'correct'");
    const systemPrompt = `${baseSystem}\nReescreva a mensagem a seguir mantendo o mesmo sentido mas melhorando o tom e a gramática. Retorne apenas o texto corrigido, sem explicações.`;
    return AiService.complete([{ role: "user", content: draft }], systemPrompt, { maxTokens: 300 });
  }

  if (action === "summarize") {
    const systemPrompt = `${baseSystem}\nResuma o histórico da conversa em bullet points. Máximo 5 pontos. Inclua: problema do cliente, o que foi feito, próximos passos (se houver).`;
    return AiService.complete(history, systemPrompt, { maxTokens: 300, temperature: 0.3 });
  }

  throw new Error(`Unknown copilot action: ${action}`);
};

export default runCopilot;

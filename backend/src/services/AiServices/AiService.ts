import axios from "axios";
import { logger } from "../../utils/logger";

export interface AiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AiOptions {
  maxTokens?: number;
  temperature?: number;
}

const complete = async (
  messages: AiMessage[],
  systemPrompt: string,
  options: AiOptions = {}
): Promise<string> => {
  const provider = process.env.AI_PROVIDER || "openai";
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || "gpt-4o";

  if (!apiKey) {
    throw new Error("AI_API_KEY not set in .env");
  }

  const allMessages: AiMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages
  ];

  if (provider === "openai") {
    const { data } = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model,
        messages: allMessages,
        max_tokens: options.maxTokens || 500,
        temperature: options.temperature ?? 0.7
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    return data.choices?.[0]?.message?.content?.trim() || "";
  }

  if (provider === "anthropic") {
    const { data } = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: model || "claude-sonnet-4-6",
        max_tokens: options.maxTokens || 500,
        system: systemPrompt,
        messages: messages.map(m => ({ role: m.role === "system" ? "user" : m.role, content: m.content }))
      },
      {
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        }
      }
    );
    return data.content?.[0]?.text?.trim() || "";
  }

  throw new Error(`AI provider "${provider}" not supported. Use openai or anthropic.`);
};

export default { complete };

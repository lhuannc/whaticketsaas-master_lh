import * as Sentry from "@sentry/node";
import { cacheLayer } from "../../libs/cache";
import { logger } from "../../utils/logger";
import Flow from "../../models/Flow";
import Ticket from "../../models/Ticket";
import Contact from "../../models/Contact";
import Queue from "../../models/Queue";
import SendWhatsAppMessage from "../WbotServices/SendWhatsAppMessage";
import SendWhatsAppMessageEvolution from "../WbotServices/SendWhatsAppMessageEvolution";
import AiService from "../AiServices/AiService";
import UpdateTicketService from "../TicketServices/UpdateTicketService";
import Whatsapp from "../../models/Whatsapp";

import { FlowNode, FlowEdge, findNode, findNextNode, resolveMenuTarget } from "./FlowGraph";
export { findNode, findNextNode, resolveMenuTarget } from "./FlowGraph";

const SESSION_TTL = 1800; // 30 min em segundos
const sessionKey = (ticketId: number) => `flow:session:${ticketId}`;

const getSession = async (ticketId: number): Promise<{ nodeId: string; flowId: number } | null> => {
  const raw = await cacheLayer.get(sessionKey(ticketId));
  return raw ? JSON.parse(raw) : null;
};

const setSession = async (ticketId: number, nodeId: string, flowId: number): Promise<void> => {
  await cacheLayer.set(sessionKey(ticketId), JSON.stringify({ nodeId, flowId }), "EX", SESSION_TTL);
};

const clearSession = async (ticketId: number): Promise<void> => {
  await cacheLayer.del(sessionKey(ticketId));
};

const sendToTicket = async (ticket: Ticket, text: string): Promise<void> => {
  const whatsapp = await Whatsapp.findByPk(ticket.whatsappId);
  if (whatsapp?.provider === "evolution") {
    await SendWhatsAppMessageEvolution({ body: text, ticket });
  } else {
    await SendWhatsAppMessage({ body: text, ticket });
  }
};

const executeNode = async (
  node: FlowNode,
  nodes: FlowNode[],
  edges: FlowEdge[],
  ticket: Ticket,
  contact: Contact,
  incomingText: string
): Promise<void> => {
  try {
    switch (node.type) {
      case "message": {
        const text = node.data.text || "";
        await sendToTicket(ticket, text);
        const next = findNextNode(nodes, edges, node.id);
        if (next) await executeNode(next, nodes, edges, ticket, contact, "");
        break;
      }

      case "menu": {
        const options = node.data.options || [];
        let menuText = node.data.text || "Escolha uma opção:\n";
        options.forEach(opt => { menuText += `\n*${opt.key}* - ${opt.label}`; });
        await sendToTicket(ticket, menuText);
        await setSession(ticket.id, node.id, ticket.id);
        break;
      }

      case "queue": {
        const queueId = node.data.queueId;
        if (queueId) {
          await UpdateTicketService({
            ticketData: { queueId, status: "pending" },
            ticketId: ticket.id,
            companyId: ticket.companyId
          });
        }
        await clearSession(ticket.id);
        const next = findNextNode(nodes, edges, node.id);
        if (next) await executeNode(next, nodes, edges, ticket, contact, "");
        break;
      }

      case "funnel": {
        const funnelStage = node.data.funnelStage;
        if (funnelStage) {
          await ticket.update({ funnelStage });
        }
        const next = findNextNode(nodes, edges, node.id);
        if (next) await executeNode(next, nodes, edges, ticket, contact, "");
        break;
      }

      case "ai": {
        const systemPrompt = node.data.aiPrompt || "Você é um assistente de atendimento. Responda em português.";
        const reply = await AiService.complete(
          [{ role: "user", content: incomingText }],
          systemPrompt
        );
        await sendToTicket(ticket, reply);
        await clearSession(ticket.id);
        break;
      }

      case "end":
        await clearSession(ticket.id);
        break;

      default:
        await clearSession(ticket.id);
    }
  } catch (err) {
    Sentry.captureException(err);
    logger.error(`[FlowExecutor] Error at node ${node.id}: ${err}`);
    await clearSession(ticket.id);
  }
};

export const findActiveFlow = async (
  companyId: number,
  channelType: string
): Promise<Flow | null> => {
  return Flow.findOne({
    where: {
      companyId,
      isActive: true,
      triggerType: "first_contact",
      channelType: ["all", channelType]
    }
  });
};

export const processFlowMessage = async (
  ticket: Ticket,
  contact: Contact,
  incomingText: string
): Promise<boolean> => {
  const { companyId } = ticket;
  const session = await getSession(ticket.id);

  if (session) {
    const flow = await Flow.findByPk(session.flowId);
    if (!flow) { await clearSession(ticket.id); return false; }

    const nodes = flow.nodes as FlowNode[];
    const edges = flow.edges as FlowEdge[];
    const currentNode = findNode(nodes, session.nodeId);
    if (!currentNode) { await clearSession(ticket.id); return false; }

    if (currentNode.type === "menu") {
      const options = currentNode.data.options || [];
      const chosen = options.find(o => o.key === incomingText.trim());
      const targetNodeId = chosen?.target;
      const next = targetNodeId ? findNode(nodes, targetNodeId) : findNextNode(nodes, edges, currentNode.id);
      if (next) {
        await setSession(ticket.id, next.id, flow.id);
        await executeNode(next, nodes, edges, ticket, contact, incomingText);
      } else {
        await clearSession(ticket.id);
      }
    }

    return true;
  }

  const flow = await findActiveFlow(companyId, ticket.channel);
  if (!flow) return false;

  const nodes = flow.nodes as FlowNode[];
  const edges = flow.edges as FlowEdge[];
  const startNode = nodes.find(n => n.type === "start");
  if (!startNode) return false;

  const firstNode = findNextNode(nodes, edges, startNode.id);
  if (!firstNode) return false;

  await setSession(ticket.id, firstNode.id, flow.id);
  await executeNode(firstNode, nodes, edges, ticket, contact, incomingText);

  return true;
};

import { Op, Filterable, Includeable } from "sequelize";
import Ticket from "../../models/Ticket";
import Contact from "../../models/Contact";
import Queue from "../../models/Queue";
import User from "../../models/User";
import Tag from "../../models/Tag";
import Whatsapp from "../../models/Whatsapp";

interface Request {
  companyId: number;
  funnelStage?: string;
  userId?: string;
  queueIds?: number[];
}

const STAGES = ["novo", "qualificado", "proposta", "negociacao", "ganho"];

const ListTicketsFunnelService = async ({
  companyId,
  funnelStage,
  userId,
  queueIds
}: Request): Promise<{ stages: Record<string, Ticket[]>; totals: Record<string, number> }> => {
  const whereCondition: Filterable["where"] = {
    companyId,
    status: { [Op.or]: ["open", "pending"] }
  };

  if (funnelStage && funnelStage !== "all") {
    whereCondition.funnelStage = funnelStage;
  }

  if (Array.isArray(queueIds) && queueIds.length > 0) {
    whereCondition.queueId = { [Op.or]: [queueIds, null] };
  }

  const includeCondition: Includeable[] = [
    { model: Contact, as: "contact", attributes: ["id", "name", "number", "profilePicUrl", "channel"] },
    { model: Queue, as: "queue", attributes: ["id", "name", "color"] },
    { model: User, as: "user", attributes: ["id", "name"] },
    { model: Tag, as: "tags", attributes: ["id", "name", "color"] },
    { model: Whatsapp, as: "whatsapp", attributes: ["name"] }
  ];

  const tickets = await Ticket.findAll({
    where: whereCondition,
    include: includeCondition,
    order: [["updatedAt", "DESC"]]
  });

  const stages: Record<string, Ticket[]> = {};
  const totals: Record<string, number> = {};
  STAGES.forEach(s => {
    stages[s] = [];
    totals[s] = 0;
  });

  tickets.forEach(t => {
    const stage = t.funnelStage && STAGES.includes(t.funnelStage) ? t.funnelStage : "novo";
    stages[stage].push(t);
    totals[stage] += Number(t.dealValue || 0);
  });

  return { stages, totals };
};

export default ListTicketsFunnelService;

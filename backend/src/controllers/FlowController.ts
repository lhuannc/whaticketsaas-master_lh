import { Request, Response } from "express";
import AppError from "../errors/AppError";
import Flow from "../models/Flow";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { channelType, isActive } = req.query as Record<string, string>;

  const where: Record<string, any> = { companyId };
  if (channelType) where.channelType = channelType;
  if (isActive !== undefined) where.isActive = isActive === "true";

  const flows = await Flow.findAll({
    where,
    attributes: ["id", "name", "description", "triggerType", "triggerValue", "channelType", "isActive", "createdAt"],
    order: [["name", "ASC"]]
  });

  return res.json(flows);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { flowId } = req.params;
  const { companyId } = req.user;

  const flow = await Flow.findOne({ where: { id: flowId, companyId } });
  if (!flow) throw new AppError("ERR_FLOW_NOT_FOUND", 404);

  return res.json(flow);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { name, description, triggerType, triggerValue, channelType } = req.body;

  if (!name) throw new AppError("ERR_FLOW_NAME_REQUIRED");

  const flow = await Flow.create({
    companyId,
    name,
    description,
    triggerType: triggerType || "first_contact",
    triggerValue,
    channelType: channelType || "all",
    isActive: false,
    nodes: [],
    edges: []
  });

  return res.status(201).json(flow);
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  const { flowId } = req.params;
  const { companyId } = req.user;

  const flow = await Flow.findOne({ where: { id: flowId, companyId } });
  if (!flow) throw new AppError("ERR_FLOW_NOT_FOUND", 404);

  const { name, description, triggerType, triggerValue, channelType, nodes, edges } = req.body;

  await flow.update({
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    ...(triggerType !== undefined && { triggerType }),
    ...(triggerValue !== undefined && { triggerValue }),
    ...(channelType !== undefined && { channelType }),
    ...(nodes !== undefined && { nodes }),
    ...(edges !== undefined && { edges })
  });

  return res.json(flow);
};

export const toggle = async (req: Request, res: Response): Promise<Response> => {
  const { flowId } = req.params;
  const { companyId } = req.user;

  const flow = await Flow.findOne({ where: { id: flowId, companyId } });
  if (!flow) throw new AppError("ERR_FLOW_NOT_FOUND", 404);

  await flow.update({ isActive: !flow.isActive });

  return res.json({ id: flow.id, isActive: flow.isActive });
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  const { flowId } = req.params;
  const { companyId } = req.user;

  const flow = await Flow.findOne({ where: { id: flowId, companyId } });
  if (!flow) throw new AppError("ERR_FLOW_NOT_FOUND", 404);

  await flow.destroy();

  return res.status(204).send();
};

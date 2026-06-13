import axios, { AxiosInstance } from "axios";
import { logger } from "../utils/logger";

const getClient = (): AxiosInstance => {
  const baseURL = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;

  if (!baseURL || !apiKey) {
    throw new Error("EVOLUTION_API_URL and EVOLUTION_API_KEY must be set in .env");
  }

  const client = axios.create({
    baseURL,
    headers: { apikey: apiKey }
  });

  client.interceptors.response.use(
    res => res,
    err => {
      const msg = err?.response?.data?.message || err.message;
      logger.error(`[EvolutionAPI] ${err?.config?.url} → ${msg}`);
      return Promise.reject(err);
    }
  );

  return client;
};

export interface EvolutionInstance {
  instanceName: string;
  status: string;
  qrcode?: string;
}

export interface EvolutionSendTextResponse {
  key: { id: string; remoteJid: string; fromMe: boolean };
  status: string;
}

const evolutionApi = {
  async createInstance(instanceName: string, webhookUrl: string, webhookToken: string): Promise<EvolutionInstance> {
    // Evolution API v2: requer `integration`; webhook é objeto
    const { data } = await getClient().post("/instance/create", {
      instanceName,
      token: webhookToken || undefined,
      qrcode: true,
      integration: "WHATSAPP-BAILEYS",
      webhook: {
        url: webhookUrl,
        byEvents: false,
        base64: true,
        events: ["MESSAGES_UPSERT", "CONNECTION_UPDATE", "QRCODE_UPDATED"]
      }
    });
    return data;
  },

  async connectInstance(instanceName: string): Promise<{ qrcode: string }> {
    const { data } = await getClient().get(`/instance/connect/${instanceName}`);
    // Evolution v2 retorna { base64, code, ... } ou { qrcode: { base64 } } conforme versão
    const qrcode =
      data?.base64 ||
      data?.qrcode?.base64 ||
      (typeof data?.qrcode === "string" ? data.qrcode : "") ||
      data?.code ||
      "";
    return { qrcode };
  },

  async getInstanceStatus(instanceName: string): Promise<EvolutionInstance> {
    const { data } = await getClient().get(`/instance/connectionState/${instanceName}`);
    return { instanceName, status: data?.instance?.state || "close" };
  },

  async deleteInstance(instanceName: string): Promise<void> {
    await getClient().delete(`/instance/delete/${instanceName}`);
  },

  async logoutInstance(instanceName: string): Promise<void> {
    await getClient().delete(`/instance/logout/${instanceName}`);
  },

  async sendText(
    instanceName: string,
    to: string,
    text: string,
    quotedMsgId?: string
  ): Promise<EvolutionSendTextResponse> {
    const payload: Record<string, unknown> = {
      number: to,
      text,
      delay: 0
    };
    if (quotedMsgId) {
      payload.quoted = { key: { id: quotedMsgId } };
    }
    const { data } = await getClient().post(`/message/sendText/${instanceName}`, payload);
    return data;
  },

  async sendMedia(
    instanceName: string,
    to: string,
    mediaUrl: string,
    mediaType: "image" | "video" | "audio" | "document",
    caption?: string,
    fileName?: string
  ): Promise<EvolutionSendTextResponse> {
    const { data } = await getClient().post(`/message/sendMedia/${instanceName}`, {
      number: to,
      mediatype: mediaType,
      media: mediaUrl,
      caption: caption || "",
      fileName: fileName || ""
    });
    return data;
  },

  async sendAudio(instanceName: string, to: string, audioUrl: string): Promise<EvolutionSendTextResponse> {
    const { data } = await getClient().post(`/message/sendWhatsAppAudio/${instanceName}`, {
      number: to,
      audio: audioUrl,
      delay: 0
    });
    return data;
  },

  async fetchProfilePicture(instanceName: string, number: string): Promise<string | null> {
    try {
      const { data } = await getClient().get(`/chat/fetchProfilePictureUrl/${instanceName}`, {
        params: { number }
      });
      return data?.profilePictureUrl || null;
    } catch {
      return null;
    }
  },

  async listInstances(): Promise<EvolutionInstance[]> {
    const { data } = await getClient().get("/instance/fetchInstances");
    return data || [];
  }
};

export default evolutionApi;

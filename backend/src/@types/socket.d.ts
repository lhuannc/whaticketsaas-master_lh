// Eventos emitidos server → client
export interface ServerToClientEvents {
  // Tickets
  [`company-${number}-ticket`]: (payload: {
    action: "create" | "update" | "delete" | "funnel-updated" | "removeFromList";
    ticket?: any;
    ticketId?: number;
  }) => void;

  // Mensagens
  [`company-${number}-appMessage`]: (payload: {
    action: "create" | "update";
    message: any;
    ticket?: any;
    contact?: any;
  }) => void;

  // WhatsApp / Canal
  [`company-${number}-whatsapp`]: (payload: {
    action: "update" | "delete";
    whatsapp: any;
  }) => void;

  [`company-${number}-whatsappSession`]: (payload: {
    action: "update";
    session: any;
  }) => void;

  // Contatos
  [`company-${number}-contact`]: (payload: {
    action: "create" | "update";
    contact: any;
  }) => void;

  // Comentários (IG + LI)
  [`company-${number}-comment`]: (payload: {
    action: "create" | "update";
    comment: any;
  }) => void;

  // Status de canal (Evolution API, IG, LI)
  [`company-${number}-channelStatus`]: (payload: {
    channelType: "whatsapp" | "instagram" | "linkedin";
    instanceId: number | string;
    status: string;
  }) => void;

  // Presença de operador
  [`company-${number}-operator`]: (payload: {
    action: "presence";
    userId: number;
    presence: "online" | "away" | "offline";
  }) => void;

  // Auth (login em outro dispositivo / bloqueio)
  [`company-${number}-auth`]: (payload: {
    action: "blocked" | "multidevice";
    message?: string;
  }) => void;

  // Configurações
  [`company-${number}-settings`]: (payload: {
    action: "update";
    setting: any;
  }) => void;
}

// Eventos emitidos client → server
export interface ClientToServerEvents {
  joinChatBox: (ticketId: string) => void;
  joinNotification: () => void;
  joinTickets: (status: string) => void;
  operatorPresence: (data: { userId: number; presence: string }) => void;
}

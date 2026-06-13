import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { socketConnection } from "../../services/socket";

// Hook que abstrai conexão Socket.io com cleanup automático + toast de reconexão.
// Uso:
//   const socketRef = useSocket(({ socket }) => {
//     socket.on(`company-${companyId}-comment`, handler);
//   });
// O callback recebe { socket, companyId } e roda na conexão. Cleanup (disconnect)
// é automático no unmount. Reconexão dispara toast.
const useSocket = (onConnect) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketConnection({ companyId });
    socketRef.current = socket;

    let wasDisconnected = false;

    socket.on("disconnect", () => {
      wasDisconnected = true;
      toast.warn("Conexão perdida. Reconectando...", { toastId: "socket-reconnect" });
    });

    socket.on("connect", () => {
      if (wasDisconnected) {
        wasDisconnected = false;
        toast.dismiss("socket-reconnect");
        toast.success("Reconectado.", { autoClose: 1500 });
      }
      if (typeof onConnect === "function") {
        onConnect({ socket, companyId });
      }
    });

    // Primeira conexão (socket.io conecta sync-ish; garante chamada inicial)
    if (typeof onConnect === "function") {
      onConnect({ socket, companyId });
    }

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return socketRef;
};

export default useSocket;

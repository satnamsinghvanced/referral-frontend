import { io, Socket } from "socket.io-client";
import { store } from "../store";

let socket: Socket | null = null;
const URL =
  import.meta.env.VITE_API_BASE_URL.replace("/api", "") ||
  "http://localhost:9090";

interface NotificationPayload {
  message: string;
}

export const initSocket = () => {
  const token = store.getState().auth.token;

  if (!token) return null;

  if (!socket) {
    socket = io(URL, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const subscribeToNotifications = (
  callback: (data: NotificationPayload) => void
) => {
  const socketInstance = getSocket();
  if (socketInstance) {
    socketInstance.on("notification", callback);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

import { io, Socket } from "socket.io-client";
import { store } from "../store";

let socket: Socket | null = null;
const URL =
  import.meta.env.VITE_API_BASE_URL.replace("/api", "") ||
  "http://localhost:9090";

interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  metadata?: any;
  createdAt: string;
}

export const initSocket = () => {
  const token = store.getState().auth.token;

  if (!token) {
    console.warn("Socket initialization skipped: No token found");
    return null;
  }

  if (socket && socket.connected) return socket;

  if (!socket) {
    console.log("Initializing socket connection to:", URL);
    socket = io(URL, {
      auth: {
        token: token,
      },
      path: "/referral-retrieve/Referral-Node-Api/socket.io/",
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
  } else if (!socket.connected) {
    socket.connect();
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
  callback: (data: NotificationPayload) => void,
) => {
  const socketInstance = getSocket();
  if (socketInstance) {
    socketInstance.on("new_notification", callback);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

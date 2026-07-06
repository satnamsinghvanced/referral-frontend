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

export interface NewMessagePayload {
  platform: "instagram" | "facebook";
  conversationId: string;
  recipientId: string;
  message: {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    isFromPatient: boolean;
  };
}

export interface NewWebMessagePayload {
  conversationId: string;
  message: {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    isFromPatient: boolean;
  };
}

export const initSocket = () => {
  const token = store.getState().auth.token;
  if (!token) {
    console.warn("Socket initialization skipped: No token found");
    return null;
  }
  if (socket && socket.connected) return socket;
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
  if (!socket) return initSocket();
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

/** Subscribe to live IG / FB direct messages pushed from the Meta webhook */
export const subscribeToNewMessage = (
  callback: (data: NewMessagePayload) => void,
) => {
  const socketInstance = getSocket();
  if (socketInstance) {
    socketInstance.on("new_message", callback);
  }
};

export const unsubscribeFromNewMessage = (
  callback: (data: NewMessagePayload) => void,
) => {
  const socketInstance = getSocket();
  if (socketInstance) {
    socketInstance.off("new_message", callback);
  }
};

/** Subscribe to live Web chat-widget messages */
export const subscribeToNewWebMessage = (
  callback: (data: NewWebMessagePayload) => void,
) => {
  const socketInstance = getSocket();
  if (socketInstance) {
    socketInstance.on("new_web_message", callback);
  }
};

export const unsubscribeFromNewWebMessage = (
  callback: (data: NewWebMessagePayload) => void,
) => {
  const socketInstance = getSocket();
  if (socketInstance) {
    socketInstance.off("new_web_message", callback);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

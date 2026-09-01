import { store } from "../store";

let eventSource: EventSource | null = null;
const listenersMap = new Map<string, Set<(data: any) => void>>();
const eventHandlerWrappers = new Map<string, (e: MessageEvent) => void>();

const URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:9090/api";

const BASE_URL = URL.endsWith("/") ? URL.slice(0, -1) : URL;

export interface NotificationPayload {
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

export const initSSE = (): EventSource | null => {
  const token = store.getState().auth.token;
  if (!token) {
    console.warn("[SSE] Initialization skipped: No token found");
    return null;
  }

  if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
    return eventSource;
  }

  const sseUrl = `${BASE_URL}/events?token=${encodeURIComponent(token)}`;
  console.log("[SSE] Connecting to SSE stream...");
  eventSource = new EventSource(sseUrl);

  eventSource.onopen = () => {
    console.log("[SSE] Connection established");
  };

  eventSource.onerror = (err) => {
    console.error("[SSE] Connection error/closed:", err);
  };

  // Re-attach active event listeners to new eventSource instance
  listenersMap.forEach((callbacks, eventName) => {
    if (!eventHandlerWrappers.has(eventName)) {
      const handler = (e: MessageEvent) => {
        try {
          const parsedData = JSON.parse(e.data);
          callbacks.forEach((cb) => cb(parsedData));
        } catch (parseErr) {
          console.error(`[SSE] Error parsing data for event ${eventName}:`, parseErr);
        }
      };
      eventHandlerWrappers.set(eventName, handler);
    }
    const handler = eventHandlerWrappers.get(eventName)!;
    eventSource?.addEventListener(eventName, handler);
  });

  return eventSource;
};

export const getSSE = () => {
  if (!eventSource || eventSource.readyState === EventSource.CLOSED) {
    return initSSE();
  }
  return eventSource;
};

export const subscribeToEvent = (
  eventName: string,
  callback: (data: any) => void
) => {
  if (!listenersMap.has(eventName)) {
    listenersMap.set(eventName, new Set());
  }
  const callbacks = listenersMap.get(eventName)!;
  callbacks.add(callback);

  if (!eventHandlerWrappers.has(eventName)) {
    const handler = (e: MessageEvent) => {
      try {
        const parsedData = JSON.parse(e.data);
        const currentCallbacks = listenersMap.get(eventName);
        if (currentCallbacks) {
          currentCallbacks.forEach((cb) => cb(parsedData));
        }
      } catch (parseErr) {
        console.error(`[SSE] Error parsing event data for ${eventName}:`, parseErr);
      }
    };
    eventHandlerWrappers.set(eventName, handler);
  }

  const es = getSSE();
  if (es) {
    const handler = eventHandlerWrappers.get(eventName)!;
    es.removeEventListener(eventName, handler); // ensure single binding
    es.addEventListener(eventName, handler);
  }
};

export const unsubscribeFromEvent = (
  eventName: string,
  callback: (data: any) => void
) => {
  const callbacks = listenersMap.get(eventName);
  if (callbacks) {
    callbacks.delete(callback);
    if (callbacks.size === 0) {
      listenersMap.delete(eventName);
      const handler = eventHandlerWrappers.get(eventName);
      if (handler && eventSource) {
        eventSource.removeEventListener(eventName, handler);
      }
      eventHandlerWrappers.delete(eventName);
    }
  }
};

export const subscribeToNotifications = (
  callback: (data: NotificationPayload) => void
) => {
  subscribeToEvent("new_notification", callback);
};

export const subscribeToNewMessage = (
  callback: (data: NewMessagePayload) => void
) => {
  subscribeToEvent("new_message", callback);
};

export const unsubscribeFromNewMessage = (
  callback: (data: NewMessagePayload) => void
) => {
  unsubscribeFromEvent("new_message", callback);
};

export const subscribeToNewWebMessage = (
  callback: (data: NewWebMessagePayload) => void
) => {
  subscribeToEvent("new_web_message", callback);
};

export const unsubscribeFromNewWebMessage = (
  callback: (data: NewWebMessagePayload) => void
) => {
  unsubscribeFromEvent("new_web_message", callback);
};

export const disconnectSSE = () => {
  if (eventSource) {
    console.log("[SSE] Closing connection");
    eventSource.close();
    eventSource = null;
  }
};

// Backward-compatibility aliases
export const initSocket = initSSE;
export const getSocket = () => {
  initSSE();
  return {
    on: (eventName: string, callback: (data: any) => void) => {
      subscribeToEvent(eventName, callback);
    },
    off: (eventName: string, callback: (data: any) => void) => {
      unsubscribeFromEvent(eventName, callback);
    },
    disconnect: disconnectSSE
  };
};
export const disconnectSocket = disconnectSSE;

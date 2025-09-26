import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import QueryProvider from "./providers/QueryProvider";
import ReduxProvider from "./providers/ReduxProvider";

import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. Did you forget to add <div id='root'></div> in index.html?"
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <HeroUIProvider>
      <ReduxProvider>
        <QueryProvider>
          <ToastProvider
            placement="top-right"
            toastProps={{
              // shouldShowTimeoutProgress: true,
              timeout: 4000, // number is expected, not string
              // color: "primary",
              classNames: {
                base: "shadow-none top-1.5",
                content: "gap-x-2",
                closeButton:
                  "opacity-100 absolute right-2 top-1/2 -translate-y-1/2",
                closeIcon: "bg-transparent",
                progressIndicator: "opacity-[0.2]",
              },
            }}
          />
          <main className="light text-foreground bg-background">
            <App />
          </main>
        </QueryProvider>
      </ReduxProvider>
    </HeroUIProvider>
  </StrictMode>
);

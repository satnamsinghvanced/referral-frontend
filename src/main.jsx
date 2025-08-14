import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import ReduxProvider from "./providers/ReduxProvider.jsx";
import QueryProvider from "./providers/QueryProvider.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <ReduxProvider>
        <QueryProvider>
          <ToastProvider
            placement="top-right"
            toastProps={{
              shouldShowTimeoutProgress: true,
              timeout: "4000",
              // color: "primary",
              classNames: {
                base: "shadow-none",
                content: "gap-x-2",
                closeButton:
                  "opacity-100 absolute right-2 top-1/2 -translate-y-1/2",
                closeIcon: "bg-transparent",
                progressIndicator: "opacity-[0.2]",
              },
            }}
          />
          <App />
        </QueryProvider>
      </ReduxProvider>
    </HeroUIProvider>
  </StrictMode>
);

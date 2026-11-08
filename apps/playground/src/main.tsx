import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { AppearanceProvider, ToastProvider } from "@pluscosmic/ui";
import "@pluscosmic/ui/fonts.css";
import "@pluscosmic/ui/styles.css";
import { App } from "./App";

const root = document.getElementById("app");
if (root) {
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <AppearanceProvider storageKey="playground">
        <ToastProvider>
          <App />
        </ToastProvider>
      </AppearanceProvider>
    </StrictMode>,
  );
}

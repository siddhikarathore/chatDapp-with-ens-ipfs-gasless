import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom'
import "./styles/index.css";
import App from "./App";

const futureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

// Suppress WalletConnect reverse profile 404 by stubbing the response
if (typeof window !== "undefined" && typeof window.fetch === "function") {
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const url = typeof input === "string" ? input : (input as URL | Request).toString();
      if (url.startsWith("https://rpc.walletconnect.com/v1/profile/reverse/")) {
        return new Response(JSON.stringify({ name: null }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (_) {
      // fall through to original fetch on parsing errors
    }
    return originalFetch(input as any, init);
  };
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter future={futureFlags}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Buffer } from "buffer";
window.Buffer = Buffer;

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("#root element not found");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js") // Let op: in build wordt het een .js bestand
      .then((reg) => console.log("SW registered: ", reg))
      .catch((err) => console.log("SW registration failed: ", err));
  });
}

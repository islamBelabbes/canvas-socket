import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { DrawProvider } from "./providers/draw-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DrawProvider>
      <App />
    </DrawProvider>
  </React.StrictMode>
);

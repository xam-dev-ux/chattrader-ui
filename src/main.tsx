import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0A0A0A;
    color: #C0C0C0;
    font-family: 'IBM Plex Mono', 'Courier Prime', monospace;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  @keyframes scanlines {
    0% { background-position: 0 0; }
    100% { background-position: 0 4px; }
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 3px,
      rgba(0, 255, 65, 0.015) 3px,
      rgba(0, 255, 65, 0.015) 4px
    );
    pointer-events: none;
    z-index: 9999;
    animation: scanlines 8s linear infinite;
  }

  table { font-size: 12px; }
  td, th { padding: 5px 8px; border-bottom: 1px solid #111; }
  td:first-child, th:first-child { padding-left: 16px; }
  td:last-child, th:last-child { padding-right: 16px; }
  tr:hover td { background: rgba(255,255,255,0.015); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0A0A0A; }
  ::-webkit-scrollbar-thumb { background: #1A1A1A; }
`;
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

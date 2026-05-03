import { useEffect, useState } from "react";

type Props = { lastFetch: number };

export function LiveIndicator({ lastFetch }: Props) {
  const [now, setNow] = useState(Date.now());
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const blink = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(blink);
  }, []);

  const delta = now - lastFetch;
  const status = delta < 15000 ? "LIVE" : delta < 60000 ? "DELAYED" : "OFFLINE";
  const color = status === "LIVE" ? "#00FF41" : status === "DELAYED" ? "#FF6B00" : "#FF2D55";
  const ago = delta < 5000 ? "just now" : `${Math.floor(delta / 1000)}s ago`;

  return (
    <span style={{ color, display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ animation: "pulse 1.5s infinite" }}>●</span>
      {status} {cursor ? "▋" : " "}
      <span style={{ color: "#555", fontSize: 11, marginLeft: 4 }}>↑ {ago}</span>
    </span>
  );
}

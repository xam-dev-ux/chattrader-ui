import { useEffect, useRef, useState } from "react";
import type { Stats } from "../api";

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

function StatCard({ label, value }: { label: string; value: string }) {
  const [flash, setFlash] = useState(false);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      prev.current = value;
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 300);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div style={{
      flex: 1,
      border: "1px solid #1A1A1A",
      padding: "12px 16px",
      background: flash ? "rgba(0,255,65,0.07)" : "transparent",
      transition: "background 0.3s",
    }}>
      <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 24, color: "#00FF41", fontFamily: "inherit", fontWeight: "bold" }}>
        {value}
      </div>
    </div>
  );
}

export function StatCards({ stats }: { stats: Stats | null }) {
  return (
    <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1A1A1A" }}>
      <StatCard label="SWAPS" value={stats ? String(stats.totalSwaps) : "—"} />
      <StatCard label="VOL (USDC)" value={stats ? stats.totalVolumeUSDC.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"} />
      <StatCard label="PAYMENTS" value={stats ? String(stats.totalPaymentsReceived) : "—"} />
      <StatCard label="UPTIME" value={stats ? formatUptime(stats.uptime) : "—"} />
    </div>
  );
}

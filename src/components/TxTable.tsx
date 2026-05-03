import { useEffect, useRef, useState } from "react";
import type { Transaction } from "../api";

function truncateHash(hash: string): string {
  if (hash.length < 12) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

function typeLabel(type: Transaction["type"]): { label: string; color: string } {
  switch (type) {
    case "swap":             return { label: "SWAP",    color: "#00FF41" };
    case "payment_received": return { label: "PAY IN",  color: "#FF6B00" };
    case "payment_sent":     return { label: "PAY OUT", color: "#555" };
  }
}

function statusColor(status: Transaction["status"]): string {
  switch (status) {
    case "confirmed": return "#00FF41";
    case "pending":   return "#FF6B00";
    case "failed":    return "#FF2D55";
  }
}

function TxRow({ tx, isNew }: { tx: Transaction; isNew: boolean }) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isNew) requestAnimationFrame(() => setVisible(true));
    else setVisible(true);
  }, [isNew]);

  function copyHash() {
    navigator.clipboard.writeText(tx.txHash).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  }

  const time = new Date(tx.timestamp).toLocaleTimeString("en", { hour12: false });
  const { label, color } = typeLabel(tx.type);
  const amount = tx.amountIn != null
    ? `${tx.amountIn} ${tx.tokenIn ?? ""}`
    : tx.amountOut != null
    ? `${tx.amountOut} ${tx.tokenOut ?? ""}`
    : "—";

  return (
    <tr style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(-8px)",
      transition: "opacity 200ms ease-out, transform 200ms ease-out",
    }}>
      <td style={{ color: "#888" }}>{time}</td>
      <td style={{ color }}>{label}</td>
      <td>{amount}</td>
      <td>
        <span
          onClick={copyHash}
          style={{ cursor: "pointer", color: copied ? "#00FF41" : "#888", textDecoration: "underline dotted" }}
          title={tx.txHash}
        >
          {copied ? "COPIED" : truncateHash(tx.txHash)}
        </span>
      </td>
      <td style={{ color: statusColor(tx.status) }}>
        ● {tx.status.toUpperCase()}
      </td>
    </tr>
  );
}

export function TxTable({ transactions }: { transactions: Transaction[] }) {
  const prevLen = useRef(0);
  const visible = transactions.slice(0, 100);

  const newCount = transactions.length > prevLen.current
    ? transactions.length - prevLen.current
    : 0;

  useEffect(() => { prevLen.current = transactions.length; }, [transactions.length]);

  return (
    <div style={{ flex: 1, overflow: "hidden" }}>
      <div style={{
        borderBottom: "1px solid #1A1A1A",
        padding: "6px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>Transaction Log</span>
      </div>
      <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 280px)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>
              <th style={{ padding: "6px 16px", textAlign: "left", fontWeight: "normal" }}>TIME</th>
              <th style={{ padding: "6px 8px", textAlign: "left", fontWeight: "normal" }}>TYPE</th>
              <th style={{ padding: "6px 8px", textAlign: "left", fontWeight: "normal" }}>AMOUNT</th>
              <th style={{ padding: "6px 8px", textAlign: "left", fontWeight: "normal" }}>TX HASH</th>
              <th style={{ padding: "6px 16px", textAlign: "left", fontWeight: "normal" }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "24px 16px", color: "#555", textAlign: "center" }}>
                  WAITING FOR TRANSACTIONS<BlinkingCursor />
                </td>
              </tr>
            ) : (
              visible.map((tx, i) => (
                <TxRow key={tx.txHash + tx.timestamp} tx={tx} isNew={i < newCount} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BlinkingCursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => !v), 530);
    return () => clearInterval(t);
  }, []);
  return <span style={{ opacity: on ? 1 : 0 }}>▋</span>;
}

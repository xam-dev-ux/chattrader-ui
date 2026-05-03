import { useEffect, useState, useRef } from "react";
import { fetchTransactions, fetchStats, type Transaction, type Stats } from "./api";
import { LiveIndicator } from "./components/LiveIndicator";
import { StatCards } from "./components/StatCards";
import { TxTable } from "./components/TxTable";

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [lastFetch, setLastFetch] = useState(0);
  const [botAddress, setBotAddress] = useState("");
  const [builderCode, setBuilderCode] = useState("");

  async function poll() {
    try {
      const [txRes, statsRes] = await Promise.all([fetchTransactions(), fetchStats()]);
      setTransactions(txRes.transactions);
      setBotAddress(txRes.botAddress);
      setBuilderCode(txRes.builderCode);
      setStats(statsRes);
      setLastFetch(Date.now());
    } catch {
      // silent — LiveIndicator will show DELAYED/OFFLINE
    }
  }

  useEffect(() => {
    poll();
    const interval = setInterval(poll, 10000);
    return () => clearInterval(interval);
  }, []);

  const addrShort = botAddress ? `${botAddress.slice(0, 6)}...${botAddress.slice(-4)}` : "—";

  return (
    <div style={{
      background: "#0A0A0A",
      color: "#C0C0C0",
      fontFamily: "'IBM Plex Mono', 'Courier Prime', monospace",
      fontSize: 13,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1A1A1A",
        padding: "10px 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <span style={{ color: "#00FF41", fontWeight: "bold", fontSize: 15 }}>CHATTRADER</span>
          <span style={{ color: "#333", margin: "0 12px" }}>|</span>
          <span style={{ color: "#555", fontSize: 11 }}>Base Mainnet Agent Dashboard</span>
        </div>
        <div style={{ display: "flex", gap: 20, alignItems: "center", fontSize: 11 }}>
          <LiveIndicator lastFetch={lastFetch} />
          <span style={{ color: "#555" }}>BOT: <span style={{ color: "#888" }}>{addrShort}</span></span>
          {builderCode && <span style={{ color: "#555" }}>{builderCode}</span>}
        </div>
      </div>

      {/* Stats */}
      <StatCards stats={stats} />

      {/* Tx Table */}
      <TxTable transactions={transactions} />

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #1A1A1A",
        padding: "10px 16px",
        fontSize: 11,
        color: "#555",
      }}>
        <div style={{ marginBottom: 4 }}>HOW TO TALK TO CHATTRADER</div>
        <div>
          &gt; Open Base App → search <span style={{ color: "#888" }}>{botAddress || "BOT_ADDRESS"}</span> → send a message
        </div>
        <div style={{ marginTop: 2, color: "#444" }}>
          &gt; "price of eth" &nbsp; "analyze btc" &nbsp; "swap 10 usdc to eth"
        </div>
      </div>
    </div>
  );
}

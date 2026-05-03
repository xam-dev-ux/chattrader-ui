const BASE = import.meta.env.VITE_AGENT_API_URL ?? "https://chattrader.onrender.com";

export type Transaction = {
  type: "swap" | "payment_received" | "payment_sent";
  txHash: string;
  amountIn?: number;
  amountOut?: number;
  tokenIn?: string;
  tokenOut?: string;
  from?: string;
  timestamp: number;
  builderCode?: string;
  status: "confirmed" | "pending" | "failed";
};

export type Stats = {
  totalSwaps: number;
  totalVolumeUSDC: number;
  totalPaymentsReceived: number;
  uptime: number;
  botAddress: string;
  builderCode: string;
};

export type TxResponse = {
  transactions: Transaction[];
  botAddress: string;
  builderCode: string;
};

export async function fetchTransactions(): Promise<TxResponse> {
  const res = await fetch(`${BASE}/api/transactions`);
  if (!res.ok) throw new Error("fetch transactions failed");
  return res.json() as Promise<TxResponse>;
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${BASE}/api/stats`);
  if (!res.ok) throw new Error("fetch stats failed");
  return res.json() as Promise<Stats>;
}

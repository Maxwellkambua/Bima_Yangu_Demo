"use client";
import {
  ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, Tooltip,
  Scatter, CartesianGrid, Legend,
} from "recharts";
import { SimulationResult } from "@/lib/types";
import { ksh } from "@/lib/format";

export function CashflowChart({ result }: { result: SimulationResult }) {
  const data = result.balanceSeries.map((b) => ({
    day: b.day,
    balance: b.balance / 100,
    savings: b.savings / 100,
  }));
  const sweeps = result.decisions
    .filter((d) => d.action === "SWEEP")
    .map((d) => ({ day: d.day, amount: d.amountCents / 100 }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid stroke="#f5f5f4" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#78716c" }} />
        <YAxis tick={{ fontSize: 11, fill: "#78716c" }} tickFormatter={(v) => `${v / 1000}k`} />
        <Tooltip
          formatter={(v: number) => `KSh ${v.toLocaleString()}`}
          labelFormatter={(d) => `Day ${d}`}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone" dataKey="balance" stroke="#0F766E" strokeWidth={2}
          dot={false} name="M-Pesa balance"
        />
        <Line
          type="monotone" dataKey="savings" stroke="#F59E0B" strokeWidth={2}
          dot={false} name="Savings"
        />
        <Scatter
          data={sweeps} dataKey="amount" fill="#0F766E" name="AI sweeps"
          shape="diamond"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
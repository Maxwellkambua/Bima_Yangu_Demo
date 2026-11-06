"use client";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, Legend,
} from "recharts";
import { SimulationResult } from "@/lib/types";

export function SavingsChart({ ai, naive }: { ai: SimulationResult; naive: SimulationResult }) {
  const data = ai.balanceSeries.map((b, i) => ({
    day: b.day,
    ai: b.savings / 100,
    naive: naive.balanceSeries[i].savings / 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
        <CartesianGrid stroke="#f5f5f4" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#78716c" }} />
        <YAxis tick={{ fontSize: 11, fill: "#78716c" }} tickFormatter={(v) => `${v / 1000}k`} />
        <Tooltip formatter={(v: number) => `KSh ${v.toLocaleString()}`} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="ai" stroke="#0F766E" strokeWidth={2}
          dot={false} name="AI-timed sweeps" />
        <Line type="monotone" dataKey="naive" stroke="#A8A29E" strokeWidth={2}
          dot={false} strokeDasharray="4 4" name="Naive weekly sweeps" />
      </LineChart>
    </ResponsiveContainer>
  );
}
import { SimulationResult } from "@/lib/types";
import { ksh } from "@/lib/format";
import { TrendingUp, ShieldCheck, AlertTriangle, Hand } from "lucide-react";

export function MetricsPanel({
  ai, naive,
}: { ai: SimulationResult; naive: SimulationResult }) {
  const delta = ai.netSavedCents - naive.netSavedCents;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Metric
        icon={<TrendingUp className="w-4 h-4" />}
        label="Net saved · AI"
        value={ksh(ai.netSavedCents)}
        sub={`vs ${ksh(naive.netSavedCents)} naive`}
        accent={delta > 0 ? "positive" : "negative"}
      />
      <Metric
        icon={<Hand className="w-4 h-4" />}
        label="AI sweeps"
        value={ai.sweepCount.toString()}
        sub={`${ai.holdbackCount} held back for obligations`}
      />
      <Metric
        icon={<AlertTriangle className="w-4 h-4" />}
        label="Emergency withdrawals"
        value={ksh(ai.totalWithdrawnCents)}
        sub={`vs ${ksh(naive.totalWithdrawnCents)} naive`}
        accent={ai.totalWithdrawnCents < naive.totalWithdrawnCents ? "positive" : "negative"}
      />
      <Metric
        icon={<ShieldCheck className="w-4 h-4" />}
        label="Failed sweeps"
        value={ai.failedSweeps.toString()}
        sub={`vs ${naive.failedSweeps} naive`}
      />
    </div>
  );
}

function Metric({
  icon, label, value, sub, accent,
}: {
  icon: React.ReactNode; label: string; value: string; sub: string;
  accent?: "positive" | "negative";
}) {
  const color =
    accent === "positive" ? "text-emerald-700"
    : accent === "negative" ? "text-rose-700"
    : "text-stone-900";
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-xs text-stone-500">
        {icon} {label}
      </div>
      <div className={`text-2xl font-semibold mt-2 ${color}`}>{value}</div>
      <div className="text-xs text-stone-500 mt-1">{sub}</div>
    </div>
  );
}
"use client";
import { useState } from "react";
import { Decision } from "@/lib/types";
import { ksh, reasonLabel } from "@/lib/format";
import { ChevronDown, CheckCircle2, PauseCircle } from "lucide-react";

export function DecisionLog({ decisions }: { decisions: Decision[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  // most recent first, show 40
  const list = [...decisions].reverse().slice(0, 40);
  return (
    <div className="max-h-[420px] overflow-y-auto pr-2 space-y-1">
      {list.map((d) => {
        const isSweep = d.action === "SWEEP";
        const open = expanded === d.day;
        const showable = isSweep || d.reasons.some((r) => r === "obligation_window");
        if (!showable) return null;
        return (
          <div
            key={d.day}
            className="border border-stone-100 rounded-lg px-3 py-2 hover:border-stone-200 cursor-pointer"
            onClick={() => setExpanded(open ? null : d.day)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                {isSweep ? (
                  <CheckCircle2 className="w-4 h-4 text-brand" />
                ) : (
                  <PauseCircle className="w-4 h-4 text-amber-600" />
                )}
                <span className="font-medium">Day {d.day}</span>
                <span className="text-stone-500">
                  {isSweep ? `Swept ${ksh(d.amountCents)}` : "Held back"}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition ${open ? "rotate-180" : ""}`}
              />
            </div>
            {open && (
              <div className="mt-2 text-xs text-stone-600 space-y-1 pl-6">
                <div>Balance before: <span className="font-mono">{ksh(d.balanceBeforeCents)}</span></div>
                <div>Predicted 7-day need: <span className="font-mono">{ksh(d.predictedNeed7dCents)}</span></div>
                {d.reasons.length > 0 && (
                  <div className="pt-1">
                    {d.reasons.map((r) => (
                      <span key={r} className="pill bg-stone-100 text-stone-700 mr-1">
                        {reasonLabel(r)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
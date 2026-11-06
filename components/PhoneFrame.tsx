"use client";
import { useState } from "react";
import { Persona, SimulationResult } from "@/lib/types";
import { ksh } from "@/lib/format";

const MENU = `Bima Yangu
1. Salio (balance)
2. Weka akiba (save)
3. Badilisha mipangilio
4. Zima akiba otomatiki`;

export function PhoneFrame({ persona, result }: { persona: Persona; result: SimulationResult }) {
  const [screen, setScreen] = useState<"menu" | "balance" | "amount" | "sent">("menu");
  const latestSweep = [...result.decisions].reverse().find((d) => d.action === "SWEEP");
  const latestHoldback = [...result.decisions].reverse().find((d) =>
    d.reasons.includes("obligation_window")
  );
  const balance = result.balanceSeries[result.days - 1]?.balance ?? 0;
  const savings = result.balanceSeries[result.days - 1]?.savings ?? 0;

  return (
    <div className="w-[260px]">
      <div className="bg-stone-900 rounded-[2rem] p-3 shadow-xl">
        <div className="bg-black rounded-[1.4rem] aspect-[9/19] p-3 flex flex-col text-white text-sm">
          <div className="text-[10px] text-stone-400 text-center mb-2">
            {persona.name}'s phone · demo
          </div>

          {/* SMS banner: latest sweep or holdback */}
          <div className="bg-emerald-900/60 rounded-lg p-2 mb-2 text-[11px] leading-snug">
            <div className="text-emerald-300 text-[9px] font-semibold mb-0.5">
              BIMA YANGU · SMS
            </div>
            {latestSweep && latestHoldback && latestSweep.day > latestHoldback.day ? (
              <>Tumeweka {ksh(latestSweep.amountCents)} akiba yako. Salio: {ksh(savings)}.</>
            ) : latestHoldback ? (
              <>Tulibakiza akiba yako — ada au kodi inaonekana karibu. Salio: {ksh(savings)}.</>
            ) : (
              <>Karibu Bima Yangu.</>
            )}
          </div>

          {/* USSD screen */}
          <div className="flex-1 bg-stone-100 rounded-lg p-3 text-stone-900 font-mono text-[11px] leading-relaxed">
            {screen === "menu" && (
              <>
                <div className="whitespace-pre-line">{MENU}</div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {["1", "2", "3", "4"].map((n) => (
                    <button
                      key={n}
                      onClick={() => setScreen(n === "1" ? "balance" : "amount")}
                      className="bg-stone-300 rounded px-2 py-1 text-[10px] hover:bg-brand hover:text-white"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </>
            )}
            {screen === "balance" && (
              <>
                <div>M-Pesa: {ksh(balance)}</div>
                <div>Akiba: {ksh(savings)}</div>
                <button onClick={() => setScreen("menu")}
                  className="mt-3 text-[10px] underline text-brand">
                  back
                </button>
              </>
            )}
            {screen === "amount" && (
              <>
                <div>Weka kiasi gani?</div>
                {[50, 100, 200].map((a) => (
                  <button
                    key={a}
                    onClick={() => setScreen("sent")}
                    className="block mt-1 bg-stone-300 rounded px-2 py-1 text-[10px] hover:bg-brand hover:text-white"
                  >
                    KSh {a}
                  </button>
                ))}
                <button onClick={() => setScreen("menu")}
                  className="mt-3 text-[10px] underline text-brand">
                  back
                </button>
              </>
            )}
            {screen === "sent" && (
              <>
                <div>Tumetuma ombi kwenye simu yako. Weka PIN.</div>
                <button onClick={() => setScreen("menu")}
                  className="mt-3 text-[10px] underline text-brand">
                  back
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="text-[10px] text-stone-500 text-center mt-2">
        Simulated USSD · In production: real M-Pesa STK push
      </div>
    </div>
  );
}
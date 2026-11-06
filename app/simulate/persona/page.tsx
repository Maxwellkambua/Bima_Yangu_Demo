import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPersona } from "@/lib/personas";
import { simulate } from "@/lib/simulation";
import { MetricsPanel } from "@/components/MetricsPanel";
import { CashflowChart } from "@/components/CashflowChart";
import { SavingsChart } from "@/components/SavingsChart";
import { DecisionLog } from "@/components/DecisionLog";
import { PhoneFrame } from "@/components/PhoneFrame";

export default function SimulatePage({ params }: { params: { persona: string } }) {
  const persona = getPersona(params.persona);
  if (!persona) notFound();
  const { ai, naive } = simulate(persona);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-brand mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> All personas
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-sm text-brand font-medium">{persona.role}</div>
          <h1 className="text-3xl font-bold">
            {persona.name} <span className="text-stone-400 font-normal">·</span>{" "}
            <span className="text-stone-500 font-normal text-xl">{persona.location}</span>
          </h1>
          <p className="text-stone-600 mt-1 max-w-xl text-sm">{persona.bio}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-stone-500">Simulation window</div>
          <div className="font-semibold">90 days</div>
        </div>
      </header>

      <MetricsPanel ai={ai} naive={naive} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="card p-6">
          <h2 className="font-semibold mb-1">Cashflow & decisions</h2>
          <p className="text-xs text-stone-500 mb-4">
            Green = money in · amber = money out · teal dot = AI sweep
          </p>
          <CashflowChart result={ai} />
        </div>
        <div className="card p-6">
          <h2 className="font-semibold mb-1">Savings balance: AI vs naive</h2>
          <p className="text-xs text-stone-500 mb-4">
            Naive sweeps harder, but loses more to emergency withdrawals.
          </p>
          <SavingsChart ai={ai} naive={naive} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold mb-4">Decision log</h2>
          <DecisionLog decisions={ai.decisions} />
        </div>
        <div className="card p-6 flex items-start justify-center">
          <PhoneFrame persona={persona} result={ai} />
        </div>
      </div>

      <div className="card p-6 mt-4">
        <h2 className="font-semibold mb-2">What the AI actually did</h2>
        <ul className="text-sm text-stone-700 space-y-2 mt-3">
          <li>· Forecasts the next 7 days of outflows from the last 30 days of history (median daily outflow + detected upcoming obligations, with a 10% buffer).</li>
          <li>· Holds back entirely during obligation windows (rent, school fees, loan repayments).</li>
          <li>· Sweeps only the amount above <em>forecast need + KSh 500 safety reserve</em>, capped at KSh 500 per sweep, once per day.</li>
          <li>· Every decision is recorded with human-readable reason codes — this is what becomes an SMS in production.</li>
        </ul>
      </div>
    </main>
  );
}
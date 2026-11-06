import Link from "next/link";
import { PERSONAS } from "@/lib/personas";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center gap-2 text-brand font-semibold mb-4">
        <Sparkles className="w-5 h-5" />
        Bima Yangu — working demo
      </div>
      <h1 className="text-5xl font-bold tracking-tight max-w-3xl">
        AI that saves for you, only when you can afford it.
      </h1>
      <p className="mt-4 text-lg text-stone-600 max-w-2xl">
        A demonstration of savings autopilot for Kenya's informal workers.
        All data below is synthetic. Pick a persona to see 90 days of
        cashflow, and how the AI-vs-naive savings strategy plays out.
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
        {PERSONAS.map((p) => (
          <Link
            key={p.id}
            href={`/simulate/${p.id}`}
            className="card p-6 hover:border-brand hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-brand font-medium">{p.role}</div>
                <div className="text-2xl font-semibold mt-1">{p.name}</div>
                <div className="text-sm text-stone-500">{p.location}</div>
              </div>
              <ArrowRight className="w-5 h-5 text-stone-400 group-hover:text-brand transition" />
            </div>
            <p className="mt-4 text-stone-600 text-sm leading-relaxed">{p.bio}</p>
            <p className="mt-4 text-xs font-medium text-accent">{p.tagline}</p>
          </Link>
        ))}
      </div>

      <p className="mt-12 text-xs text-stone-500 max-w-2xl">
        This is a demo, not a product. In production, sweeps would be one-tap STK
        Push on M-Pesa, funds custodied at a licensed fund manager, and every
        decision explained via SMS. See README for the full architecture.
      </p>
    </main>
  );
}
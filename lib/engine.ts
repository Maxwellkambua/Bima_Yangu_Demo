import {
  CashflowEvent, Decision, SweepRule,
} from "./types";

const LOOKBACK = 30;
const OBLIGATION_LOOKAHEAD = 7;   // days
const LARGE_OUTFLOW = 300_000;    // KSh 3,000 — threshold for "obligation"

function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function groupDailyOutflow(
  history: CashflowEvent[], from: number, to: number,
): number[] {
  const byDay = new Map<number, number>();
  for (const e of history) {
    if (e.day < from || e.day > to) continue;
    if (e.direction !== "OUT") continue;
    byDay.set(e.day, (byDay.get(e.day) ?? 0) + e.amountCents);
  }
  return Array.from(byDay.values());
}

/** Detect recurring large outflows in history and predict ones due within N days. */
function upcomingObligations(
  history: CashflowEvent[], asOf: number, lookaheadDays: number,
): number {
  const lookback = asOf - 35;
  // Find historical obligation days (large outflows)
  const obligationDays = new Set<number>();
  const amountsByDom = new Map<number, number[]>();
  for (const e of history) {
    if (e.day < lookback || e.day > asOf) continue;
    if (e.direction !== "OUT" || e.amountCents < LARGE_OUTFLOW) continue;
    const dom = e.day % 30;
    obligationDays.add(dom);
    const arr = amountsByDom.get(dom) ?? [];
    arr.push(e.amountCents);
    amountsByDom.set(dom, arr);
  }
  let total = 0;
  for (const dom of obligationDays) {
    // Does the day-of-month fall within [asOf, asOf+lookahead]?
    const asOfDom = asOf % 30;
    for (let k = 0; k <= lookaheadDays; k++) {
      if ((asOfDom + k) % 30 === dom) {
        const amts = amountsByDom.get(dom) ?? [];
        total += amts.length
          ? Math.round(amts.reduce((a, b) => a + b, 0) / amts.length)
          : LARGE_OUTFLOW;
        break;
      }
    }
  }
  return total;
}

function predictNeed7d(history: CashflowEvent[], asOf: number): number {
  const dailyOut = groupDailyOutflow(history, Math.max(0, asOf - LOOKBACK), asOf);
  if (dailyOut.length === 0) {
    // cold start: assume KSh 500/day × 7
    return 350_000;
  }
  const base = median(dailyOut) * 7;
  const upcoming = upcomingObligations(history, asOf, OBLIGATION_LOOKAHEAD);
  return Math.round((base + upcoming) * 1.1);
}

export function decide(
  rule: SweepRule,
  history: CashflowEvent[],
  balanceCents: number,
  asOf: number,
  sweepsToday: number,
): Decision {
  const predicted = predictNeed7d(history, asOf);

  const base = {
    day: asOf, predictedNeed7dCents: predicted,
    balanceBeforeCents: balanceCents, amountCents: 0,
  };

  if (sweepsToday >= rule.maxPerDay) {
    return { ...base, action: "SKIP", reasons: ["daily_count"] };
  }
  if (balanceCents <= rule.minReserveCents) {
    return { ...base, action: "SKIP", reasons: ["below_reserve"] };
  }
  // Obligation window: predicted need exceeds *available after reserve*
  const safe = balanceCents - predicted - rule.minReserveCents;
  if (safe < rule.minSweepCents) {
    const nearObligation = upcomingObligations(history, asOf, 7) > 0;
    return {
      ...base,
      action: "SKIP",
      reasons: [nearObligation ? "obligation_window" : "no_safe_headroom"],
    };
  }
  let amount = Math.min(safe, rule.maxSweepCents);
  amount = Math.floor(amount / 1000) * 1000;
  if (amount < rule.minSweepCents) {
    return { ...base, action: "SKIP", reasons: ["below_min_sweep"] };
  }
  const reasons: string[] = [];
  if (upcomingObligations(history, asOf, 7) > 0) reasons.push("obligation_detected");
  if (amount < rule.maxSweepCents / 2) reasons.push("partial_sweep");
  return { ...base, action: "SWEEP", amountCents: amount, reasons };
}
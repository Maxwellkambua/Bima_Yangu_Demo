import { generateCashflow } from "./simulator";
import { decide } from "./engine";
import {
  CashflowEvent, Decision, Persona, SimulationResult, SweepRule,
} from "./types";

const DAYS = 90;
const KSHS = (n: number) => n * 100;

const DEFAULT_RULE: SweepRule = {
  minReserveCents: KSHS(500),
  minSweepCents: KSHS(10),
  maxSweepCents: KSHS(500),
  maxPerDay: 1,
};

/** Emergency withdrawal: if balance can't cover today's outflows, pull from savings. */
function applyOutflows(
  day: number,
  outs: CashflowEvent[],
  balance: number,
  savings: number,
  withdrawals: { day: number; amountCents: number; reason: string }[],
): { balance: number; savings: number } {
  for (const o of outs) {
    if (balance >= o.amountCents) {
      balance -= o.amountCents;
    } else {
      const shortfall = o.amountCents - balance;
      const pull = Math.min(shortfall, savings);
      if (pull > 0) {
        savings -= pull;
        balance += pull;
        withdrawals.push({
          day, amountCents: pull, reason: o.category,
        });
      }
      // If still short, this outflow fails silently (real M-Pesa can't go negative)
      balance -= Math.min(balance, o.amountCents);
    }
  }
  return { balance, savings };
}

export function simulate(persona: Persona): {
  ai: SimulationResult;
  naive: SimulationResult;
} {
  const cashflow = generateCashflow(persona);
  return {
    ai: runAi(persona, cashflow),
    naive: runNaive(persona, cashflow),
  };
}

function runAi(persona: Persona, cashflow: CashflowEvent[]): SimulationResult {
  const rule = DEFAULT_RULE;
  let balance = persona.startBalanceCents;
  let savings = 0;
  let sweepsToday = 0;
  const decisions: Decision[] = [];
  const balanceSeries: SimulationResult["balanceSeries"] = [];
  const withdrawals: SimulationResult["withdrawals"] = [];

  for (let day = 0; day < DAYS; day++) {
    sweepsToday = 0;
    const today = cashflow.filter((e) => e.day === day);
    const ins = today.filter((e) => e.direction === "IN");
    const outs = today.filter((e) => e.direction === "OUT");

    // Inflows arrive first (typical M-Pesa pattern)
    for (const i of ins) balance += i.amountCents;

    // Apply outflows
    const after = applyOutflows(day, outs, balance, savings, withdrawals);
    balance = after.balance;
    savings = after.savings;

    // Run policy on *remaining* balance
    const history = cashflow.filter((e) => e.day <= day);
    const d = decide(rule, history, balance, day, sweepsToday);
    decisions.push(d);
    if (d.action === "SWEEP") {
      savings += d.amountCents;
      balance -= d.amountCents;
      sweepsToday += 1;
    }

    balanceSeries.push({ day, balance, savings });
  }

  const totalWithdrawnCents = withdrawals.reduce((s, w) => s + w.amountCents, 0);
  return {
    personaId: persona.id, days: DAYS, cashflow, decisions, balanceSeries, withdrawals,
    totalSavedCents: decisions.reduce((s, d) => s + d.amountCents, 0),
    totalWithdrawnCents,
    netSavedCents: decisions.reduce((s, d) => s + d.amountCents, 0) - totalWithdrawnCents,
    sweepCount: decisions.filter((d) => d.action === "SWEEP").length,
    holdbackCount: decisions.filter((d) => d.reasons.includes("obligation_window")).length,
    failedSweeps: 0,
  };
}

function runNaive(persona: Persona, cashflow: CashflowEvent[]): SimulationResult {
  // Naive: sweep KSh 500 every Monday if balance allows.
  let balance = persona.startBalanceCents;
  let savings = 0;
  const decisions: Decision[] = [];
  const balanceSeries: SimulationResult["balanceSeries"] = [];
  const withdrawals: SimulationResult["withdrawals"] = [];
  let failedSweeps = 0;

  const NAIVE_AMOUNT = KSHS(500);

  for (let day = 0; day < DAYS; day++) {
    const today = cashflow.filter((e) => e.day === day);
    const ins = today.filter((e) => e.direction === "IN");
    const outs = today.filter((e) => e.direction === "OUT");

    for (const i of ins) balance += i.amountCents;

    // Naive sweeps *before* paying bills (the classic mistake)
    const isMonday = day % 7 === 0;
    if (isMonday && balance >= NAIVE_AMOUNT + KSHS(200)) {
      balance -= NAIVE_AMOUNT;
      savings += NAIVE_AMOUNT;
      decisions.push({
        day, action: "SWEEP", amountCents: NAIVE_AMOUNT,
        reasons: ["scheduled"], predictedNeed7dCents: 0,
        balanceBeforeCents: balance + NAIVE_AMOUNT,
      });
    } else if (isMonday) {
      failedSweeps += 1;
      decisions.push({
        day, action: "SKIP", amountCents: 0,
        reasons: ["insufficient_balance"], predictedNeed7dCents: 0,
        balanceBeforeCents: balance,
      });
    }

    const after = applyOutflows(day, outs, balance, savings, withdrawals);
    balance = after.balance;
    savings = after.savings;

    balanceSeries.push({ day, balance, savings });
  }

  const totalWithdrawnCents = withdrawals.reduce((s, w) => s + w.amountCents, 0);
  return {
    personaId: persona.id, days: DAYS, cashflow, decisions, balanceSeries, withdrawals,
    totalSavedCents: decisions.reduce((s, d) => s + d.amountCents, 0),
    totalWithdrawnCents,
    netSavedCents: decisions.reduce((s, d) => s + d.amountCents, 0) - totalWithdrawnCents,
    sweepCount: decisions.filter((d) => d.action === "SWEEP").length,
    holdbackCount: 0,
    failedSweeps,
  };
}
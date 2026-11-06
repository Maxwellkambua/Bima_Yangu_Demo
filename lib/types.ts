export type Direction = "IN" | "OUT";
export type Category =
  | "INCOME" | "FUEL" | "AIRTIME" | "RENT" | "FEES" | "LOAN"
  | "MATERIALS" | "REMITTANCE" | "STOCK" | "HARVEST" | "OTHER";

export interface CashflowEvent {
  day: number;              // 0..89
  direction: Direction;
  amountCents: number;
  category: Category;
  note?: string;
}

export interface SweepRule {
  minReserveCents: number;
  minSweepCents: number;
  maxSweepCents: number;
  maxPerDay: number;
}

export type DecisionAction = "SWEEP" | "SKIP";

export interface Decision {
  day: number;
  action: DecisionAction;
  amountCents: number;
  reasons: string[];           // reason codes — humanised in the UI
  predictedNeed7dCents: number;
  balanceBeforeCents: number;
}

export interface SimulationResult {
  personaId: string;
  days: number;
  cashflow: CashflowEvent[];
  decisions: Decision[];
  balanceSeries: { day: number; balance: number; savings: number }[];
  withdrawals: { day: number; amountCents: number; reason: string }[];
  totalSavedCents: number;
  totalWithdrawnCents: number;
  netSavedCents: number;
  sweepCount: number;
  holdbackCount: number;
  failedSweeps: number;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  seed: number;
  startBalanceCents: number;
  weeklyPattern: "low" | "medium" | "high";
  tagline: string;
}
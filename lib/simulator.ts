import { CashflowEvent, Persona } from "./types";
import { between, mulberry32 } from "./rng";

const DAYS = 90;
const KSHS = (n: number) => n * 100;

export function generateCashflow(p: Persona): CashflowEvent[] {
  const rand = mulberry32(p.seed);
  const events: CashflowEvent[] = [];

  for (let day = 0; day < DAYS; day++) {
    const dom = day % 30;          // "day of month", 0..29
    const dow = day % 7;           // 0=Mon..6=Sun
    const month = Math.floor(day / 30);

    if (p.id === "otieno") {
      // ~90% of days: 8–15 rides, KSh 400–1,800 in
      if (rand() < 0.9) {
        events.push({
          day, direction: "IN",
          amountCents: KSHS(between(rand, 400, 1_800)),
          category: "INCOME",
        });
      }
      // Daily fuel
      events.push({
        day, direction: "OUT",
        amountCents: KSHS(between(rand, 200, 350)),
        category: "FUEL",
      });
      // Daily airtime
      if (rand() < 0.5) {
        events.push({
          day, direction: "OUT",
          amountCents: KSHS(between(rand, 20, 100)),
          category: "AIRTIME",
        });
      }
      // Weekly boda loan (Tuesday)
      if (dow === 1) {
        events.push({
          day, direction: "OUT",
          amountCents: KSHS(1_200),
          category: "LOAN",
        });
      }
      // Rent on day 1
      if (dom === 1) {
        events.push({
          day, direction: "OUT",
          amountCents: KSHS(4_000),
          category: "RENT",
        });
      }
    }

    if (p.id === "wanjiku") {
      // Most days: small veg sales KSh 300–1,400
      if (rand() < 0.85) {
        events.push({
          day, direction: "IN",
          amountCents: KSHS(between(rand, 300, 1_400)),
          category: "INCOME",
        });
      }
      // Stock purchase twice weekly (Mon & Thu)
      if (dow === 0 || dow === 3) {
        events.push({
          day, direction: "OUT",
          amountCents: KSHS(between(rand, 1_200, 2_600)),
          category: "STOCK",
        });
      }
      // Rent day 1
      if (dom === 1) {
        events.push({
          day, direction: "OUT",
          amountCents: KSHS(3_500),
          category: "RENT",
        });
      }
      // School fees on day 5 of months 0 and 2 (terms)
      if ((month === 0 || month === 2) && dom === 5) {
        events.push({
          day, direction: "OUT",
          amountCents: KSHS(6_500),
          category: "FEES",
        });
      }
    }

    if (p.id === "akinyi") {
      // 2–3 jobs per week — pick 2 or 3 days
      const jobsToday = rand() < 0.35;
      if (jobsToday) {
        events.push({
          day, direction: "IN",
          amountCents: KSHS(between(rand, 800, 4_500)),
          category: "INCOME",
        });
      }
      // Materials
      if (rand() < 0.4) {
        events.push({
          day, direction: "OUT",
          amountCents: KSHS(between(rand, 300, 2_000)),
          category: "MATERIALS",
        });
      }
      // Rent on day 14 (mid-month)
      if (dom === 14) {
        events.push({
          day, direction: "OUT",
          amountCents: KSHS(4_200),
          category: "RENT",
        });
      }
      // Weekly remittance Sunday
      if (dow === 6) {
        events.push({
          day, direction: "OUT",
          amountCents: KSHS(500),
          category: "REMITTANCE",
        });
      }
    }

    if (p.id === "kipchoge") {
      // Weekly milk income (~Sunday pickup)
      if (dow === 6) {
        events.push({
          day, direction: "IN",
          amountCents: KSHS(between(rand, 400, 1_000)),
          category: "INCOME",
        });
      }
      // Harvest on day 20 of months 1 and 2
      if ((month === 1 || month === 2) && dom === 20) {
        events.push({
          day, direction: "IN",
          amountCents: KSHS(between(rand, 30_000, 70_000)),
          category: "HARVEST",
        });
      }
      // Inputs on day 8
      if (dom === 8) {
        events.push({
          day, direction: "OUT",
          amountCents: KSHS(between(rand, 2_000, 4_500)),
          category: "MATERIALS",
        });
      }
      // School fees months 0 and 2
      if ((month === 0 || month === 2) && dom === 5) {
        events.push({
          day, direction: "OUT",
          amountCents: KSHS(7_000),
          category: "FEES",
        });
      }
      // Rent day 1
      if (dom === 1) {
        events.push({
          day, direction: "OUT",
          amountCents: KSHS(2_500),
          category: "RENT",
        });
      }
    }
  }

  return events;
}
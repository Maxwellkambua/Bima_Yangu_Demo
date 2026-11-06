import type { Persona } from "./types";

export const PERSONAS: Persona[] = [
  {
    id: "otieno",
    name: "Otieno",
    role: "Boda boda rider",
    location: "Kisumu",
    bio: "Rides for a local hailing app. Paid via M-Pesa daily. Finances his bike on weekly installments.",
    seed: 42,
    startBalanceCents: 500_000,     // KSh 5,000
    weeklyPattern: "medium",
    tagline: "Daily income, weekly loan, monthly rent — the classic squeeze.",
  },
  {
    id: "wanjiku",
    name: "Wanjiku",
    role: "Mama mboga",
    location: "Gikomba, Nairobi",
    bio: "Sells vegetables at a market stall. Buys stock twice weekly. School fees every term.",
    seed: 7,
    startBalanceCents: 200_000,     // KSh 2,000
    weeklyPattern: "high",
    tagline: "Thin daily margins, lumpy stock purchases, school fees that hurt.",
  },
  {
    id: "akinyi",
    name: "Akinyi",
    role: "Fundi (casual laborer)",
    location: "Kibera",
    bio: "Does small construction jobs. Paid on completion — 2–3 times a week. Sends money home weekly.",
    seed: 121,
    startBalanceCents: 300_000,     // KSh 3,000
    weeklyPattern: "medium",
    tagline: "Irregular lumpy income, rent mid-month, remittances every Sunday.",
  },
  {
    id: "kipchoge",
    name: "Kipchoge",
    role: "Smallholder farmer",
    location: "Trans Nzoia",
    bio: "Grows maize and keeps dairy cattle. Big payouts at harvest, small weekly milk income.",
    seed: 314,
    startBalanceCents: 100_000,     // KSh 1,000
    weeklyPattern: "low",
    tagline: "Seasonal income — the hardest case for any savings product.",
  },
];

export const getPersona = (id: string) => PERSONAS.find((p) => p.id === id);
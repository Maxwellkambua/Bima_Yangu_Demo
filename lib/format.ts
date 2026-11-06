export const ksh = (cents: number) =>
  `KSh ${(cents / 100).toLocaleString("en-KE", {
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  })}`;

export const reasonLabel = (code: string): string => ({
  daily_count: "Daily sweep limit reached",
  below_reserve: "Balance below safety reserve",
  obligation_window: "Held back — rent / fees likely due soon",
  obligation_detected: "Obligation detected in next 7 days",
  no_safe_headroom: "No safe headroom after forecast",
  below_min_sweep: "Sweep amount below minimum",
  partial_sweep: "Partial sweep — capped by forecast",
  insufficient_balance: "Balance too low to sweep",
  scheduled: "Weekly scheduled sweep (naive)",
} as Record<string, string>)[code] ?? code;
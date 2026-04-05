/**
 * Irish Tax Calculator 2025
 * Based on Budget October 2024 rates (applicable for tax year 2025)
 *
 * Components:
 *  - Income Tax (PAYE): 20% / 40% with personal & PAYE credits
 *  - USC (Universal Social Charge): 0.5% – 8% banded
 *  - PRSI (Pay Related Social Insurance): 4% Class A employees
 *
 * Assumptions: single person, PAYE employee, no additional credits/deductions.
 */

export interface TaxBreakdown {
  gross: number
  incomeTax: number
  usc: number
  prsi: number
  totalDeductions: number
  netPay: number
  effectiveRate: number     // % of gross
  incomeTaxPct: number      // incomeTax as % of gross
  uscPct: number
  prsiPct: number
  netPct: number
}

// ── 2025 Tax Rates ────────────────────────────────────────────────────────────

const RATES = {
  // Income Tax
  standardRateBand: 42000,
  standardRate: 0.20,
  higherRate: 0.40,
  personalCredit: 1875,
  payeCredit: 1875,

  // USC
  uscExemptThreshold: 13000,
  uscBands: [
    { to: 12012, rate: 0.005 },
    { to: 25760, rate: 0.02  },
    { to: 70044, rate: 0.04  },
    { to: Infinity, rate: 0.08 },
  ] as { to: number; rate: number }[],

  // PRSI Class A
  prsiThreshold: 18304, // ~€352/week × 52
  prsiRate: 0.04,
} as const

// ── Calculator ────────────────────────────────────────────────────────────────

export function calcTax(gross: number): TaxBreakdown {
  if (gross <= 0) return zero()

  // ── Income Tax ──
  const taxAtStandard = Math.min(gross, RATES.standardRateBand) * RATES.standardRate
  const taxAtHigher   = Math.max(0, gross - RATES.standardRateBand) * RATES.higherRate
  const credits       = RATES.personalCredit + RATES.payeCredit
  const incomeTax     = Math.max(0, taxAtStandard + taxAtHigher - credits)

  // ── USC ──
  let usc = 0
  if (gross > RATES.uscExemptThreshold) {
    let prev = 0
    for (const band of RATES.uscBands) {
      if (gross <= prev) break
      const taxable = Math.min(gross, band.to) - prev
      usc += taxable * band.rate
      prev = band.to
    }
  }

  // ── PRSI ──
  const prsi = gross >= RATES.prsiThreshold ? gross * RATES.prsiRate : 0

  const totalDeductions = incomeTax + usc + prsi
  const netPay          = gross - totalDeductions

  const pct = (n: number) => gross > 0 ? Math.round((n / gross) * 1000) / 10 : 0

  return {
    gross:            Math.round(gross),
    incomeTax:        Math.round(incomeTax),
    usc:              Math.round(usc),
    prsi:             Math.round(prsi),
    totalDeductions:  Math.round(totalDeductions),
    netPay:           Math.round(netPay),
    effectiveRate:    pct(totalDeductions),
    incomeTaxPct:     pct(incomeTax),
    uscPct:           pct(usc),
    prsiPct:          pct(prsi),
    netPct:           pct(netPay),
  }
}

function zero(): TaxBreakdown {
  return {
    gross: 0, incomeTax: 0, usc: 0, prsi: 0,
    totalDeductions: 0, netPay: 0,
    effectiveRate: 0, incomeTaxPct: 0, uscPct: 0, prsiPct: 0, netPct: 0,
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function fmt(n: number): string {
  return '€' + Math.round(n).toLocaleString('en-IE')
}

export function fmtPct(n: number): string {
  return n.toFixed(1) + '%'
}

// Preset salaries for quick-select
export const PRESETS = [28080, 35000, 45000, 60000, 80000, 100000]

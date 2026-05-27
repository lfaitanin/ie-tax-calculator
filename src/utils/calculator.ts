/**
 * Irish Tax Calculator 2026
 * Budget October 2025 rates (tax year 2026)
 *
 * Income Tax · USC · PRSI · Pension relief
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TaxBreakdown {
  gross: number
  incomeTax: number
  usc: number
  prsi: number
  totalDeductions: number
  netPay: number
  effectiveRate: number
  incomeTaxPct: number
  uscPct: number
  prsiPct: number
  netPct: number
  marginalRate: 0 | 20 | 40  // % as integer
}

export interface PensionResult {
  contribution: number
  taxSaved: number
  netCost: number
  marginalRate: number
  taxAfter: TaxBreakdown
}

// ── 2026 Rates (Budget 2026, effective Jan 2026) ──────────────────────────────

const RATES = {
  standardRateBand: 44_000,   // unchanged from Budget 2025
  standardRate:     0.20,
  higherRate:       0.40,
  personalCredit:   2_000,    // Budget 2025 increase, unchanged 2026
  payeCredit:       2_000,    // Budget 2025 increase, unchanged 2026

  uscExemptThreshold: 13_000,
  uscBands: [
    { to: 12_012,    rate: 0.005 },
    { to: 28_700,    rate: 0.02  },  // upper limit raised in Budget 2026
    { to: 70_044,    rate: 0.03  },  // reduced to 3% since Budget 2025
    { to: Infinity,  rate: 0.08  },
  ] as { to: number; rate: number }[],

  prsiThreshold: 18_304,  // €352/week × 52
  prsiRate:      0.042,   // 4.2% from October 2025 (rises to 4.35% Oct 2026)
} as const

// ── Core calculator ───────────────────────────────────────────────────────────

export function calcTax(gross: number): TaxBreakdown {
  if (gross <= 0) return zero()

  // Income Tax
  const taxAtStandard = Math.min(gross, RATES.standardRateBand) * RATES.standardRate
  const taxAtHigher   = Math.max(0, gross - RATES.standardRateBand) * RATES.higherRate
  const credits       = RATES.personalCredit + RATES.payeCredit
  const incomeTax     = Math.max(0, taxAtStandard + taxAtHigher - credits)

  // USC (not reduced by pension contributions)
  let usc = 0
  if (gross > RATES.uscExemptThreshold) {
    let prev = 0
    for (const band of RATES.uscBands) {
      if (gross <= prev) break
      usc += (Math.min(gross, band.to) - prev) * band.rate
      prev = band.to
    }
  }

  // PRSI (not reduced by pension contributions)
  const prsi = gross >= RATES.prsiThreshold ? gross * RATES.prsiRate : 0

  const totalDeductions = incomeTax + usc + prsi
  const netPay          = gross - totalDeductions

  const pct = (n: number) => gross > 0 ? Math.round((n / gross) * 1000) / 10 : 0

  // Marginal rate: 0 if credits absorb all tax, 20 in standard band, 40 above
  const creditBreakeven = credits / RATES.standardRate   // ~€18,750
  const marginalRate: 0 | 20 | 40 =
    gross <= creditBreakeven      ? 0  :
    gross <= RATES.standardRateBand ? 20 : 40

  return {
    gross:           Math.round(gross),
    incomeTax:       Math.round(incomeTax),
    usc:             Math.round(usc),
    prsi:            Math.round(prsi),
    totalDeductions: Math.round(totalDeductions),
    netPay:          Math.round(netPay),
    effectiveRate:   pct(totalDeductions),
    incomeTaxPct:    pct(incomeTax),
    uscPct:          pct(usc),
    prsiPct:         pct(prsi),
    netPct:          pct(netPay),
    marginalRate,
  }
}

function zero(): TaxBreakdown {
  return {
    gross: 0, incomeTax: 0, usc: 0, prsi: 0,
    totalDeductions: 0, netPay: 0,
    effectiveRate: 0, incomeTaxPct: 0, uscPct: 0, prsiPct: 0, netPct: 0,
    marginalRate: 0,
  }
}

// ── Pension optimizer ─────────────────────────────────────────────────────────

/**
 * Pension contributions reduce Income Tax base only — not USC or PRSI.
 * The government gives back marginalRate × contribution at year end.
 */
export function calcPensionSaving(gross: number, contribution: number): PensionResult {
  const clampedContrib = Math.min(Math.max(0, contribution), gross)
  const before = calcTax(gross)
  const after  = calcTax(Math.max(0, gross - clampedContrib))

  // Only income tax changes; USC/PRSI are recalculated on full gross
  const uscAndPrsi = before.usc + before.prsi
  const adjustedAfter: TaxBreakdown = {
    ...after,
    usc:             before.usc,
    prsi:            before.prsi,
    totalDeductions: after.incomeTax + uscAndPrsi,
    netPay:          gross - clampedContrib - after.incomeTax - uscAndPrsi,
  }

  const taxSaved = Math.round(before.incomeTax - after.incomeTax)
  const netCost  = Math.round(clampedContrib - taxSaved)

  return {
    contribution: Math.round(clampedContrib),
    taxSaved,
    netCost,
    marginalRate: before.marginalRate,
    taxAfter:     adjustedAfter,
  }
}

// ── Hourly conversion ─────────────────────────────────────────────────────────

export function hourlyToAnnual(hourlyRate: number, hoursPerWeek: number): number {
  return hourlyRate * hoursPerWeek * 52
}

export const HOURS_PRESETS: { value: number; tag?: 'stamp2Term' | 'fullTime' }[] = [
  { value: 20, tag: 'stamp2Term' },
  { value: 25 },
  { value: 30 },
  { value: 39, tag: 'fullTime' },
  { value: 40 },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

export function fmt(n: number): string {
  return '€' + Math.round(n).toLocaleString('en-IE')
}

export function fmtPct(n: number): string {
  return n.toFixed(1) + '%'
}

export const PRESETS = [28_080, 35_000, 45_000, 60_000, 80_000, 100_000]

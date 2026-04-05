import { useState, useMemo } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import {
  calcTax, calcPensionSaving, hourlyToAnnual,
  fmt, fmtPct, PRESETS, HOURS_PRESETS,
  type TaxBreakdown,
} from './utils/calculator'
import { useLang } from './i18n/LangContext'
import type { Language } from './i18n/translations'
import './index.css'

type Mode = 'annual' | 'monthly' | 'hourly'

// ── Language dropdown ─────────────────────────────────────────────────────────

const LANG_OPTIONS: { value: Language; flag: string; label: string }[] = [
  { value: 'en', flag: '🇮🇪', label: 'EN' },
  { value: 'pt', flag: '🇧🇷', label: 'PT' },
  { value: 'es', flag: '🇪🇸', label: 'ES' },
]

function LangDropdown() {
  const { lang, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const current = LANG_OPTIONS.find(o => o.value === lang)!
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
        <span>{current.flag}</span><span>{current.label}</span>
        <svg className="w-3 h-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 min-w-[90px]">
            {LANG_OPTIONS.map(o => (
              <button key={o.value} onClick={() => { setLang(o.value); setOpen(false) }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-gray-50 ${lang === o.value ? 'text-green-700 bg-green-50' : 'text-gray-700'}`}>
                <span>{o.flag}</span><span>{o.label}</span>
                {lang === o.value && <span className="ml-auto text-green-500">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Visual stacked bar ────────────────────────────────────────────────────────

function BreakdownBar({ result }: { result: TaxBreakdown }) {
  const { t } = useLang()
  const segs = [
    { label: t.netLabel,  pct: result.netPct,       color: 'bg-emerald-500' },
    { label: t.incomeTax, pct: result.incomeTaxPct,  color: 'bg-rose-400' },
    { label: t.usc,       pct: result.uscPct,        color: 'bg-amber-400' },
    { label: t.prsi,      pct: result.prsiPct,       color: 'bg-violet-400' },
  ]
  return (
    <div className="space-y-2.5">
      <div className="flex h-5 rounded-full overflow-hidden gap-px">
        {segs.map(s => (
          <div key={s.label} className={`${s.color} transition-all duration-500`} style={{ width: `${s.pct}%` }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {segs.map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${s.color}`} />
            <span className="text-xs text-green-100">{s.label}</span>
            <span className="text-xs font-bold text-white">{fmtPct(s.pct)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Breakdown row ─────────────────────────────────────────────────────────────

function Row({ label, annual, monthly, color, bold }: {
  label: string; annual: number; monthly: number
  color?: string; bold?: boolean
}) {
  const { t } = useLang()
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className={`text-sm ${bold ? 'font-black text-gray-900' : `font-medium ${color ?? 'text-gray-600'}`}`}>
        {label}
      </span>
      <div className="text-right">
        <p className={`text-sm font-bold ${bold ? 'text-gray-900' : (color ?? 'text-gray-800')}`}>
          {fmt(Math.abs(annual))}
          {!bold && annual < 0 && <span className="text-xs ml-0.5 opacity-60">{t.perYear}</span>}
          {bold && <span className="text-xs font-normal text-gray-400 ml-0.5">{t.perYear}</span>}
        </p>
        <p className="text-xs text-gray-400">{fmt(Math.abs(monthly))}{t.perMonth}</p>
      </div>
    </div>
  )
}

// ── Info card ─────────────────────────────────────────────────────────────────

function InfoCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <span className="text-xl flex-shrink-0 mt-0.5">{emoji}</span>
      <div>
        <p className="text-sm font-bold text-gray-900 mb-0.5">{title}</p>
        <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
      </div>
    </div>
  )
}

// ── Pension optimizer ─────────────────────────────────────────────────────────

function PensionOptimizer({ gross, result }: { gross: number; result: TaxBreakdown }) {
  const { t } = useLang()
  const [raw, setRaw] = useState('')

  const contribution = useMemo(() => {
    const n = parseFloat(raw.replace(/[,.\s]/g, '').replace(/[^0-9]/g, ''))
    return isNaN(n) || n <= 0 ? 0 : n
  }, [raw])

  const pension = useMemo(
    () => contribution > 0 ? calcPensionSaving(gross, contribution) : null,
    [gross, contribution]
  )

  const noTax = result.incomeTax === 0

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100">
        <p className="font-black text-gray-900 text-sm">{t.pensionTitle}</p>
        <p className="text-xs text-gray-500 mt-0.5">{t.pensionSubtitle}</p>
      </div>
      <div className="p-4">
        {/* Contribution input */}
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">{t.pensionContribLabel}</label>
        <div className="relative mb-4">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-400">€</span>
          <input type="text" inputMode="numeric"
            value={raw} onChange={e => setRaw(e.target.value)}
            placeholder={t.pensionContribPlaceholder}
            className="w-full pl-8 pr-4 py-3 text-lg font-bold text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 bg-white transition-colors placeholder:text-gray-200" />
        </div>

        {/* Example hint */}
        {!pension && (
          <p className="text-xs text-gray-400 text-center italic mb-2">{t.pensionExample}</p>
        )}

        {/* Zero tax advisory */}
        {noTax && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 text-xs text-amber-700 mb-3">
            {t.pensionZeroTax}
          </div>
        )}

        {/* Results */}
        {pension && !noTax && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">{t.pensionYouPutIn}</p>
              <p className="text-lg font-black text-gray-900">{fmt(pension.contribution)}</p>
              <p className="text-xs text-gray-400">{t.perYear}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <p className="text-xs text-emerald-600 mb-1">{t.pensionTaxSaved}</p>
              <p className="text-lg font-black text-emerald-700">{fmt(pension.taxSaved)}</p>
              <p className="text-xs text-emerald-500">{pension.marginalRate}% {t.pensionAtRate}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-center">
              <p className="text-xs text-blue-600 mb-1">{t.pensionNetCost}</p>
              <p className="text-lg font-black text-blue-700">{fmt(pension.netCost)}</p>
              <p className="text-xs text-blue-500">{t.perYear}</p>
            </div>
          </div>
        )}

        {pension && !noTax && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-xs text-blue-700 text-center">
            <strong>{fmt(pension.netCost)}</strong> {t.pensionNetCostNote}
          </div>
        )}

        <p className="text-xs text-gray-300 text-center mt-3">⚠️ {t.pensionAgeNote}</p>
      </div>
    </div>
  )
}

// ── Tax Saving Tips ───────────────────────────────────────────────────────────

function TaxSavingTips() {
  const { t } = useLang()
  const [expanded, setExpanded] = useState<number | null>(null)

  const tips = [
    { emoji: '🏠', title: t.tip1Title, value: t.tip1Value, body: t.tip1Body },
    { emoji: '🏦', title: t.tip2Title, value: t.tip2Value, body: t.tip2Body },
    { emoji: '🚲', title: t.tip3Title, value: t.tip3Value, body: t.tip3Body },
    { emoji: '💊', title: t.tip4Title, value: t.tip4Value, body: t.tip4Body },
    { emoji: '🏡', title: t.tip5Title, value: t.tip5Value, body: t.tip5Body },
    { emoji: '📱', title: t.tip6Title, value: t.tip6Value, body: t.tip6Body },
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-gray-100">
        <p className="font-black text-gray-900 text-sm">{t.tipsTitle}</p>
      </div>
      <div className="divide-y divide-gray-50">
        {tips.map((tip, i) => (
          <div key={i}>
            <button
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(expanded === i ? null : i)}>
              <span className="text-xl flex-shrink-0">{tip.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 leading-snug">{tip.title}</p>
              </div>
              <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full flex-shrink-0">
                {tip.value}
              </span>
              <span className="text-gray-400 flex-shrink-0">
                {expanded === i ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </span>
            </button>
            {expanded === i && (
              <div className="px-4 pb-4 pt-1">
                <p className="text-xs text-gray-600 leading-relaxed">{tip.body}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Root App ──────────────────────────────────────────────────────────────────

export default function App() {
  const { t } = useLang()
  const [mode, setMode]                   = useState<Mode>('annual')
  const [raw, setRaw]                     = useState('')
  const [hourlyRaw, setHourlyRaw]         = useState('')
  const [hoursPerWeek, setHoursPerWeek]   = useState(39)

  // Parse → always compute as annual gross
  const gross = useMemo(() => {
    if (mode === 'hourly') {
      const h = parseFloat(hourlyRaw.replace(/[,]/g, '.').replace(/[^0-9.]/g, ''))
      return isNaN(h) || h <= 0 ? 0 : hourlyToAnnual(h, hoursPerWeek)
    }
    const n = parseFloat(raw.replace(/[,.\s]/g, '').replace(/[^0-9]/g, ''))
    if (isNaN(n) || n <= 0) return 0
    return mode === 'monthly' ? n * 12 : n
  }, [mode, raw, hourlyRaw, hoursPerWeek])

  const result  = useMemo(() => calcTax(gross), [gross])
  const hasResult = gross > 0

  function pickPreset(annual: number) {
    setMode('annual')
    setRaw(annual.toLocaleString('en-IE'))
  }

  const MODES: Mode[] = ['annual', 'monthly', 'hourly']
  const MODE_LABELS: Record<Mode, string> = {
    annual: t.annualLabel, monthly: t.monthlyLabel, hourly: t.hourlyLabel,
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-black text-gray-900 text-base">💶 {t.siteName}</span>
          <LangDropdown />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 py-6 w-full space-y-5">

        {/* Hero */}
        <div className="text-center mb-1">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight">{t.heroTitle}</h1>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">{t.heroSubtitle}</p>
        </div>

        {/* Input card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">

          {/* Mode tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
            {MODES.map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${mode === m ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>

          {/* Annual / Monthly input */}
          {mode !== 'hourly' && (
            <>
              <div className="relative mb-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-200 select-none">€</span>
                <input type="text" inputMode="numeric"
                  value={raw} onChange={e => setRaw(e.target.value)}
                  placeholder={t.inputPlaceholder}
                  className="w-full pl-10 pr-4 py-4 text-2xl font-black text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 bg-white placeholder:text-gray-200 text-center transition-colors" />
              </div>
              {hasResult && (
                <p className="text-xs text-gray-400 text-center mb-3">
                  {mode === 'annual'
                    ? `≈ ${fmt(gross / 12)} ${t.perMonth}`
                    : `≈ ${fmt(gross)} ${t.perYear}`}
                </p>
              )}
            </>
          )}

          {/* Hourly input */}
          {mode === 'hourly' && (
            <div className="mb-3">
              <div className="relative mb-3">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-200 select-none">€</span>
                <input type="text" inputMode="decimal"
                  value={hourlyRaw} onChange={e => setHourlyRaw(e.target.value)}
                  placeholder={t.hourlyPlaceholder}
                  className="w-full pl-10 pr-4 py-4 text-2xl font-black text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 bg-white placeholder:text-gray-200 text-center transition-colors" />
              </div>

              {/* Hours per week pills */}
              <p className="text-xs text-gray-400 text-center mb-2">{t.hoursPerWeekLabel}</p>
              <div className="flex gap-1.5 justify-center flex-wrap">
                {HOURS_PRESETS.map(p => (
                  <button key={p.value} onClick={() => setHoursPerWeek(p.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      hoursPerWeek === p.value
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                    }`}>
                    {p.value}h
                    {p.tag && (
                      <span className="ml-1 opacity-70">
                        {t.hoursTags[p.tag]}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {hasResult && (
                <p className="text-xs text-gray-400 text-center mt-2">
                  = {fmt(gross)} {t.hourlyHint}
                </p>
              )}
            </div>
          )}

          {/* Quick presets (annual / monthly modes only) */}
          {mode !== 'hourly' && (
            <div>
              <p className="text-xs text-gray-400 text-center mb-2">{t.presetsLabel}</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {PRESETS.map(p => (
                  <button key={p} onClick={() => pickPreset(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      gross === p
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'
                    }`}>
                    {fmt(p)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-center text-xs text-gray-300 mt-4">🇮🇪 {t.taxYear}</p>
        </div>

        {/* ── Results ── */}
        {hasResult && (
          <>
            {/* Take-home hero */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl p-5 text-white">
              <p className="text-sm font-semibold text-emerald-200 mb-1">{t.takeHome}</p>
              <div className="flex items-baseline gap-2 mb-0.5">
                <p className="text-4xl font-black">{fmt(result.netPay)}</p>
                <p className="text-emerald-200 text-sm">{t.perYear}</p>
              </div>
              <p className="text-emerald-100 text-xl font-bold mb-4">
                {fmt(result.netPay / 12)}
                <span className="text-emerald-200 text-sm font-normal">{t.perMonth}</span>
                {mode === 'hourly' && (
                  <span className="text-emerald-200 text-sm font-normal ml-2">
                    · {fmt(result.netPay / (hoursPerWeek * 52))}/hr net
                  </span>
                )}
              </p>
              <BreakdownBar result={result} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-2xl border border-gray-200 p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">{t.effectiveRate}</p>
                <p className="text-xl font-black text-gray-900">{fmtPct(result.effectiveRate)}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">{t.marginalRate}</p>
                <p className="text-xl font-black text-gray-900">{result.marginalRate}%</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">{t.totalDeductions}</p>
                <p className="text-xl font-black text-rose-600">{fmt(result.totalDeductions)}</p>
              </div>
            </div>

            {/* Full breakdown */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <p className="font-black text-gray-900 text-sm">{t.breakdown}</p>
              </div>
              <div className="px-4 divide-y divide-gray-50">
                <Row label={t.grossSalary} annual={result.gross} monthly={result.gross / 12} bold />
                <div className="py-0.5">
                  <p className="text-xs text-gray-300 text-center py-1">— {t.deductions} —</p>
                </div>
                <Row label={`${t.incomeTax} (${fmtPct(result.incomeTaxPct)})`}
                  annual={-result.incomeTax} monthly={-result.incomeTax / 12} color="text-rose-500" />
                <Row label={`${t.usc} (${fmtPct(result.uscPct)})`}
                  annual={-result.usc} monthly={-result.usc / 12} color="text-amber-500" />
                <Row label={`${t.prsi} (${fmtPct(result.prsiPct)})`}
                  annual={-result.prsi} monthly={-result.prsi / 12} color="text-violet-500" />
                <div className="py-0.5"><div className="h-px bg-gray-200" /></div>
                <Row label={`✅ ${t.netTakeHome}`} annual={result.netPay} monthly={result.netPay / 12} bold />
              </div>
            </div>

            {/* Pension optimizer */}
            <PensionOptimizer gross={gross} result={result} />
          </>
        )}

        {/* Tax saving tips — always visible */}
        <TaxSavingTips />

        {/* How Ireland taxes you */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
            <p className="font-black text-gray-900 text-sm">{t.howItWorksTitle}</p>
          </div>
          <div className="px-4">
            <InfoCard emoji="🔴" title={t.incomeTax} body={t.incomeTaxInfo} />
            <InfoCard emoji="🟠" title={t.usc}        body={t.uscInfo} />
            <InfoCard emoji="🟣" title={t.prsi}       body={t.prsiInfo} />
          </div>
        </div>

        {/* Min wage + Stamp 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="font-bold text-blue-900 text-sm mb-1">{t.minWageTitle}</p>
            <p className="text-3xl font-black text-blue-700 mb-1">{t.minWageHourly}</p>
            <p className="text-xs text-blue-600 leading-relaxed mb-3">{t.minWageDesc}</p>
            <button onClick={() => pickPreset(27_378)}
              className="text-xs font-bold text-blue-700 underline">
              {hasResult && gross === 27_378 ? t.selectedLabel : t.calcMinWage}
            </button>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="font-bold text-amber-900 text-sm mb-1">{t.stamp2Title}</p>
            <p className="text-xs text-amber-700 leading-relaxed">{t.stamp2Body}</p>
          </div>
        </div>

        {/* Sponsor CTA */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-green-900 mb-0.5">{t.sponsorCta}</p>
            <a href="https://ie-work-permits.com" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-green-700 hover:text-green-800">
              {t.sponsorLink} <ExternalLink size={11} />
            </a>
          </div>
          <span className="text-3xl flex-shrink-0">🏢</span>
        </div>

        <p className="text-xs text-gray-300 text-center pb-2 leading-relaxed">{t.disclaimer}</p>
      </main>

      <footer className="border-t border-gray-100 bg-white px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between text-xs text-gray-400">
          <span>Built by <span className="font-semibold text-gray-600">Luiz Faitanin</span></span>
          <a href="https://irishventures.ie" className="hover:text-gray-600">irishventures.ie →</a>
        </div>
      </footer>

      <Analytics />
    </div>
  )
}

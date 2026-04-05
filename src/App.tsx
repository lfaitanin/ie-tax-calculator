import { useState, useMemo } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { ExternalLink } from 'lucide-react'
import { calcTax, fmt, fmtPct, PRESETS, type TaxBreakdown } from './utils/calculator'
import { useLang } from './i18n/LangContext'
import type { Language } from './i18n/translations'
import './index.css'

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
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
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
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-gray-50 transition-colors ${lang === o.value ? 'text-green-700 bg-green-50' : 'text-gray-700'}`}>
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

// ── Visual breakdown bar ──────────────────────────────────────────────────────

function BreakdownBar({ result }: { result: TaxBreakdown }) {
  const { t } = useLang()
  const segments = [
    { label: t.netLabel,   pct: result.netPct,      color: 'bg-emerald-500' },
    { label: t.incomeTax,  pct: result.incomeTaxPct, color: 'bg-rose-400' },
    { label: t.usc,        pct: result.uscPct,       color: 'bg-amber-400' },
    { label: t.prsi,       pct: result.prsiPct,      color: 'bg-violet-400' },
  ]

  return (
    <div className="space-y-2.5">
      {/* stacked bar */}
      <div className="flex h-5 rounded-full overflow-hidden gap-px">
        {segments.map(s => (
          <div key={s.label} className={`${s.color} transition-all duration-500`}
            style={{ width: `${s.pct}%` }} />
        ))}
      </div>
      {/* legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${s.color}`} />
            <span className="text-xs text-gray-600">{s.label}</span>
            <span className="text-xs font-bold text-gray-800">{fmtPct(s.pct)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Breakdown table row ───────────────────────────────────────────────────────

function Row({
  label, annual, monthly, accent, dimmed, bold,
}: {
  label: string; annual: number; monthly: number
  accent?: string; dimmed?: boolean; bold?: boolean
}) {
  const { t } = useLang()
  return (
    <div className={`flex items-center justify-between py-2.5 ${dimmed ? 'opacity-40' : ''}`}>
      <span className={`text-sm ${bold ? 'font-black text-gray-900' : 'text-gray-600'} ${accent ?? ''}`}>
        {label}
      </span>
      <div className="text-right">
        <p className={`text-sm font-bold ${bold ? 'text-gray-900 text-base' : 'text-gray-800'} ${accent ?? ''}`}>
          {fmt(annual)}
          <span className="text-xs font-normal text-gray-400 ml-0.5">{t.perYear}</span>
        </p>
        <p className="text-xs text-gray-400">{fmt(monthly)}{t.perMonth}</p>
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

// ── Root App ──────────────────────────────────────────────────────────────────

export default function App() {
  const { t } = useLang()
  const [raw, setRaw] = useState('')
  const [mode, setMode] = useState<'annual' | 'monthly'>('annual')

  // Parse input → always store/calc as annual
  const gross = useMemo(() => {
    const n = parseFloat(raw.replace(/[,.\s]/g, '').replace(/[^0-9]/g, ''))
    if (isNaN(n) || n <= 0) return 0
    return mode === 'monthly' ? n * 12 : n
  }, [raw, mode])

  const result = useMemo(() => calcTax(gross), [gross])

  const hasResult = gross > 0

  function handlePreset(annual: number) {
    setMode('annual')
    setRaw(annual.toLocaleString('en-IE'))
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-black text-gray-900 text-base">💶 {t.siteName}</span>
          <LangDropdown />
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto px-4 py-6 w-full space-y-5">

        {/* ── Hero + Input ── */}
        <div className="text-center mb-2">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">{t.heroSubtitle}</p>
        </div>

        {/* Input card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          {/* Annual / Monthly toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4 w-fit mx-auto">
            {(['annual', 'monthly'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${mode === m ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                {m === 'annual' ? t.annualLabel : t.monthlyLabel}
              </button>
            ))}
          </div>

          {/* Salary input */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300 select-none">€</span>
            <input
              type="text" inputMode="numeric"
              value={raw}
              onChange={e => setRaw(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="w-full pl-10 pr-4 py-4 text-2xl font-black text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-400 bg-white transition-colors placeholder:text-gray-200 text-center"
            />
          </div>

          {/* Conversion hint */}
          {hasResult && (
            <p className="text-center text-xs text-gray-400 mt-2">
              {mode === 'annual'
                ? `≈ ${fmt(gross / 12)} ${t.perMonth}`
                : `≈ ${fmt(gross)} ${t.perYear}`}
            </p>
          )}

          {/* Preset quick picks */}
          <div className="mt-4">
            <p className="text-xs text-gray-400 text-center mb-2">{t.presetsLabel}</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {PRESETS.map(p => (
                <button key={p} onClick={() => handlePreset(p)}
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

          <p className="text-center text-xs text-gray-300 mt-4">🇮🇪 {t.taxYear}</p>
        </div>

        {/* ── Results ── */}
        {hasResult && (
          <>
            {/* Take-home hero */}
            <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl p-5 text-white">
              <p className="text-sm font-semibold text-emerald-200 mb-1">{t.takeHome}</p>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-4xl font-black">{fmt(result.netPay)}</p>
                <p className="text-emerald-200 text-sm">{t.perYear}</p>
              </div>
              <p className="text-emerald-100 text-lg font-bold mb-4">
                {fmt(result.netPay / 12)}<span className="text-emerald-200 text-sm font-normal">{t.perMonth}</span>
              </p>
              <BreakdownBar result={result} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">{t.effectiveRate}</p>
                <p className="text-2xl font-black text-gray-900">{fmtPct(result.effectiveRate)}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">{t.totalDeductions}</p>
                <p className="text-2xl font-black text-rose-600">{fmt(result.totalDeductions)}</p>
              </div>
            </div>

            {/* Full breakdown table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                <p className="font-black text-gray-900 text-sm">{t.breakdown}</p>
              </div>
              <div className="px-4 divide-y divide-gray-50">
                <Row label={t.grossSalary}  annual={result.gross}     monthly={result.gross / 12}       bold />
                <div className="py-1">
                  <div className="flex items-center gap-2 text-xs text-gray-400 py-1">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span>deductions</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                </div>
                <Row label={`${t.incomeTax} (${fmtPct(result.incomeTaxPct)})`}
                     annual={-result.incomeTax} monthly={-result.incomeTax / 12}
                     accent="text-rose-500" />
                <Row label={`${t.usc} (${fmtPct(result.uscPct)})`}
                     annual={-result.usc} monthly={-result.usc / 12}
                     accent="text-amber-500" />
                <Row label={`${t.prsi} (${fmtPct(result.prsiPct)})`}
                     annual={-result.prsi} monthly={-result.prsi / 12}
                     accent="text-violet-500" />
                <div className="py-1">
                  <div className="h-px bg-gray-200" />
                </div>
                <Row label={`✅ ${t.netTakeHome}`} annual={result.netPay} monthly={result.netPay / 12} bold />
              </div>
            </div>
          </>
        )}

        {/* ── How Ireland taxes you ── */}
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

        {/* ── Min wage + Stamp 2 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <p className="font-bold text-blue-900 text-sm mb-1">{t.minWageTitle}</p>
            <p className="text-3xl font-black text-blue-700 mb-1">{t.minWageHourly}</p>
            <p className="text-xs text-blue-600 leading-relaxed">{t.minWageDesc}</p>
            <button
              onClick={() => handlePreset(27378)}
              className="mt-3 text-xs font-bold text-blue-700 underline"
            >
              {hasResult && gross === 27378 ? '✓ Selected' : 'Calculate min wage →'}
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="font-bold text-amber-900 text-sm mb-1">{t.stamp2Title}</p>
            <p className="text-xs text-amber-700 leading-relaxed">{t.stamp2Body}</p>
          </div>
        </div>

        {/* ── Sponsor CTA ── */}
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

        {/* Disclaimer */}
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

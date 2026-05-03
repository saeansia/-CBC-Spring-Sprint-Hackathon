'use client'
import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import ResultCard from '@/components/ResultCard'
import Disclaimer from '@/components/Disclaimer'
import Link from 'next/link'

interface Metric {
  name: string
  value: string
  unit: string
  normalRange: string
  status: 'normal' | 'borderline' | 'abnormal'
  explanation: string
}

interface ReportResult {
  summary: string
  metrics: Metric[]
  recommendations: string[]
  followUp: string
}

const statusStyles: Record<Metric['status'], { label: string; color: string }> = {
  normal:     { label: 'Normal',     color: '#16a34a' },
  borderline: { label: 'Borderline', color: '#d97706' },
  abnormal:   { label: 'Abnormal',   color: '#dc2626' },
}

export default function MedicalReportsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/analyze-report', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setResult(data)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 fade-in" style={{ background: '#e8edf2', minHeight: '100vh' }}>
      <Link href="/" className="text-blue-500 text-sm font-medium hover:text-blue-700 mb-8 inline-block">
        &larr; Back
      </Link>
      <Disclaimer />

      <h1 className="font-heading text-4xl text-slate-800 mb-2">Medical Reports</h1>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
        Upload your lab results and we'll explain what every number means — and what you can do about it.
      </p>

      <FileUpload onFileSelect={setFile} />

      <button
        onClick={analyze}
        disabled={!file || loading}
        className="btn-blue mt-5 w-full py-3 text-sm"
      >
        {loading ? 'Reading results...' : 'Analyze Report'}
      </button>

      {loading && (
        <div className="flex items-center justify-center gap-3 mt-8 text-blue-500 text-sm">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Reading your results...
        </div>
      )}

      {error && (
        <div
          className="mt-6 px-5 py-4 rounded-2xl text-red-600 text-sm"
          style={{ boxShadow: 'inset 3px 3px 8px #c5cad0, inset -3px -3px 8px #ffffff', background: '#e8edf2' }}
        >
          {error}
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard title="Overview">
            <p>{result.summary}</p>
          </ResultCard>

          <ResultCard title="Your Metrics">
            <div className="space-y-4">
              {result.metrics.map((m, i) => {
                const s = statusStyles[m.status]
                return (
                  <div
                    key={i}
                    className="rounded-xl p-4"
                    style={{ boxShadow: 'inset 3px 3px 8px #c5cad0, inset -3px -3px 8px #ffffff', background: '#e8edf2' }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-700 text-sm">{m.name}</span>
                      <span
                        className="text-xs font-semibold px-3 py-0.5 rounded-full"
                        style={{ color: s.color, background: s.color + '18' }}
                      >
                        {s.label}
                      </span>
                    </div>
                    <p className="text-blue-600 font-medium text-sm">
                      {m.value} {m.unit}
                      <span className="text-slate-400 font-normal ml-2 text-xs">normal: {m.normalRange}</span>
                    </p>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed">{m.explanation}</p>
                  </div>
                )
              })}
            </div>
          </ResultCard>

          <ResultCard title="Lifestyle Recommendations">
            <ul className="space-y-2">
              {result.recommendations.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-blue-400 font-bold mt-0.5">—</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </ResultCard>

          <ResultCard title="When to Follow Up">
            <p>{result.followUp}</p>
          </ResultCard>
        </div>
      )}
    </main>
  )
}

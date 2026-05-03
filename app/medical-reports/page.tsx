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

const statusBadge = (status: Metric['status']) => {
  if (status === 'normal') return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">🟢 Normal</span>
  if (status === 'borderline') return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">🟡 Borderline</span>
  return <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">🔴 Abnormal</span>
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
    <main className="max-w-2xl mx-auto px-6 py-10 fade-in">
      <Link href="/" className="text-blue-500 text-sm hover:underline mb-6 inline-block">← Back</Link>
      <Disclaimer />
      <h1 className="font-heading text-4xl text-blue-950 mb-2">Understand Your Lab Results</h1>
      <p className="text-gray-500 mb-8">Upload your medical report and we'll explain what every number means — and what you can do about it.</p>

      <FileUpload onFileSelect={setFile} />

      <button
        onClick={analyze}
        disabled={!file || loading}
        className="mt-5 w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {loading ? 'Reading your results...' : 'Analyze Report'}
      </button>

      {loading && (
        <div className="flex items-center justify-center gap-3 mt-8 text-teal-600">
          <div className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <span>Reading your results...</span>
        </div>
      )}

      {error && <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>}

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard title="Overall Summary" icon="📊">
            <p>{result.summary}</p>
          </ResultCard>

          <ResultCard title="Your Metrics" icon="🔬">
            <div className="space-y-4">
              {result.metrics.map((m, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800">{m.name}</span>
                    {statusBadge(m.status)}
                  </div>
                  <p className="text-blue-700 font-medium">{m.value} {m.unit} <span className="text-gray-400 font-normal text-xs">normal: {m.normalRange}</span></p>
                  <p className="text-gray-500 text-sm mt-1">{m.explanation}</p>
                </div>
              ))}
            </div>
          </ResultCard>

          <ResultCard title="Lifestyle Recommendations" icon="🌱">
            <ul className="list-disc list-inside space-y-1">
              {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </ResultCard>

          <ResultCard title="When to Follow Up" icon="📅">
            <p>{result.followUp}</p>
          </ResultCard>
        </div>
      )}
    </main>
  )
}

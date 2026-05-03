'use client'
import { useState } from 'react'
import FileUpload from '@/components/FileUpload'
import ResultCard from '@/components/ResultCard'
import Disclaimer from '@/components/Disclaimer'
import Link from 'next/link'

interface BillResult {
  summary: { total: string; provider: string; serviceDate: string }
  lineItems: { charge: string; amount: string; explanation: string }[]
  redFlags: string[]
  nextSteps: string[]
  questionsToAsk: string[]
}

export default function MedicalBillsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BillResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/analyze-bill', { method: 'POST', body: formData })
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

      <h1 className="font-heading text-4xl text-slate-800 mb-2">Medical Bills</h1>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
        Upload a photo or PDF of your bill — we'll break down every charge in plain English.
      </p>

      <FileUpload onFileSelect={setFile} />

      <button
        onClick={analyze}
        disabled={!file || loading}
        className="btn-blue mt-5 w-full py-3 text-sm"
      >
        {loading ? 'Analyzing...' : 'Analyze Bill'}
      </button>

      {loading && (
        <div className="flex items-center justify-center gap-3 mt-8 text-blue-500 text-sm">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Analyzing your bill...
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
          <ResultCard title="Bill Summary">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Total</p>
                <p className="font-semibold text-blue-600 text-lg">{result.summary.total}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Provider</p>
                <p className="font-medium text-slate-700">{result.summary.provider}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Date</p>
                <p className="font-medium text-slate-700">{result.summary.serviceDate}</p>
              </div>
            </div>
          </ResultCard>

          <ResultCard title="Line Item Explanations">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 text-xs uppercase tracking-wide border-b border-slate-200/60">
                  <th className="pb-2 pr-4">Charge</th>
                  <th className="pb-2 pr-4">Amount</th>
                  <th className="pb-2">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {result.lineItems.map((item, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-medium text-slate-700">{item.charge}</td>
                    <td className="py-2 pr-4 text-blue-600">{item.amount}</td>
                    <td className="py-2 text-slate-500">{item.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ResultCard>

          {result.redFlags.length > 0 && (
            <ResultCard title="Items to Review">
              <ul className="space-y-2">
                {result.redFlags.map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-red-400 font-bold mt-0.5">—</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </ResultCard>
          )}

          <ResultCard title="Next Steps">
            <ol className="space-y-2 list-decimal list-inside">
              {result.nextSteps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </ResultCard>

          <ResultCard title="Questions to Ask">
            <ul className="space-y-2">
              {result.questionsToAsk.map((q, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-blue-400 font-bold mt-0.5">—</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </ResultCard>
        </div>
      )}
    </main>
  )
}

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
      if (data.error) {
        setError(data.error)
      } else {
        setResult(data)
      }
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
      <h1 className="font-heading text-4xl text-blue-950 mb-2">Understand Your Medical Bill</h1>
      <p className="text-gray-500 mb-8">Upload a photo or PDF of your bill — we'll break down every charge in plain English.</p>

      <FileUpload onFileSelect={setFile} />

      <button
        onClick={analyze}
        disabled={!file || loading}
        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {loading ? 'Analyzing your bill...' : 'Analyze Bill'}
      </button>

      {loading && (
        <div className="flex items-center justify-center gap-3 mt-8 text-blue-600">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Analyzing your bill...</span>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
      )}

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard title="Bill Summary" icon="📋">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-gray-400 text-xs uppercase">Total</p><p className="font-semibold text-lg text-blue-800">{result.summary.total}</p></div>
              <div><p className="text-gray-400 text-xs uppercase">Provider</p><p className="font-semibold">{result.summary.provider}</p></div>
              <div><p className="text-gray-400 text-xs uppercase">Date</p><p className="font-semibold">{result.summary.serviceDate}</p></div>
            </div>
          </ResultCard>

          <ResultCard title="Line Item Explanations" icon="📝">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-400 border-b border-gray-100"><th className="pb-2">Charge</th><th className="pb-2">Amount</th><th className="pb-2">Meaning</th></tr></thead>
              <tbody>
                {result.lineItems.map((item, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-2 pr-3 font-medium">{item.charge}</td>
                    <td className="py-2 pr-3 text-blue-700">{item.amount}</td>
                    <td className="py-2 text-gray-500">{item.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ResultCard>

          {result.redFlags.length > 0 && (
            <ResultCard title="Red Flags" icon="🚩">
              <ul className="list-disc list-inside space-y-1">
                {result.redFlags.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </ResultCard>
          )}

          <ResultCard title="Next Steps" icon="✅">
            <ol className="list-decimal list-inside space-y-1">
              {result.nextSteps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </ResultCard>

          <ResultCard title="Questions to Ask" icon="💬">
            <ul className="list-disc list-inside space-y-1">
              {result.questionsToAsk.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </ResultCard>
        </div>
      )}
    </main>
  )
}

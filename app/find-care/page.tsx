'use client'
import { useState } from 'react'
import ResultCard from '@/components/ResultCard'
import Disclaimer from '@/components/Disclaimer'
import Link from 'next/link'

interface CareResult {
  overview: string
  urgency: 'er' | 'soon' | 'appointment' | 'home'
  urgencyReason: string
  providerType: string
  howToFind: string[]
  homeCareTips: string[]
  scriptForDoctor: string
}

const urgencyConfig = {
  er: { badge: '🚨 Go to ER Now', color: 'bg-red-100 text-red-800 border-red-200' },
  soon: { badge: '⚠️ See a Doctor Soon (within 48hrs)', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  appointment: { badge: '📅 Schedule an Appointment', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  home: { badge: '💊 Can Try Home Care First', color: 'bg-green-100 text-green-800 border-green-200' },
}

export default function FindCarePage() {
  const [concern, setConcern] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CareResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const find = async () => {
    if (!concern.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/find-care', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concern, location }),
      })
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
      <h1 className="font-heading text-4xl text-blue-950 mb-2">Find the Right Care</h1>
      <p className="text-gray-500 mb-8">Describe what you're experiencing and we'll help you understand what kind of care you need.</p>

      <textarea
        value={concern}
        onChange={(e) => setConcern(e.target.value)}
        placeholder="Describe your symptoms or health concern... (e.g. 'I've had a persistent cough for 2 weeks and mild fever')"
        rows={4}
        className="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
      />

      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Your location (city or zip) — optional"
        className="mt-3 w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
      />

      <button
        onClick={find}
        disabled={!concern.trim() || loading}
        className="mt-5 w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {loading ? 'Finding your options...' : 'Find Care Options'}
      </button>

      {loading && (
        <div className="flex items-center justify-center gap-3 mt-8 text-violet-600">
          <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <span>Finding your options...</span>
        </div>
      )}

      {error && <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>}

      {result && (
        <div className="mt-8 space-y-4">
          <ResultCard title="What This Might Be" icon="🩺">
            <p>{result.overview}</p>
          </ResultCard>

          <div className={`border rounded-2xl p-5 ${urgencyConfig[result.urgency].color}`}>
            <p className="font-bold text-lg">{urgencyConfig[result.urgency].badge}</p>
            <p className="text-sm mt-1">{result.urgencyReason}</p>
          </div>

          <ResultCard title="Type of Provider to See" icon="👨‍⚕️">
            <p className="font-medium text-base">{result.providerType}</p>
          </ResultCard>

          <ResultCard title="How to Find Help" icon="🗺️">
            <ol className="list-decimal list-inside space-y-1">
              {result.howToFind.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </ResultCard>

          {result.homeCareTips.length > 0 && (
            <ResultCard title="Home Care Tips" icon="🏠">
              <ul className="list-disc list-inside space-y-1">
                {result.homeCareTips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </ResultCard>
          )}

          <ResultCard title="What to Tell the Doctor" icon="📋">
            <p className="italic text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-100">&ldquo;{result.scriptForDoctor}&rdquo;</p>
          </ResultCard>
        </div>
      )}
    </main>
  )
}

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
  er:          { label: 'Go to ER Now',                    color: '#dc2626', bg: '#fef2f2' },
  soon:        { label: 'See a Doctor Soon (within 48hrs)', color: '#d97706', bg: '#fffbeb' },
  appointment: { label: 'Schedule an Appointment',          color: '#2563eb', bg: '#eff6ff' },
  home:        { label: 'Can Try Home Care First',          color: '#16a34a', bg: '#f0fdf4' },
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

  const inputStyle = {
    background: '#e8edf2',
    boxShadow: 'inset 4px 4px 10px #c5cad0, inset -4px -4px 10px #ffffff',
    border: 'none',
    outline: 'none',
    borderRadius: '14px',
    color: '#1e293b',
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10 fade-in" style={{ background: '#e8edf2', minHeight: '100vh' }}>
      <Link href="/" className="text-blue-500 text-sm font-medium hover:text-blue-700 mb-8 inline-block">
        &larr; Back
      </Link>
      <Disclaimer />

      <h1 className="font-heading text-4xl text-slate-800 mb-2">Find Care</h1>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
        Describe what you're experiencing and we'll help you find the right level of care.
      </p>

      <textarea
        value={concern}
        onChange={(e) => setConcern(e.target.value)}
        placeholder="Describe your symptoms or concern... (e.g. 'I've had a persistent cough for 2 weeks and mild fever')"
        rows={4}
        className="w-full p-4 text-sm resize-none placeholder-slate-400"
        style={inputStyle}
      />

      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Your location (city or zip) — optional"
        className="mt-4 w-full px-4 py-3 text-sm placeholder-slate-400"
        style={inputStyle}
      />

      <button
        onClick={find}
        disabled={!concern.trim() || loading}
        className="btn-blue mt-5 w-full py-3 text-sm"
      >
        {loading ? 'Finding options...' : 'Find Care Options'}
      </button>

      {loading && (
        <div className="flex items-center justify-center gap-3 mt-8 text-blue-500 text-sm">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Finding your options...
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
          <ResultCard title="What This Might Be">
            <p>{result.overview}</p>
          </ResultCard>

          <div
            className="rounded-2xl px-6 py-5"
            style={{ background: urgencyConfig[result.urgency].bg, boxShadow: '6px 6px 14px #c5cad0, -6px -6px 14px #ffffff' }}
          >
            <p className="font-semibold text-base" style={{ color: urgencyConfig[result.urgency].color }}>
              {urgencyConfig[result.urgency].label}
            </p>
            <p className="text-slate-500 text-sm mt-1">{result.urgencyReason}</p>
          </div>

          <ResultCard title="Type of Provider">
            <p className="font-medium text-slate-800">{result.providerType}</p>
          </ResultCard>

          <ResultCard title="How to Find Help">
            <ol className="space-y-2 list-decimal list-inside">
              {result.howToFind.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </ResultCard>

          {result.homeCareTips.length > 0 && (
            <ResultCard title="Home Care Tips">
              <ul className="space-y-2">
                {result.homeCareTips.map((t, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-blue-400 font-bold mt-0.5">—</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </ResultCard>
          )}

          <ResultCard title="What to Tell Your Doctor">
            <p
              className="italic text-slate-600 rounded-xl px-4 py-3 text-sm leading-relaxed"
              style={{ boxShadow: 'inset 3px 3px 8px #c5cad0, inset -3px -3px 8px #ffffff', background: '#e8edf2' }}
            >
              &ldquo;{result.scriptForDoctor}&rdquo;
            </p>
          </ResultCard>
        </div>
      )}
    </main>
  )
}

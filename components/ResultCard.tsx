'use client'
import { ReactNode } from 'react'

interface ResultCardProps {
  title: string
  icon?: string
  children: ReactNode
}

export default function ResultCard({ title, children }: ResultCardProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden mb-4"
      style={{ background: '#e8edf2', boxShadow: '6px 6px 14px #c5cad0, -6px -6px 14px #ffffff' }}
    >
      <div className="px-6 py-3 border-b border-slate-200/60">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-blue-600">{title}</h3>
      </div>
      <div className="px-6 py-5 text-slate-600 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

'use client'
import { ReactNode } from 'react'

interface ResultCardProps {
  title: string
  icon?: string
  children: ReactNode
}

export default function ResultCard({ title, icon, children }: ResultCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-50 overflow-hidden mb-4">
      <div className="bg-blue-50 px-5 py-3 flex items-center gap-2 border-b border-blue-100">
        {icon && <span className="text-lg">{icon}</span>}
        <h3 className="font-semibold text-blue-900 text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <div className="px-5 py-4 text-gray-700 text-sm leading-relaxed">{children}</div>
    </div>
  )
}

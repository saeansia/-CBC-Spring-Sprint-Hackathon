import Link from 'next/link'

const features = [
  {
    href: '/medical-bills',
    label: 'Bills',
    title: 'Medical Bills',
    subtitle: "Upload a bill and we'll break down every charge in plain language.",
  },
  {
    href: '/medical-reports',
    label: 'Labs',
    title: 'Medical Reports',
    subtitle: 'Upload lab results and understand what every number means.',
  },
  {
    href: '/find-care',
    label: 'Care',
    title: 'Find Care',
    subtitle: 'Describe your concern and find the right level of care.',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16" style={{ background: '#e8edf2' }}>
      {/* Header */}
      <div className="fade-in text-center mb-16">
        <div
          className="inline-block px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
          style={{
            background: '#e8edf2',
            color: '#2563eb',
            boxShadow: '3px 3px 8px #c5cad0, -3px -3px 8px #ffffff',
          }}
        >
          HealthBridge
        </div>
        <h1 className="font-heading text-5xl text-slate-800 leading-tight mb-4">
          Understand your health,<br />one document at a time.
        </h1>
        <p className="text-slate-500 text-lg max-w-lg mx-auto">
          AI-powered tools to decode medical documents and find the right care — in plain English.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="fade-in grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-16">
        {features.map((f) => (
          <Link key={f.href} href={f.href} className="group block">
            <div
              className="p-8 rounded-2xl transition-all duration-200 group-hover:-translate-y-1"
              style={{
                background: '#e8edf2',
                boxShadow: '8px 8px 18px #c5cad0, -8px -8px 18px #ffffff',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white text-sm font-bold tracking-wide"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
              >
                {f.label}
              </div>
              <h2 className="font-heading text-xl text-slate-800 mb-2">{f.title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed">{f.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer disclaimer */}
      <p className="text-slate-400 text-xs text-center max-w-md">
        HealthBridge is an educational tool and does not provide medical advice.
        Always consult a licensed healthcare professional.
      </p>
    </main>
  )
}

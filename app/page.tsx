import Link from 'next/link'

const features = [
  {
    href: '/medical-bills',
    icon: '🧾',
    title: 'Medical Bills',
    subtitle: "Upload a bill and we'll explain every charge",
    color: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
  },
  {
    href: '/medical-reports',
    icon: '🔬',
    title: 'Medical Reports',
    subtitle: 'Upload lab results and understand your metrics',
    color: 'from-teal-50 to-teal-100',
    border: 'border-teal-200',
  },
  {
    href: '/find-care',
    icon: '🏥',
    title: 'Find Care',
    subtitle: 'Describe your concern and find nearby help',
    color: 'from-violet-50 to-violet-100',
    border: 'border-violet-200',
  },
]

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <section className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-12 fade-in">
        <div className="bg-blue-600 text-white rounded-2xl px-5 py-2 text-sm font-semibold mb-6 shadow-md inline-block">
          HealthBridge
        </div>
        <h1 className="font-heading text-5xl text-blue-950 leading-tight mb-4">
          Understand your health,<br />one document at a time.
        </h1>
        <p className="text-gray-500 text-lg max-w-xl">
          AI-powered tools to decode medical bills, interpret lab results, and find the right care — in plain English.
        </p>
      </section>

      <section className="flex flex-col md:flex-row gap-6 justify-center px-8 pb-24 max-w-5xl mx-auto w-full fade-in">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className={`flex-1 bg-gradient-to-br ${f.color} border ${f.border} rounded-3xl p-8 flex flex-col gap-3 shadow-sm hover:shadow-lg transition-all duration-200 group`}
          >
            <span className="text-4xl">{f.icon}</span>
            <h2 className="font-heading text-2xl text-gray-900 group-hover:text-blue-800 transition-colors">{f.title}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{f.subtitle}</p>
          </Link>
        ))}
      </section>

      <footer className="mt-auto bg-amber-50 border-t border-amber-200 py-4 px-6 text-center text-amber-800 text-xs">
        HealthBridge is an educational tool. It does not provide medical advice. Always consult a licensed healthcare professional.
      </footer>
    </main>
  )
}

import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <p className="text-base font-medium text-gray-900">
          <span className="text-amber-600">BBN</span> Investment Academy
        </p>
        <div className="flex gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5">Sign in</Link>
          <Link href="/signup" className="text-sm bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded-lg transition-colors">Join free</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
          Malawi's first investment education platform
        </div>
        <h1 className="text-4xl font-medium text-gray-900 leading-tight mb-4">
          Learn to grow your money on the <span className="text-amber-600">Malawi Stock Exchange</span>
        </h1>
        <p className="text-base text-gray-500 mb-8 leading-relaxed">
          Daily stock analysis, structured courses, simulated trading practice, and 1-on-1 mentorship with Benedicto Bena Nkhoma — 25 years of banking expertise, now accessible to everyone.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/signup" className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
            Start learning free
          </Link>
          <Link href="/login" className="border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium px-6 py-2.5 rounded-lg transition-colors">
            Sign in
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-16">
          {[
            { num: '226K', label: 'Community members' },
            { num: '25+', label: 'Years experience' },
            { num: '16', label: 'MSE counters tracked' },
            { num: 'Free', label: 'To get started' },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-medium text-amber-600">{s.num}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { icon: '📊', title: 'Daily analysis', desc: "Bena's daily MSE stock breakdowns — PE ratios, market caps, his commentary posted every day." },
            { icon: '📚', title: 'Structured courses', desc: 'Learn at your own pace from beginner to advanced with video lessons, notes, and practice demos.' },
            { icon: '📈', title: 'Trading simulator', desc: 'Practice buying and selling MSE shares with MK 1,000,000 in fake money. No risk, real learning.' },
            { icon: '🎯', title: '1-on-1 mentorship', desc: 'Book a private 45-minute session directly with Bena for personalised investment guidance.' },
            { icon: '💬', title: 'Members community', desc: 'Connect with other Malawian investors, share ideas, ask questions, and learn together.' },
            { icon: '🏦', title: 'MSE live tracker', desc: 'All 16 MSE counters — price, change percentage, PE ratio, and market cap in one place.' },
          ].map(f => (
            <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-amber-50 border border-amber-100 rounded-xl p-6 text-center">
          <p className="text-sm font-medium text-gray-900 mb-1">Ready to start investing smarter?</p>
          <p className="text-sm text-gray-500 mb-4">Join free today — no credit card required.</p>
          <Link href="/signup" className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors inline-block">
            Create free account
          </Link>
        </div>
      </div>

      <footer className="border-t border-gray-100 px-6 py-4 text-center">
        <p className="text-xs text-gray-400">© 2026 BBN Investment Academy · Blantyre, Malawi</p>
      </footer>
    </div>
  )
}
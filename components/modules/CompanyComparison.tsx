'use client'
import { useState } from 'react'

const companies = {
    real: {
        name: 'National Bank of Malawi (real, 2025)',
        revenue: '+48.98% YoY',
        profit: '+95% YoY',
        expenses: 'grew slower than inflation',
        verdict: 'healthy',
    },
    fictional: {
        name: '"Chikomeko Holdings" (fictional example)',
        revenue: '-12% YoY',
        profit: '-34% YoY',
        expenses: 'grew faster than revenue',
        verdict: 'concerning',
    },
}

export default function CompanyComparison() {
    const [guess, setGuess] = useState<'real' | 'fictional' | null>(null)

    return (
        <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-3">
                Which company looks financially healthier? Tap one.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
                {(Object.entries(companies) as [keyof typeof companies, typeof companies.real][]).map(
                    ([key, c]) => (
                        <button
                            key={key}
                            onClick={() => setGuess(key)}
                            className={`text-left p-3 rounded-lg border text-xs ${guess === key ? 'border-amber-400 bg-white' : 'border-gray-200 bg-white'
                                }`}
                        >
                            <p className="font-medium text-gray-900 mb-2">{c.name}</p>
                            <p className="text-gray-600 mb-1">Revenue: {c.revenue}</p>
                            <p className="text-gray-600 mb-1">Profit: {c.profit}</p>
                            <p className="text-gray-600">Expenses: {c.expenses}</p>
                        </button>
                    )
                )}
            </div>

            {guess && (
                <div className="border-t border-gray-200 pt-3">
                    <p
                        className={`text-sm font-medium mb-1 ${guess === 'real' ? 'text-green-700' : 'text-red-700'
                            }`}
                    >
                        {guess === 'real' ? 'Correct.' : 'Take another look.'}
                    </p>
                    <p className="text-sm text-gray-700">
                        The real NBM figures show revenue, profit, and cost discipline all moving in the right
                        direction together. The fictional company shows the opposite pattern — falling revenue,
                        falling profit even faster, and expenses outpacing income. That combination, growing
                        costs while revenue shrinks, is one of the clearest warning signs in a report.
                    </p>
                </div>
            )}
        </div>
    )
}
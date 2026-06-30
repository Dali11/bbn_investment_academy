'use client'
import { useState } from 'react'

const lineItems = [
    {
        label: 'Net revenue (2025)',
        value: 'MWK 364.7 billion',
        change: '+48.98% year-over-year',
        explainer: "This is the total income the bank generated from its business activities, before any expenses are subtracted. Revenue growing year after year is generally a healthy sign, but it only tells you the top line — not whether the company is actually keeping that money as profit.",
        sentiment: 'good',
    },
    {
        label: 'Other income',
        value: 'Up 93%',
        change: 'driven by forex dealings, fees, and capital gains',
        explainer: "Income from sources beyond core operations — here, foreign exchange trading, fees, and gains on investments. A spike like this is worth noting separately, since it can be less repeatable year to year than core lending income.",
        sentiment: 'neutral',
    },
    {
        label: 'Operating expenses',
        value: '+25%',
        change: 'below the 28.4% headline inflation rate',
        explainer: "What it cost the bank to run its operations. The genuinely important detail here is that expenses grew slower than inflation — meaning the bank actually got more efficient in real terms, not just nominally.",
        sentiment: 'good',
    },
    {
        label: 'Profit after tax (2025)',
        value: 'MWK 197.97 billion',
        change: '+95% from MWK 101.71 billion in 2024',
        explainer: "What's left after every expense, including tax, is subtracted from revenue. This is the bottom line — the actual profit available to the business and, ultimately, to shareholders through dividends or reinvestment.",
        sentiment: 'good',
    },
]

export default function IncomeStatementExplorer() {
    const [active, setActive] = useState(0)

    return (
        <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-3">National Bank of Malawi — 2025 results, tap a line</p>

            <div className="space-y-1 mb-4">
                {lineItems.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg flex justify-between items-center transition-colors ${active === i ? 'bg-white border border-amber-300' : 'hover:bg-white'
                            }`}
                    >
                        <span className="text-sm text-gray-900">{item.label}</span>
                        <span className="text-sm font-medium text-gray-700">{item.value}</span>
                    </button>
                ))}
            </div>

            <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center gap-2 mb-2">
                    <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${lineItems[active].sentiment === 'good'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                    >
                        {lineItems[active].change}
                    </span>
                </div>
                <p className="text-sm text-gray-700">{lineItems[active].explainer}</p>
            </div>
        </div>
    )
}
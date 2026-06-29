'use client'
import { useState } from 'react'

const steps = [
    {
        title: 'Broker sends your order to the MSE',
        detail: 'Your stockbroker submits your buy or sell instruction during trading hours, roughly 9:30am to 2:30pm on weekdays.',
    },
    {
        title: "It's matched with someone trading at your price",
        detail: 'The MSE pairs your order with a willing buyer or seller at a price you both agree to.',
    },
    {
        title: 'Shares settle into your CDSRC account',
        detail: 'After the trade executes, the shares (or cash, if selling) land in your account, typically within a few days.',
    },
]

export default function SettlementJourney() {
    const [active, setActive] = useState(0)

    return (
        <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-3">Tap each step to see what happens</p>

            <div className="flex flex-col gap-2 mb-4">
                {steps.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className="flex items-center gap-3 text-left"
                    >
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${active === i ? 'bg-amber-600 text-white' : 'bg-green-100 text-green-700'
                                }`}
                        >
                            {i + 1}
                        </div>
                        <p className={`text-sm ${active === i ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                            {s.title}
                        </p>
                    </button>
                ))}
            </div>

            <div className="border-t border-gray-200 pt-3">
                <p className="text-sm text-gray-700">{steps[active].detail}</p>
            </div>
        </div>
    )
}
'use client'
import { useState } from 'react'

export default function ModuleTabs({
    tab1,
    tab2,
    tab3,
    labels,
}: {
    tab1: React.ReactNode
    tab2: React.ReactNode
    tab3: React.ReactNode
    labels: [string, string, string]
}) {
    const [active, setActive] = useState(1)

    return (
        <div className="my-6">
            <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg">
                {labels.map((label, i) => {
                    const tabNum = i + 1
                    return (
                        <button
                            key={tabNum}
                            onClick={() => setActive(tabNum)}
                            className={`flex-1 text-xs font-medium py-2 px-2 rounded-md transition-colors ${active === tabNum
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {label}
                        </button>
                    )
                })}
            </div>

            <div className={active === 1 ? 'block' : 'hidden'}>{tab1}</div>
            <div className={active === 2 ? 'block' : 'hidden'}>{tab2}</div>
            <div className={active === 3 ? 'block' : 'hidden'}>{tab3}</div>
        </div>
    )
}
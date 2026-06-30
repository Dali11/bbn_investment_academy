const flags = [
    {
        title: 'Expenses growing faster than revenue',
        detail: 'If costs are rising quicker than income, profit margins shrink even while the company looks busier on paper.',
    },
    {
        title: 'Revenue relying heavily on one-off gains',
        detail: 'Income from a one-time sale or asset revaluation can inflate a single year\'s numbers without reflecting the real underlying business.',
    },
    {
        title: 'Profit falling while revenue holds steady',
        detail: 'This usually points to rising costs, debt interest, or inefficiency eating into what the business actually keeps.',
    },
    {
        title: 'Repeated delays in publishing results',
        detail: 'Companies that consistently report late may be signaling internal problems with their finances or governance.',
    },
]

export default function RedFlags() {
    return (
        <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-3">Worth watching for in any report</p>
            <div className="space-y-3">
                {flags.map((f, i) => (
                    <div key={i} className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">{f.title}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{f.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
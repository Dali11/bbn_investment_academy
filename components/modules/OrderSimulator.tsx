'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'

const prices: Record<string, number> = {
    AIRTEL: 111.41,
    NICO: 1600.16,
    SUNBIRD: 3100.13,
}

export default function OrderSimulator() {
    const [step, setStep] = useState(1)
    const [stock, setStock] = useState('AIRTEL')
    const [quantity, setQuantity] = useState(50)

    const cost = prices[stock] * quantity

    return (
        <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-xs text-gray-500 mb-3">
                Try it: place a simulated order, no real money involved
            </p>

            {step === 1 && (
                <div>
                    <p className="text-xs text-gray-400 mb-1">Step 1 of 3</p>
                    <p className="text-sm font-medium text-gray-900 mb-3">Choose a share to buy</p>
                    <select
                        value={stock}
                        onChange={e => setStock(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
                    >
                        {Object.entries(prices).map(([symbol, price]) => (
                            <option key={symbol} value={symbol}>
                                {symbol} — MWK {price.toLocaleString()}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => setStep(2)}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2 rounded-lg"
                    >
                        Continue
                    </button>
                </div>
            )}

            {step === 2 && (
                <div>
                    <p className="text-xs text-gray-400 mb-1">Step 2 of 3</p>
                    <p className="text-sm font-medium text-gray-900 mb-3">How many shares</p>
                    <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2"
                    />
                    <p className="text-sm text-gray-600 mb-3">
                        Estimated cost: <span className="font-medium text-gray-900">MWK {cost.toLocaleString()}</span>
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStep(1)}
                            className="flex-1 border border-gray-200 text-sm font-medium py-2 rounded-lg"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setStep(3)}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2 rounded-lg"
                        >
                            Review order
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div>
                    <p className="text-xs text-gray-400 mb-1">Step 3 of 3</p>
                    <p className="text-sm font-medium text-gray-900 mb-3">Confirm your order</p>
                    <table className="w-full text-sm mb-4">
                        <tbody>
                            <tr>
                                <td className="text-gray-500 py-1">Share</td>
                                <td className="text-right">{stock}</td>
                            </tr>
                            <tr>
                                <td className="text-gray-500 py-1">Quantity</td>
                                <td className="text-right">{quantity}</td>
                            </tr>
                            <tr className="border-t border-gray-200">
                                <td className="text-gray-500 pt-2">Total</td>
                                <td className="text-right font-medium pt-2">MWK {cost.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button
                        onClick={() => setStep(4)}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2 rounded-lg"
                    >
                        Place order
                    </button>
                </div>
            )}

            {step === 4 && (
                <div className="text-center py-2">
                    <Check className="mx-auto text-green-600 mb-1" size={28} />
                    <p className="text-sm font-medium text-gray-900 mb-1">Order placed</p>
                    <p className="text-xs text-gray-500 mb-4">
                        In real trading, your broker sends this to the MSE and your shares settle into your CDSRC account a few days later.
                    </p>
                    <button
                        onClick={() => setStep(1)}
                        className="w-full border border-gray-200 text-sm font-medium py-2 rounded-lg"
                    >
                        Try again
                    </button>
                </div>
            )}
        </div>
    )
}
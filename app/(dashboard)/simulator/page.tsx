import { createClient } from '@/lib/supabase/server'
import SimulatorClient from './SimulatorClient'


export default async function SimulatorPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let { data: portfolio } = await supabase
        .from('sim_portfolios')
        .select('*')
        .eq('user_id', user?.id ?? '')
        .single()

    if (!portfolio && user) {
        const { data: newPortfolio } = await supabase
            .from('sim_portfolios')
            .insert({ user_id: user.id, cash_balance: 1000000 })
            .select()
            .single()
        portfolio = newPortfolio
    }

    const { data: holdings } = await supabase
        .from('sim_holdings')
        .select('*, mse_counters(symbol, company_name)')
        .eq('portfolio_id', portfolio?.id ?? '')

    const { data: prices } = await supabase
        .from('mse_prices')
        .select('*, mse_counters(symbol)')
        .order('price_date', { ascending: false })

    const { data: counters } = await supabase
        .from('mse_counters')
        .select('*')
        .order('symbol')

    const { data: transactions } = await supabase
        .from('sim_transactions')
        .select('*, mse_counters(symbol)')
        .eq('portfolio_id', portfolio?.id ?? '')
        .order('created_at', { ascending: false })
        .limit(10)

    const latestPrices: Record<number, number> = {}
    prices?.forEach(p => {
        if (!latestPrices[p.counter_id]) {
            latestPrices[p.counter_id] = Number(p.price)
        }
    })

    return (
        <SimulatorClient
            portfolio={portfolio}
            holdings={holdings ?? []}
            counters={counters ?? []}
            latestPrices={latestPrices}
            transactions={transactions ?? []}
            userId={user?.id ?? ''}
        />
    )
}
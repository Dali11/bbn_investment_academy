// app/(public)/markets/calendar/page.tsx
// Unified market calendar: merges `corporate_actions` (AGMs, dividends,
// rights issues, stock splits, reports, announcements) with `ipos`
// (open/close/listing dates) into one chronological agenda. No dedicated
// table — this page is a synthesized view over data entered via
// /admin/corporate-actions and /admin/ipos, same idea as Screeners
// synthesizing a view over mse_prices.

import { createClient as createServiceClient } from '@supabase/supabase-js'
import { CalendarAgenda, type CalendarEvent } from './CalendarAgenda'

export const revalidate = 3600 // re-fetch at most once per hour

function getServiceClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
}

export default async function MarketsCalendarPage() {
    const supabase = getServiceClient()

    const [{ data: rawActions }, { data: rawIpos }] = await Promise.all([
        supabase
            .from('corporate_actions')
            .select('id, type, headline, action_date, mse_counters(symbol, company_name)')
            .order('action_date', { ascending: false })
            .limit(300),
        supabase
            .from('ipos')
            .select('id, company_name, status, open_date, close_date, listing_date, mse_counters(symbol)')
            .limit(200),
    ])

    const actionEvents: CalendarEvent[] = (rawActions ?? [])
        .filter((a: any) => a.action_date)
        .map((a: any) => ({
            id: `ca-${a.id}`,
            date: a.action_date as string,
            type: a.type,
            label: a.headline as string,
            symbol: a.mse_counters?.symbol ?? null,
            company_name: a.mse_counters?.company_name ?? null,
        }))

    const ipoEvents: CalendarEvent[] = (rawIpos ?? []).flatMap((i: any) => {
        const symbol = i.mse_counters?.symbol ?? null
        const events: CalendarEvent[] = []
        if (i.open_date) {
            events.push({
                id: `ipo-${i.id}-open`,
                date: i.open_date,
                type: 'IPO',
                label: `${i.company_name} IPO opens for subscription`,
                symbol,
                company_name: i.company_name,
            })
        }
        if (i.close_date) {
            events.push({
                id: `ipo-${i.id}-close`,
                date: i.close_date,
                type: 'IPO',
                label: `${i.company_name} IPO closes`,
                symbol,
                company_name: i.company_name,
            })
        }
        if (i.listing_date) {
            events.push({
                id: `ipo-${i.id}-list`,
                date: i.listing_date,
                type: 'IPO',
                label: `${i.company_name} lists on the MSE`,
                symbol,
                company_name: i.company_name,
            })
        }
        return events
    })

    const events = [...actionEvents, ...ipoEvents].sort((a, b) => a.date.localeCompare(b.date))

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-[20px] font-semibold text-(--color-text-primary)">Calendar</h1>
                <p className="mt-0.5 text-[13px] text-(--color-text-tertiary)">
                    AGMs, dividends, rights issues, reports and IPO dates across MSE-listed companies
                </p>
            </div>

            <CalendarAgenda events={events} />
        </div>
    )
}

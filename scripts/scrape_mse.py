import requests
from bs4 import BeautifulSoup
from supabase import create_client
from datetime import date
from dotenv import load_dotenv
from pathlib import Path
import os
import re

# Resolve relative to this script's location, not the shell's CWD —
# otherwise running from inside scripts/ silently finds nothing.
PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env.local")

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise SystemExit(
        f"Missing Supabase credentials. Expected to find NEXT_PUBLIC_SUPABASE_URL "
        f"and SUPABASE_SERVICE_ROLE_KEY in {PROJECT_ROOT / '.env.local'} — "
        f"check that file exists and has both values set."
    )

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

PRICE_RE = re.compile(r"\d[\d,]*\.\d{2}")
SIGNED_RE = re.compile(r"[+-]\d+\.\d{2}")


def scrape_mse():
    url = "https://afx.kwayisi.org/mse/"
    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        res = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(res.text, "lxml")
    except Exception as e:
        print(f"Failed to fetch page: {e}")
        return

    today = date.today().isoformat()
    updated = 0
    seen = set()

    links = soup.find_all("a", href=re.compile(r"/mse/[a-z0-9\-]+\.html"))

    for link in links:
        symbol = link.get_text(strip=True).upper()

        if " " in symbol or len(symbol) > 10:
            continue
        if any(x in symbol for x in ["MASI", "MDSI", "MFSI", "INDEX"]):
            continue
        if symbol in seen:
            continue

        row = link.find_parent("tr")
        if not row:
            continue

        row_text = row.get_text(" ", strip=True)

        prices = PRICE_RE.findall(row_text)
        if not prices:
            print(f"Skipping {symbol} — no price pattern in row: {row_text}")
            continue

        try:
            price = float(prices[0].replace(",", ""))
        except Exception:
            print(f"Skipping {symbol} — could not parse price")
            continue

        price_pos = row_text.find(prices[0])
        after_price = row_text[price_pos + len(prices[0]):]
        signed_match = SIGNED_RE.search(after_price)

        change_pct = None
        if signed_match:
            raw_change = float(signed_match.group())
            next_char = after_price[signed_match.end():signed_match.end() + 1]
            if next_char == "%":
                change_pct = raw_change
            else:
                prev_price = price - raw_change
                if prev_price:
                    change_pct = round((raw_change / prev_price) * 100, 2)
        # If nothing signed is found at all, the counter likely didn't
        # trade today — change_pct correctly stays None.

        seen.add(symbol)

        counter = supabase.table("mse_counters").select("id").eq("symbol", symbol).execute()
        if not counter.data:
            print(f"Not in DB: {symbol}")
            continue

        counter_id = counter.data[0]["id"]

        existing = (
            supabase.table("mse_prices")
            .select("id")
            .eq("counter_id", counter_id)
            .eq("price_date", today)
            .execute()
        )

        if existing.data:
            supabase.table("mse_prices") \
                .update({"price": price, "change_pct": change_pct}) \
                .eq("id", existing.data[0]["id"]) \
                .execute()
            print(f"Updated {symbol}: MK {price} ({change_pct}%)")
        else:
            supabase.table("mse_prices").insert({
                "counter_id": counter_id,
                "price": price,
                "change_pct": change_pct,
                "price_date": today,
            }).execute()
            print(f"Inserted {symbol}: MK {price} ({change_pct}%)")

        updated += 1

    print(f"\nDone. {updated} counters updated for {today}")


from mse_index_parser import parse_index_rows, parse_trading_date


def scrape_indices():
    """Scrapes MASI/MDSI/MFSI from the daily trading-summary paragraph on
    afx.kwayisi.org/mse/ and upserts one row per index into `mse_indices`.

    Unlike individual counters, MDSI and MFSI are never published as an
    absolute index level by this source — only MASI gets a "close at X"
    figure. MDSI/MFSI rows are stored with value=None and only the
    day/week/YTD % changes filled in.
    """
    url = "https://afx.kwayisi.org/mse/"
    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        res = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(res.text, "lxml")
    except Exception as e:
        print(f"Failed to fetch page for indices: {e}")
        return

    text = soup.get_text(" ", strip=True)

    # Prefer the trading day printed on the page itself over wall-clock
    # "today" — the scraper may run late, retry, or hit a stale page.
    index_date = parse_trading_date(text) or date.today().isoformat()

    rows = parse_index_rows(text, index_date)

    if not any(r["index_code"] == "MASI" for r in rows):
        print("Couldn't find/parse MASI summary sentence on page")
    for code in ("MDSI", "MFSI"):
        if not any(r["index_code"] == code for r in rows):
            print(f"Couldn't find {code} summary clause — skipping")

    updated = 0
    for row in rows:
        row["source"] = "live_scrape"
        existing = (
            supabase.table("mse_indices")
            .select("id")
            .eq("index_code", row["index_code"])
            .eq("index_date", row["index_date"])
            .execute()
        )
        if existing.data:
            supabase.table("mse_indices") \
                .update(row) \
                .eq("id", existing.data[0]["id"]) \
                .execute()
            print(f"Updated {row['index_code']}: {row}")
        else:
            supabase.table("mse_indices").insert(row).execute()
            print(f"Inserted {row['index_code']}: {row}")
        updated += 1

    print(f"\nDone. {updated} indices updated for {index_date}")


SUFFIX_MULT = {"K": 1_000, "M": 1_000_000, "B": 1_000_000_000, "T": 1_000_000_000_000}


def parse_suffixed_number(s):
    """'7.74T' -> 7_740_000_000_000.0, '4.36M' -> 4_360_000.0, '1,384' -> 1384.0.

    Returns None if s is empty/unparseable — many fields (Opening Price,
    Number of Deals) are frequently blank on the source page.
    """
    if not s:
        return None
    s = s.strip().replace(",", "")
    m = re.match(r"^([+-]?\d+(?:\.\d+)?)([KMBT])?$", s)
    if not m:
        return None
    value = float(m.group(1))
    if m.group(2):
        value *= SUFFIX_MULT[m.group(2)]
    return value


def _label_value(text, label, value_re=r"[\d,]+\.?\d*[KMBT]?"):
    """Find `label` in flattened page text and grab the value glued/spaced
    right after it. Returns the raw matched string, or None.
    """
    m = re.search(re.escape(label) + r"\s*(" + value_re + r")", text)
    return m.group(1) if m else None


DAY_ROW_RE = re.compile(
    r"(\d{4}-\d{2}-\d{2})\s*([\d,]+)\s*([\d,]+\.\d{2})\s*([+-][\d,]+\.\d{2})?\s*([+-][\d.]+%)?"
)


def scrape_counter_details():
    """Scrapes each counter's individual afx.kwayisi.org page (richer than
    the /mse/ index page): day range, volume, deals, turnover, EPS, P/E,
    DPS, dividend yield, shares outstanding, market cap, and the last-10-
    trading-days table.

    Writes daily-changing fields onto mse_prices (today's row) and
    slow-changing fundamentals onto mse_fundamentals (overwritten in
    place). Also gap-fills mse_prices for any of the last 10 trading
    dates missing a row for this counter, using the source's own recent-
    history table as a safety net against a missed daily run.
    """
    headers = {"User-Agent": "Mozilla/5.0"}
    today = date.today().isoformat()

    counters = supabase.table("mse_counters").select("id, symbol").execute().data
    if not counters:
        print("No counters in mse_counters — run scrape_mse() first.")
        return

    updated = 0
    for c in counters:
        counter_id, symbol = c["id"], c["symbol"]
        url = f"https://afx.kwayisi.org/mse/{symbol.lower()}.html"

        try:
            res = requests.get(url, headers=headers, timeout=10)
            if res.status_code != 200:
                print(f"{symbol}: HTTP {res.status_code} — skipping")
                continue
            soup = BeautifulSoup(res.text, "lxml")
        except Exception as e:
            print(f"{symbol}: failed to fetch {url}: {e}")
            continue

        text = soup.get_text(" ", strip=True)

        day_low = parse_suffixed_number(_label_value(text, "Day\u2019s Low Price"))
        day_high = parse_suffixed_number(_label_value(text, "Day\u2019s High Price"))
        volume = parse_suffixed_number(_label_value(text, "Traded Volume"))
        deals = parse_suffixed_number(_label_value(text, "Number of Deals"))
        turnover = parse_suffixed_number(_label_value(text, "Gross Turnover"))
        eps = parse_suffixed_number(_label_value(text, "Earnings Per Share"))
        pe_ratio = parse_suffixed_number(_label_value(text, "Price/Earning Ratio"))
        dps = parse_suffixed_number(_label_value(text, "Dividend Per Share"))
        dividend_yield = parse_suffixed_number(
            _label_value(text, "Dividend Yield", value_re=r"[\d.]+%?")
        )
        shares_outstanding = parse_suffixed_number(
            _label_value(text, "Shares Outstanding")
        )
        market_cap = parse_suffixed_number(
            _label_value(text, "Market Capitalization")
        )

        price_fields = {}
        if day_low is not None:
            price_fields["day_low"] = day_low
        if day_high is not None:
            price_fields["day_high"] = day_high
        if volume is not None:
            price_fields["volume"] = int(volume)
        if deals is not None:
            price_fields["deals"] = int(deals)
        if turnover is not None:
            price_fields["turnover"] = turnover
        if pe_ratio is not None:
            price_fields["pe_ratio"] = pe_ratio
        if market_cap is not None:
            price_fields["market_cap"] = market_cap

        if price_fields:
            existing = (
                supabase.table("mse_prices")
                .select("id")
                .eq("counter_id", counter_id)
                .eq("price_date", today)
                .execute()
            )
            if existing.data:
                supabase.table("mse_prices").update(price_fields).eq(
                    "id", existing.data[0]["id"]
                ).execute()
            else:
                price_fields.update({"counter_id": counter_id, "price_date": today})
                supabase.table("mse_prices").insert(price_fields).execute()
            print(f"{symbol}: updated today's row with {list(price_fields.keys())}")
            updated += 1
        else:
            print(f"{symbol}: no daily fields parsed off {url}")

        fundamentals = {}
        if eps is not None:
            fundamentals["eps"] = eps
        if dps is not None:
            fundamentals["dps"] = dps
        if dividend_yield is not None:
            fundamentals["dividend_yield"] = dividend_yield
        if shares_outstanding is not None:
            fundamentals["shares_outstanding"] = shares_outstanding

        if fundamentals:
            fundamentals["counter_id"] = counter_id
            supabase.table("mse_fundamentals").upsert(
                fundamentals, on_conflict="counter_id"
            ).execute()

        # Gap-fill: backfill any of the last 10 trading days missing from
        # mse_prices, using the source's own recent-history table. This is
        # a safety net for a missed daily run, not a redesign — it only
        # ever inserts rows that don't already exist; never overwrites.
        day_rows = DAY_ROW_RE.findall(text)
        filled = 0
        for row_date, row_volume, row_close, row_change, row_change_pct in day_rows:
            existing = (
                supabase.table("mse_prices")
                .select("id")
                .eq("counter_id", counter_id)
                .eq("price_date", row_date)
                .execute()
            )
            if existing.data:
                continue  # already have this date — leave it alone

            change_pct = None
            if row_change_pct:
                try:
                    change_pct = float(row_change_pct.rstrip("%"))
                except ValueError:
                    pass

            supabase.table("mse_prices").insert({
                "counter_id": counter_id,
                "price_date": row_date,
                "price": float(row_close.replace(",", "")),
                "change_pct": change_pct,
                "volume": int(row_volume.replace(",", "")) if row_volume else None,
            }).execute()
            filled += 1

        if filled:
            print(f"{symbol}: gap-filled {filled} missing day(s) from 10-day history")

    print(f"\nDone. {updated} counters had detail pages scraped.")


if __name__ == "__main__":
    scrape_mse()
    scrape_indices()
    scrape_counter_details()
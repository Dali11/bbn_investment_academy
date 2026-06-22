import requests
from bs4 import BeautifulSoup
from supabase import create_client
from datetime import date
from dotenv import load_dotenv
import os
import re

load_dotenv(".env.local")

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def scrape_mse():
    url = "https://afx.kwayisi.org/mse/"
    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        res = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(res.text, "html.parser")
    except Exception as e:
        print(f"Failed to fetch page: {e}")
        return

    today = date.today().isoformat()
    updated = 0

    # Find all links that look like individual stock pages
    links = soup.find_all("a", href=re.compile(r"/mse/\w+"))

    for link in links:
        row = link.find_parent("tr")
        if not row:
            continue
        
        cols = row.find_all("td")
        if len(cols) < 3:
            continue
        
        symbol = link.get_text(strip=True).upper()
        
        # Skip index rows
        if any(x in symbol for x in ["MASI", "MDSI", "MFSI", "INDEX"]):
            continue
        
        try:
            price = float(cols[1].get_text(strip=True).replace(",", ""))
            change_text = cols[2].get_text(strip=True).replace("%", "").replace("+", "").strip()
            change_pct = float(change_text)
        except:
            print(f"Skipping {symbol} — could not parse")
            continue
        
        counter = supabase.table("mse_counters")\
            .select("id")\
            .eq("symbol", symbol)\
            .execute()
        
        if not counter.data:
            print(f"Not in DB: {symbol}")
            continue
        
        counter_id = counter.data[0]["id"]

        existing = supabase.table("mse_prices")\
            .select("id")\
            .eq("counter_id", counter_id)\
            .eq("price_date", today)\
            .execute()

        if existing.data:
            supabase.table("mse_prices")\
                .update({"price": price, "change_pct": change_pct})\
                .eq("id", existing.data[0]["id"])\
                .execute()
            print(f"Updated {symbol}: MK {price} ({change_pct}%)")
        else:
            supabase.table("mse_prices")\
                .insert({
                    "counter_id": counter_id,
                    "price": price,
                    "change_pct": change_pct,
                    "price_date": today
                })\
                .execute()
            print(f"Inserted {symbol}: MK {price} ({change_pct}%)")

        updated += 1

    print(f"\nDone. {updated} counters updated for {today}")

if __name__ == "__main__":
    scrape_mse()
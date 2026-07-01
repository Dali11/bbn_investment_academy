-- scripts/analyses_add_category_migration.sql
-- Adds `category` to `analyses`, powering the six Analysis Hub tabs on
-- /research (Latest Analysis, Undervalued Stocks, Dividend Stocks,
-- Weekly Recap, Economic Outlook, Sector Analysis).
--
-- All existing rows default to 'latest' since that's functionally what
-- they were before categories existed — general commentary with no
-- themed bucket. Keep the check constraint in sync with the
-- AnalysisCategory union in lib/analysisCategories.ts.
--
-- Run this once in the Supabase SQL editor.

alter table analyses
    add column if not exists category text not null default 'latest'
    check (category in ('latest', 'undervalued', 'dividend', 'weekly_recap', 'economic_outlook', 'sector'));

create index if not exists analyses_category_idx on analyses (category);

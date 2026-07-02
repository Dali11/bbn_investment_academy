# Run this from the project root (malawi-investor-main), e.g.:
#   PS C:\Users\NAME\bbn_investment_academy> .\rename-mse-to-stocks.ps1
#
# Renames app/(public)/mse -> app/(public)/stocks and updates every
# /mse href reference across the app to /stocks. Safe to re-run: if the
# folder's already renamed, that step just prints a message and moves on.

$mseFolder = "app\(public)\mse"
$stocksFolder = "app\(public)\stocks"

if (Test-Path -LiteralPath $mseFolder) {
    try {
        Rename-Item -LiteralPath $mseFolder -NewName "stocks" -ErrorAction Stop
        Write-Host "renamed: $mseFolder -> $stocksFolder"
    } catch {
        Write-Host ""
        Write-Host "Rename failed (folder still locked): $($_.Exception.Message)"
        Write-Host "Falling back to copying instead of renaming..."
        try {
            Copy-Item -LiteralPath $mseFolder -Destination $stocksFolder -Recurse -ErrorAction Stop
            Write-Host "copied: $mseFolder -> $stocksFolder"
            Write-Host "NOTE: the old '$mseFolder' folder is still there (harmless, just unused)."
            Write-Host "Delete it manually once whatever's locking it lets go - Task Manager,"
            Write-Host "closing VS Code fully, or a reboot usually clears it."
        } catch {
            Write-Host ""
            Write-Host "FAILED to copy the folder too: $($_.Exception.Message)"
            Write-Host "Stop 'npm run dev', fully close VS Code, and check Task Manager for"
            Write-Host "leftover node.exe processes, then run this script again."
            exit 1
        }
    }
} elseif (Test-Path -LiteralPath $stocksFolder) {
    Write-Host "already renamed: $stocksFolder exists"
} else {
    Write-Host "WARNING: neither folder found - check you are running this from the project root"
}

$files = @(
    "components\markets\MostActiveCounters.tsx",
    "components\home\SearchBox.tsx",
    "components\home\MarketSnapshot.tsx",
    "components\home\MarketMovers.tsx",
    "app\account\page.tsx",
    "app\(dashboard)\SidebarClient.tsx",
    "app\(public)\stocks\[symbol]\page.tsx",
    "app\(public)\stocks\StocksTable.tsx",
    "app\(public)\research\[id]\page.tsx",
    "app\(public)\research\page.tsx",
    "app\(public)\markets\page.tsx",
    "app\(public)\markets\corporate-actions\[slug]\page.tsx",
    "app\(public)\markets\corporate-actions\CorporateActionsList.tsx",
    "app\(public)\markets\ipos\IposList.tsx",
    "app\(public)\markets\stocks\StocksTable.tsx",
    "app\(public)\markets\screeners\ScreenerTool.tsx",
    "app\(public)\markets\calendar\CalendarAgenda.tsx",
    "app\(public)\news\NewsFeed.tsx",
    "app\(public)\layout.tsx",
    "next.config.ts",
    "lib\marketsNav.ts"
)

# Built from character codes on purpose, not typed as literal quote
# characters, so this can never be corrupted by smart-quote conversion
# in transit (copy/paste, editors, email, etc).
$singleQuote = [char]39
$doubleQuote = [char]34
$backtick    = [char]96

$openClass  = "[" + $singleQuote + $doubleQuote + $backtick + "]"
$closeClass = "[" + $singleQuote + $doubleQuote + "/" + $backtick + "]"
$pattern = "(" + $openClass + ")/mse(" + $closeClass + ")"
$replacement = "`$1/stocks`$2"

foreach ($f in $files) {
    if (Test-Path -LiteralPath $f) {
        $content = Get-Content -LiteralPath $f -Raw
        $updated = [regex]::Replace($content, $pattern, $replacement)
        if ($updated -ne $content) {
            Set-Content -LiteralPath $f -Value $updated -NoNewline
            Write-Host "patched: $f"
        } else {
            Write-Host "no change: $f"
        }
    } else {
        Write-Host "MISSING: $f"
    }
}

Write-Host ""
Write-Host "Done. Now run: Remove-Item -Recurse -Force .next"
Write-Host "Then: npm run dev"
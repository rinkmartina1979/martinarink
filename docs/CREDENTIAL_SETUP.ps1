# ═══════════════════════════════════════════════════════════════════
# MARTINA RINK — ADD MISSING ENV VARS TO VERCEL
# Run this script once you have all credentials.
# Run from: D:\WEBSITE DESIGN\martinarink-next
# Command: powershell -ExecutionPolicy Bypass -File docs\CREDENTIAL_SETUP.ps1
# ═══════════════════════════════════════════════════════════════════

# FILL THESE IN BEFORE RUNNING:
$SANITY_PROJECT_ID     = ""   # From sanity.io/manage → your project → Settings
$SANITY_WRITE_TOKEN    = ""   # From sanity.io/manage → your project → API → Tokens
$BREVO_API_KEY         = ""   # From app.brevo.com → Settings → API Keys
$BREVO_LIST_NEWSLETTER = ""   # From Brevo → Contacts → Lists → Newsletter → ID in URL
$BREVO_LIST_ASSESSMENT = ""   # From Brevo → Contacts → Lists → Assessment Leads → ID in URL
$RESEND_API_KEY        = ""   # From resend.com/api-keys
$CALENDLY_URL          = ""   # Your Calendly event URL (full https://calendly.com/...)

# Validate — stop if any are empty
$missing = @()
if (-not $SANITY_PROJECT_ID)     { $missing += "SANITY_PROJECT_ID" }
if (-not $SANITY_WRITE_TOKEN)    { $missing += "SANITY_WRITE_TOKEN" }
if (-not $BREVO_API_KEY)         { $missing += "BREVO_API_KEY" }
if (-not $BREVO_LIST_NEWSLETTER) { $missing += "BREVO_LIST_NEWSLETTER" }
if (-not $BREVO_LIST_ASSESSMENT) { $missing += "BREVO_LIST_ASSESSMENT" }
if (-not $RESEND_API_KEY)        { $missing += "RESEND_API_KEY" }
if (-not $CALENDLY_URL)          { $missing += "CALENDLY_URL" }

if ($missing.Count -gt 0) {
    Write-Host "ERROR: Fill in these values before running:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    exit 1
}

Write-Host "Adding env vars to Vercel..." -ForegroundColor Cyan

$vars = @{
    "NEXT_PUBLIC_SANITY_PROJECT_ID" = $SANITY_PROJECT_ID
    "SANITY_WRITE_TOKEN"            = $SANITY_WRITE_TOKEN
    "BREVO_API_KEY"                 = $BREVO_API_KEY
    "BREVO_LIST_ID_NEWSLETTER"      = $BREVO_LIST_NEWSLETTER
    "BREVO_LIST_ID_ASSESSMENT"      = $BREVO_LIST_ASSESSMENT
    "RESEND_API_KEY"                = $RESEND_API_KEY
    "NEXT_PUBLIC_CALENDLY_URL"      = $CALENDLY_URL
}

foreach ($key in $vars.Keys) {
    $value = $vars[$key]
    Write-Host "  Adding $key..." -NoNewline
    $value | npx vercel env add $key production --force 2>&1 | Out-Null
    Write-Host " done" -ForegroundColor Green
}

Write-Host ""
Write-Host "All env vars added. Deploying now..." -ForegroundColor Cyan
npx vercel --prod 2>&1

Write-Host ""
Write-Host "DONE. Site is live." -ForegroundColor Green

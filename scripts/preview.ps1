# Launch a local preview of Universal Signatures.
# Runs the dev server in the foreground — press Ctrl-C to stop.
# Windows equivalent of preview.sh.
#
#   Usage:  .\scripts\preview.ps1 [port]     (default 5186)
#
# 5186 is this app's port in the registry (Docs_UNI_SIM/dev-preview.md).
# --strictPort means a port clash fails loudly instead of silently serving
# this app on another app's port.
#
# No .env needed — cloud features are gated behind sign-in.
# First run installs deps if node_modules is missing.

$ErrorActionPreference = 'Stop'
Push-Location (Join-Path $PSScriptRoot '..')
try {
    $port = if ($args.Count -ge 1) { $args[0] } else { '5186' }

    if (-not (Test-Path 'node_modules')) {
        Write-Host "Installing dependencies (first run)..." -ForegroundColor Cyan
        npm install
        if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
    }

    Write-Host "Universal Signatures -> http://localhost:$port" -ForegroundColor Green
    npm run dev -- --port $port --strictPort
} finally {
    Pop-Location
}

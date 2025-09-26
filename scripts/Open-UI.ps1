$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path (Join-Path $ScriptDir "..")
$IndexHtml = Join-Path $ProjectRoot "ui\index.html"

if (-not (Test-Path $IndexHtml)) {
  Write-Error "UI not found: $IndexHtml"
}

Start-Process $IndexHtml



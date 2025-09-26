param(
    [string]$Scenario = "basic",
    [string]$To = "",
    [string]$TrackingBase = "https://training.example.org/learn"
)

$ErrorActionPreference = "Stop"

# Resolve project root relative to this script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path (Join-Path $ScriptDir "..")
Set-Location $ProjectRoot

# Ensure Node is available
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js is not installed or not in PATH. Install Node 18+ and retry."
}

# Build optional args
$toArg = ""
if ($To -and $To.Trim() -ne "") {
  $toArg = " --to=`"$To`""
}

Write-Host "Running preview (scenario: $Scenario)"

node .\phishing-sim.js --authorized=true --scenario=$Scenario --trackingBase=$TrackingBase$toArg | cat



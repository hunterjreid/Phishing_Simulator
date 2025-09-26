param(
    [string]$ShortcutName = "Phishing Simulator Preview",
    [string]$Scenario = "basic"
)

$ErrorActionPreference = "Stop"

# Resolve project root
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path (Join-Path $ScriptDir "..")

# PowerShell path
$Pwsh = (Get-Command powershell.exe).Source

# Target script and arguments
$RunScript = Join-Path $ProjectRoot "scripts\Run-Preview.ps1"
$Arguments = "-ExecutionPolicy Bypass -NoLogo -NoProfile -File `"$RunScript`" -Scenario $Scenario"

# Desktop path
$WshShell = New-Object -ComObject WScript.Shell
$Desktop = [Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $Desktop ("$ShortcutName.lnk")
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $Pwsh
$Shortcut.Arguments   = $Arguments
$Shortcut.WorkingDirectory = $ProjectRoot
$Shortcut.IconLocation = "$env:SystemRoot\\System32\\shell32.dll,73"
$Shortcut.Description = "Open phishing simulator preview (no email sending)"
$Shortcut.Save()

Write-Host "Shortcut created: $ShortcutPath"



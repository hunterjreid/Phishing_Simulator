param(
    [string]$ShortcutName = "Phishing Simulator UI"
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path (Join-Path $ScriptDir "..")
$OpenScript = Join-Path $ProjectRoot "scripts\Open-UI.ps1"

$Pwsh = (Get-Command powershell.exe).Source
$Arguments = "-ExecutionPolicy Bypass -NoLogo -NoProfile -File `"$OpenScript`""

$WshShell = New-Object -ComObject WScript.Shell
$Desktop = [Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $Desktop ("$ShortcutName.lnk")
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $Pwsh
$Shortcut.Arguments   = $Arguments
$Shortcut.WorkingDirectory = $ProjectRoot
$Shortcut.IconLocation = "$env:SystemRoot\\System32\\shell32.dll,167"
$Shortcut.Description = "Open phishing simulator UI (preview only)"
$Shortcut.Save()

Write-Host "Shortcut created: $ShortcutPath"



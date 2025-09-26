<p align="center">
  <img src="https://github.com/hunterjreid/Phishing_Simulator/assets/62681404/9a352b6e-e118-491a-b962-2a6474ec6eac" alt="5eb44c04dea78545adb03301_021-spam" width="300">
</p>

# Phishing_Simulator
Phishing Simulator
Welcome to Phishing Simulator! This tool helps preview phishing simulation content to train your team against potential threats.

## Getting Started
Setup✈️
```
npm install
npm run preview
```



Install Node.js 18+ and dependencies:  
```bash
npm install
```

Preview content (no emails are sent):  
```bash
npm run preview
```

Open the UI (Windows):  
```bash
npm run ui
```

Or via PowerShell scripts:  
```powershell
scripts\Open-UI.ps1
scripts\Create-UI-Shortcut.ps1 -ShortcutName "Phishing Simulator UI"
```

Scenarios:  
```bash
npm run preview:payroll
npm run preview:package
```

Windows PowerShell helper scripts:  
```powershell
# Run preview with optional parameters
scripts\Run-Preview.ps1 -Scenario payroll -To "alice@example.com,bob@example.com" -TrackingBase "https://training.example.org/learn"

# Create a Desktop shortcut to launch preview
scripts\Create-DesktopShortcut.ps1 -ShortcutName "Phishing Simulator Preview" -Scenario basic
```

Command-line flags for direct Node usage:  
```bash
node phishing-sim.js --authorized=true \
  --scenario=basic \
  --to="alex@example.com,sam@example.com" \
  --trackingBase="https://training.example.org/learn"
```

## License
Phishing Simulator is released under the MIT License.

## Responsible Use
This repository is for education and authorized training only. The included simulator is preview-only and does not send emails. Use strictly with explicit permission on systems and recipients you are authorized to test.

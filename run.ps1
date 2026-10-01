# SkillBridge - 1-Click PowerShell Runner
Clear-Host
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "       SKILLBRIDGE - STUDENT INTERNSHIP & CAREER PORTAL" -ForegroundColor White
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check MongoDB
$mongoService = Get-Service -Name MongoDB* -ErrorAction SilentlyContinue
if ($mongoService -and $mongoService.Status -eq "Running") {
    Write-Host "[OK] MongoDB is running." -ForegroundColor Green
} elseif ($mongoService) {
    Write-Host "[i] Starting MongoDB service..." -ForegroundColor Yellow
    Start-Service -Name $mongoService.Name -ErrorAction SilentlyContinue
    Write-Host "[OK] MongoDB service started." -ForegroundColor Green
} else {
    Write-Host "[OK] Assuming local MongoDB on port 27017." -ForegroundColor Green
}

Write-Host ""
Write-Host "[*] Launching SkillBridge Servers..." -ForegroundColor Cyan
Write-Host "[*] Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "[*] Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""

# Auto-open browser in background
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 2
    Start-Process "http://localhost:5173"
} | Out-Null

# Run npm start
npm start

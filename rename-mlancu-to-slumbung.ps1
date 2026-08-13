# Script to rename all "Mlancu" to "Slumbung" in all files
# Run this in PowerShell: .\rename-mlancu-to-slumbung.ps1

Write-Host "🔄 Starting rename: Mlancu → Slumbung" -ForegroundColor Green

# List of files to update
$files = @(
    "index.html",
    "admin-dashboard.html",
    "admin-login.html",
    "check-setup.html"
)

$totalReplacements = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "📝 Processing: $file" -ForegroundColor Cyan
        
        # Read file content
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Count occurrences before replace
        $matches = ([regex]::Matches($content, "Mlancu")).Count
        
        if ($matches -gt 0) {
            # Replace all occurrences
            $newContent = $content -replace "Mlancu", "Slumbung"
            
            # Write back to file
            Set-Content $file -Value $newContent -Encoding UTF8 -NoNewline
            
            Write-Host "   ✅ Replaced $matches occurrences" -ForegroundColor Green
            $totalReplacements += $matches
        } else {
            Write-Host "   ℹ️  No occurrences found" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ⚠️  File not found: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ DONE! Total replacements: $totalReplacements" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Review changes: git diff"
Write-Host "2. Commit: git add -A && git commit -m 'feat: rename Desa Mlancu to Desa Slumbung'"
Write-Host "3. Push: git push"

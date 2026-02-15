
$src = "f:\PieceOfShit\Projects\Portfolio\xabir\src\assets\TechVault_img.png"
$dest = "f:\PieceOfShit\Projects\Portfolio\xabir\public\techvault.png"

Write-Host "Copying from $src to $dest"

if (Test-Path $src) {
    Write-Host "Source exists."
    Copy-Item -Path $src -Destination $dest -Force -Verbose
    if (Test-Path $dest) {
        Write-Host "Copy SUCCESS. Destination exists."
        Get-Item $dest | Select-Object Name, Length, LastWriteTime | Format-Table
    } else {
        Write-Host "Copy FAILED. Destination missing."
    }
} else {
    Write-Host "Source MISSING at $src"
    Get-ChildItem "f:\PieceOfShit\Projects\Portfolio\xabir\src\assets"
}

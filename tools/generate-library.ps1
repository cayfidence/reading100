# tools/generate-library.ps1
# Scans the local ./library folder for PDF files and writes:
#  - library/library.json (for http/https hosting)
#  - library/library.js   (for local file:// preview)

Param(
  [string]$LibraryPath = "library",
  [string]$JsonOutput = "library/library.json",
  [string]$JsOutput = "library/library.js"
)

$ErrorActionPreference = "Stop"
if(!(Test-Path $LibraryPath)){ throw "Path not found: $LibraryPath" }

$files = Get-ChildItem -Path $LibraryPath -File -Filter *.pdf | Sort-Object Name

$items = @()
foreach($f in $files){
  $slug = ($f.BaseName.ToLower() -replace "[^a-z0-9]+","-").Trim('-')
  $items += [pscustomobject]@{ name = $f.Name; title = $f.BaseName; slug = $slug; file = $f.Name }
}

# Write JSON
$json = $items | ConvertTo-Json -Depth 3
$JsonFull = Join-Path -Path (Get-Location) -ChildPath $JsonOutput
$null = New-Item -ItemType File -Force -Path $JsonFull
[System.IO.File]::WriteAllText($JsonFull, $json, [System.Text.Encoding]::UTF8)

# Write JS fallback
$JsFull = Join-Path -Path (Get-Location) -ChildPath $JsOutput
$js = 'window.__LIBRARY__ = ' + ($items | ConvertTo-Json -Depth 3) + ';'
$null = New-Item -ItemType File -Force -Path $JsFull
[System.IO.File]::WriteAllText($JsFull, $js, [System.Text.Encoding]::UTF8)

Write-Host "Wrote $($items.Count) items to $JsonOutput and $JsOutput"

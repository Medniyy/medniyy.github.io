# Deploy ATH Creative Studio static site to medniyy.github.io (ath.camera)
# Run from project root after: npm run build
# Requires: git, and push access to https://github.com/Medniyy/medniyy.github.io

$ErrorActionPreference = "Stop"
$repoRoot = $PSScriptRoot

# Ensure we have the pages remote
git remote add pages https://github.com/Medniyy/medniyy.github.io.git 2>$null

# Create orphan branch with only static site content
git checkout --orphan gh-pages 2>$null
git reset --hard

# Remove everything except .git and out
Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" -and $_.Name -ne "out" } | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

# Ensure .nojekyll exists (GitHub Pages ignores _next/ without it)
if (-not (Test-Path "$repoRoot\out\.nojekyll")) { New-Item -Path "$repoRoot\out\.nojekyll" -ItemType File -Force | Out-Null }
# Copy out/* to root (so GitHub Pages serves index.html at root)
Copy-Item -Path "$repoRoot\out\*" -Destination $repoRoot -Recurse -Force
Copy-Item -Path "$repoRoot\out\.nojekyll" -Destination $repoRoot -Force -ErrorAction SilentlyContinue

# Commit and push to medniyy.github.io main branch
git add -A
git commit -m "Deploy ATH Creative Studio landing page (ath.camera)"
git push pages gh-pages:main --force

# Switch back to master and restore normal state
git checkout master 2>$null
git branch -D gh-pages 2>$null

Write-Host "Done. Your site will be live at https://ath.camera after GitHub Pages finishes building (1-2 min)."

# setup-git.ps1
# Tự động hóa việc khởi tạo Git cục bộ

Write-Host "--- Bat dau khoi tao Git cho du an ASP.NET Flow Web ---" -ForegroundColor Cyan

# Kiem tra Git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Git chua duoc cai dat tren may nay!" -ForegroundColor Red
    exit
}

# Khoi tao Git
if (!(Test-Path .git)) {
    git init
    Write-Host "Da khoi tao Git repository." -ForegroundColor Green
} else {
    Write-Host "Git repository da ton tai." -ForegroundColor Yellow
}

# Tao .gitignore co ban
if (!(Test-Path .gitignore)) {
    ".DS_Store`nnode_modules/`n.vercel/" | Out-File -FilePath .gitignore -Encoding utf8
    Write-Host "Da tao file .gitignore." -ForegroundColor Green
}

# Commit cac file hien tai
git add .
git commit -m "Initial commit: ASP.NET Core Architecture Flow Diagrams"

Write-Host "`n--- Hoan tat! ---" -ForegroundColor Cyan
Write-Host "Bay gio ban hay vao GitHub tao Repository moi va chay cac lenh 'git remote add origin ...' nhu trong huong dan." -ForegroundColor Green

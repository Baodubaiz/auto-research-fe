<#
==============================================================================
🚀 AUTO-RESEARCH-FE: DOCKER DEVELOPMENT WORKSPACE AUTOMATION (WINDOWS PS)
==============================================================================
Hỗ trợ tự động chuẩn bị môi trường, chạy Docker với Hot-Reload, xem live logs,
khởi động lại, và reset container tiện lợi trên Windows PowerShell.
==============================================================================
#>

[CmdletBinding()]
param (
    [Parameter(Position = 0, Mandatory = $false)]
    [ValidateSet("start", "up", "logs", "log", "restart", "reset", "rebuild", "stop", "down", "setup", "menu")]
    [string]$Action = "menu"
)

# Đảm bảo bảng mã UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
Set-Location $ProjectRoot

function Print-Banner {
    Clear-Host
    Write-Host "========================================================================" -ForegroundColor Cyan
    Write-Host "          🚀 AUTO-RESEARCH-FE: DOCKER DEV WORKSPACE MANAGER             " -ForegroundColor Cyan
    Write-Host "========================================================================" -ForegroundColor Cyan
}

function Test-Docker {
    $dockerCmd = Get-Command docker -ErrorAction SilentlyContinue
    if (-not $dockerCmd) {
        Write-Host "❌ Lỗi: Docker chưa được cài đặt trên máy của bạn." -ForegroundColor Red
        Write-Host "Vui lòng cài đặt Docker Desktop for Windows trước khi tiếp tục." -ForegroundColor Yellow
        exit 1
    }

    docker info 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Lỗi: Docker Desktop chưa được bật hoặc Docker daemon chưa khởi chạy." -ForegroundColor Red
        Write-Host "Vui lòng mở ứng dụng Docker Desktop trên Windows và thử lại." -ForegroundColor Yellow
        exit 1
    }
}

function Prepare-Env {
    if (-not (Test-Path ".env.local")) {
        if (Test-Path ".env.example") {
            Write-Host "⚙️  Chưa tìm thấy .env.local, đang tự động tạo từ .env.example..." -ForegroundColor Yellow
            Copy-Item ".env.example" ".env.local"
            Write-Host "✅ Đã tạo tệp .env.local thành công." -ForegroundColor Green
        } else {
            Write-Host "⚙️  Đang tạo tệp .env.local mặc định..." -ForegroundColor Yellow
            @"
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
PORT=3000
"@ | Out-File -FilePath ".env.local" -Encoding utf8
            Write-Host "✅ Đã tạo tệp .env.local thành công." -ForegroundColor Green
        }
    } else {
        Write-Host "✅ Đã có tệp .env.local." -ForegroundColor Green
    }
}

function Start-Project {
    Prepare-Env
    Write-Host "`n🚀 Đang xây dựng và khởi chạy container auto-research-fe..." -ForegroundColor Blue
    docker compose up -d --build

    Write-Host "`n========================================================================" -ForegroundColor Green
    Write-Host "🎉 DỰ ÁN ĐÃ KHỞI CHẠY THÀNH CÔNG!" -ForegroundColor Green
    Write-Host "🌐 Đường dẫn ứng dụng: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔄 Chế độ Hot-Reload: Đang bật (File code thay đổi sẽ tự cập nhật)" -ForegroundColor Green
    Write-Host "========================================================================`n" -ForegroundColor Green

    Write-Host "Đang mở Live Logs (Bấm Ctrl+C bất kỳ lúc nào để quay lại)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 1
    View-Logs
}

function View-Logs {
    $runningServices = docker compose ps --services --filter "status=running"
    if ($runningServices -notcontains "web") {
        Write-Host "⚠️  Container hiện chưa chạy. Bạn có muốn khởi động ngay không? (y/n): " -NoNewline -ForegroundColor Yellow
        $resp = Read-Host
        if ($resp -match "^[Yy]$") {
            Start-Project
            return
        } else {
            return
        }
    }

    Write-Host "📜 Đang theo dõi Live Logs của auto-research-fe..." -ForegroundColor Cyan
    Write-Host "(Bấm Ctrl+C để thoát khỏi log, container vẫn sẽ tiếp tục chạy ngầm)`n" -ForegroundColor Yellow

    try {
        docker compose logs -f --tail=100 web
    } catch {
        Write-Host "`nĐã thoát chế độ xem log. Container vẫn đang chạy." -ForegroundColor Green
    }
}

function Restart-Project {
    Write-Host "`n🔄 Đang khởi động lại container..." -ForegroundColor Blue
    docker compose restart web
    Write-Host "✅ Đã khởi động lại thành công!`n" -ForegroundColor Green
    View-Logs
}

function Reset-Project {
    Write-Host "`n🧹 Bạn đang chọn RESET TOÀN BỘ container và rebuild lại từ đầu." -ForegroundColor Red
    Write-Host "Bạn có chắc chắn muốn tiếp tục? (y/N): " -NoNewline -ForegroundColor Yellow
    $confirm = Read-Host
    if ($confirm -notmatch "^[Yy]$") {
        Write-Host "Đã hủy thao tác reset." -ForegroundColor Yellow
        return
    }

    Write-Host "⏳ Đang dừng và dọn dẹp containers, volumes cũ..." -ForegroundColor Yellow
    docker compose down -v --remove-orphans

    Write-Host "🔨 Đang rebuild Docker image hoàn toàn mới (no-cache)..." -ForegroundColor Blue
    docker compose build --no-cache

    Write-Host "🚀 Đang khởi chạy lại dự án..." -ForegroundColor Green
    docker compose up -d

    Write-Host "`n✅ Đã Reset & Khởi chạy mới thành công tại http://localhost:3000!`n" -ForegroundColor Green
    View-Logs
}

function Stop-Project {
    Write-Host "`n⏹️  Đang dừng các container..." -ForegroundColor Yellow
    docker compose down
    Write-Host "✅ Đã tắt toàn bộ container Docker của dự án." -ForegroundColor Green
}

function Setup-Local {
    Prepare-Env
    Write-Host "`n🛠️  Đang chuẩn bị môi trường và kiểm tra Node.js local..." -ForegroundColor Blue
    $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeCmd) {
        $nodeVer = node -v
        Write-Host "Node version: $nodeVer" -ForegroundColor Green
        $npmCmd = Get-Command npm -ErrorAction SilentlyContinue
        if ($npmCmd) {
            Write-Host "Đang chạy npm install để đồng bộ thư viện cho IDE..." -ForegroundColor Cyan
            npm install
            Write-Host "✅ Cài đặt thư viện local thành công!" -ForegroundColor Green
        }
    } else {
        Write-Host "Máy bạn chưa cài Node.js local. Không sao! Bạn vẫn có thể chạy toàn bộ dự án qua Docker." -ForegroundColor Yellow
    }
}

function Show-Menu {
    while ($true) {
        Print-Banner
        Write-Host "Trạng thái Container:" -ForegroundColor White
        docker compose ps
        Write-Host "`nVui lòng chọn thao tác:" -ForegroundColor White
        Write-Host "  [1] 🚀 Khởi chạy dự án (Start/Build & Live Logs)" -ForegroundColor Green
        Write-Host "  [2] 📜 Bật xem Live Logs để code tiếp" -ForegroundColor Cyan
        Write-Host "  [3] 🔄 Khởi động lại nhanh container (Restart)" -ForegroundColor Yellow
        Write-Host "  [4] 🧹 Reset toàn bộ & Rebuild (Clean Rebuild no-cache)" -ForegroundColor Red
        Write-Host "  [5] ⏹️  Dừng chạy container (Stop Docker)" -ForegroundColor Yellow
        Write-Host "  [6] 🛠️  Chuẩn bị môi trường & cài đặt dependencies local" -ForegroundColor Blue
        Write-Host "  [0] 🚪 Thoát" -ForegroundColor White
        Write-Host ""
        Write-Host "👉 Nhập lựa chọn của bạn [1-6, 0]: " -NoNewline -ForegroundColor Yellow
        $opt = Read-Host

        switch ($opt) {
            "1" { Start-Project }
            "2" { View-Logs }
            "3" { Restart-Project }
            "4" { Reset-Project }
            "5" { Stop-Project }
            "6" { Setup-Local }
            "0" {
                Write-Host "`nTạm biệt! Chúc bạn code vui vẻ! ✨`n" -ForegroundColor Green
                exit 0
            }
            default {
                Write-Host "Lựa chọn không hợp lệ, vui lòng thử lại." -ForegroundColor Red
                Start-Sleep -Seconds 1
            }
        }

        Write-Host ""
        Write-Host "Bấm [Enter] để quay lại menu chính..." -ForegroundColor DarkGray
        Read-Host | Out-Null
    }
}

# Main Dispatcher
Test-Docker

switch ($Action.ToLower()) {
    { $_ -in "start", "up" }     { Start-Project }
    { $_ -in "logs", "log" }     { View-Logs }
    "restart"                   { Restart-Project }
    { $_ -in "reset", "rebuild" } { Reset-Project }
    { $_ -in "stop", "down" }    { Stop-Project }
    "setup"                     { Setup-Local }
    default                     { Show-Menu }
}

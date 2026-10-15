#!/usr/bin/env bash

# ==============================================================================
# 🚀 AUTO-RESEARCH-FE: DOCKER DEVELOPMENT WORKSPACE AUTOMATION
# ==============================================================================
# Hỗ trợ tự động chuẩn bị môi trường, chạy Docker với Hot-Reload, xem live logs,
# khởi động lại, và reset container tiện lợi cho lập trình viên.
# ==============================================================================

set -e

# Màu sắc hiển thị
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Xác định thư mục gốc của project
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${PROJECT_ROOT}"

# Hàm in banner
print_banner() {
  clear 2>/dev/null || true
  echo -e "${CYAN}${BOLD}"
  echo "========================================================================"
  echo "          🚀 AUTO-RESEARCH-FE: DOCKER DEV WORKSPACE MANAGER             "
  echo "========================================================================"
  echo -e "${NC}"
}

# 1. Kiểm tra Docker & Docker Compose
check_docker() {
  if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Lỗi: Docker chưa được cài đặt trên máy của bạn.${NC}"
    echo -e "${YELLOW}Vui lòng cài đặt Docker Desktop hoặc Docker Engine trước khi tiếp tục.${NC}"
    exit 1
  fi

  if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Lỗi: Docker Daemon chưa khởi chạy hoặc bạn chưa có quyền chạy docker.${NC}"
    echo -e "${YELLOW}Hãy bật Docker Desktop hoặc chạy 'sudo systemctl start docker'.${NC}"
    exit 1
  fi
}

# 2. Tự động chuẩn bị file môi trường
prepare_env() {
  if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
      echo -e "${YELLOW}⚙️  Chưa tìm thấy .env.local, đang tự động tạo từ .env.example...${NC}"
      cp .env.example .env.local
      echo -e "${GREEN}✅ Đã tạo tệp .env.local thành công.${NC}"
    else
      echo -e "${YELLOW}⚙️  Đang tạo tệp .env.local mặc định...${NC}"
      echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1" > .env.local
      echo "PORT=3000" >> .env.local
      echo -e "${GREEN}✅ Đã tạo tệp .env.local thành công.${NC}"
    fi
  else
    echo -e "${GREEN}✅ Đã có tệp .env.local.${NC}"
  fi
}

# 3. Khởi chạy dự án (Start with Hot-Reload & Logs)
start_project() {
  prepare_env
  echo -e "\n${BLUE}🚀 Đang xây dựng và khởi chạy container auto-research-fe...${NC}"
  docker compose up -d --build

  echo -e "\n${GREEN}========================================================================"
  echo -e "🎉 DỰ ÁN ĐÃ KHỞI CHẠY THÀNH CÔNG!"
  echo -e "🌐 Đường dẫn ứng dụng: ${BOLD}${CYAN}http://localhost:3000${NC}"
  echo -e "🔄 Chế độ Hot-Reload: ${GREEN}Đang bật (File code thay đổi sẽ tự cập nhật)${NC}"
  echo -e "========================================================================${NC}\n"

  echo -e "${YELLOW}Đang mở Live Logs (Bấm ${BOLD}Ctrl+C${NC}${YELLOW} bất kỳ lúc nào để quay lại menu)...${NC}\n"
  sleep 1
  view_logs
}

# 4. Xem Live Logs
view_logs() {
  if ! docker compose ps --services --filter "status=running" | grep -q "web"; then
    echo -e "${YELLOW}⚠️  Container hiện chưa chạy. Bạn có muốn khởi động ngay không? (y/n)${NC}"
    read -r -p "Lựa chọn: " choice
    if [[ "$choice" =~ ^[Yy]$ ]]; then
      start_project
      return
    else
      return
    fi
  fi

  echo -e "${CYAN}📜 Đang theo dõi Live Logs của auto-research-fe...${NC}"
  echo -e "${YELLOW}(Bấm Ctrl+C để thoát khỏi log, container vẫn sẽ tiếp tục chạy ngầm)${NC}\n"
  
  trap 'echo -e "\n${GREEN}Đã thoát chế độ xem log. Container vẫn đang chạy.${NC}"; return 0' INT
  docker compose logs -f --tail=100 web || true
  trap - INT
}

# 5. Khởi động lại container (Quick Restart)
restart_project() {
  echo -e "\n${BLUE}🔄 Đang khởi động lại container...${NC}"
  docker compose restart web
  echo -e "${GREEN}✅ Đã khởi động lại thành công!${NC}\n"
  view_logs
}

# 6. Reset toàn bộ & Rebuild (Clean Rebuild)
reset_project() {
  echo -e "\n${RED}🧹 Bạn đang chọn RESET TOÀN BỘ container và rebuild lại từ đầu.${NC}"
  read -r -p "Bạn có chắc chắn muốn tiếp tục? (y/N): " confirm
  if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Đã hủy thao tác reset.${NC}"
    return
  fi

  echo -e "${YELLOW}⏳ Đang dừng và dọn dẹp containers, volumes cũ...${NC}"
  docker compose down -v --remove-orphans

  echo -e "${BLUE}🔨 Đang rebuild Docker image hoàn toàn mới (no-cache)...${NC}"
  docker compose build --no-cache

  echo -e "${GREEN}🚀 Đang khởi chạy lại dự án...${NC}"
  docker compose up -d

  echo -e "\n${GREEN}✅ Đã Reset & Khởi chạy mới thành công tại http://localhost:3000!${NC}\n"
  view_logs
}

# 7. Dừng container (Stop)
stop_project() {
  echo -e "\n${YELLOW}⏹️  Đang dừng các container...${NC}"
  docker compose down
  echo -e "${GREEN}✅ Đã tắt toàn bộ container Docker của dự án.${NC}"
}

# 8. Cài đặt dependencies trên máy local (hỗ trợ IDE lint / intellisense)
setup_local() {
  prepare_env
  echo -e "\n${BLUE}🛠️  Đang chuẩn bị môi trường và kiểm tra Node.js local...${NC}"
  if command -v node &> /dev/null; then
    echo -e "${GREEN}Node version: $(node -v)${NC}"
    if command -v npm &> /dev/null; then
      echo -e "${CYAN}Đang chạy npm install để đồng bộ thư viện cho IDE...${NC}"
      npm install
      echo -e "${GREEN}✅ Cài đặt thư viện local thành công!${NC}"
    fi
  else
    echo -e "${YELLOW}Máy bạn chưa cài Node.js local. Không sao! Bạn vẫn có thể chạy toàn bộ dự án qua Docker.${NC}"
  fi
}

# Menu tương tác
show_menu() {
  while true; do
    print_banner
    echo -e "Trạng thái Container: $(docker compose ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "Chưa chạy")"
    echo -e "\n${BOLD}Vui lòng chọn thao tác:${NC}"
    echo -e "  ${GREEN}[1]${NC} 🚀 Khởi chạy dự án (Start/Build & Live Logs)"
    echo -e "  ${CYAN}[2]${NC} 📜 Bật xem Live Logs để code tiếp"
    echo -e "  ${YELLOW}[3]${NC} 🔄 Khởi động lại nhanh container (Restart)"
    echo -e "  ${RED}[4]${NC} 🧹 Reset toàn bộ & Rebuild (Clean Rebuild no-cache)"
    echo -e "  ${YELLOW}[5]${NC} ⏹️  Dừng chạy container (Stop Docker)"
    echo -e "  ${BLUE}[6]${NC} 🛠️  Chuẩn bị môi trường & cài đặt dependencies local"
    echo -e "  ${BOLD}[0]${NC} 🚪 Thoát"
    echo ""
    read -r -p "👉 Nhập lựa chọn của bạn [1-6, 0]: " opt

    case $opt in
      1) start_project ;;
      2) view_logs ;;
      3) restart_project ;;
      4) reset_project ;;
      5) stop_project ;;
      6) setup_local ;;
      0) echo -e "\n${GREEN}Tạm biệt! Chúc bạn code vui vẻ! ✨${NC}\n"; exit 0 ;;
      *) echo -e "${RED}Lựa chọn không hợp lệ, vui lòng thử lại.${NC}"; sleep 1 ;;
    esac

    echo ""
    read -r -p "Bấm [Enter] để quay lại menu chính..."
  done
}

# Xử lý tham số dòng lệnh nếu truyền trực tiếp
check_docker

case "$1" in
  start|up)
    start_project
    ;;
  logs|log)
    view_logs
    ;;
  restart)
    restart_project
    ;;
  reset|rebuild)
    reset_project
    ;;
  stop|down)
    stop_project
    ;;
  setup)
    setup_local
    ;;
  *)
    show_menu
    ;;
esac

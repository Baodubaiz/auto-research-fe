# 🎓 Auto Research Frontend (`auto-research-fe`)

> **Hệ thống Không Gian Nghiên Cứu Học Thuật & Soạn Thảo Luận Văn Tự Động Bằng AI (AI Academic Workspace)**  
> Được xây dựng trên nền tảng **Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Shadcn UI và TanStack React Query v5**, kết nối trực tiếp với Backend Gateway NestJS (`auto-research-be`). Dự án được chuẩn hóa để phát triển hoàn toàn trên môi trường **Docker**.

---

## 📌 Mục Lục
- [1. Giới Thiệu Dự Án](#1-giới-thiệu-dự-án)
- [2. Công Nghệ Sử Dụng (Tech Stack)](#2-công-nghệ-sử-dụng-tech-stack)
- [3. Cấu Trúc Thư Mục Dự Án (Project Structure)](#3-cấu-trúc-thư-mục-dự-án-project-structure)
- [4. Cấu Hình Biến Môi Trường (.env)](#4-cấu-hình-biến-môi-trường-env)
- [5. Hướng Dẫn Khởi Chạy Dự Án Bằng Docker](#5-hướng-dẫn-khởi-chạy-dự-án-bằng-docker)
- [6. Quy Chuẩn Lập Trình (Coding Standards)](#6-quy-chuẩn-lập-trình-coding-standards)

---

## 1. Giới Thiệu Dự Án

**Auto Research Frontend** là giải pháp phần mềm thông minh hỗ trợ toàn diện quy trình nghiên cứu khoa học và viết luận văn học thuật:
- 💡 **Khơi gợi ý tưởng & Đề xuất đề tài:** Tự động sinh lĩnh vực, hướng nghiên cứu hẹp, bộ từ khóa học thuật và danh sách đề tài tiềm năng.
- 📚 **Tìm kiếm & Quản lý bài báo khoa học:** AI truy vấn kho dữ liệu bài báo quốc tế (Semantic Scholar, ArXiv, Scopus), lọc Open Access và liên kết vào danh mục tham khảo.
- 🌳 **Thiết lập Đề cương & RAG PDF:** Sinh cấu trúc cây đề cương đa cấp (Chapters, Sections) kèm số từ mục tiêu, trích xuất text tài liệu PDF cá nhân để vector hóa vào Qdrant.
- ✍️ **Soạn thảo Luận văn với AI Streaming:** Trình soạn thảo văn bản học thuật chia đôi màn hình, nhận luồng nội dung theo từng mục thời gian thực qua Server-Sent Events (SSE).
- 📊 **Sinh Slide Thuyết trình PowerPoint Tự Động:** Tự động tạo dàn ý và đóng gói tệp slide trình chiếu (`.pptx`) tải trực tiếp từ máy chủ lưu trữ MinIO S3.
- 📈 **Phân tích Dữ liệu Thống kê:** Hỗ trợ tải file bảng tính CSV/Excel, phân tích mô tả, kiểm định độ tin cậy Cronbach's Alpha, ma trận tương quan và đề xuất phương pháp nghiên cứu.
- ✨ **Tối ưu hóa Văn bản (AI in Doc):** Thanh công cụ bôi đen đoạn văn để yêu cầu AI viết lại, học thuật hóa, mở rộng, rút gọn và bảng rà soát gợi ý sửa lỗi toàn bài (Diff View).
- 💬 **Trợ lý AI Chatbot Học thuật:** Chatbot đa chế độ: Outer Chatbot (tư vấn chung), Inner Chatbot (trả lời trích dẫn từ tài liệu RAG), và Writer Agent (tương tác đa lượt).

---

## 2. Công Nghệ Sử Dụng (Tech Stack)

| Hạng mục | Công nghệ / Thư viện | Vai trò |
|---|---|---|
| **Core Framework** | **Next.js 16.3.5 (App Router)** | Framework ứng dụng web thế hệ mới với Turbopack |
| **UI Library** | **React 19.2.8** | Thư viện giao diện chính, React Server & Client Components |
| **Language** | **TypeScript 5 (Strict Mode)** | Đảm bảo tính an toàn kiểu dữ liệu toàn diện |
| **Styling** | **Tailwind CSS v4** | Hệ thống CSS utility-first mới nhất (`@import "tailwindcss";`) |
| **UI Components** | **Shadcn UI (Radix UI)** | Bộ primitives UI tiếp cận cao: Button, Card, Input, Dialog, Select,... |
| **State & Caching** | **TanStack React Query v5** | Quản lý Server State, Cache Invalidation, Polling tiến độ |
| **Auth State** | **React Context (`AuthProvider`)** | Quản lý phiên đăng nhập và token lưu trong `localStorage` |
| **HTTP Client** | **Axios (`apiClient`)** | Xử lý request, tự động đính kèm JWT Bearer token và bắt mã 401 |
| **Streaming** | **Native Fetch + ReadableStream** | Nhận luồng dữ liệu thời gian thực Server-Sent Events (SSE) |
| **Icons & Toast** | **Lucide React + Sonner** | Bộ icon học thuật hiện đại và thông báo Toast popup |
| **Environment** | **Docker + Docker Compose** | Chạy và phát triển ứng dụng đồng nhất với Hot-Reload |

---

## 3. Cấu Trúc Thư Mục Dự Án (Project Structure)

Dự án áp dụng mô hình **Feature-Based Architecture (Domain-Driven)**:

```text
auto-research-fe/
├── .env.example               # Mẫu cấu hình biến môi trường
├── .env.local                 # Biến môi trường local (tự động tạo, gitignored)
├── .dockerignore              # Danh sách loại trừ khi build Docker image
├── Dockerfile.dev             # Cấu hình container phát triển có Hot-Reload
├── docker-compose.yml         # Thiết lập chạy dịch vụ web Docker
├── Jenkinsfile                # Pipeline CI/CD tự động trên Jenkins
├── components.json            # Cấu hình Shadcn UI
├── docs/                      # Tài liệu kiến trúc và hướng dẫn CI/CD
├── scripts/                   # Script tự động hóa khởi chạy Docker
│   ├── dev.sh                 # Dành cho Linux / macOS
│   └── dev.ps1                # Dành cho Windows PowerShell
├── public/                    # Tài nguyên tĩnh (Favicon, Logo, Images)
└── src/
    ├── app/                   # Next.js 16 App Router
    │   ├── (auth)/            # Nhóm trang xác thực (Login, Register)
    │   │   ├── login/page.tsx
    │   │   ├── register/page.tsx
    │   │   └── layout.tsx
    │   ├── (dashboard)/       # Nhóm không gian làm việc chính
    │   │   ├── layout.tsx     # Bọc Sidebar, Header và Auth Guard
    │   │   ├── page.tsx       # Màn hình Dashboard Overview
    │   │   ├── documents/     # Quản lý danh sách đề tài
    │   │   │   ├── page.tsx
    │   │   │   └── [documentId]/
    │   │   │       ├── setup/ # Wizard 4 bước thiết lập đề tài
    │   │   │       ├── write/ # Workspace soạn thảo luận văn & streaming
    │   │   │       └── enhancement/ # Tối ưu hóa văn bản AI
    │   │   ├── chatbot/       # Trợ lý AI Chatbot học thuật
    │   │   ├── analytics/     # Biểu đồ thống kê tiêu thụ token AI
    │   │   └── admin/         # Cổng quản trị tài liệu mẫu & tạp chí
    │   ├── globals.css        # Tailwind CSS v4 tokens và theme variables
    │   └── layout.tsx         # Root Layout (bọc QueryProvider & AuthProvider)
    ├── components/            # Components dùng chung toàn ứng dụng
    │   ├── ui/                # Base primitives Shadcn (Button, Card, Input,...)
    │   ├── layout/            # Sidebar.tsx, Header.tsx, Breadcrumb.tsx
    │   └── common/            # LoadingState.tsx, StatusBadge.tsx, AdminGuard.tsx
    ├── features/              # Mô-đun tính năng theo nghiệp vụ (Feature Modules)
    │   ├── auth/              # components, hooks, services, types xác thực
    │   ├── document-setup/    # Topic, Domains, Keywords, Proposals, Outline, RAG Docs
    │   ├── write-report/      # Markdown Editor, Slides Generator, Data Analysis
    │   ├── chatbot/           # Chat Sessions, Message List, Writer Agent
    │   ├── enhancement/       # Floating Toolbar, Diff Comparison, Suggestions
    │   ├── jobs/              # Quản lý vòng đời tác vụ nền & hook useJob
    │   └── users/             # Quản lý hồ sơ cá nhân và đổi mật khẩu
    ├── hooks/                 # Custom hooks toàn cục (useSSEStream.ts)
    ├── lib/                   # Tiện ích cốt lõi (api-client, constants, utils, error-codes)
    ├── providers/             # React Context Providers (AuthProvider, QueryProvider)
    └── types/                 # Kiểu dữ liệu toàn cục (api.type.ts)
```

---

## 4. Cấu Hình Biến Môi Trường (.env)

Tệp `.env.local` sẽ được script khởi chạy **tự động tạo ra** từ `.env.example` nếu chưa tồn tại:

```env
# URL kết nối tới Backend Gateway NestJS (auto-research-be)
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# Cổng khởi chạy Frontend
PORT=3000
```

---

## 5. Hướng Dẫn Khởi Chạy Dự Án Bằng Docker

Dự án phát triển hoàn toàn thông qua Docker Container với tính năng **Hot-Reload tự động** (mọi chỉnh sửa code trên máy sẽ cập nhật tức thời vào container). 

Bạn chỉ cần thực thi **duy nhất một lệnh** tương ứng với hệ điều hành:

### 🐧 Trên Linux / macOS:
```bash
./scripts/dev.sh
```

### 🪟 Trên Windows (PowerShell):
```powershell
.\scripts\dev.ps1
```

---

### ✨ Tính Năng Của Script Quản Lý:
Khi chạy lệnh trên, script sẽ:
1. Tự động kiểm tra Docker và tự động khởi tạo tệp cấu hình `.env.local`.
2. Hiển thị menu điều khiển tương tác trực quan:
   - **[1] 🚀 Khởi chạy dự án:** Tự động build và chạy container, mở ngay Live Logs theo dõi hot-reload.
   - **[2] 📜 Bật xem Live Logs:** Mở xem luồng log của ứng dụng để tiếp tục code (bấm `Ctrl+C` để thoát log mà không dừng container).
   - **[3] 🔄 Khởi động lại nhanh container (Restart):** Khởi động lại container trong vài giây.
   - **[4] 🧹 Reset toàn bộ & Rebuild:** Dọn dẹp cache/volume cũ và rebuild image từ đầu khi có cập nhật mới trong `package.json`.
   - **[5] ⏹️ Dừng chạy container (Stop):** Tắt toàn bộ container Docker của dự án khi không dùng.

Sau khi khởi chạy, truy cập ứng dụng tại: **[http://localhost:3000](http://localhost:3000)**.

---

## 6. Quy Chuẩn Lập Trình (Coding Standards)

1. **Phân Định Client / Server Components:**
   - Mọi tệp có sử dụng React Hooks (`useState`, `useEffect`, `useContext`), React Query, event handlers (`onClick`, `onChange`), hoặc `localStorage` đều **phải khai báo `'use client';` ở dòng đầu tiên**.
2. **Nguyên Tắc Phân Tầng Feature-Based:**
   - `components/`: Chỉ đảm nhận việc hiển thị UI và binding dữ liệu.
   - `hooks/`: Chứa toàn bộ state logic và bọc React Query (`useQuery`, `useMutation`).
   - `services/`: Đóng gói các hàm gọi API thông qua `apiClient`. Tuyệt đối không gọi axios trực tiếp trong component.
   - `types/`: Lưu trữ interfaces và DTOs tương ứng.
3. **Quản Lý Trạng Thái:**
   - Sử dụng **TanStack React Query v5** cho Server State (caching, polling, auto-refetch).
   - Sau các thao tác thêm/sửa/xóa (Mutation), luôn gọi `queryClient.invalidateQueries({ queryKey: [...] })` để UI tự động cập nhật dữ liệu mới.
   - Quản lý phiên làm việc qua `AuthProvider` (React Context) lưu `localStorage`. Không sử dụng Redux hoặc Zustand.
4. **Giới Hạn Độ Dài Tệp (File Length Rule):**
   - Độ dài tối ưu: **100 – 150 dòng code**.
   - Cảnh báo: **200 dòng**.
   - **Tuyệt đối không để tệp vượt quá 300 dòng code**. Phải chủ động tách sub-components và custom hooks.
5. **Xử Lý Lỗi Thân Thiện:**
   - Mọi thông báo hiển thị cho người dùng sử dụng `sonner` (`toast.success()`, `toast.error()`).
   - Mọi mã lỗi từ Backend Gateway (401, 403, 600 - 673) đều được dịch sang thông điệp tiếng Việt dễ hiểu qua `src/lib/error-codes.ts`.

---


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 🤖 AGENTS & AI CODING GUIDELINES: AUTO-RESEARCH-FE

> Tài liệu này định nghĩa các nguyên tắc kiến trúc, tiêu chuẩn code và quy tắc bắt buộc mà mọi AI Assistant hoặc Developer **PHẢI** tuân thủ khi làm việc trên codebase Frontend **`auto-research-fe`**.

---

## 🧩 0. TASK DECOMPOSITION RULE (MANDATORY – ÁP DỤNG CHO MỌI TASK TRUNG BÌNH ĐẾN LỚN)

> **Mục tiêu**: Tránh "ảo giác" (hallucination) khi xử lý task quá lớn trong một lượt. AI phải chủ động chia nhỏ, lập kế hoạch thành file, rồi thực thi từng phần độc lập.

### Khi nào áp dụng?
Áp dụng bắt buộc khi task có **bất kỳ** dấu hiệu sau:
- Yêu cầu tạo hoặc chỉnh sửa **≥ 3 file** khác nhau.
- Task liên quan đến **nhiều layer** (UI components + hooks + services + types + router, v.v.).
- Mô tả yêu cầu dài hơn **10 câu** hoặc có nhiều điều kiện logic phức tạp.
- Ước tính thời gian thực thi **> 15 phút**.
- Task có từ khóa: "refactor toàn bộ", "migrate", "thêm tính năng X hoàn chỉnh", v.v.

### Quy trình bắt buộc
1. **Bước 1 – Phân tích & Lập Kế hoạch**:
   - Sử dụng thư mục `fe_tasks/` (hoặc `tasks/`) ở root project.
   - Tạo/cập nhật `fe_tasks/FE_TASK_PLAN.md` để tổng quan toàn bộ tiến trình.
   - Tạo các file con `task_fe_XX_<tên>.md` mô tả chi tiết: *Mục tiêu, Phạm vi (Scope), Các bước thực hiện, Tiêu chí hoàn thành (Done Criteria), Rủi ro*.
2. **Bước 2 – Thực thi tuần tự (Từng task một)**:
   - **Đọc từng file task một** trước khi thực thi, không đọc dồn dập.
   - Sau khi hoàn thành: cập nhật trạng thái trong `FE_TASK_PLAN.md` (✅ Done / 🟡 In Progress / ⏳ Pending / ❌ Blocked).
   - Nếu phát sinh vấn đề ngoài dự kiến → dừng lại, báo cáo người dùng trước khi tiếp tục.
   - **Không nhảy cóc task** — luôn thực hiện đúng thứ tự phụ thuộc (Dependencies).

---

## 🗣️ 1. COMMUNICATION & LANGUAGE RULE (MANDATORY)

- **Luôn trả lời và giải thích bằng tiếng Việt** khi trao đổi và báo cáo với người dùng.
- Code identifiers, TypeScript types, comment code nội bộ và Git commit messages nên viết bằng tiếng Anh chuẩn.
- Các thông báo hiển thị cho người dùng cuối (Toast message, Dialog, Placeholder) trên giao diện phải ưu tiên tiếng Việt học thuật, thân thiện.

---

## 📌 2. FILE LENGTH & MODULARITY RULES (MANDATORY)

- **Ngưỡng tối ưu**: Khoảng **100 – 150 dòng code** mỗi file.
- **Giới hạn cảnh báo**: Không nên vượt quá **200 dòng code**.
- **Giới hạn tuyệt đối**: **TUYỆT ĐỐI KHÔNG ĐỂ FILE VƯỢT QUÁ 300 DÒNG CODE**.
- **Hành động bắt buộc**: Khi một component hoặc file vượt quá 200 dòng, phải chủ động refactor và tách nhỏ:
  - Tách UI thành các sub-components (ví dụ: `ProposalCard.tsx`, `ProposalList.tsx`).
  - Đưa business logic và state queries/mutations ra custom hooks (`useProposals.ts`, `useJob.ts`).
  - Đưa API calls ra `services/*.service.ts`.
  - Đưa TypeScript types ra `types/*.type.ts`.

---

## 🏗️ 3. KIẾN TRÚC PROJECT (NEXT.JS 16 APP ROUTER + FEATURE-BASED)

### 3.1 Tech Stack Chuẩn
- **Core Engine:** **Next.js 16.3.5 (App Router)** + **React 19.2.8** + **TypeScript 5 (Strict Mode)**.
- **Styling:** **Tailwind CSS v4** (`@tailwindcss/postcss: ^4`, `@import "tailwindcss";` trong `globals.css`).
- **UI Components:** **Shadcn UI (Radix UI)** trong `src/components/ui/` (`button`, `card`, `input`, `badge`, `label`, `select`, `switch`, `textarea`, `checkbox`).
- **Icons & Toast:** **Lucide React** (`lucide-react`) + **Sonner** (`sonner` cho `toast.success`, `toast.error`).
- **Server State & Data Fetching:** **TanStack React Query v5** (`@tanstack/react-query`).
- **Auth State:** **React Context** (`AuthProvider.tsx`, `useAuth()`) lưu `localStorage` qua `LOCAL_STORAGE_KEYS`. *(Tuyệt đối không dùng Redux hay Zustand)*.
- **HTTP Client:** Axios instance tập trung tại `src/lib/api-client.ts`.
- **Streaming:** SSE streaming qua native `fetch` + `ReadableStream` với Bearer Token (`src/hooks/useSSEStream.ts`).

### 3.2 Cấu trúc Thư mục Thực tế
```text
auto-research-fe/
├── AGENTS.md                  # Quy tắc AI & chuẩn mực codebase
├── fe_tasks/                  # 📋 Quản lý task kế hoạch triển khai
│   ├── FE_TASK_PLAN.md        # Kế hoạch tổng quan & trạng thái
│   └── task_fe_*.md           # Chi tiết từng sub-task
├── docs/                      # 📚 Tài liệu kiến trúc & CI/CD
├── public/                    # Static assets
└── src/
    ├── app/                   # Next.js 16 App Router
    │   ├── (auth)/            # Nhóm route xác thực (login, register)
    │   ├── (dashboard)/       # Nhóm route ứng dụng chính
    │   │   ├── page.tsx       # Dashboard Overview tổng quan
    │   │   ├── documents/     # Quản lý đề tài & Setup/Write/Enhance
    │   │   ├── chatbot/       # Trợ lý AI Chatbot học thuật
    │   │   ├── analytics/     # Thống kê lượng token tiêu thụ
    │   │   └── admin/         # Cổng quản trị hệ thống
    │   ├── globals.css        # Tailwind CSS v4 & theme variables
    │   └── layout.tsx         # Root Layout (QueryProvider + AuthProvider)
    ├── components/
    │   ├── ui/                # Base primitives (Shadcn UI / Radix)
    │   ├── layout/            # Sidebar, Header, Breadcrumb
    │   └── common/            # LoadingState, StatusBadge, Guards
    ├── features/              # Feature-Driven Modules (Screaming Architecture)
    │   ├── auth/              # Xác thực người dùng
    │   ├── document-setup/    # Wizard thiết lập đề tài (Topic, Outline, Refs)
    │   ├── write-report/      # Soạn thảo báo cáo, slide, data analysis
    │   ├── chatbot/           # Chatbot Outer, Inner RAG, Writer Agent
    │   ├── enhancement/       # Tối ưu hóa văn bản (AI in Doc, Diff)
    │   ├── jobs/              # Vòng đời background jobs & polling
    │   └── users/             # Quản lý profile cá nhân & mật khẩu
    ├── hooks/                 # Global utility hooks (useSSEStream, etc.)
    ├── lib/                   # apiClient, constants, utils, error-codes
    ├── providers/             # AuthProvider, QueryProvider
    └── types/                 # Global types & API response schemas
```

---

## 🎯 4. TIÊU CHUẨN CODE & THIẾT KẾ (CLEAN CODE)

1. **Phân Định Rõ Ràng Client / Server Components:**
   - Trong Next.js 16 App Router, mặc định các file là Server Component.
   - **Bắt buộc khai báo `'use client';`** ở dòng đầu tiên của file khi sử dụng React hooks (`useState`, `useEffect`, `useContext`), React Query (`useQuery`, `useMutation`), event handlers (`onClick`, `onChange`), hoặc truy cập browser APIs (`localStorage`, `window`).
2. **Nguyên tắc Phân tầng Feature-Based:**
   - `components/`: Chỉ đảm nhiệm việc hiển thị UI và nhận props / trigger events.
   - `hooks/`: Chứa toàn bộ state logic và bọc các hàm React Query (`useQuery`, `useMutation`).
   - `services/`: Đóng gói các hàm gọi API thông qua `apiClient`. Không gọi `axios` trực tiếp trong component.
   - `types/`: Lưu trữ interfaces DTO request/response rõ ràng.
3. **Quản lý Secrets & Hằng số:**
   - **Không bao giờ hardcode URL hoặc secrets** trong source code.
   - Mọi URL endpoint phải khai báo trong `src/lib/constants.ts` (`ROUTES`, `API_ENDPOINTS`).
   - Biến môi trường trình duyệt phải có tiền tố `NEXT_PUBLIC_` (ví dụ: `NEXT_PUBLIC_API_URL`).
4. **Xử lý Lỗi & Thông báo:**
   - Sử dụng `sonner` (`toast.success()`, `toast.error()`) để thông báo cho người dùng.
   - Mọi mã lỗi từ backend (401, 403, 600 - 673) phải được thông dịch qua bộ từ điển `src/lib/error-codes.ts` thành thông báo tiếng Việt học thuật dễ hiểu.
5. **Đồng bộ Dữ liệu với React Query Invalidation:**
   - Sau khi thực hiện mutation (tạo, sửa, xóa), **luôn gọi `queryClient.invalidateQueries({ queryKey: [...] })`** để UI tự động refetch dữ liệu mới nhất mà không cần reload trang.

---

## 🧪 5. KIỂM THỬ & CHẤT LƯỢNG MÃ NGUỒN (TESTING POLICY)

1. **Quy tắc Kiểm thử:**
   - Mọi service, hook quan trọng và component nghiệp vụ chính nên có unit tests hoặc integration tests tương ứng.
   - Vị trí test: Đặt đồng vị trí (`*.spec.ts` hoặc `*.test.tsx`) cạnh file code hoặc trong thư mục `__tests__/`.
2. **Lệnh Kiểm thử Dự kiến:**
   - Chạy test: `npm test` hoặc `npm run test`
   - Linting check: `npm run lint`
   - TypeScript build check: `npm run build`
3. **Trước khi commit hoặc báo cáo hoàn thành:**
   - Phải chạy kiểm tra linter và type check để đảm bảo không có lỗi biên dịch TypeScript.

---

## 🚀 6. MCP FASTCODE – QUY TẮC TỐI ƯU TOKEN (MANDATORY)

> **Ưu tiên sử dụng MCP Fastcode để hiểu và điều hướng codebase thay vì đọc file thô lớn, nhằm tiết kiệm token và tăng tốc độ xử lý.**

### Thứ tự ưu tiên khi đọc code:
```text
1. fastcode.get_repo_structure   → Xem cây thư mục tổng quan
2. fastcode.get_file_summary     → Đọc tóm tắt ngữ nghĩa của module
3. fastcode.search_symbol        → Tìm chính xác hook / component / service
4. fastcode.get_call_chain       → Truy vết chuỗi gọi hàm
5. fastcode.code_qa              → Hỏi trực tiếp về logic nếu chưa rõ
6. view_file (tool gốc)          → CHỈ dùng khi cần đọc chi tiết từng dòng code cụ thể
```

- Không dùng `view_file` cả file hàng trăm dòng khi chỉ cần kiểm tra một hàm nhỏ.

---

## 🔐 7. QUY TẮC GIT & VERSION CONTROL

1. **Commit Message Format:**
   ```text
   <type>(<scope>): <mô tả ngắn bằng tiếng Anh>

   type: feat | fix | refactor | docs | test | chore | style
   ```
   *Ví dụ*: `feat(document-setup): add reference search paper card component`

2. **Các tệp TUYỆT ĐỐI KHÔNG commit vào Git:**
   - Biến môi trường: `.env`, `.env.local`
   - Build artifacts: `.next/`, `out/`, `build/`, `dist/`, `node_modules/`
   - Task và local agent files: `fe_tasks/`, `CLAUDE.md`, `AGENTS.md` (đã khai báo trong `.gitignore`).

---

## ✅ 8. CHECKLIST KHI TRIỂN KHAI TÍNH NĂNG MỚI (CHECKLIST)

Khi triển khai bất kỳ tính năng nào trên project này, AI phải tuân thủ checklist:
- [ ] **Đọc task liên quan** trong `fe_tasks/task_fe_*.md` và `fe_tasks/FE_TASK_PLAN.md`.
- [ ] **Xác định feature folder** trong `src/features/<feature-name>/`.
- [ ] **Định nghĩa Types/DTOs** trong `src/features/<feature-name>/types/`.
- [ ] **Xây dựng API Service** trong `src/features/<feature-name>/services/` sử dụng `apiClient`.
- [ ] **Tạo Custom Hook** trong `src/features/<feature-name>/hooks/` sử dụng React Query.
- [ ] **Xây dựng UI Components** trong `src/features/<feature-name>/components/` (sử dụng Shadcn UI + Tailwind v4).
- [ ] **Đăng ký Route** trong `src/app/(dashboard)/...` (nếu có trang mới).
- [ ] **Kiểm tra độ dài file** (< 250 dòng code, không quá 300 dòng).
- [ ] **Đảm bảo không có lỗi Type/Linter**.
- [ ] **Cập nhật trạng thái task** trong `fe_tasks/FE_TASK_PLAN.md` sang ✅ Done.

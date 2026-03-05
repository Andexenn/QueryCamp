CHUYEN DE CSDL PROJECT

Repo structure:
```
query-camp/
├── public/               # File tĩnh không qua biên dịch
│   ├── favicon.ico
│   └── robots.txt
├── src/                  # Toàn bộ mã nguồn của bạn nằm ở đây
│   ├── assets/           # Tài nguyên tĩnh (ảnh, fonts) cần build
│   ├── components/       # Các mảnh UI dùng chung
│   ├── hooks/            # Custom Hooks (Logic tái sử dụng)
│   ├── pages/            # Các trang chính (Layout cấp cao)
│   ├── services/         # Nơi gọi API hoặc xử lý logic nền
│   ├── types/            # Nơi định nghĩa TypeScript Interfaces
│   ├── utils/            # Các hàm hỗ trợ (Helper functions)
│   ├── workers/          # (Tùy chọn) Chứa code Web Worker chạy ngầm
│   ├── App.tsx           # Component gốc bọc toàn bộ ứng dụng
│   ├── main.tsx          # Điểm neo vào index.html
│   └── index.css         # Nơi nhúng Tailwind CSS
├── index.html            # File HTML duy nhất của trang tĩnh
├── package.json          # Danh sách thư viện
├── tsconfig.json         # Cấu hình TypeScript
└── vite.config.ts        # Cấu hình Vite
```
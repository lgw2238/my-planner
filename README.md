# My-planner

react app (tailwind + jsx)

```plaintext
src/
├── assets/            # 이미지, 아이콘 등 정적 파일
├── components/        # 공통 컴포넌트
│   └── layout/       # 레이아웃 관련 컴포넌트
│       ├── Layout.jsx    # 전체 레이아웃 구조
│       ├── Navbar.jsx    # 상단 네비게이션 바
│       └── Sidebar.jsx   # 사이드 메뉴
├── features/         # 주요 기능별 컴포넌트
│   ├── auth/        # 인증 관련
│   │   └── Login.jsx
│   ├── calendar/    # 캘린더 기능
│   │   ├── Calendar.jsx
│   │   └── EventModal.jsx
│   ├── evaluation/  # 평가 관리
│   │   ├── EvaluationList.jsx
│   │   └── EvaluationModal.jsx
│   └── upload/      # 일정 업로드
│       └── EventUpload.jsx
├── routes/          # 라우팅 설정
│   ├── index.jsx
│   └── ProtectedRoute.jsx
├── store/           # 상태 관리
│   └── useStore.js  # Zustand store
└── styles/          # 스타일 관련
    └── index.css    # 전역 스타일

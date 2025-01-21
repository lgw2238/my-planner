# My-planner

react app (tailwind + jsx)

```plaintext
src/
├── api/
│   └── axios.js                 # axios 인스턴스 및 인터셉터 설정
│
├── components/
│   └── layout/
│       ├── Layout.jsx          # 메인 레이아웃 컴포넌트
│       └── Sidebar.jsx         # 사이드바 컴포넌트
│
├── features/
│   ├── auth/
│   │   └── Login.jsx          # 로그인 컴포넌트
│   │
│   ├── calendar/
│   │   ├── Calendar.jsx       # 캘린더 메인 컴포넌트
│   │   └── EventModal.jsx     # 일정 추가/수정 모달
│   │
│   ├── evaluation/
│   │   ├── EvaluationList.jsx           # 평가 목록
│   │   ├── EvaluationModal.jsx          # 평가 추가/수정 모달
│   │   ├── EvaluationItemManagement.jsx # 평가 항목 관리
│   │   └── EvaluationItemModal.jsx      # 평가 항목 추가/수정 모달
│   │
│   ├── monitoring/
│   │   └── ServerStatus.jsx   # 서버 상태 모니터링
│   │
│   └── upload/
│       └── EventUpload.jsx    # 일정 업로드
│
├── icons/
│   └── UploadIcon.jsx         # 업로드 아이콘 컴포넌트
│
├── routes/
│   ├── index.jsx              # 라우터 설정
│   └── ProtectedRoute.jsx     # 인증 라우트 래퍼
│
└── store/
    └── useStore.js            # Zustand 스토어 (상태 관리)

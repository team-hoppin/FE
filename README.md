# peak-FE

음악인을 위한 홍보 진단 서비스 **PEAK** 프론트엔드 저장소입니다.

## 기술 스택

| 분류        | 기술                                |
| ----------- | ----------------------------------- |
| 프레임워크  | Next.js 16 (App Router)             |
| 언어        | TypeScript 5                        |
| 스타일      | Tailwind CSS v4, shadcn/ui          |
| UI 컴포넌트 | lucide-react, react-day-picker      |
| 상태 관리   | Zustand v5                          |
| 서버 상태   | TanStack Query v5                   |
| 애니메이션  | Framer Motion v12, Embla Carousel   |
| 유틸        | date-fns, clsx, html-to-image       |
| 네트워킹    | @microsoft/fetch-event-source (SSE) |

## 폴더 구조

```
src/
├── app/
│   ├── (default)/          # 기본 레이아웃 라우트 그룹
│   │   ├── album/          # 앨범 생성 · 홍보 신청
│   │   ├── mypage/         # 마이페이지
│   │   ├── report/         # 진단 신청 · 결과
│   │   ├── setting/        # 설정
│   │   ├── login/
│   │   ├── onboarding/
│   │   └── auth/
│   └── (logo-header)/      # 로고 헤더 레이아웃 라우트 그룹
│       └── album/[id]/     # 앨범 상세 (공개)
├── components/
│   ├── common/             # 공통 컴포넌트 (Header, ErrorView 등)
│   ├── ui/                 # shadcn/ui 및 커스텀 UI 컴포넌트
│   ├── album/              # 앨범 도메인 컴포넌트
│   ├── mypage/             # 마이페이지 도메인 컴포넌트
│   ├── report/             # 진단 도메인 컴포넌트
│   ├── home/
│   └── login/
├── lib/
│   └── api/                # API 클라이언트 및 외부 라이브러리 설정
├── stores/                 # Zustand 전역 상태 스토어
├── types/                  # TypeScript 타입 · 인터페이스 정의
└── utils/                  # 순수 유틸 함수 및 매핑 상수
```

## 컨벤션

### 네이밍

| 대상        | 규칙                   | 예시                   |
| ----------- | ---------------------- | ---------------------- |
| 변수 · 함수 | 카멜 케이스            | `isPrime`, `fetchData` |
| 상수        | 대문자 스네이크 케이스 | `MAX_VALUE`            |
| 파일명      | 케밥 케이스            | `card-title.tsx`       |
| 컴포넌트명  | 파스칼 케이스          | `CardList`             |
| 이미지 파일 | 케밥 케이스            | `page-login.png`       |

- 이벤트 핸들러 함수: `handle___` / Props 전달 시: `on___`
- 컴포넌트 내부 함수는 화살표 함수

### 스타일

- 색상은 CSS 변수 사용 (`var(--color-main)`, `var(--color-font-light)`)
- 타이포그래피는 `globals.css`에 정의된 유틸 클래스 사용 (`h1-bold`, `p2-semibold` 등)
- CVA 내부에서 타이포그래피 클래스 사용 시 Tailwind 유틸로 대체 (`text-base font-bold`)

### 커밋

첫 글자 **소문자**, 메시지 끝에 이슈 번호 포함

```
feat: 로그인 기능 개발 (#10)
```

| 타입       | 설명                               |
| ---------- | ---------------------------------- |
| `feat`     | 새로운 기능 추가                   |
| `fix`      | 버그 수정                          |
| `refactor` | 코드 리팩토링                      |
| `style`    | 코드 포매팅 등 기능 변경 없는 경우 |
| `design`   | CSS 등 UI 디자인 변경              |
| `chore`    | 프로젝트 세팅, 패키지 수정 등 기타 |
| `docs`     | 문서 수정                          |
| `test`     | 테스트 코드 추가 · 수정            |
| `comment`  | 주석 추가 · 변경                   |
| `rename`   | 파일 · 폴더 이동 또는 이름 변경    |
| `remove`   | 파일 삭제                          |
| `!HOTFIX`  | 치명적인 버그 긴급 수정            |

### 브랜치 · PR

```
브랜치: 유형/#이슈번호       예) feat/#10
PR:    #이슈번호 유형: 제목  예) #10 feat: 로그인 기능 구현
```

## 코드 리뷰

PR 생성 시 **CodeRabbit**이 자동으로 코드 리뷰를 진행했습니다.

- AI가 변경된 코드를 분석하여 버그 가능성, 컨벤션 위반, 개선 사항 등을 코멘트로 남겼습니다.
- 리뷰 언어는 한국어로 설정했습니다.
- CodeRabbit 리뷰를 참고하여 머지 전 코드 품질을 점검했습니다.

## 트러블슈팅

### 1. 인증 상태 관리: localStorage → 쿠키 전환

**문제**

초기에 온보딩 완료 여부와 로그인 상태를 `localStorage`로 관리했습니다. Next.js App Router에서 미들웨어와 Server Component는 서버에서 실행되기 때문에 `localStorage`를 읽을 수 없어 아래 문제들이 발생했습니다.

- 미들웨어에서 인증 체크 불가 → 클라이언트 `useEffect`에서 뒤늦게 체크
- 페이지가 한 번 렌더된 뒤 리다이렉트 → **화면이 잠깐 번쩍이는 플래시 현상**
- 헤더(Server Component)가 로그인 상태를 서버에서 읽지 못해 즉시 반영 불가

**해결**

`localStorage` → 쿠키로 전면 전환하여 미들웨어에서 서버 레벨로 바로 처리했습니다.

```ts
// 변경 전
localStorage.setItem("onboarding", "done");

// 변경 후
document.cookie = "onboarding=done; path=/; max-age=31536000";
```

---

### 2. SSE 이벤트 발생 시 전체 목록 리렌더링 문제

**문제**

마이페이지에서 SSE로 앨범 상태를 실시간 업데이트할 때, 이벤트가 발생할 때마다 `invalidateQueries()`로 전체 목록을 재요청했습니다. 특정 앨범 하나의 상태만 바뀌어도 모든 카드가 리렌더링되었습니다. (Render Duration: 55.1ms)

**해결**

`invalidateQueries` 대신 `setQueryData`로 변경된 항목만 캐시에서 부분 업데이트하고, `React.memo`를 적용해 reference가 바뀌지 않은 카드는 리렌더링을 스킵했습니다.

```ts
queryClient.setQueryData(["mypage-promotions"], (oldData) => ({
  ...oldData,
  pages: oldData.pages.map((page) => ({
    ...page,
    promotions: page.promotions.map((promotion) =>
      promotion.promotionId === updatedPromotion.promotionId
        ? updatedPromotion
        : promotion
    ),
  })),
}));
```

→ Render Duration 55.1ms → 9.9ms, **약 82% 성능 개선**


# PEAK 프로젝트 결과 보고서

## 1️⃣ 요구사항 기획서

### 기능적 요구사항

| 기능 | 핵심 동작 방식 및 조건 |
|------|----------------------|
| 소셜 로그인 | 구글 · 카카오 · 네이버 OAuth 로그인 지원. 로그인 성공 시 `/auth/success`에서 세션 확인 후 홈으로 이동 |
| 온보딩 | 최초 방문 시 서비스 소개 슬라이드 표시. 완료 후 쿠키에 기록하여 재방문 시 스킵 |
| 앨범 등록 · 수정 | 앨범명, 커버 이미지, 스트리밍 링크 입력. 커버 이미지는 S3 presigned URL을 통해 업로드. 수정 시 기존 데이터 자동 로드 |
| 앨범 홍보 링크 생성 | 앨범 등록 완료 시 공개 URL 생성. 비로그인 사용자도 앨범 상세 페이지 접근 가능 |
| 홍보 현황 실시간 조회 | 마이페이지에서 SSE(Server-Sent Events)로 홍보 상태 실시간 업데이트 |
| 앨범 이미지 저장 | 모바일: 갤러리 저장 (Web Share API), PC: 파일 다운로드로 분기 처리 |
| 음원 진단 신청 | 인스타그램 계정 유효성 검증 후 진단 신청. 홍보 기간 날짜 선택 필수 |
| 진단 결과 조회 | 진단 완료 시 메일 발송. 결과 페이지에서 진단 내역 및 하이라이트 확인 |
| 설정 | 로그아웃, 회원탈퇴. 탈퇴 시 온보딩 쿠키 초기화하여 재온보딩 진행 |

### 비기능적 요구사항

| 항목 | 내용 |
|------|------|
| 반응형 | 모바일 우선 설계. PC 환경에서도 레이아웃 유지 |
| 인증 보안 | 미들웨어(proxy.ts)에서 쿠키 기반으로 보호 라우트 접근 제어 |
| 토큰 관리 | 401 응답 시 refresh token으로 자동 재발급 후 요청 재시도 |
| 페이지 전환 | FadeMotion 공통 컴포넌트로 모든 페이지에 전환 애니메이션 적용 |
| 중복 요청 방지 | 앨범 생성 · 수정 API 요청 중 추가 제출 비활성화 |
| 코드 리뷰 | PR마다 CodeRabbit AI 자동 리뷰 적용 |

### 시스템 환경 요구사항

| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) + TypeScript 5 |
| 스타일 | Tailwind CSS v4, shadcn/ui |
| 배포 | Vercel |
| 인증 방식 | 소셜 OAuth + httpOnly 쿠키 기반 세션 |

---

## 2️⃣ 컴포넌트 구조도

| 페이지 | 경로 | 주요 컴포넌트 |
|--------|------|--------------|
| 홈 | `/` | `HomePage`, `HomeButtons` |
| 온보딩 | `/onboarding` | 인라인 슬라이드 (Embla Carousel) |
| 로그인 | `/login` | `LoginErrorToast` |
| 앨범 등록 · 수정 | `/album` | `AlbumPage`, `CalendarInput`, `Input`, `Textarea` |
| 홍보 완료 | `/album/promote` | 인라인 페이지 |
| 앨범 상세 (공개) | `/album/[id]` | `AlbumDetail`, `AlbumActionButton`, `StreamingButton` |
| 앨범 분석 | `/album/analysis/[id]` | `AlbumAnalysisPage`, `AnalysisDiagnosisSection`, `AnalysisRealtimeStatusSection`, `AnalysisStreamingSection`, `AlbumAnalysisActionButton` |
| 마이페이지 | `/mypage` | `AlbumItemCard`, `DiagnosisItemCard`, `DiagnosisLabel` |
| 진단 신청 | `/report` | `ReportForm`, `CalendarInput` |
| 진단 결과 | `/report/[promotionId]` | `ReportDetail` |
| 진단 신청 완료 | `/report/complete` | 인라인 페이지 |
| 진단 준비중 | `/report/coming-soon` | `ComingSoon` |
| 설정 | `/setting` | `BackButton`, `AlertModal` |
| 회원탈퇴 완료 | `/auth/withdraw` | 인라인 페이지 |

### 공통 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| `Header` | 로그인 상태에 따라 마이페이지 링크 노출 (Server Component) |
| `FadeMotion` | 페이지 · 섹션 전환 애니메이션 래퍼 |
| `AlertModal` | 확인 · 경고 · 에러 공통 모달 (Zustand로 전역 관리) |
| `AuthErrorModal` | 403 응답 시 전역 표시되는 인증 오류 모달 |
| `ErrorView` | API 오류 시 공통 에러 화면 |
| `BackButton` | 뒤로가기 버튼 |
| `CalendarInput` | 날짜 선택 인풋 (react-day-picker 기반) |

---

## 3️⃣ 트러블슈팅

### 1. 인증 상태 관리: localStorage → 쿠키 전환

**문제**

초기에 온보딩 완료 여부와 로그인 상태를 `localStorage`로 관리했습니다. Next.js App Router에서 미들웨어와 Server Component는 서버에서 실행되기 때문에 `localStorage`를 읽을 수 없어 아래 문제들이 발생했습니다.

- 미들웨어에서 인증 체크 불가 → 클라이언트 `useEffect`에서 뒤늦게 체크
- 페이지가 한 번 렌더된 뒤 리다이렉트 → **화면이 잠깐 번쩍이는 플래시 현상**
- 헤더(Server Component)가 로그인 상태를 서버에서 읽지 못해 즉시 반영 불가

**해결**

`localStorage` → 쿠키로 전면 전환했습니다.

```ts
// 변경 전
localStorage.setItem("onboarding", "done");

// 변경 후
document.cookie = "onboarding=done; path=/; max-age=31536000";
```

미들웨어에서 쿠키를 직접 읽어 서버에서 바로 리다이렉트 처리하고, `useEffect` 기반 리다이렉트 코드를 제거했습니다. 플래시 현상이 해결되고 Server Component에서도 로그인 상태를 즉시 반영할 수 있게 됐습니다.

---

### 2. SSE 이벤트 발생 시 전체 목록 리렌더링 문제

**문제**

마이페이지에서 SSE로 앨범 분석 상태를 실시간 업데이트할 때, 이벤트가 발생할 때마다 `invalidateQueries()`로 전체 목록을 다시 fetch했습니다. 특정 앨범 하나의 상태만 바뀌어도 모든 카드 컴포넌트가 리렌더링되는 문제가 있었습니다.

```
SSE 이벤트 발생 → invalidateQueries → 전체 리스트 재요청 → 모든 카드 리렌더링
Render Duration: 55.1ms
```

**해결**

`invalidateQueries` 대신 `setQueryData`로 변경된 항목만 캐시에서 부분 업데이트하도록 변경했습니다.

```ts
queryClient.setQueryData(["mypage-promotions"], (oldData) => ({
  ...oldData,
  pages: oldData.pages.map((page) => ({
    ...page,
    promotions: page.promotions.map((promotion) =>
      promotion.promotionId === updatedPromotion.promotionId
        ? updatedPromotion   // 변경된 항목만 교체
        : promotion          // 나머지는 기존 reference 유지
    ),
  })),
}));
```

변경되지 않은 항목은 객체 reference가 그대로 유지되므로, `React.memo`를 적용한 카드 컴포넌트는 리렌더링을 스킵합니다.

```
SSE 이벤트 발생 → setQueryData → 변경된 카드만 렌더링
Render Duration: 9.9ms → 약 82% 성능 개선
```

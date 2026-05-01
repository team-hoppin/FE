# peak-FE

## 기술 스택

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui

---

## 컨벤션

### 폴더 구조

- `src/components/common/` → 공통 컴포넌트
- `src/components/도메인/` → 페이지 내에서 사용할 컴포넌트
- `src/lib/` → 외부 라이브러리 설정 및 API 클라이언트
- `src/stores/` → Zustand 전역 상태 스토어
- `src/types/` → TypeScript 타입 및 인터페이스 정의 (도메인 타입, API 응답 타입 등)
- `src/utils/` → 도메인 특화 순수 유틸 함수 및 매핑 상수

### 네이밍

- 변수, 함수는 카멜 케이스 (예: `isPrime`, `fetchData`)
- 상수는 대문자 스네이크 케이스 (예: `MAX_VALUE`)
- 파일명은 케밥 케이스 (예: `card-title`)
- **컴포넌트명은 파스칼 케이스** (예: `CardList`)
- 컴포넌트가 아닌 파일은 카멜 케이스
- 이미지 파일은 케밥 케이스

### 함수 작성

- 컴포넌트 내부 함수는 화살표 함수
- 이벤트 핸들러 함수는 `handle___` / Props 전달 시 `on___`

### 커밋

첫 글자 **소문자** (예: `feat: 로그인 기능 개발`)

| 커밋 유형  | 의미                                                         |
| ---------- | ------------------------------------------------------------ |
| `feat`     | 새로운 기능 추가                                             |
| `fix`      | 버그 수정                                                    |
| `refactor` | 코드 리팩토링                                                |
| `style`    | 코드 formatting, 세미콜론 누락, 코드 자체의 변경이 없는 경우 |
| `design`   | CSS 등 사용자 UI 디자인 변경                                 |
| `chore`    | 프로젝트 세팅, 패키지 매니저 수정, 그 외 기타 수정           |
| `docs`     | 문서 수정                                                    |
| `test`     | 테스트 코드, 리팩토링 테스트 코드 추가                       |
| `comment`  | 필요한 주석 추가 및 변경                                     |
| `rename`   | 파일 또는 폴더 명을 수정하거나 옮기는 작업만인 경우          |
| `remove`   | 파일을 삭제하는 작업만 수행한 경우                           |
| `!HOTFIX`  | 급하게 치명적인 버그를 고쳐야 하는 경우                      |

### 브랜치명

```
유형/#이슈번호
예) feat/#10
```

### PR명

```
#이슈번호 유형: 이슈 제목과 동일
예) #10 feat: 로그인 기능 구현
```

---

## 스타일 컨벤션

- 색상은 하드코딩 대신 CSS 변수 사용 (예: `var(--color-main)`, `var(--color-font-light)`)
- 타이포그래피는 `globals.css`에 정의된 유틸 클래스 사용 (예: `h1-bold`, `p1-bold`, `p3-regular`)
- 타이포그래피 클래스는 `@layer components`에 정의되어 있어 Tailwind 유틸보다 우선순위가 낮음 — CVA 내부에서 쓸 경우 `text-base font-bold` 등 Tailwind 유틸로 대체할 것

## 피그마 토큰 업데이트

피그마에서 `figma-export.json`으로 내보낸 후 요청하면 아래 규칙에 따라 `src/app/globals.css`의 `@theme inline`을 업데이트한다.

### 변환 규칙

- 색상 토큰은 카테고리 prefix(`brand`, `semantic`, `greyscale`) 제거 후 추가
  - 예) `color-brand-main-mid` → `--color-main-mid`
- semantic 색상은 의미 기반 이름 사용
  - 예) `color-semantic-blue` → `--color-info`
- shadow, radius는 토큰명 그대로 사용
  - 예) `shadow-btn` → `--shadow-btn`, `radius-r1` → `--radius-r1`
- 이미 있는 변수는 값만 업데이트, 없는 것만 추가

---

## SVG 아이콘 컨벤션

- lucide-react 아이콘을 커스텀할 경우 피그마에서 SVG로 내보내기 후 `src/components/ui/`에 별도 컴포넌트로 분리
- 파일명은 lucide 아이콘명 기준으로 네이밍 (예: `circle-user-round.tsx`)
- `size`, `fill` 등 커스텀이 필요한 값은 props로 받고 기본값 설정

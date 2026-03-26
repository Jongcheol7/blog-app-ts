# 블로그 프로젝트 전체 회의록

**일시**: 2026-03-26
**참석자**: Designer, Dev, Marketing, PM, QA
**안건**: 현재 상태 진단 및 향후 방향 수립

---

## 1. 각 에이전트별 현황 보고

### Designer — UI/UX 감사

**현재 상태**: Tailwind CSS v4 oklch 색상 시스템 + shadcn/ui + Supanova 모션 시그니처로 프리미엄한 시각 품질을 달성. 라이트/다크 테마, 반응형 레이아웃, glass-nav, card-bezel 더블 베젤 등 일관된 디자인 시스템 보유.

**잘된 점**:
1. oklch 색상 변수 기반 라이트(Clean Structural)/다크(Vantablack Luxe) 테마 완성도
2. Tiptap 에디터 — 이미지 리사이즈, 코드 복사 버튼, 라이트박스, 자동 목차 등 고급 기능
3. 블로그 상세 페이지의 메타데이터 시각 계층 (배지, 조회수, 읽기 시간, 공유 버튼)
4. 반응형 그리드 (2→3→4 컬럼) + 모바일/데스크톱 네비게이션 분리
5. Supanova 모션 (fadeInUp, shimmer, cubic-bezier 0.5초)으로 일관된 애니메이션

**개선 필요**:
1. **폼 요소 시각적 계층 혼동** — Textarea `bg-secondary/50`이 너무 연해 focus 상태 구분 어려움
2. **로딩/빈 상태 UI 불일관** — BlogMain은 Loader2 스피너, GuestbookLists는 스켈레톤 (다른 패턴)
3. **에디터 툴바 접근성** — NoteToolbar 버튼 active/inactive 구분 부족, aria-label 없음
4. **카테고리/태그 필터 변경 시 스크롤 위치 미관리** — 결과는 상단인데 스크롤은 하단 유지
5. **에러 페이지 구체성 부족** — error.tsx가 일반적 메시지만 제공

---

### Dev — 아키텍처 분석

**현재 상태**: Next.js 15 + React 19 + Prisma v6 + NextAuth v4 + TanStack Query v5 + Zustand v5. Vercel 서버리스 배포. 아키텍처 기초가 탄탄하고 모범적 패턴(Prisma 싱글턴, TanStack Query 캐싱, 권한 검증) 보유.

**잘된 점**:
1. **Prisma 싱글턴 패턴** — globalThis 캐싱 + directUrl로 Supabase Transaction 모드 완벽 지원
2. **TanStack Query 키 구조화** — `["blogLists", { keyword, category, tag, page }]`로 부분 무효화 가능
3. **일관된 인증/인가** — 모든 쓰기 API에서 `getServerSession()` + 소유자/관리자 확인
4. **파일 업로드** — Presigned URL(1분 유효) + 클라이언트 이미지 압축 + dev/prod 폴더 분리
5. **Soft delete** — `deletedAt` + 인덱스 설정으로 감사 추적 가능

**기술 부채**:
1. **API 검증 로직 산발** — 매 핸들러마다 수동 검증 복제, Zod 등 스키마 검증 도구 미사용
2. **API 응답 포맷 불일치** — `error` vs `success` vs `message` 혼재
3. **타입 안정성 부족** — BlogForm 단일 타입이 생성/수정/조회 모두 커버 (Partial 미활용)
4. **N+1 쿼리 위험** — `blogTags.tag` 매번 include, Comment 조회 시 user 반복 로드
5. **조회수 중복 방지 race condition** — 동시 요청 시 중복 기록 가능

---

### Marketing — SEO/성장 분석

**현재 상태**: 중급 수준의 기술적 SEO 기초. sitemap, robots.txt, RSS 피드, 동적 메타데이터 구현 완료. 그러나 분석 도구 미연동, 정적 생성 전략 부재, 구조화된 데이터 없음.

**잘된 점**:
1. **동적 메타데이터** — `generateMetadata()`로 포스트별 OG 태그 자동 생성
2. **Sitemap 자동 생성** — `force-dynamic` + priority 전략 (홈 1.0, 목록 0.9, 포스트 0.7)
3. **RSS 피드** — RSS 2.0 표준 준수, 최근 50개 포스트, atom:link 자체참조
4. **next/image 최적화** — priority 속성, sizes 반응형, 커스텀 로더
5. **보안 헤더** — X-Frame-Options: DENY, nosniff, Permissions-Policy

**개선 필요**:
1. **Google Analytics 미연동** — 방문자, 검색어, 이탈률 등 핵심 데이터 수집 불가
2. **ISR/SSG 전략 부재** — 매 요청마다 DB 쿼리, Core Web Vitals 악화
3. **블로그 목록/About/방명록 메타데이터 없음** — 기본 제목만 표시
4. **구조화된 데이터(JSON-LD) 완전 부재** — Rich Snippet 미표시
5. **Canonical URL 미설정** — 중복 콘텐츠 문제 가능

---

### PM — 기능 현황/로드맵

**현재 기능 인벤토리**:

| 영역 | 완성도 | 주요 기능 |
|------|--------|-----------|
| 블로그 CRUD | 100% | Tiptap 에디터, 이미지/비디오, 코드 하이라이팅, 라이트박스, 목차 |
| 댓글 시스템 | 80% | 대댓글, 비밀댓글, 무한 스크롤 (수정 기능 없음) |
| 인증/권한 | 100% | GitHub/Google OAuth, 관리자 권한 |
| 카테고리 | 100% | CRUD, 필터링, 관리자 팝업 |
| 방명록 | 100% | CRUD, 비밀 메시지 |
| SEO/피드 | 90% | sitemap, robots, RSS (JSON-LD 없음) |
| 관리자 대시보드 | 70% | 기본 통계, 포스트 테이블 (차트 없음) |
| 조회수 추적 | 90% | 30분 중복 체크, GitHub Actions 크론 |

**경쟁 플랫폼 대비 부족한 점**:
1. 전문 검색 (현재 제목+태그 텍스트 매칭만)
2. 추천/관련 글 알고리즘
3. 통계 대시보드 (일별 조회수 그래프 등)
4. 댓글 수정, 스팸 필터, 알림 시스템
5. 시리즈/연재 기능

---

### QA — 보안/품질 점검

**보안 상태**: 전반적으로 보안 의식이 높은 구조. NextAuth 인증, DOMPurify XSS 방어, MIME 타입 검증, 보안 헤더 등 기본기 갖춤.

**잘된 점**:
1. 모든 쓰기 API에서 세션 검증 + 소유자/관리자 권한 확인
2. DOMPurify로 Tiptap 출력 및 핀 포스트 XSS 방어
3. 이미지 업로드 화이트리스트 MIME 타입 검증 + Presigned URL
4. 비공개/비밀 콘텐츠 이중 접근 제어 (API + 프론트엔드)
5. 보안 헤더 (X-Frame-Options, nosniff, Permissions-Policy)

**발견된 이슈**:

| 심각도 | 이슈 | 파일 |
|--------|------|------|
| **Critical** | .env.local이 Git에 노출 (AWS Key, OAuth Secret, DB 비밀번호 등) | `.env.local` |
| **High** | Adjacent API에서 비공개 글 제목/이미지 노출 가능 | `api/blog/adjacent/route.ts` |
| **High** | DB 연결정보가 .env 주석에 노출 | `.env` |
| **Medium** | 비밀글 필터링이 프론트엔드에서만 처리 (API 응답에 비밀글 내용 포함) | `api/guestbook/route.ts` |
| **Medium** | 입력값 길이 제한 없음 (title, content, tags, comment) | 여러 API |
| **Medium** | 프로덕션에서 console.log 49개 — 비공개글 내용까지 로그 노출 | 여러 API |
| **Low** | Rate Limiting 부재 — 댓글/방명록 스팸 가능 | 전체 API |
| **Low** | CSRF 보호가 NextAuth 내장에만 의존 | 전체 |

---

## 2. 크로스 에이전트 논의 — 공통 이슈

### 모든 에이전트가 동의한 사항

1. **API 계층 정비가 시급** (Dev + QA + PM)
   - 검증 로직 산발 → Zod 스키마 도입
   - 응답 포맷 불일치 → 표준 ApiResponse 타입
   - console.log 49개 → 프로덕션에서 제거

2. **비밀글/비공개글 보안 강화** (QA + Dev)
   - 프론트엔드가 아닌 API 계층에서 필터링 필수
   - Adjacent API 접근 제어 보완

3. **분석 도구 연동 필수** (Marketing + PM + Designer)
   - GA4 또는 Vercel Analytics 없이는 개선 방향 수립 불가
   - 사용자 행동 데이터 → 디자인/기능 의사결정 근거

4. **로딩/에러 상태 UI 표준화** (Designer + PM)
   - 페이지마다 다른 로딩 패턴 → 일관된 UX 필요

---

## 3. 향후 방향 — 통합 로드맵

### Phase 0: 즉시 조치 (이번 주)

| # | 작업 | 담당 | 근거 |
|---|------|------|------|
| 1 | ~~.env.local Git 노출 해결~~ — 모든 API 키 로테이션 | QA/Dev | Critical 보안 이슈 |
| 2 | 비밀글 API 계층 필터링 이동 (guestbook, comment) | Dev/QA | 비밀글 내용 API 노출 |
| 3 | Adjacent API 비공개글 접근 제어 | Dev/QA | 비공개 글 제목 노출 |
| 4 | 프로덕션 console.log 제거 (49개) | Dev | 민감 정보 로그 유출 |

### Phase 1: 기반 정비 (1-2개월)

| # | 작업 | 공수 | 담당 | 임팩트 |
|---|------|------|------|--------|
| 1 | API 검증 표준화 (Zod + ApiResponse 타입) | M | Dev | 버그 감소, 유지보수성 |
| 2 | Google Analytics 4 연동 | S | Marketing | 데이터 기반 의사결정 |
| 3 | 블로그 상세 ISR 설정 (`revalidate: 3600`) | S | Dev/Marketing | Core Web Vitals 30-50% 개선 |
| 4 | 로딩/빈/에러 상태 UI 통일 | M | Designer | 일관된 UX |
| 5 | 입력값 길이 제한 추가 | S | QA/Dev | 메모리 폭탄 방어 |
| 6 | 댓글 수정 기능 | S | PM/Dev | 기능 완성도 80→95% |
| 7 | 모든 페이지 메타데이터 + Canonical URL | S | Marketing | 검색 가시성 |

### Phase 2: 성장 엔진 (2-4개월)

| # | 작업 | 공수 | 담당 | 임팩트 |
|---|------|------|------|--------|
| 1 | 구조화된 데이터 JSON-LD (BlogPosting) | M | Marketing | Rich Snippet, CTR 10-20% 향상 |
| 2 | 추천 글 시스템 (태그/카테고리 기반) | M | PM/Dev | 체류 시간 25% 증가 |
| 3 | 관리자 대시보드 고도화 (일별 조회수 차트) | M | PM/Dev | 운영 편의성 |
| 4 | 폼 요소 시각적 계층 강화 + 접근성 | M | Designer | 폼 작성 오류 감소 |
| 5 | 타입 안정성 강화 (Create/Update/Output 분리) | M | Dev | IDE 자동완성, 런타임 에러 감소 |
| 6 | 필터링 상태 시각화 (활성 필터 배지) | S | Designer | 사용자 맥락 인지 |

### Phase 3: 차별화 (4-6개월)

| # | 작업 | 공수 | 담당 | 임팩트 |
|---|------|------|------|--------|
| 1 | 전문 검색 (Meilisearch 또는 Algolia) | L | Dev/PM | 콘텐츠 디스커버리 |
| 2 | 시리즈/연재 기능 | M | PM/Dev | 콘텐츠 구조화 |
| 3 | 뉴스레터 구독 (Resend) | M | Marketing/Dev | 재방문률 |
| 4 | Rate Limiting + 스팸 필터 | M | QA/Dev | 품질 보호 |
| 5 | N+1 쿼리 최적화 + 캐싱 전략 | L | Dev | 성능, 인프라 비용 |
| 6 | 에러 추적 (Sentry) | S | QA/Dev | 프로덕션 안정성 |

---

## 4. 핵심 결론

### 강점
- **기술 기초가 탄탄** — 모던 스택, 모범적 패턴, 프리미엄 디자인 시스템
- **핵심 기능 완성도 높음** — 에디터, 인증, 댓글, 카테고리 모두 실사용 수준
- **확장 가능한 구조** — 모듈식 폴더, 커스텀 hooks, Zustand 경량 상태관리

### 약점
- **보안 사각지대** — .env 노출, 비밀글 API 필터링 미흡
- **API 계층 정비 필요** — 검증/응답/로깅 표준화
- **분석 도구 부재** — 데이터 없이 개선 방향 수립 불가
- **SEO 미완성** — JSON-LD, ISR, Canonical 등 미적용

### 한 줄 요약
> **"기초가 튼튼한 집에 마감공사와 보안 점검이 필요한 상태"**
> 즉시 보안 이슈를 해결하고, API 계층을 정비한 뒤, GA 연동 → ISR → JSON-LD 순서로 성장 엔진을 가동하면 경쟁 플랫폼 수준으로 도약 가능.

---

*이 회의록은 Designer, Dev, Marketing, PM, QA 5개 에이전트의 코드베이스 분석을 종합하여 작성되었습니다.*

# 금빛농원 GEUMBIT FARM — Brand Site

Next.js 15 (App Router · Static Export) + TypeScript + Tailwind CSS 4 + next-intl 기반의 금빛농원(GEUMBIT FARM) 다국어(KO/EN/ZH) 브랜드 사이트. GitHub Pages에 정적 배포되며, 식스샵 쇼핑몰 개설 시 환경변수만 바꾸면 모든 구매 버튼이 식스샵 URL로 자동 라우팅된다.

배포 URL: <https://w2er1702-boop.github.io/geumbit-farm/>

---

## 1. 로컬 실행

```bash
npm install
npm run dev          # http://localhost:3000/ko (또는 /en, /zh)
```

> 한국어는 빌드 시 후처리 단계에서 `/`로 이동된다. 개발 서버에서는 `/ko`로 접근한다.

## 2. 빌드 및 정적 미리보기

```bash
npm run build        # next build → out/ 생성 → postbuild로 /ko/* 를 루트로 이동
npx serve out        # http://localhost:3000 에서 미리보기 (basePath는 빠짐)
```

## 3. 환경 변수

`.env.example`를 참고. 로컬에서는 `.env.local`을 만들고, GitHub Actions에서는 Repository **Variables**에 등록한다.

| 변수 | 용도 | 기본값 |
|---|---|---|
| `NEXT_PUBLIC_SIXSHOP_URL` | 식스샵 도메인 (개설 후 입력) | (비어 있음) |
| `NEXT_PUBLIC_NAVER_STORE_URL` | 네이버 스토어 fallback | `https://smartstore.naver.com/ycgoldenfarm` |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | (현재 미사용) | 비어 있음 |
| `NEXT_PUBLIC_SITE_URL` | OG·sitemap의 절대 URL | `https://w2er1702-boop.github.io/geumbit-farm` |

`NEXT_PUBLIC_SIXSHOP_URL`이 설정되어 있고 상품에 `sixshopSlug`가 채워져 있으면 식스샵으로, 아니면 네이버 스마트스토어로 자동 라우팅된다.

## 4. 콘텐츠 / 자산 채우기 체크리스트

코드에는 모든 경로가 잡혀 있으므로 아래 파일만 채우면 된다.

- [ ] `public/logo.png` — GEUMBIT FARM 로고
- [ ] `public/logo.svg` — SVG 원본 (있다면)
- [ ] `public/og-default.jpg` — 기본 OG 이미지 (1200×630)
- [ ] `public/farm/hero.jpg` — 홈/농장 페이지 히어로
- [ ] `public/farm/farm-1.jpg` ~ `farm-6.jpg` — 농장 페이지 갤러리
- [ ] `public/products/{slug}.jpg` 9개 — 네이버 스토어 `ycgoldenfarm`에서 다운로드 후 저장
  - `oak-sanghwang-30g`, `oak-sanghwang-100g`
  - `golden-sanghwang-slice-250g`, `golden-sanghwang-slice-500g`
  - `golden-sanghwang-whole-250g`, `golden-sanghwang-whole-500g`
  - `golden-sanghwang-jinaek`
  - `sanghwang-set-500g`
  - `golden-sanghwang-fermented`
- [ ] `public/certifications/` — 인증서 이미지/PDF
- [ ] `data/brand.json` — `story` 등의 placeholder를 실제 텍스트로 교체
- [ ] `data/certifications.json` — 보유 인증 항목 채우기 (`id`, `name`, `issuer`, `issuedAt`, `image`, `pdf`)

이미지가 없으면 카드에는 자동으로 "이미지 준비 중 · 桑黃" placeholder가 표시된다.

## 5. GitHub Pages 배포 (자동)

main 브랜치에 push되면 `.github/workflows/deploy.yml`이 자동 실행된다.

### 5.1 최초 1회만 — GitHub 측 수동 설정

1. 저장소 **Settings → Pages → Build and deployment → Source** 를 **GitHub Actions** 로 변경.
2. (선택) **Settings → Secrets and variables → Actions → Variables** 탭에서 위 §3의 4개 변수를 등록.

설정이 끝나면 다음 push부터 워크플로가 성공한다.

### 5.2 첫 배포 확인

워크플로 완료 후 다음 URL 접속:

```
https://w2er1702-boop.github.io/geumbit-farm/
```

404가 뜨면:
- `out/.nojekyll` 존재 확인 (postbuild가 자동 생성)
- `next.config.mjs`의 `basePath: '/geumbit-farm'` 확인
- Actions 탭 로그 확인

## 6. 커스텀 도메인 연결 (선택)

1. `next.config.mjs`에서 `const useCustomDomain = true;` 로 변경 → `basePath`/`assetPrefix` 자동 비활성화.
2. `public/CNAME` 파일에 도메인 한 줄 (`geumbitfarm.com` 등) 작성.
3. DNS:
   - apex: A 레코드 → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - www: CNAME → `w2er1702-boop.github.io`
4. **Settings → Pages → Custom domain** 에 도메인 입력 후 **Enforce HTTPS** 체크.
5. Variables의 `NEXT_PUBLIC_SITE_URL` 을 새 도메인으로 업데이트 후 재배포.

## 7. 식스샵 전환 (개설 후)

1. 식스샵 관리자에서 각 상품의 slug(URL path) 확인.
2. `data/products.json`의 각 항목 `sixshopSlug` 필드에 그 값을 입력.
3. GitHub Actions Variables의 `NEXT_PUBLIC_SIXSHOP_URL` 을 식스샵 도메인으로 설정 (예: `https://geumbitfarm.com`).
4. main에 빈 커밋을 push하거나 Actions 탭에서 워크플로 수동 재실행.

코드 변경 없이 모든 BuyButton이 식스샵으로 라우팅된다.

## 8. 디자인 시스템 요약

- 콘셉트: Editorial Luxury × Korean Heritage Apothecary
- 색: Onyx / Heritage Gold / Oxblood / Parchment
- 폰트: Noto Serif KR · Cinzel · Noto Serif SC · Pretendard · EB Garamond · JetBrains Mono
- 시그니처 요소: 세로 한자 장식, 골드 룰, 이중 보더 카드, 종이 질감 노이즈

`app/globals.css`에 모든 토큰이 CSS 변수 + `@theme` 블록으로 정의되어 있다.

## 9. 콘텐츠 / 표시 가이드

- 의약품적 효능 단정 표현(암 치료, 면역증강 보장 등) 금지.
- B2B 거래처 명시(정관장 등) 금지. "국내 굴지의 건강식품 기업 원물 공급" 까지만 우회.
- 모든 상품은 일반 식품 표시 가이드 준수.

## 10. 트러블슈팅

- **개발 서버에서 `/` 404**: 개발 모드에서는 `/ko`, `/en`, `/zh` 로 접근. 프로덕션 빌드에서는 postbuild가 `/`를 자동으로 한국어로 만든다.
- **이미지가 안 보임**: `public/products/{slug}.jpg` 존재 확인. 없으면 placeholder가 표시되므로 정상.
- **빌드 시 폰트 에러**: 네트워크 제한 환경이면 `app/[locale]/layout.tsx`의 `next/font/google` import가 실패할 수 있다. CI에서는 정상.

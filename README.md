# 금빛농원 GEUMBIT FARM — 브랜드/판매 홈페이지 (시안)

연천 한탄강 자락에서 키운 유기농 황금상황버섯 브랜드 **금빛농원**의 정적 홈페이지 시안.

- **기술 스택:** 순수 정적 멀티페이지 — HTML + CSS + 바닐라 JS. 빌드 툴 없음.
- **설계 의도:** 최종 타깃인 **Cafe24 스마트디자인**(HTML/CSS/JS 기반)으로의 이식 직접성. 자세한 사양은 [`SPEC.md`](./SPEC.md) 참조.
- **배포:** GitHub Pages — `main` 브랜치 push 시 자동 배포.
- **배포 URL:** <https://w2er1702-boop.github.io/geumbit-farm/>

---

## 1. 로컬 실행

빌드가 필요 없다. 정적 서버로 열기만 하면 된다. (`file://` 직접 열기는 partial include의 `fetch` 때문에 동작하지 않으므로 반드시 서버로 실행.)

```bash
python3 -m http.server 8000
# http://localhost:8000 접속
```

## 2. 디렉토리 구조

```
/
├─ SPEC.md                  # 빌드 지시서 (v2.0)
├─ index.html               # HOME
├─ story.html               # OUR STORY
├─ products.html            # 제품 목록 (필터 + 그리드)
├─ product-detail.html      # 제품 상세 (?p=slug)
├─ reviews.html             # 후기
├─ community.html           # 공지/Q&A/FAQ
├─ cart/login/join/mypage.html   # 커머스 stub (비동작 UI 셸)
├─ support.html             # 고객센터
├─ terms/privacy/guide.html # 정책/안내
├─ robots.txt · sitemap.xml · .nojekyll
├─ assets/
│  ├─ css/style.css         # 전역 스타일 + 디자인 토큰 (SPEC 2-1)
│  ├─ js/main.js            # 드로어/탭/아코디언/reveal/갤러리/include
│  ├─ js/products.js        # 제품 데이터 + 카드 렌더러
│  └─ img/{photo,gen,logo}/ # 실사 / AI 생성 / 로고
└─ partials/                # header.html · footer.html (JS include)
```

## 3. 공통 헤더/푸터

`partials/header.html`, `partials/footer.html`를 각 페이지에서 `<div data-include="...">`로 불러온다(`assets/js/main.js`의 경량 include). 모든 경로는 상대경로라 GitHub Pages 서브경로(`/geumbit-farm/`)에서도 그대로 동작한다.

## 4. 제품 데이터

`assets/js/products.js`의 `PRODUCTS` 배열이 단일 출처다. 가격·네이버 상품번호는 운영값 기반, 별점/후기수는 샘플이다. 구매 버튼은 네이버 스마트스토어(`ycgoldenfarm`)로 라우팅되며, 운영 전환 시 Cafe24 상품모듈로 교체한다.

## 5. 이미지

- **실사**(제품·농장): `assets/img/photo/{slug}.jpg`. 없으면 자동으로 "桑黃" placeholder 블록이 표시된다.
- **AI 생성 배경**(배너·무드): `assets/img/gen/GEN_*.webp`. 현재 5종 생성 완료 — `GEN_HERO_BG`, `GEN_STORY_HERO`, `GEN_CULTIVATION`, `GEN_GIFT_BANNER`, `GEN_NEWSLETTER_BG`.
- 배너 텍스트는 이미지에 굽지 않고 HTML/CSS로 오버레이한다(SPEC 6-1).

채워야 할 슬롯:
- [ ] `assets/img/photo/{slug}.jpg` 9종 — 네이버 스토어 실사
- [ ] `assets/img/photo/` PDP 메인/썸네일/상세컷, 농장·대표 실사
- [ ] `assets/img/gen/` 미생성 슬롯 (GEN_CRAFT_HANDS 등) — 필요 시 추가 생성
- [ ] 회사정보·CS·SNS·사업자번호 등 `[샘플]` 값 (footer 및 정책 페이지)

## 6. GitHub Pages 배포

`main`에 push되면 `.github/workflows/deploy.yml`이 저장소 루트를 그대로 Pages에 업로드한다(빌드 없음).

최초 1회: **Settings → Pages → Build and deployment → Source** 를 **GitHub Actions** 로 설정.

> `.nojekyll`이 있어 Jekyll 처리 없이 `assets/`가 그대로 배포된다.

## 7. SEO / 접근성

- 각 페이지 `<title>`·`meta description`·OG 태그.
- `sitemap.xml` / `robots.txt` 포함. 운영 시 **네이버 서치어드바이저**에 사이트 등록 및 사이트맵 제출 권장(`naver-site-verification` 메타 추가).
- 이미지 `alt`, 폼 `label`, 포커스 스타일, 명도 대비, `prefers-reduced-motion` 대응.

## 8. 컴플라이언스 (SPEC 3장)

- **효능 표현 금지** — 일반식품으로 포지셔닝. 면역·항암·치료·예방 등 기능성 표현 금지.
- **거래처 직접 명시 금지** — "국내 유수 건강식품 기업에 원물 공급" 식 간접 표현만.
- 후기에 질병 치료·효능 체험담 노출 금지.
- AI 생성 가짜 제품/패키지컷 사용 금지(제품은 실사만).

## 9. Cafe24 이식 (운영 전환)

정적 HTML/CSS/JS를 스마트디자인 스킨으로 이식. 커머스 영역(목록·상세·옵션·장바구니·회원·주문)은 Cafe24 module/변수로 교체. 자세한 내용은 `SPEC.md` 9장.

---
*디자인/카피/구성은 제안·샘플이며, 운영값 교체와 표시광고 컴플라이언스 검토가 필요합니다.*

# 금빛농원 홈페이지 — Claude Code 빌드 지시서 (v2.0)

> 이 문서는 **Claude Code에 그대로 입력**해 금빛농원 브랜드/판매 홈페이지 시안을 빌드하기 위한 실행 지시서다.
> 프로젝트 루트에 `SPEC.md`로 저장하고 Claude Code에서 참조한다.
>
> **표기:** `[확정]` 확정 · `[샘플]` 임시값(교체 필요) · `[제안]` 권장 · `[확실]` 1차출처 검증 · `[법리]` 일반 법리(자문 아님)

---

## 0. Claude Code 사용법

1. 빈 디렉토리에서 git 저장소를 만들고 이 파일을 `SPEC.md`로 둔다.
2. Claude Code에 아래처럼 지시한다(예시):
   - `"SPEC.md를 읽고 1장대로 프로젝트를 스캐폴딩해줘."`
   - `"5-1의 HOME 페이지를 빌드해줘. 아직 없는 이미지 슬롯은 placeholder 블록으로 처리해."`
   - `"전 페이지의 헤더/푸터를 공통 컴포넌트로 만들고 GNB·푸터 링크가 모두 작동하게 해줘."`
   - `"6-3 프롬프트로 만든 배너 이미지를 /assets/img 에 넣고 슬롯에 연결해줘."`
3. **이미지 2종 구분(중요):** 제품·패키지·농장 = **실사**(6-2), 디자인/배너/배경/무드 = **GPT Image 2.0 생성**(6-3).
4. 빌드 산출물은 GitHub에 커밋. 운영 전환 시 9장(Cafe24 이식) 참조.

---

## 1. 프로젝트 셋업 (Claude Code 실행 지시)

### 1-1. 기술 스택 `[제안]`
- **시안 단계: 순수 정적 멀티페이지** — HTML + CSS + 바닐라 JS. 빌드 툴 없음.
  - 이유: 최종 타깃인 **Cafe24 스마트디자인이 HTML/CSS/JS 기반**이라, 빌드리스 정적 마크업이 이식 시 가장 직접적이다 [확실].
  - 대안: 멀티페이지 관리가 많아지면 Astro 사용 가능(선택).
- 외부 의존: 폰트(아래) 외 프레임워크 없음. 아이콘은 인라인 SVG(라인 스타일).

### 1-2. 디렉토리 구조
```
/ (repo root)
├─ SPEC.md
├─ index.html              # HOME
├─ story.html              # OUR STORY
├─ products.html           # 제품 목록
├─ product-detail.html     # 제품 상세(대표 1종 예시)
├─ reviews.html            # 후기
├─ community.html          # 공지/Q&A/FAQ
├─ cart.html login.html join.html mypage.html support.html
├─ terms.html privacy.html guide.html
├─ /assets
│   ├─ /css/style.css      # 전역 스타일(디자인 토큰 포함)
│   ├─ /js/main.js         # 드로어/탭/슬라이더 등
│   ├─ /img/photo/         # 실사(제품·농장) — 6-2
│   ├─ /img/gen/           # GPT Image 2.0 생성(배너·배경) — 6-3
│   └─ /img/logo/          # 로고
└─ /partials               # header.html footer.html (JS include 또는 빌드시 삽입)
```
- 헤더/푸터는 `/partials`로 두고 각 페이지에서 동일 마크업 사용(중복 또는 경량 JS include). Claude Code가 일관 적용.

### 1-3. 초기화/실행/버전관리 (지시)
- `git init` 후 첫 커밋.
- 로컬 프리뷰: 정적 서버(예: `python3 -m http.server`)로 전 페이지 링크 확인.
- 변경 단위로 커밋, 기능별 브랜치/PR 권장.

---

## 2. 브랜드 & 디자인 시스템

### 2-1. 컬러 토큰 (`assets/css/style.css :root`)
```css
:root{
  --paper:#FAF6EC; --paper-2:#F2EADA; --panel:#EFE6D2;
  --ink:#231B12; --ink-soft:#5B4E3E; --ink-faint:#8A7C68;
  --gold:#A8803C; --gold-deep:#82602A; --gold-soft:#C9A961; --gold-pale:#E7D6B2;
  --moss:#5E6A4D; --line:#E0D5BF;
}
```

### 2-2. 타이포그래피
| 용도 | 폰트 |
|---|---|
| 한글 제목/디스플레이 | **Nanum Myeongjo**(명조) |
| 한글 본문 | **Pretendard**(대체 Noto Sans KR) |
| 영문 라벨/장식 | **Cormorant Garamond** italic |
```html
<link href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
```

### 2-3. 공통 컴포넌트 (Claude Code가 재사용 컴포넌트로 구현)
- **Button**: `.btn-fill`(ink 배경), `.btn-out`(아웃라인), hover 시 골드 전환. radius 2px.
- **Card(제품)**: 1:1 썸네일 + 이름 + 가격(소비자가/판매가/할인가) + 별점. hover 시 미세 확대·상승.
- **SectionLabel**: 영문 대문자 + 자간 확대 + 골드.
- **Banner**: 배경 이미지(gen) + **텍스트는 HTML 오버레이**(이미지에 텍스트를 굽지 않음).
- **Placeholder 블록**: 실사 미배치 슬롯용. 따뜻한 톤 박스 + 라벨(슬롯명/파일명/권장크기).
- **모션**: 페이지 로드 staggered fade-up, 스크롤 reveal, 카드 hover. 과하지 않게.

---

## 3. 컴플라이언스 (제작 전 필수)

1. **효능 표현 금지** — 상황버섯(*P. baumii* 등)은 건강기능식품 원료가 아니므로 면역·항암·간·혈압 등 **기능성/치료/예방 표현 금지. 일반식품으로 포지셔닝** `[확실 — 기존 확인; 최종 표현 법률검토 권장]`. 허용: "정성으로 키운", "하루 한 잔의 꾸준함", "자연 그대로".
2. **거래처 직접 명시 금지** — 정관장/KGC 등 이름 노출 금지. "국내 유수 건강식품 기업에 원물을 공급해 온 재배 노하우" 식 간접 표현만 `[확정]`.
3. **후기** — 질병 치료·효능 체험담 노출 금지(모니터링).
4. **이미지** — AI로 만든 **가짜 제품/패키지컷 사용 금지**(실물과 다르면 표시광고 위반 소지). 제품은 실사만.

---

## 4. 사이트맵 & 라우팅

전역 헤더: 상단 공지바 + 로고 + GNB(제품 / OUR STORY / REVIEWS / COMMUNITY) + 유틸(검색·장바구니·로그인/마이페이지). 모바일 햄버거 드로어.

| 경로 | 페이지 | 구현 | 비고 |
|---|---|---|---|
| `index.html` | HOME | 풀디자인 | |
| `story.html` | OUR STORY | 풀디자인(에디토리얼) | |
| `products.html` | 제품 목록 | 풀디자인(그리드+필터) | |
| `product-detail.html` | 제품 상세 | 풀디자인 | 운영 시 Cafe24 상품모듈 |
| `reviews.html` | 후기 | 풀디자인 | |
| `community.html` | 커뮤니티 | 기본(탭) | |
| `cart/login/join/mypage.html` | 커머스 | 시안 stub | 운영 시 Cafe24 모듈 |
| `support.html` | 고객센터 | 기본 | |
| `terms/privacy/guide.html` | 정책/안내 | 텍스트 | 푸터 링크 |

> **요구사항:** 시안에서 모든 GNB·푸터 링크가 깨지지 않고 해당 페이지로 이동.

---

## 5. 페이지별 상세 빌드 사양

카피는 전부 `[샘플]`. 각 섹션: 구성요소 / 카피 / 이미지 슬롯 / 동작.

### 5-1. HOME (`index.html`)
1. **상단 공지바** — "전 상품 무료배송 · 5만원 이상 사은품"`[샘플]`
2. **히어로** — 2분할(좌 카피 / 우 배경). 라벨 `YEONCHEON · SANGHWANG` · 제목 "연천의 시간이 키운 / **금빛** 상황버섯" · 서브 "오랜 시간 정성으로 키운 원물을, 정직하게 담았습니다." · CTA `제품 보기`/`브랜드 이야기`. 배경 슬롯 **`GEN_HERO_BG`**(6-3 A).
3. **브랜드 인트로 스트립**(다크) — "좋은 원물은, 서두르지 않습니다." 배경 슬롯(선택) **`GEN_PROMO_BG`**.
4. **대표 제품 3** — Card×3. 썸네일 **`PHOTO_PROD_01~03`**(실사). 클릭 → product-detail.
5. **금빛농원의 약속(가치 4)** — 인라인 SVG 아이콘 + 텍스트: ①연천 청정 재배 ②오랜 재배 경력 ③깐깐한 선별 ④정직한 표기.
6. **브랜드 티저** — 좌 이미지/우 텍스트 → OUR STORY 유도. 이미지 **`GEN_CULTIVATION`**(6-3 C) 또는 실사 농장컷.
7. **신뢰 지표(숫자 3)** — "재배 N년 / 누적 출고 N / 재구매율 N%"`[샘플, 검증값만]`.
8. **후기 하이라이트 3** — 별점+요약. 포토(선택) 실사 후기.
9. **클로징 CTA / 뉴스레터** — 배경 **`GEN_NEWSLETTER_BG`**(6-3 I). 입력폼 시안 비동작.

### 5-2. OUR STORY (`story.html`)
- **스토리 히어로(와이드)** — 라벨 `OUR STORY` · "연천, 금빛을 키우는 땅". 배경 **`GEN_STORY_HERO`**(6-3 B).
- **블록1 재배 환경** — 좌 이미지/우 텍스트. **`GEN_CULTIVATION`** 또는 실사.
- **블록2 정성과 시간** — 좌우 반전. **`GEN_CRAFT_HANDS`**(6-3 D) 또는 실사 작업컷.
- **블록3 사람/철학** — 실사(대표/농장) 권장.
- **인용 밴드** — "서두르지 않고, 자연의 속도로."
- 하단 CTA → 제품.

### 5-3. 제품 목록 (`products.html`)
- 필터 칩: 전체/선물세트/단품`[샘플]`.
- 그리드(데스크톱 3~4열) Card×6`[샘플]`. 썸네일 **`PHOTO_PROD_01~06`**(실사).

### 5-4. 제품 상세 (`product-detail.html`)
- 좌: 메인 **`PHOTO_PDP_MAIN`** + 썸네일4 **`PHOTO_PDP_THUMB_1~4`**(전부 실사).
- 우: 제품명/별점/가격(소비자가·판매가·할인가)/옵션 select/수량/`장바구니`·`바로구매`(비동작)/배송·교환 안내.
- 하단 상세: 긴 상세컷 **`PHOTO_PDP_DETAIL`**(실사) + 탭(상품정보/배송/교환반품/후기).
- 상세설명은 원물·산지·보관·섭취 중심(효능 문구 금지).

### 5-5. REVIEWS (`reviews.html`)
- 평균 별점/건수 + 리뷰 리스트(별점/내용/작성자/날짜/포토). 효능 체험담 금지.

### 5-6. COMMUNITY (`community.html`)
- 탭: 공지사항 / Q&A / FAQ(아코디언). 리스트 UI.

### 5-7. 커머스 stub (`cart/login/join/mypage.html`)
- 디자인 톤만 유지한 **비동작 UI 셸**. 운영 시 Cafe24 모듈로 대체.

### 5-8. 고객센터 (`support.html`)
- CS번호/운영시간/이메일 + 문의폼 UI(비동작).

### 5-9. 푸터(전역)
- 로고 **`LOGO`** + CS번호/운영시간 / 메뉴 / SNS / 사업자정보(전부 `[샘플]`).

---

## 6. 이미지 파이프라인

### 6-1. 원칙 — 실사 vs AI 생성
- **실사(필수):** 제품·패키지·실제 농장/버섯컷 → `assets/img/photo/`.
- **GPT Image 2.0 생성:** 배경 플레이트·배너 바탕·무드/분위기·텍스처·추상 자연 → `assets/img/gen/`.
- **하이브리드(주의):** 실사 제품을 AI 배경에 합성하는 건 가능하나 **제품 묘사는 실물과 동일해야 함**.
- **배너 텍스트는 이미지에 굽지 않고 HTML/CSS로 오버레이**(수정·번역·접근성 유리).

### 6-2. 실사 자산 인벤토리(25장) + 슬롯 매핑(회신 요청)
원본=Google Drive. 아래 **embed URL은 시안 임시용**(운영 시 재호스팅).
`내용(작성)`을 비워 두었으니 아래 둘 중 하나로 회신: (A) `1=농장 전경 / 5=버섯 클로즈업 / 12=진액 30포 …`, (B) 슬롯 지정 `PHOTO_PROD_01=12 …`.

| # | 원본 | 시안용 embed URL (`sz=w1600`) | 내용(작성) |
|---|---|---|---|
| 01 | [원본](https://drive.google.com/file/d/1PqccpZ93zNDMzk9SkrW1xR_-fAVk7m4-/view) | `https://drive.google.com/thumbnail?id=1PqccpZ93zNDMzk9SkrW1xR_-fAVk7m4-&sz=w1600` |  |
| 02 | [원본](https://drive.google.com/file/d/1YvvUmHOcpkCSLaDIPXZIN7FI9J3nLqtI/view) | `https://drive.google.com/thumbnail?id=1YvvUmHOcpkCSLaDIPXZIN7FI9J3nLqtI&sz=w1600` |  |
| 03 | [원본](https://drive.google.com/file/d/1IxIHdAwpXN4cVjnL6ePYApFRLHkJKHvT/view) | `https://drive.google.com/thumbnail?id=1IxIHdAwpXN4cVjnL6ePYApFRLHkJKHvT&sz=w1600` |  |
| 04 | [원본](https://drive.google.com/file/d/1U6XV1GW23HTstlk1ZXDNZLAMiQoYdVNm/view) | `https://drive.google.com/thumbnail?id=1U6XV1GW23HTstlk1ZXDNZLAMiQoYdVNm&sz=w1600` |  |
| 05 | [원본](https://drive.google.com/file/d/1MiB1hFWAjUuowcZAtplbIAju_4Pvn9Cl/view) | `https://drive.google.com/thumbnail?id=1MiB1hFWAjUuowcZAtplbIAju_4Pvn9Cl&sz=w1600` |  |
| 06 | [원본](https://drive.google.com/file/d/1R5W5XZISRzgiL1tJJiM30sQZWQrp7QB7/view) | `https://drive.google.com/thumbnail?id=1R5W5XZISRzgiL1tJJiM30sQZWQrp7QB7&sz=w1600` |  |
| 07 | [원본](https://drive.google.com/file/d/105DIvM0V8kWOAlzef4yNGrp8GMQWMDxA/view) | `https://drive.google.com/thumbnail?id=105DIvM0V8kWOAlzef4yNGrp8GMQWMDxA&sz=w1600` |  |
| 08 | [원본](https://drive.google.com/file/d/1N8Lif1xLZtvMumhluxq4xKsFP1m-5Iit/view) | `https://drive.google.com/thumbnail?id=1N8Lif1xLZtvMumhluxq4xKsFP1m-5Iit&sz=w1600` |  |
| 09 | [원본](https://drive.google.com/file/d/1rUfctv1k4rDzS2ZM9gFgcr-WjvlM9nHv/view) | `https://drive.google.com/thumbnail?id=1rUfctv1k4rDzS2ZM9gFgcr-WjvlM9nHv&sz=w1600` |  |
| 10 | [원본](https://drive.google.com/file/d/1YM4pvJxT8k4571r_64gqwA_CBp_cqA0v/view) | `https://drive.google.com/thumbnail?id=1YM4pvJxT8k4571r_64gqwA_CBp_cqA0v&sz=w1600` |  |
| 11 | [원본](https://drive.google.com/file/d/19AXExo_VXc-R7DnVnlx1gFOMLVzKuOip/view) | `https://drive.google.com/thumbnail?id=19AXExo_VXc-R7DnVnlx1gFOMLVzKuOip&sz=w1600` |  |
| 12 | [원본](https://drive.google.com/file/d/1lD4ip4bxJzWCqeMqUTJmXTbxNLcyLqOA/view) | `https://drive.google.com/thumbnail?id=1lD4ip4bxJzWCqeMqUTJmXTbxNLcyLqOA&sz=w1600` |  |
| 13 | [원본](https://drive.google.com/file/d/1umrk9i5Uiw3wue7941Z2H6mS_Td7FayO/view) | `https://drive.google.com/thumbnail?id=1umrk9i5Uiw3wue7941Z2H6mS_Td7FayO&sz=w1600` |  |
| 14 | [원본](https://drive.google.com/file/d/16OuSiicebXf3uLwYRDOrm8Ba2nGaQSF2/view) | `https://drive.google.com/thumbnail?id=16OuSiicebXf3uLwYRDOrm8Ba2nGaQSF2&sz=w1600` |  |
| 15 | [원본](https://drive.google.com/file/d/1bow7qnZqoIZFcE8YU1hCIiB09OGOEaHL/view) | `https://drive.google.com/thumbnail?id=1bow7qnZqoIZFcE8YU1hCIiB09OGOEaHL&sz=w1600` |  |
| 16 | [원본](https://drive.google.com/file/d/1lxn2l0Khh2WwBWfA5BQOb_ihZ28obGol/view) | `https://drive.google.com/thumbnail?id=1lxn2l0Khh2WwBWfA5BQOb_ihZ28obGol&sz=w1600` |  |
| 17 | [원본](https://drive.google.com/file/d/1GRqE6uoZeNsDAOagbTXl2kU_1XKhDang/view) | `https://drive.google.com/thumbnail?id=1GRqE6uoZeNsDAOagbTXl2kU_1XKhDang&sz=w1600` |  |
| 18 | [원본](https://drive.google.com/file/d/15152tojqNySu8lJC1uhV1nCBfjHbL-l2/view) | `https://drive.google.com/thumbnail?id=15152tojqNySu8lJC1uhV1nCBfjHbL-l2&sz=w1600` |  |
| 19 | [원본](https://drive.google.com/file/d/13aXRzNiOicPa-S7-1fUPzMUO_rAI4C_4/view) | `https://drive.google.com/thumbnail?id=13aXRzNiOicPa-S7-1fUPzMUO_rAI4C_4&sz=w1600` |  |
| 20 | [원본](https://drive.google.com/file/d/1XIubZ5C7x7NCWeFv5YN4-utiBGA8WwZ9/view) | `https://drive.google.com/thumbnail?id=1XIubZ5C7x7NCWeFv5YN4-utiBGA8WwZ9&sz=w1600` |  |
| 21 | [원본](https://drive.google.com/file/d/1DQ0NqzT-8VOOLzKcFNgDzuyQJu2-WTTQ/view) | `https://drive.google.com/thumbnail?id=1DQ0NqzT-8VOOLzKcFNgDzuyQJu2-WTTQ&sz=w1600` |  |
| 22 | [원본](https://drive.google.com/file/d/1nzuU5OnKJmSCqtq7RxAf9FSn6YKDWLis/view) | `https://drive.google.com/thumbnail?id=1nzuU5OnKJmSCqtq7RxAf9FSn6YKDWLis&sz=w1600` |  |
| 23 | [원본](https://drive.google.com/file/d/1jyQe2xmKmtTwHYLcXi2rncYejWjOsMGZ/view) | `https://drive.google.com/thumbnail?id=1jyQe2xmKmtTwHYLcXi2rncYejWjOsMGZ&sz=w1600` |  |
| 24 | [원본](https://drive.google.com/file/d/1TYRfWlr8QVr0CwNiCVjHkYYKLjF4noR8/view) | `https://drive.google.com/thumbnail?id=1TYRfWlr8QVr0CwNiCVjHkYYKLjF4noR8&sz=w1600` |  |
| 25 | [원본](https://drive.google.com/file/d/179uBJFdLWv7HjZ-BOtFVPkBXmH_UtAu6/view) | `https://drive.google.com/thumbnail?id=179uBJFdLWv7HjZ-BOtFVPkBXmH_UtAu6&sz=w1600` |  |

> ⚠️ 운영 시 **Drive 직접 임베드 비권장** [높음] — CDN 아님·핫링크 제한·대용량 인터스티셜. **Cafe24 `SkinImg/` 또는 별도 호스팅으로 재호스팅**.

### 6-3. GPT Image 2.0 생성 자산 + 즉시 사용 프롬프트
- 엔진: **GPT Image 2.0**(힉스필드). 비율은 가로=1536×1024, 세로=1024×1536, 정사각=1024×1024 기준(최종 크롭은 CSS).
- 공통 네거티브: `no text, no logos, no watermark, no fake product packaging`.
- 공통 스타일 키: warm natural daylight, earthy ivory + deep brown palette, antique gold accents, soft film grain, editorial premium, photorealistic.
- **타사 사진 모사 금지** — 아래는 금빛농원 오리지널 아트디렉션 `[법리]`.

| 슬롯 | 용도 | 비율 |
|---|---|---|
| `GEN_HERO_BG` | HOME 히어로 배경 | 1536×1024 |
| `GEN_STORY_HERO` | STORY 상단 와이드 | 1536×1024 |
| `GEN_CULTIVATION` | 재배 환경 무드 | 1024×1536 |
| `GEN_CRAFT_HANDS` | 정성/작업 무드 | 1024×1536 |
| `GEN_LIFESTYLE` | 제품 합성용 연출 배경 | 1536×1024 |
| `GEN_GIFT_BANNER` | 선물세트 배너 바탕(다크) | 1536×1024 |
| `GEN_TEXTURE` | 섹션 배경 텍스처 | 1024×1024 |
| `GEN_PROMO_BG` | 인트로/공지 바탕 | 1536×1024 |
| `GEN_NEWSLETTER_BG` | 뉴스레터 바탕 | 1536×1024 |
| `GEN_ACCENT` | 보태니컬 포인트/디바이더 | 1024×1024 |

**프롬프트 (영문, 그대로 사용)**

- **A. GEN_HERO_BG** — `A serene Korean mountain valley farm at golden hour, low morning mist over forested hills, soft warm sunlight, quiet natural cultivation setting, cinematic wide landscape, muted earthy tones with golden light, editorial premium mood, film grain, photorealistic, highly detailed, no people, no text, no logos, no watermark.`
- **B. GEN_STORY_HERO** — `Wide cinematic landscape of forested low hills in rural Korea, early layered mist, calm timeless atmosphere, warm earthy color grade, fine film grain, premium editorial nature photography, photorealistic, no text, no watermark.`
- **C. GEN_CULTIVATION** — `Close-up of a natural mushroom cultivation environment on aged wooden logs in dappled forest light, moss and bark textures, soft shadows, earthy browns with muted gold highlights, macro editorial detail, photorealistic, calm premium mood, no branded products, no text, no watermark.`
- **D. GEN_CRAFT_HANDS** — `Hands gently inspecting dried natural ingredients in warm side light, rustic wooden table, neutral linen, shallow depth of field, earthy palette, artisanal sincere mood, editorial premium photography, photorealistic, face not visible, no text, no logos, no watermark.`
- **E. GEN_LIFESTYLE** — `Calm morning still-life on a warm wooden table: a simple ceramic cup, soft linen, a sprig of greenery, gentle window light, generous empty negative space on the right for product placement, earthy ivory and gold tones, editorial premium lifestyle photography, photorealistic, no branded packaging, no text, no watermark.`
- **F. GEN_GIFT_BANNER** — `Premium dark editorial background for a gift promotion: deep warm brown and near-black tones, a soft beam of golden light, subtle bokeh, refined luxurious, ample empty space for overlaid text, photorealistic, no text, no logos, no watermark.`
- **G. GEN_TEXTURE** — `Subtle organic paper texture in warm ivory and soft beige, very faint natural fiber detail, minimal, flat even lighting, seamless background, photorealistic, low contrast, no text, no watermark.`
- **H. GEN_PROMO_BG** — `Minimal warm gradient background, ivory to soft golden beige, faint organic texture, calm and clean, lots of empty space for text overlay, photorealistic, no text, no watermark.`
- **I. GEN_NEWSLETTER_BG** — `Soft-focus natural backdrop of warm out-of-focus foliage and golden light, dreamy calm atmosphere, earthy palette, generous empty space, editorial premium, photorealistic, no text, no watermark.`
- **J. GEN_ACCENT** — `A single delicate botanical element (a sprig or leaf) on a clean warm ivory background, minimal editorial still-life, soft shadow, earthy gold accent, generous negative space, photorealistic, no text, no watermark.`

**생성/다듬기 워크플로우**: 생성 → 검토 → 프롬프트 미세조정(조명·색·여백) → 변형/업스케일 → `assets/img/gen/`에 슬롯명으로 저장. (연결된 힉스필드로 이 대화에서 바로 생성 가능.)

### 6-4. 저작권 안전 원칙 `[법리]`
- 타사(좋은상황 등)의 **실제 사진 복제·모사 금지**(개별 사진은 저작물).
- '프리미엄 자연 건강식품' **장르의 일반적 연출 문법**을 바탕으로 **오리지널** 제작(스타일/장르 자체는 통상 저작권 대상 아님).
- 본 프롬프트는 특정 브랜드 모방을 지시하지 않음. *법률 자문 아님 — 필요 시 변호사 검토.*

### 6-5. 호스팅
- 시안: Drive embed(임시).
- 운영: 전 이미지 webp 변환 → Cafe24 `SkinImg/` 또는 CDN 재호스팅.

---

## 7. Claude Code 작업 체크리스트
- [ ] 프로젝트 스캐폴딩(1-2 구조), git init
- [ ] 전역 CSS 디자인 토큰(2-1) + 폰트(2-2)
- [ ] 공통 컴포넌트(2-3): 헤더/푸터/드로어/버튼/카드/배너/placeholder
- [ ] HOME(5-1) 전 섹션
- [ ] OUR STORY(5-2), 제품목록(5-3), 제품상세(5-4)
- [ ] REVIEWS(5-5), COMMUNITY(5-6), 커머스 stub(5-7), 고객센터(5-8)
- [ ] 정책/안내 페이지(terms/privacy/guide)
- [ ] 실사 슬롯(6-2) 연결 / 미배치는 placeholder
- [ ] GEN 이미지(6-3) 배치 + 배너 텍스트 HTML 오버레이
- [ ] 반응형(≥980 / <980 / <600), 접근성(alt·label·focus·대비)
- [ ] SEO(8) 메타·OG·사이트맵
- [ ] 전 페이지 링크 점검 → 커밋/PR

---

## 8. SEO / 접근성 / 성능
- 각 페이지 `<title>`·`meta description`·OG 태그.
- **네이버 서치어드바이저** 사이트 등록·사이트맵 제출(국내 검색 핵심). 좋은상황도 `naver-site-verification` 사용 [중간].
- 이미지 alt, 폼 label, 포커스 스타일, 명도 대비.
- 실사·GEN 이미지 webp + 적정 해상도, lazy-load.

---

## 9. Cafe24 이식 메모(운영 전환)
- 정적 HTML/CSS/JS를 **스마트디자인 스킨**으로 이식: 파일 `/design/skin/스킨명/`, 이미지 `SkinImg/`, 배포는 편집창/디자인 FTP, **수정 전 디자인 백업 필수** [확실].
- 커머스 영역(목록·상세·옵션·장바구니·회원·주문)은 **Cafe24 module/변수**로 교체(직접 개발 X) [확실].
- 본 시안의 HTML 구조·CSS·카피·이미지는 모듈 영역만 치환하면 대부분 재사용 가능.

---

## 10. 확정 필요 / 다음 단계
**확정 필요(`[샘플]` 교체):** 제품 라인업·구성·가격 / 회사정보(상호·대표·주소·사업자등록·통신판매신고) / CS·SNS / 슬로건 / 로고(투명 PNG).
**다음 단계:** (1) 6-2 이미지 매핑 회신 (2) 6-3 배너/배경 이미지 생성(힉스필드 GPT Image 2.0 — 이 대화에서 바로 가능) (3) Claude Code로 7장 체크리스트 빌드.

---
*v2.0 · 디자인/카피/구성은 제안·샘플이며 운영값 교체와 표시광고 컴플라이언스 검토가 필요합니다.*

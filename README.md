# 금빛농원 GEUMBIT FARM · 카페24 풀커스텀 스킨

연천 한탄강의 가족 농원 **금빛농원**의 자사몰(카페24) 1차 MVP 스킨.

설계서 v1.0 — *깊은 자연을 달여낸 금빛 정성*. 모바일 우선, Onyx · Gold · Walnut · Ivory 톤. 상품 5종(원물·슬라이스·혼합세트·진액·발효액) + 옵션 구성.

```
cafe24-skin/     카페24 스마트디자인 스킨 (업로드 대상)
preview/         로컬 시안 빌더 + 스크린샷 (디자인 검토용)
```

## 빠른 배포

```bash
cd cafe24-skin
./build-zip.sh
# → ../geumbit-skin-YYYYMMDD-HHMM.zip 생성
# → 카페24 어드민 → 디자인 → 스킨 관리 → 업로드
```

배포 절차·어드민 후속 작업·미결 항목(M3~M6 도메인·배송비·로고·촬영) 정리는 [`cafe24-skin/README.md`](./cafe24-skin/README.md) 참고.

## 시안 미리보기

```bash
node preview/build.mjs           # 정적 HTML 생성
node preview/screenshot.mjs      # 모바일·PC 스크린샷 (Playwright)
```

`preview/*.png` — 홈 / 상품목록 / 상품상세 × 모바일·PC.

## 디자인 시스템 요약

| 토큰 | HEX | 비중 | 용도 |
|---|---|---|---|
| Onyx | `#11100D` | 34% | 히어로·푸터·고급 배경 |
| Ivory | `#F7E8CD` | 26% | 본문 배경·여백 |
| Walnut | `#3A2115` | 20% | 목재 톤 배경·제목 |
| Gold | `#D8AA4B` | 13% | 로고·CTA·금박 포인트 |
| Amber | `#6E2A12` | 5% | 진액·할인 강조 |
| Brass | `#C9A15A` | 2% | 구분선·얇은 테두리 |

- 본문: **Pretendard** · 제목: **Noto Serif KR** · 영문 장식: **Cormorant Garamond**
- 가격: 빨강 대신 amber 톤, 취소선 정가 + 굵은 판매가 (설계서 §2.5)

## 콘텐츠 가이드

- 질병명·치료·면역 보장 표현 **금지** (식품표시광고법 §7)
- B2B 거래처(정관장 등) 직접 명시 **금지**
- 전자상거래 필수표기 — 푸터 변수가 카페24 운영자 정보에서 자동 반영

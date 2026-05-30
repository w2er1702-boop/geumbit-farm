# 시안 프리뷰

카페24 스킨(`cafe24-skin/`)의 템플릿 태그(`<!--@layout-->`, `{$var}` 등)는 카페24 서버에서만 치환된다. 로컬에서 디자인을 미리 보기 위한 정적 빌더와 스크린샷 도구.

## 사용

```bash
# 1) cafe24-skin 의 layout+page 를 합쳐 정적 HTML 빌드
node preview/build.mjs

# → preview/home.html, product-list.html, product-detail.html, story.html

# 2) (선택) Playwright 로 풀페이지 스크린샷
#    Playwright 가 /tmp/preview-tools 에 설치되어 있어야 한다.
node preview/screenshot.mjs

# → preview/{home,list,detail}-{mobile,pc}.png
```

`build.mjs`의 `VARS` 객체에 샘플 값(상호명·전화번호 등)이 들어 있다. 운영 시 카페24 어드민의 "내 쇼핑몰 정보"가 자동 채워주므로 프리뷰 외엔 의미 없다.

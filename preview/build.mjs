// 카페24 스킨 → 정적 시안 사이트 빌더
// 1) 카페24 템플릿 태그를 샘플 값으로 치환
// 2) layout + page 본문 합쳐 정적 HTML 생성
// 3) self-contained 디렉토리(preview/site/)에 css/js 복사 → GitHub Pages 배포 가능

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKIN = path.join(__dirname, '..', 'cafe24-skin');
const OUT_LEGACY = __dirname;                 // 기존 preview/*.html (스크린샷용)
const SITE = path.join(__dirname, 'site');    // 배포용 self-contained

const read = (p) => fs.readFileSync(path.join(SKIN, p), 'utf8');

const VARS = {
  mall_name: '금빛농원 GEUMBIT FARM',
  mall_description: '경기 연천, 한탄강 자락의 가족 농원. 정성껏 기른 상황버섯을 금빛농원의 기준으로 귀하게 전합니다.',
  company_name: '금빛농원(한여울바이오밸리)',
  president_name: '대표자명',
  company_number: '000-00-00000',
  online_order_business_number: '제0000-경기연천-0000호',
  company_address: '경기도 연천군 한탄강로 000',
  email: 'contact@geumbitfarm.kr',
  customer_service_tel: '031-000-0000',
  customer_service_time: '평일 10:00–17:00 (점심 12:30–13:30)',
  basket_count: '0',
  category_name: '상품 전체',
  category_description: '용도와 일상에 맞춰 결을 고르세요. 원물·슬라이스·혼합세트·진액·발효액.',
  product_count: '5',
};

function resolveVars(html) {
  html = html.replace(/\{\$(\w+)\|default:'([^']*)'\}/g, (_, k, def) => VARS[k] ?? def);
  html = html.replace(/\{\$(\w+)\}/g, (_, k) => VARS[k] ?? '');
  return html;
}
function resolveImports(html) {
  return html.replace(/<!--@import\(([^)]+)\)-->/g, (_, p) => {
    const sub = read(p.replace(/^\//, ''));
    return resolveVars(sub);
  });
}
// mode: 'legacy' (preview/ 절대경로 → ../cafe24-skin/css/...)
//       'site'   (preview/site/ 상대경로 → css/..., js/...)
function resolveCssJs(html, mode) {
  const cssBase = mode === 'site' ? '' : '../cafe24-skin';
  const jsBase  = mode === 'site' ? '' : '../cafe24-skin';
  html = html.replace(/<!--@css\(([^)]+)\)-->/g,
    (_, p) => `<link rel="stylesheet" href="${cssBase}${p.split('?')[0]}" />`);
  html = html.replace(/<!--@js\(([^)]+)\)-->/g,
    (_, p) => `<script src="${jsBase}${p.split('?')[0]}"></script>`);
  return html;
}

function buildPage({ src, outLegacy, outSite }) {
  let body = read(src).replace(/<!--@layout\([^)]+\)-->\s*/g, '');
  body = resolveVars(body);

  function compose(mode) {
    let layout = read('layout/basic/layout.html');
    layout = resolveImports(layout);
    layout = resolveCssJs(layout, mode);
    layout = layout.replace('{$layout_module_content}', () => body);
    layout = resolveVars(layout);
    layout = layout.replace(
      '<!-- jQuery는 카페24가 기본 로드. 추가 스킨 스크립트만 연결 -->',
      '<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>'
    );
    return layout;
  }

  fs.writeFileSync(path.join(OUT_LEGACY, outLegacy), compose('legacy'));
  fs.writeFileSync(path.join(SITE, outSite), compose('site'));
  console.log('✓', outLegacy, '/', outSite);
}

// site/ 디렉토리 준비
fs.rmSync(SITE, { recursive: true, force: true });
fs.mkdirSync(SITE, { recursive: true });
fs.mkdirSync(path.join(SITE, 'css'), { recursive: true });
fs.mkdirSync(path.join(SITE, 'js'),  { recursive: true });

// css/js 복사
for (const f of ['tokens.css', 'style.css']) {
  fs.copyFileSync(path.join(SKIN, 'css', f), path.join(SITE, 'css', f));
}
fs.copyFileSync(path.join(SKIN, 'js', 'script.js'), path.join(SITE, 'js', 'script.js'));

// 페이지 빌드
buildPage({ src: 'main/index.html',     outLegacy: 'home.html',           outSite: 'index.html' });
buildPage({ src: 'product/list.html',   outLegacy: 'product-list.html',   outSite: 'product-list.html' });
buildPage({ src: 'product/detail.html', outLegacy: 'product-detail.html', outSite: 'product-detail.html' });
buildPage({ src: 'main/story.html',     outLegacy: 'story.html',          outSite: 'story.html' });

// .nojekyll (GitHub Pages가 _로 시작하는 파일을 무시하지 않도록)
fs.writeFileSync(path.join(SITE, '.nojekyll'), '');

console.log('\n→ preview/site/ 준비 완료 (GitHub Pages 배포 대상)');

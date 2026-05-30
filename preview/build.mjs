// 카페24 스킨 → 정적 프리뷰 HTML 빌더
// layout.html + _header.html + _footer.html + 페이지 본문을 합치고
// 카페24 템플릿 태그를 샘플 값으로 치환한다.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKIN = path.join(__dirname, '..', 'cafe24-skin');
const OUT = __dirname;

const read = (p) => fs.readFileSync(path.join(SKIN, p), 'utf8');

// 샘플 값 — 카페24 운영자 정보가 어드민에 들어가면 자동 채워진다.
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
  // {$var|default:'fallback'}
  html = html.replace(/\{\$(\w+)\|default:'([^']*)'\}/g, (_, k, def) => VARS[k] ?? def);
  // {$var}
  html = html.replace(/\{\$(\w+)\}/g, (_, k) => VARS[k] ?? '');
  return html;
}

function resolveImports(html) {
  // <!--@import(/layout/basic/_header.html)-->
  return html.replace(/<!--@import\(([^)]+)\)-->/g, (_, p) => {
    const sub = read(p.replace(/^\//, ''));
    return resolveVars(sub);
  });
}

function resolveCssJs(html) {
  // <!--@css(/css/style.css?ver=...)-->  →  <link rel="stylesheet" href="...">
  html = html.replace(/<!--@css\(([^)]+)\)-->/g,
    (_, p) => `<link rel="stylesheet" href="../cafe24-skin${p.split('?')[0]}" />`);
  // <!--@js(...)-->  →  <script src="...">
  html = html.replace(/<!--@js\(([^)]+)\)-->/g,
    (_, p) => `<script src="../cafe24-skin${p.split('?')[0]}"></script>`);
  return html;
}

function buildPage(pageRelPath, outName) {
  // 페이지 본문(@layout 선언 제거)
  let body = read(pageRelPath).replace(/<!--@layout\([^)]+\)-->\s*/g, '');
  body = resolveVars(body);

  // 레이아웃에 본문 주입 (반드시 resolveVars 전에 — 그렇지 않으면 placeholder가 먹힌다)
  let layout = read('layout/basic/layout.html');
  layout = resolveImports(layout);
  layout = resolveCssJs(layout);
  // $ 특수문자가 replacement-string으로 해석되는 것을 피해 함수형 replace 사용
  layout = layout.replace('{$layout_module_content}', () => body);
  layout = resolveVars(layout);

  // jQuery는 카페24가 기본 로드. 프리뷰에선 CDN으로.
  layout = layout.replace(
    '<!-- jQuery는 카페24가 기본 로드. 추가 스킨 스크립트만 연결 -->',
    '<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>'
  );

  // 모듈 영역 안의 placeholder 변수({$product_name} 등)는 빈 값으로 떨어지면
  // 텍스트로 보이지 않게 — 이 페이지는 정적 placeholder 카드가 따로 있어서 OK.

  const outPath = path.join(OUT, outName);
  fs.writeFileSync(outPath, layout);
  console.log('✓', outName, '←', pageRelPath);
}

buildPage('main/index.html', 'home.html');
buildPage('product/list.html', 'product-list.html');
buildPage('product/detail.html', 'product-detail.html');
buildPage('main/story.html', 'story.html');

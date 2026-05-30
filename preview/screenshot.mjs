import { chromium } from '/tmp/preview-tools/node_modules/playwright/index.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const targets = [
  { file: 'home.html',           name: 'home' },
  { file: 'product-list.html',   name: 'list' },
  { file: 'product-detail.html', name: 'detail' },
];
const viewports = [
  { name: 'mobile', width: 390,  height: 844  },
  { name: 'pc',     width: 1280, height: 900  },
];

const browser = await chromium.launch();
for (const t of targets) {
  for (const v of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: v.width, height: v.height },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    const url = 'file://' + path.join(__dirname, t.file);
    await page.goto(url, { waitUntil: 'networkidle' });
    // reveal 애니메이션 끝나도록 잠시 대기
    await page.waitForTimeout(800);
    // 모든 [data-reveal] 강제 표시 (스크린샷에서 페이드 중간 상태 방지)
    await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
    });
    await page.waitForTimeout(300);
    const out = path.join(__dirname, `${t.name}-${v.name}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log('✓', `${t.name}-${v.name}.png`);
    await ctx.close();
  }
}
await browser.close();

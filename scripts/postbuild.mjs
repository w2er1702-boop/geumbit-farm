// Move default-locale (Korean) build output from /out/ko/* to /out/ so that
// "/" serves Korean directly while "/en" and "/zh" remain as subdirectories.
import { promises as fs } from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('out');
const koDir = path.join(outDir, 'ko');

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(s, d);
    } else {
      await fs.copyFile(s, d);
    }
  }
}

async function main() {
  if (!(await exists(outDir))) {
    console.warn('[postbuild] out/ not found — skipping');
    return;
  }
  if (!(await exists(koDir))) {
    console.warn('[postbuild] out/ko not found — skipping');
    return;
  }

  await copyDir(koDir, outDir);
  await fs.rm(koDir, { recursive: true, force: true });

  // Required by GitHub Pages so Jekyll does not strip _next/
  await fs.writeFile(path.join(outDir, '.nojekyll'), '');

  console.log('[postbuild] Moved /ko/* -> /, created .nojekyll');
}

main().catch((err) => {
  console.error('[postbuild] failed:', err);
  process.exit(1);
});

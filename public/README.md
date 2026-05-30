# Static asset slots

This folder is what `next build` ships as-is under the site root. Every
file referenced from a CSS placeholder or a `FIXME(unverified)` block in
the codebase has its slot listed here. Drop the correctly-named file in
the right folder and the placeholder code will switch over without any
further changes.

> Naming matters. The codebase references the exact paths below; do not
> rename. If you have a different size or format, transcode/resize first.

## Open Graph

| Path | Spec | Used by |
|---|---|---|
| `og-default.svg` | 1200×630, brand-toned SVG fallback (currently shipped) | All pages via `lib/seo.ts::buildPageMetadata` |
| `og-default.jpg` | 1200×630, real photo composite (optional, takes priority once swapped in `lib/seo.ts`) | Override path in `lib/seo.ts::buildPageMetadata` to switch |

## Home & Farm hero

| Path | Spec | Used by |
|---|---|---|
| `farm/hero.jpg` | ≥ 2400×1500, landscape, drone-style or wide shot of the Hantangang growing site | `components/HeroSection.tsx`, `app/[locale]/farm/page.tsx` (currently CSS placeholders) |
| `farm/farm-1.jpg` … `farm/farm-6.jpg` | Each ≥ 1200×1500 (portrait 4:5), gallery tiles | `app/[locale]/farm/page.tsx` gallery |

## Product imagery

One image per product, square crop, ≥ 1200×1200. The filename must match
the `slug` field in `data/products.json`:

| Slug | Path |
|---|---|
| `oak-sanghwang-30g` | `products/oak-sanghwang-30g.jpg` |
| `oak-sanghwang-100g` | `products/oak-sanghwang-100g.jpg` |
| `golden-sanghwang-slice-250g` | `products/golden-sanghwang-slice-250g.jpg` |
| `golden-sanghwang-whole-250g` | `products/golden-sanghwang-whole-250g.jpg` |
| `golden-sanghwang-jinaek` | `products/golden-sanghwang-jinaek.jpg` |
| `sanghwang-set-500g` | `products/sanghwang-set-500g.jpg` |
| `golden-sanghwang-whole-500g` | `products/golden-sanghwang-whole-500g.jpg` |
| `golden-sanghwang-slice-500g` | `products/golden-sanghwang-slice-500g.jpg` |
| `golden-sanghwang-fermented` | `products/golden-sanghwang-fermented.jpg` |

`ProductImage` (`components/ProductImage.tsx`) already shows a 桑黃
fallback if the file is missing, so missing one product won't crash —
but missing all of them looks empty in production.

## Certifications

Add real certificates only after the operator confirms them. Each entry
in `data/certifications.json` may reference:

- `image` → `certifications/<id>.jpg` (or `.png`)
- `pdf` → `certifications/<id>.pdf` (optional)

Leaving `data/certifications.json` as `[]` is the safe state.

## When you swap an asset in

1. Drop the file at the path above.
2. If you replaced a CSS placeholder (hero/gallery), remove the
   surrounding `FIXME(unverified)` block and put back the `next/image`
   call shown in the file's git history.
3. Re-run `npm run build`. The static export should now ship the asset.

## Notes

- `output: 'export'` + `images.unoptimized: true` means Next does not
  resize images at build time. Pre-process to the spec above.
- `basePath: '/geumbit-farm'` is applied automatically by `next/image`
  for production builds, so author paths should always start with `/`
  (e.g. `/farm/hero.jpg`), never the full GitHub Pages URL.

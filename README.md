# FIGHURS — site rebuild

Animated magazine site for [fighurs.com](https://fighurs.com): editorial homepage, Kargo-style archive, and PDF flip readers for every issue.

## Run locally

```bash
export PATH="$HOME/.local/node/bin:$PATH"
cd ~/Desktop/fighurs-site
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## What’s included

| Route | Purpose |
| --- | --- |
| `/` | Animated homepage (scroll storytelling + marquee figures) |
| `/magazine` | Asymmetric works grid inspired by kargo-studio.com/works |
| `/magazine/:slug` | Flip-book reader powered by PDF.js + page-flip |
| `/shop` | Print issue list with links to digital + original shop |
| `/about` | Brand / mission |

## Issue PDFs

PDFs are symlinked from `~/Downloads` into `public/issues/`:

- `makenna.pdf` ← Mak1mppppw.pdf
- `eddie-cole.pdf` ← EDDIE-FINAL-2.pdf
- `isaiah-collins.pdf` ← vol-4.pdf
- `nyfw-ss26.pdf` ← NYFW-ISSUE-1.pdf
- `masue-kamara.pdf` ← masue-editone.pdf
- `iconikki.pdf` ← final-nikki-1.pdf
- `juhm.pdf` ← JUHM-done.pdf

**Note:** `vol-4.pdf` and `NYFW-ISSUE-1.pdf` appear to contain the same embedded images. If NYFW or Isaiah looks wrong in the flip book, re-export the correct PDF and replace the symlink.

## Stack

Vite + React + TypeScript, GSAP, Lenis, PDF.js, react-pageflip.

# Notes: karthikmudunuri/portfolio-template

Source: https://github.com/karthikmudunuri/portfolio-template (reviewed May 15, 2026)

## Purpose
- Minimalist developer portfolio template with rich animated UI components (Eldora UI).
- Built as a reusable template/demo showcasing animated titles, backgrounds, and interactive overlays.

## High-level tech stack
- Next.js (app dir, Next 14+ conventions)
- React + TypeScript
- Tailwind CSS
- Framer Motion (core animation primitives)
- GSAP (used for timeline/preloader animations)
- Blobity (cursor/magnetic blob implementation via bundled class)
- Utility libs: lodash/throttle, kinet (types included), react-intersection-observer, react-icons

## Key folders & files
- `app/` — main Next.js app structure
  - `app/page.tsx` — composes `Hero`, `About`, `Work`, `Tools`, `Contact`, `Footer` and initializes `useBlobity`, `PreLoader`, overlays
  - `app/layout.tsx`, `globals.css`, `tailwind.config.js`, `next.config.js`
  - `app/sections/` — top-level sections (Hero, About, Work, Tools, Contact, NavBar, Footer)
  - `app/components/` — reusable components
    - `background/` — `HeroBackground.tsx`, `ContactBackground.tsx` (video backgrounds)
    - `blobity/` — `Blobity.ts` (class), `useBlobity.ts` hook, `types.d.ts` (kinet typings)
    - `overlay/` — `Blur.tsx`, `Grain.tsx`, `Color.tsx` (visual overlays)
    - `work/` — `ProjectGrid`, `ProjectCard`, `projectDetails.ts` (project metadata)
    - `other/PreLoader.tsx` — GSAP preloader timeline
  - `app/animations/` — small animation primitives used site-wide
    - `AnimatedTitle.tsx`, `AnimatedBody.tsx`, `AnimatedWords.tsx`, `AnimatedLetters.tsx`, `Animated.tsx`, `AnimatedTools.tsx`
    - Pattern: split text into words/chars and animate with framer-motion + intersection observer

- `public/` — assets (hero.mp4, contact.mp4, metadata.jpg, 404.gif, project images)
- `README.md` — usage, features, and quick start (npm install, npm run dev)
- `LICENSE` — MIT

## Notable implementation patterns
- Animated text components
  - `AnimatedTitle` / `AnimatedBody` / `AnimatedWords` / `AnimatedLetters`:
    - Use `framer-motion`'s `useAnimation`, `motion`, and `useInView`.
    - Break content into words and characters; stagger children with `delayChildren` / `staggerChildren`.
    - Provide `delay` prop to sequence animations across sections.
- Backgrounds
  - `HeroBackground` and `ContactBackground` are simple client components rendering a looping `<video>` plus gradient overlays.
- Preloader
  - `PreLoader.tsx` uses GSAP timelines to animate intro text and then reveal the page (also toggles `overflowY` on body).
- Cursor / Magnetic Blob
  - `Blobity` class implements a canvas-based blob cursor with `Kinet` for physics; `useBlobity` hook instantiates it on mount.
- Container component
  - A custom `Container` provides CSS variable-driven sizing/positioning and integrates a `Grain` overlay and other visual helpers.
- Overlays
  - `Blur`, `Grain`, and `Color` components are used as fixed overlays to control atmosphere and readability.
- Component composition
  - Sections are composed from small animation primitives (AnimatedTitle/Body) and reusable UI components (ProjectCard, Container).

## Dependencies & dev notes
- `package.json` includes Framer Motion, Tailwind, GSAP, Kinet (or types), react-intersection-observer, react-icons.
- `tailwind.config.js` is configured for the `app/**/*` content and extends colors and utilities.
- `next.config.js` uses `appDir: true` experimental flag, optimizes fonts, and allows raw.githubusercontent.com in images.

## Useful files to reference when re-implementing patterns
- Animated text: `app/animations/AnimatedTitle.tsx`, `AnimatedBody.tsx`, `AnimatedWords.tsx`, `AnimatedLetters.tsx`.
- Background video pattern: `app/components/background/HeroBackground.tsx`, `ContactBackground.tsx`.
- GSAP preloader example: `app/components/other/PreLoader.tsx`.
- Blobity cursor: `app/components/blobity/Blobity.ts` and `useBlobity.ts` (shows how to bundle a custom DOM-driven effect).
- Project metadata & cards: `app/components/work/projectDetails.ts` and `ProjectCard.tsx` (layout & animated title usage).

## Recommended reuse guidance
- For animated titles/bodies: reuse `AnimatedTitle` & `AnimatedBody` patterns (split words/chars; framer-motion variants; `useInView`).
- For hero backgrounds: prefer `HeroBackground` video + gradient overlay; swap to image if video heavy.
- For cursor/magnetic interactions: copy `Blobity` only if licensing and bundle size acceptable; it relies on `Kinet` and custom canvas code.
- For preloader or page-intro timelines: GSAP timeline from `PreLoader.tsx` is a self-contained example.

## License
- MIT (see repository `LICENSE`)

---

(Notes generated automatically by review on 2026-05-15.)

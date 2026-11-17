---
inclusion: always
---

# Technology

The console is a Vite single-page app on Node 22.

## Stack

- TypeScript and React for the UI
- Three.js, `@react-three/fiber`, and `@react-three/drei` for the night-shift city
- Vitest for unit tests of the summarizer
- One global stylesheet and system fonts
- npm scripts: `dev`, `test`, `build`, `preview`, `guard`

## Rules for new code

- Prefer pure functions for text. `summarizeJobNote` must stay deterministic and free of `fetch`, storage, and clocks.
- Do not add a backend, a database, or a paid API.
- Do not put a visitor key, token, or password in source, tests, steering, or logs. The desk may store a key only under the `localStorage` name `hollow-pines.night-shift.visitor-key`.
- Do not import remote fonts, models, or textures. Build the lot from simple meshes.
- Keep `.env` gitignored. Never gitignore `/.kiro`.
- `npm run build` must keep passing on Node 22. It typechecks with `tsc --noEmit`, then runs `vite build`.

## Summarizer contract

`summarizeJobNote` returns `summary`, `clientDraft`, `topic`, `followUp`, `sent`, and `notice`. `sent` is always `false`. The client draft drops internal-only sentences. Passing `visitorKeyStored: true` may change `notice` only.

## Browser support

The demo targets current Chrome. If WebGL is missing, show the flat lot and keep the board and desk usable.

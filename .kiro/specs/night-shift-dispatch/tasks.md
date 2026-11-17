# Implementation Plan: Night-Shift Dispatch

## Overview

Specs and steering land first. Implementation follows the design: sample roster, pure summarizer and tests, then the three console surfaces, then the production build. Optional follow-ups stay open for the owner to continue in Kiro.

## Tasks

- [ ] 1. Record the Kiro spec, steering, and repo guard
  - Write `requirements.md`, `design.md`, and this task list under `/.kiro/specs/night-shift-dispatch/`
  - Write `product.md`, `tech.md`, and `structure.md` under `/.kiro/steering/` with `inclusion: always`
  - Add a v1 hook at `/.kiro/hooks/` that runs the repo guard on file save
  - Add `LICENSE` (Apache-2.0, Copyright 2026 Dylan Green) and a `.gitignore` that ignores `.env` and does not ignore `/.kiro`
  - _Requirements: 6.2, 6.3, 7.1, 7.2, 7.3_

- [ ] 2. Add the Hollow Pines sample roster
  - Define the six departments, status colors, activity log, sample beats, and the built-in on-site note
  - Keep every name and ticket fictional
  - _Requirements: 1.4, 2.2, 6.1_

- [ ] 3. Implement and test the local job-note summarizer
  - [ ] 3.1 Write Vitest coverage for empty input, determinism, length, internal-sentence filtering, redaction, and the visitor-key flag
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.2_
  - [ ] 3.2 Implement `summarizeJobNote` as a pure template with `sent: false` and no network
    - _Requirements: 4.1, 4.2, 4.3, 5.2_

- [ ] 4. Build the night-shift city
  - Render department buildings, status lights, and click-to-select in React Three Fiber
  - Fall back to a flat lot when WebGL is missing or the canvas errors
  - _Requirements: 1.1, 1.2, 1.3, 3.2_

- [ ] 5. Build the dispatch board
  - Show the roster, status labels, activity log, and sample-night step control
  - Highlight the selected department and its log lines
  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.3_

- [ ] 6. Build the job-note desk
  - Paste a note, load the sample note, and show the summary plus client-safe draft
  - Store an optional visitor key only in `localStorage`, with a clear action
  - State on the page that nothing is sent
  - _Requirements: 4.5, 5.1, 5.3, 5.4_

- [ ] 7. Wire the console shell, README, and verify
  - Compose city, board, and desk in one night-shift layout
  - Document how to run, the fictional contest demo, and how Kiro specs, steering, and hooks are used
  - Pass `npm test` and `npm run build` on Node 22
  - _Requirements: 6.4, 6.5_

- [ ] 8. Optional: visual pass in Kiro
  - After a local demo, adjust lantern colors, building positions, and copy in a Kiro session
  - Keep sample data only, and keep `/.kiro` committed
  - _Requirements: 1.2, 7.1_

- [ ] 9. Optional: decide on a provider later
  - This build does not call a provider
  - If a later Kiro task adds one, it must be opt-in, must read the visitor key from `localStorage` at call time, and must never commit the key
  - _Requirements: 5.1, 5.2_

## Notes

- Tasks 1 through 7 are the contest console. Tasks 8 and 9 stay open so the owner can finish them in Kiro.
- Do not deploy, merge, or change repository visibility as part of these tasks.

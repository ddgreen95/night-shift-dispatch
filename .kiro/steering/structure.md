---
inclusion: always
---

# Structure

Keep the repo small and easy to open in Kiro.

```text
.kiro/specs/night-shift-dispatch/   requirements, design, tasks
.kiro/steering/                     product, tech, structure
.kiro/hooks/                        v1 hook JSON
scripts/check-repo-guards.mjs       .env ignored, .kiro tracked
src/data/sampleRoster.ts            fictional roster, beats, sample note
src/summarizer/                     pure template and Vitest file
src/components/                     city, board, desk
src/App.tsx                         selected department and sample beat
src/styles.css                      night-shift theme
```

## Naming

- React components are `PascalCase.tsx`.
- The summarizer and roster are camelCase TypeScript modules.
- Department ids are kebab-case and stable: `night-dispatcher`, `ticket-triage`, `parts-runner`, `invoice-drafter`, `callback-keeper`, `review-requests`.
- CSS classes are kebab-case.

## Imports

UI components may import the roster and the summarizer. The summarizer must not import React or the roster. Tests import only the summarizer.

## State

`App` owns `selectedId` and `beatIndex`. The city and the board both call `onSelect`. The desk does not change the roster. Sample beats replace statuses and the log in one step. Do not fetch new beats.

## Docs

Speak in plain language in steering files. Use fictional Hollow Pines examples only. Do not paste secrets into specs, even as placeholders that look real.

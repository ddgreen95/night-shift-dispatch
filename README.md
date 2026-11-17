# Night-Shift Dispatch

Night-Shift Dispatch is a Chrome console for a fictional overnight shift at Hollow Pines Home Repair. It stitches three views of the same sample roster:

- a small 3D night-shift city of shop departments
- a 2D dispatch board with idle, working, and waiting-for-a-human-yes states, plus a recent-activity log
- a job-note desk that turns a pasted on-site note into a short summary and a client-safe draft

All of the code in this repository is new as of November 2026. The shop, the agents, and the tickets are sample data for the Kiroween 2026 hackathon (Frankenstein category).

## How to run

Requires Node 22.

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

```bash
npm test
npm run build
npm run guard
```

`npm test` runs the Vitest suite for the local summarizer. `npm run build` typechecks with `tsc` and produces `dist/`. `npm run guard` checks that `.env` is gitignored and `/.kiro` is tracked.

No API key is required. The desk uses a deterministic template on this machine. An optional visitor key can be saved in `localStorage` only. This build does not send, post, or bill.

## Contest demo (fictional data)

1. Start the dev server and open the console. The opening beat is **02:14 · opening watch**.
2. Click the tall **Lantern Tower** in the city (Night Dispatcher). The dispatch board highlights that card and its log lines. Click a card to highlight it back. Click the ground to clear the selection.
3. Press **Step sample night**. The canned script moves to 02:21, when Ticket Triage has a human yes, then to 02:36, when the sample wax-ring kit is on the truck. Nothing is loaded from a network.
4. On the job-note desk, press **Load sample note**, then **Summarize locally**.
5. Read the summary, then the client-safe draft. The sample note contains an internal line about a cracked flange. That line is held out of the draft. The page states that nothing was sent.
6. Optional: open **Optional visitor key**, save any string, and summarize again. The wording of the summary does not change. The notice says the key stayed in this browser and was not sent. Press **Clear stored key** when you are done. Do not commit a key.

If WebGL is unavailable, the city becomes a flat lot of the same six departments. The board and the desk still work.

## How Kiro is used

This repo is meant to be finished in Kiro. The plan was written spec-first, in the Requirements-First shape documented at [kiro.dev](https://kiro.dev/docs/specs/feature-specs/requirements-first/):

- `/.kiro/specs/night-shift-dispatch/requirements.md` — user stories and EARS acceptance criteria (`WHEN` / `THE SYSTEM SHALL`)
- `/.kiro/specs/night-shift-dispatch/design.md` — architecture, data model, and the local summarizer contract
- `/.kiro/specs/night-shift-dispatch/tasks.md` — the implementation checklist. Completed tasks are checked. Optional follow-ups stay open on purpose
- `/.kiro/steering/product.md`, `tech.md`, and `structure.md` — always-included project steering (`inclusion: always`)
- `/.kiro/hooks/repo-guard.json` — a v1 `PostFileSave` hook that runs `scripts/check-repo-guards.mjs`

Those spec files were authored before the console code. The app implements tasks 1–7 so the demo runs. Tasks 8 and 9 are still open: a visual pass, and any later decision about an opt-in provider. The owner should continue that work in Kiro. Do not treat this repository as a finished product deployment.

`/.kiro` is committed and must not be gitignored. `.env` files are gitignored. There are no secrets in the tree.

## Sample roster

| Agent | Building | Opening status |
| --- | --- | --- |
| Night Dispatcher | Lantern Tower | Working |
| Ticket Triage | Intake Cottage | Waiting for a human yes |
| Parts Runner | Parts Shed | Working |
| Invoice Drafter | Ledger Loft | Idle |
| Callback Keeper | Bell Porch | Idle |
| Review Requests | Thank-You Post | Waiting for a human yes |

## License

Apache-2.0. Copyright 2026 Dylan Green. See [LICENSE](LICENSE).

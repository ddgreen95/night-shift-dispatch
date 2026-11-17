# Requirements Document

## Introduction

Night-Shift Dispatch is a Chrome web app for the fictional home-service shop Hollow Pines Home Repair. It is a Kiroween 2026 demo in the Frankenstein category: one night-shift console that stitches a small 3D department city, a 2D dispatch board, and a job-note desk.

The owner watches a sample roster during a fictional overnight shift. Every name, ticket, and note in the console is sample data. The desk summarizes a pasted on-site note on this machine. The default summarizer is a deterministic local template. A visitor may store an optional key in `localStorage` for a later Kiro iteration. This build does not send, post, or bill anything.

### Glossary

- **Owner**: the person rehearsing the contest demo.
- **Department**: one sample agent and the building that represents it.
- **Status**: `idle`, `working`, or `waiting` (waiting for a human yes).
- **Client-safe draft**: wording the owner could review before anyone outside the shop sees it.
- **Visitor key**: an optional secret the visitor types. It stays in `localStorage` and is never written into the repo, a `.env` file, or a network request by this build.

## Requirements

### Requirement 1: Night-shift city

**User Story:** As the owner on night shift, I want a small 3D city of Hollow Pines departments, so that I can see which sample agents are glowing by status.

#### Acceptance Criteria

1. WHEN the console loads in a browser with WebGL THE SYSTEM SHALL render a React Three Fiber city of the sample departments for Hollow Pines Home Repair.
2. WHEN a department status is idle, working, or waiting for a human yes THE SYSTEM SHALL glow that building with the matching status color.
3. WHEN WebGL is unavailable or the city view fails THE SYSTEM SHALL show a flat lot of the same departments so the rest of the console still works.
4. WHEN the owner looks at the city THE SYSTEM SHALL show only fictional Hollow Pines sample agents, with no third-party trademarks or copyrighted assets.

### Requirement 2: Dispatch board

**User Story:** As the owner, I want a 2D board of the same roster, so that I can read status and recent sample activity without relying on the 3D view.

#### Acceptance Criteria

1. WHEN the console loads THE SYSTEM SHALL list every sample department with its status: idle, working, or waiting for a human yes.
2. WHEN the board renders THE SYSTEM SHALL show a recent-activity log of fictional night-shift events for that same roster.
3. WHEN the owner steps the sample night THE SYSTEM SHALL advance a canned local script of statuses and log lines without contacting a network.

### Requirement 3: City and board stay linked

**User Story:** As the owner, I want a click on a building to mark that department on the board, so that the city and the roster describe one shift.

#### Acceptance Criteria

1. WHEN the owner clicks a building THE SYSTEM SHALL highlight that department on the dispatch board.
2. WHEN the owner clicks a department on the board THE SYSTEM SHALL highlight the matching building.
3. WHEN a department is highlighted THE SYSTEM SHALL emphasize that department's lines in the activity log.

### Requirement 4: Job-note desk

**User Story:** As the owner, I want to paste a sample on-site note and receive a short summary plus a client-safe status draft, so that I can review wording before anyone else sees it.

#### Acceptance Criteria

1. WHEN the owner submits a non-empty note and no visitor key is in use THE SYSTEM SHALL summarize it with the deterministic local template and SHALL NOT require an API key.
2. WHEN the same note is submitted twice THE SYSTEM SHALL return the same summary and the same client-safe draft.
3. WHEN a note includes an internal-only sentence THE SYSTEM SHALL keep that sentence out of the client-safe draft.
4. WHEN the note is empty or whitespace THE SYSTEM SHALL ask for a note and SHALL NOT invent a client-safe draft.
5. WHEN the owner chooses the built-in sample note THE SYSTEM SHALL fill the desk with the fictional Hollow Pines note shipped in the repo.

### Requirement 5: Visitor key stays on the machine

**User Story:** As a visitor, I want an optional key stored only in this browser, so that a later iteration can find it without putting a secret in the project.

#### Acceptance Criteria

1. WHEN the owner saves a visitor key THE SYSTEM SHALL write it only to `localStorage` and SHALL NOT place it in source, logs, or the summary text.
2. WHEN a visitor key is stored and the owner summarizes a note THE SYSTEM SHALL still use the local template and SHALL state that this build did not send the note or the key.
3. WHEN the owner clears the visitor key THE SYSTEM SHALL remove it from `localStorage`.
4. IF `localStorage` is unavailable THEN THE SYSTEM SHALL keep the local summarizer working and explain that the key could not be stored.

### Requirement 6: Sample data, secrets, and license

**User Story:** As the contest owner, I want the repo to contain only new sample-data code and a clear license, so that judges can run it without secrets or outside brands.

#### Acceptance Criteria

1. THE SYSTEM SHALL ship sample departments named Night Dispatcher, Ticket Triage, Parts Runner, Invoice Drafter, Callback Keeper, and Review Requests.
2. WHEN files are committed THE SYSTEM SHALL ignore `.env` files and SHALL keep `/.kiro` tracked.
3. THE REPOSITORY SHALL include an Apache-2.0 `LICENSE` with the line `Copyright 2026 Dylan Green`.
4. WHEN `npm run build` runs on Node 22 THE SYSTEM SHALL produce a production build.
5. WHEN `npm test` runs THE SYSTEM SHALL execute unit tests that cover the local summarizer.

### Requirement 7: Kiro spec workflow

**User Story:** As the owner finishing this in Kiro, I want specs, steering, and hooks in `/.kiro`, so that Kiro can keep iterating from the same plan.

#### Acceptance Criteria

1. WHEN a Kiro session opens this repo THE SYSTEM SHALL provide `requirements.md`, `design.md`, and `tasks.md` under `/.kiro/specs/night-shift-dispatch/`.
2. WHEN a Kiro session opens this repo THE SYSTEM SHALL provide `product.md`, `tech.md`, and `structure.md` under `/.kiro/steering/`.
3. WHEN a file is saved THE SYSTEM SHALL be able to run a project hook that checks `.env` is gitignored and `/.kiro` is committed.

# Fleet Inspect — Vehicle Inspection PWA

Reference file for Claude Code. Read this at the start of every session working on this repo — it captures the product spec so it doesn't need to be re-explained.

## What this app is

A Progressive Web App for daily vehicle/fleet inspections. Two user roles, two very different UIs:

- **Driver / Crew Leader** — mobile, in the field, gloves-on, sunlight-readable. Zero-friction giant-touch UI.
- **Shop Manager / Owner** — desktop/tablet admin. Reviews logs, flagged vehicles, resolves issues.

Deployment target: static PWA served via GitHub Pages. Must load in under 1.5s on 4G (PERF-1).

## Core UX rules (apply everywhere)

- **UX-1 Sunlight visibility**: WCAG AAA contrast. Dark charcoal/black backgrounds, bright white text, high-contrast status colors (green/yellow/red).
- **UX-2 Glove-friendly targets**: every primary touch target ≥ 60px height.
- One question per screen in the inspection wizard — never bundle multiple checks on one view.

## Module 1 — Vehicle & Driver Context

- **FR-1.1** Select vehicle/asset via a grid of high-contrast cards, or simulated QR scan (camera/input).
- **FR-1.2** Log inspecting driver via quick-select profile or temporary text entry.
- **FR-1.3** Prompt for odometer reading / engine hours via a giant numeric keypad before the inspection starts.

## Module 2 — Step-by-Step Inspection Wizard

- **FR-2.1** Linear sequence of screens, exactly one check item per view.
- **FR-2.2** Each screen has two full-width touch targets: `PASS` (green) / `FAIL` (red).
- **FR-2.3** Standard inspection sequence (default order):
  1. Tires & Wheels — pressure, tread depth, lug nuts
  2. Fluids & Engine — oil level, coolant, visible leaks under vehicle
  3. Lights & Signals — headlights, brake lights, turn signals, flashers
  4. Brakes & Steering — brake pedal response, steering play
  5. Hitch & Trailer Coupling (if applicable) — safety chains, breakaway cable, trailer plug
  6. Safety Equipment — fire extinguisher, first-aid kit, high-vis cones
- **FR-2.4** Persistent minimal step counter at top of screen (e.g. "Step 3 of 6").

## Module 3 — Defect Capture & Evidence

- **FR-3.1** Tapping `FAIL` instantly reveals a secondary input panel on the same screen before advancing.
- **FR-3.2** Photo evidence: at least one photo required via device camera when `FAIL` is selected.
- **FR-3.3** Text input field pre-configured with native voice-to-text, for describing the defect.
- **FR-3.4** Severity rating on any failure:
  - `Minor (Monitor)` — e.g. chipped mirror, low washer fluid
  - `Critical (Out of Service)` — e.g. flat tire, faulty brakes, trailer hitch play

## Module 4 — Submission & Cloud Sync

- **FR-4.1** Digital signature capture — finger touch signature canvas — required before final submission, attesting accuracy.
- **FR-4.2** Metadata auto-logged on submission: UTC timestamp + browser geolocation (lat/lng).
- **FR-4.3** Any `Critical Fail` instantly flips vehicle status in the DB from `Active` → `Out of Service`.
- **FR-4.4** Offline queueing: if network is down, save submissions to `localStorage`/`IndexedDB`; auto-sync to cloud on reconnect.

## Module 5 — Admin Dashboard & Asset Management

- **FR-5.1** Fleet status grid, three buckets: `Passed` (green) — any vehicle with a non-critical inspection on record, not just today's; `Pending Inspection` (yellow) — vehicles with no inspection on record at all; `Out of Service` (red). (Changed 2026-08-05 from a strict "today only" Passed bucket — a vehicle inspected yesterday and not re-inspected was incorrectly showing as pending.)
- **FR-5.2** Clicking an `Out of Service` asset opens the detailed inspection log: driver name, timestamp, failure notes, photos.
- **FR-5.3** `Mark Repair Complete` button — logs mechanic's notes, restores vehicle to `Active`.

## Tech stack

- **Frontend**: React + TypeScript + Vite, Tailwind CSS v4 (CSS-first config in [src/index.css](src/index.css) via `@theme`), React Router v7 (`BrowserRouter` with `basename="/fleet-inspect"` for GitHub Pages), `vite-plugin-pwa` for the installable/offline shell, `react-signature-canvas` for FR-4.1.
- **Backend**: Firebase — Firestore (data + FR-4.3 status flips), Storage (reserved for defect photos — currently photos are stored as data URLs directly on the inspection doc; revisit if documents grow too large), Auth (email/password, admin-only — see below).
- Firestore is initialized with `persistentLocalCache` + `persistentMultipleTabManager` in [src/lib/firebase.ts](src/lib/firebase.ts) — this is what implements FR-4.4's offline queueing, no custom IndexedDB code needed.
- Firebase config comes from `VITE_FIREBASE_*` env vars (see [.env.example](.env.example) for the shape; real values live in `.env.local` locally and as GitHub Actions repo secrets for the Pages deploy — both gitignored/not in the repo).
- **Live Firebase project**: `fir-9a26d` ("demo" display name), Firestore database created in `nam5`.
- **GitHub Pages**: deployed via [.github/workflows/deploy.yml](.github/workflows/deploy.yml) on every push to `main`, live at https://generallymatthew.github.io/fleet-inspect/. The repo is public (required for Pages on the free plan).

## Auth (admin/manager login)

- `/admin` and `/admin/:vehicleId` are gated by [src/components/AdminGuard.tsx](src/components/AdminGuard.tsx), which redirects unauthenticated visitors to `/admin/login` ([src/routes/admin/AdminLogin.tsx](src/routes/admin/AdminLogin.tsx)) and back to the originally-requested page after sign-in.
- Driver routes (`/`, `/driver`, `/odometer`, `/inspect/*`, `/signature`, `/complete`) stay public/unauthenticated per FR-1.2 — drivers identify by name, not login.
- One manager account exists: `test@test.com` (demo credentials, password given to the user in chat, not stored in this repo — changed from the original `manager@fleet-inspect.app` account on 2026-07-31 per user request). Create more accounts via the Firebase Console → Authentication, or `POST https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=<API_KEY>`.
- Firestore rules ([firestore.rules](firestore.rules)) require `request.auth != null` to **read** `vehicles`/`inspections`, but leave **writes** open (`vehicles`: full write; `inspections`: create-only, no update/delete) since drivers submit without logging in. Deploy changes with `npx firebase-tools deploy --only firestore:rules --project fir-9a26d --token "$FIREBASE_TOKEN"` (get a token via `npx firebase-tools login:ci` run by the user interactively — the CLI's own OAuth flow doesn't work from a sandboxed/non-interactive shell).

## Known limitations / follow-ups
- **Vehicle writes are still unauthenticated**: Firestore rules allow anyone to write to `vehicles` (needed so drivers can flip status), so a non-admin could still overwrite vehicle status/labels directly via the API even though the UI hides that from them. Tightening this further would need per-field rules or a Cloud Function, not yet done.
- **Photo storage**: defect photos are embedded as base64 data URLs directly in Firestore documents rather than uploaded to Firebase Storage — this is deliberate, since it lets FR-4.4's offline queueing (Firestore's local cache) cover photos for free instead of needing a separate offline upload queue for Storage. [src/lib/compressImage.ts](src/lib/compressImage.ts) downscales/re-encodes each photo (max 1000px, JPEG q=0.7) before embedding to stay well under Firestore's 1MB document limit (a 570KB test photo compressed to ~45KB). Revisit if a doc ever needs multiple photos per defect or otherwise risks the limit.
- **Bundle size**: production build is ~890KB unminified gzip ~270KB (mostly the Firebase SDK) — acceptable for now but worth revisiting against PERF-1 (sub-1.5s load on 4G) once real usage data exists; code-splitting the admin bundle from the driver bundle would be the first lever.
- **Minor UI polish** noted but not yet addressed (user flagged "some minor UI issues" on 2026-07-30 without specifics yet).

## Status

Scaffolded and verified end-to-end against a live Firebase project, deployed to GitHub Pages, with a working admin login gate (2026-07-30): vehicle/driver/odometer entry, the full 5–6 step wizard (trailer step conditionally shown, Back/Forward nav that only allows revisiting already-answered steps), defect capture with required photo/note/severity, signature capture, submission with real Firestore writes, critical-fail status flip, and the full admin dashboard loop (login → fleet grid → asset detail with real defect data → mark repair complete → status restored → sign out) — all buttons flex to fill available space. Photo capture is compressed client-side before embedding (see Known limitations). Demo admin login is `test@test.com` (changed 2026-07-31, password given in chat, not in repo).

**Spanish/English language toggle for the driver flow** (completed and deployed 2026-08-03): toggle lives on the Welcome screen; the chosen language persists via `LanguageContext` ([src/state/LanguageContext.tsx](src/state/LanguageContext.tsx), React context + localStorage, pattern-matched to `InspectionContext`) and applies across the entire driver flow (Welcome → vehicle/driver/odometer → all 6 wizard steps → signature → submission complete). Strings live in [src/lib/translations.ts](src/lib/translations.ts) (`en`/`es` dictionary); inspection step titles/descriptions were moved out of `src/data/inspectionSteps.ts` and into the translation dictionary, keyed by step `id`. Vehicle labels (Truck #101, etc.) and quick-select driver names are treated as proper nouns and left untranslated. Admin/manager screens remain English-only.

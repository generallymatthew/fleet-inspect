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

- **FR-5.1** Fleet status grid, three buckets: `Passed Today` (green), `Pending Inspection` (yellow), `Out of Service` (red).
- **FR-5.2** Clicking an `Out of Service` asset opens the detailed inspection log: driver name, timestamp, failure notes, photos.
- **FR-5.3** `Mark Repair Complete` button — logs mechanic's notes, restores vehicle to `Active`.

## Tech stack

- **Frontend**: React + TypeScript + Vite, Tailwind CSS v4 (CSS-first config in [src/index.css](src/index.css) via `@theme`), React Router v7 (`BrowserRouter` with `basename="/fleet-inspect"` for GitHub Pages), `vite-plugin-pwa` for the installable/offline shell, `react-signature-canvas` for FR-4.1.
- **Backend**: Firebase — Firestore (data + FR-4.3 status flips), Storage (reserved for defect photos — currently photos are stored as data URLs directly on the inspection doc; revisit if documents grow too large), no Auth yet (driver identity is name-based per FR-1.2, not a login).
- Firestore is initialized with `persistentLocalCache` + `persistentMultipleTabManager` in [src/lib/firebase.ts](src/lib/firebase.ts) — this is what implements FR-4.4's offline queueing, no custom IndexedDB code needed.
- Firebase config comes from `VITE_FIREBASE_*` env vars (see [.env.example](.env.example)); until a real Firebase project is wired up, reads/writes will fail — see "Known limitations" below.

## Known limitations / follow-ups

- **No live Firebase project yet.** `.env.local` needs real Firebase config for cloud sync, admin dashboard live data, and photo persistence to actually work. Until then, Firestore calls fail after a short timeout (by design — see `withTimeout` in [src/lib/withTimeout.ts](src/lib/withTimeout.ts), used in [src/lib/submitInspection.ts](src/lib/submitInspection.ts) and [src/routes/admin/AssetDetail.tsx](src/routes/admin/AssetDetail.tsx) so the UI never hangs indefinitely on a stalled read/write).
- **Auth/roles**: there's no login or role separation between driver and admin routes yet (`/` vs `/admin` are just public routes). Add Firebase Auth + route guards before this is used for real, especially since `/admin` currently has no access control.
- **Photo storage**: defect photos are embedded as base64 data URLs directly in Firestore documents rather than uploaded to Firebase Storage. Fine for the current scaffold; revisit for real usage since Firestore has a 1MB document size limit.
- **Bundle size**: production build is ~890KB unminified gzip ~270KB (mostly the Firebase SDK) — acceptable for now but worth revisiting against PERF-1 (sub-1.5s load on 4G) once real usage data exists; code-splitting the admin bundle from the driver bundle would be the first lever.

## Status

Scaffolded and verified working end-to-end in the browser (2026-07-30): vehicle/driver/odometer entry, the full 5–6 step wizard (trailer step conditionally shown), defect capture with required photo/note/severity, signature capture, submission, and the admin dashboard/asset-detail views. No real Firebase project connected yet — that's the next concrete step before this is usable beyond local testing.

# Grow Heal Love Practice Explorer PoC

A Bun + Vite + React + Base UI experiment for exploring a psychotherapy group-practice operations model as small stateful square grids.

This app uses **mocked data only**. The synthetic client handles, sessions, notes, recordings, and transcripts are not real PHI.

## Run locally

```bash
bun install
bun run dev
```

Open http://localhost:5173/.

## What it does

- Shows a group-practice cockpit with grids for therapists, administrators, clients/intake, session agenda, open work queue, and therapy groups.
- Uses square color/state to make dense operational data scannable.
- Hover/focus a square to see a Base UI `Popover` preview.
- Click therapists, clients, sessions, or groups to drill into full-screen Base UI `Drawer` workspaces.
- Right-click a square for Base UI `ContextMenu` copy actions.
- Drag clients onto therapists, admins, or groups for non-mutating workflow actions.
- Drag tasks onto people, recordings onto sessions, transcripts onto notes, and notes onto therapists.
- Review session recordings with native audio, Base UI `Meter` progress/review indicators, and timestamped mock transcript segments.
- Carry entities in a floating pouch across drawer views.
- Search filters all grids on the current screen.

## Mocked domain model

- **Therapists** — availability, caseload, specialties, supervision, and note backlog.
- **Administrators** — intake, billing, compliance, scheduling, queue load, and escalations.
- **Clients** — synthetic handles with lifecycle stage, acuity, paperwork, consent, matching, and open task counts.
- **Sessions** — status, modality, location, linked notes, recordings, transcripts, and session-tied tasks.
- **Notes** — nested under client, therapist, and session workspaces; draft/review/signed/late states, due dates, and supervision-review flags.
- **Recordings** — nested under client and session workspaces; consent/upload/transcription/readiness/retention states plus a recording-review drawer.
- **Transcripts** — nested under client and session workspaces; transcription, review, redaction, and note-linking states.
- **Tasks** — intake, billing, scheduling, compliance, and clinical work queues.
- **Groups** — capacity, enrollment, cadence, focus, and lead therapist.

## Quality checks

```bash
bun run lint
bun run test
bun run build
```

Run all three with:

```bash
bun run check
```

Use `bun run format` to apply Biome formatting/import organization.

## Optional demo audio

Audio files are not committed. Recording examples look for `/audio/jung-interview.mp3`. If you have rights to use a local copy, place it at `public/audio/jung-interview.mp3`. See `public/audio/README.md` for the suggested `yt-dlp` command.

## Project shape

- `src/components/` — generic screen/grid/pouch primitives.
- `src/features/practice/` — practice mock data, search, status, previews, legends, context menus, drag/drop menus, and drawer screens.
- `src/features/practice/mock/` — per-entity mocked data files.
- `src/styles.scss` and `src/styles/` — Sass entrypoint and partials for layout, grids, overlays, and shared tokens.
- `src/utils/` — small clipboard helper.

## Possible next experiments

- Add Playwright coverage for hover previews, drawer navigation, search, and drag/drop affordances.
- Add a timeline/agenda view for session days.
- Prototype a mocked note-drafting workflow from transcript to clinician-reviewed note.
- Add a compliance audit view for consent, retention, supervision, and overdue documentation.

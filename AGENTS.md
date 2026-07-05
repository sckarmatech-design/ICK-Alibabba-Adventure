# AGENTS.md — Instructions for Coding Agents

## First thing every session

1. Read `IMPLEMENTATION_PLAN.md` fully — it contains the entire architecture (Prisma schema, route map, auth flow, image upload, video embed, Vercel deploy).
2. Read this file.
3. Check which phase is `❌ Not started` or has incomplete checkboxes.
4. Read `app/routes.ts`, `app/root.tsx`, and `package.json` to understand current state.
5. Begin working on the earliest unfinished phase. Follow the tasks in order within that phase.

## Progress tracking

- Every phase in `IMPLEMENTATION_PLAN.md` has a status line: `**Status:** ❌ Not started` / `✅ Complete` / `🔄 In progress`.
- When you start a phase, change its status to `🔄 In progress`.
- Each phase has an `Entry checkpoint` (prerequisite checklist) and a `Verification` (exit checklist).
- Mark checkboxes `[x]` as you complete them.
- When all verification items are checked, change status to `✅ Complete`.

## Rules

- **Do not change the tech stack.** React Router v7 Framework Mode, Prisma + PostgreSQL (Supabase), Tailwind v4. No Express, no Fastify, no separate API server.
- **Do not create new features beyond what the plan specifies.** The plan covers exactly what is needed — no extras.
- **Do not remove or delete `app/data/*.ts` files.** They are the canonical seed source. They will be deleted only in a final cleanup phase after everything is confirmed working.
- **Do not edit `IMPLEMENTATION_PLAN.md` structure.** Only update status lines and checkboxes.
- **Run `npm run typecheck` after every file change.** Fix all type errors before moving on.
- **Run the project (`npm run dev`) after completing a phase** to verify it starts without errors.
- If a task requires manual setup (e.g. Supabase bucket creation), note it in the phase blockers section and ask the user to complete it, then resume.

## Getting started

Run this to understand the current project:

```bash
npm run typecheck
npm run dev
```

Open `http://localhost:5173` to see the current state, then start implementing the next incomplete phase.

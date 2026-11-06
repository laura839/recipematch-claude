# CLAUDE.md

## Deployment

- This web app runs on **Railway**, not on the local computer.
- Railway deploys the app automatically from the `main` branch of this GitHub repo (`laura839/recipematch-claude`).

## Database

- The database is a **Railway PostgreSQL** database.
- It is available only through the `DATABASE_URL` environment variable on Railway.

## Rules

- Do **not** set up a local database.
- Do **not** set up or run a local server.
- Before every push, run **both** `npm test` and `npm run build`. Do not push if either fails.
- After each finished task, commit and push to GitHub (`main`) so that Railway deploys the new version.

## Project notes

- Stack: Next.js (App Router) + TypeScript + Tailwind CSS + Prisma (v6) + Vitest.
- Railway config lives in `railway.json`: build `npm run build`, pre-deploy `npm run db:deploy`
  (`prisma migrate deploy && prisma db seed`), start `npm run start`.
- `npm run build` must work without `DATABASE_URL`: never query the database at build time;
  data pages and API routes use `export const dynamic = "force-dynamic"`.
- Migrations are written offline with `prisma migrate diff ... --script` (no local database).
- The seed (`prisma/seed.ts`) is idempotent: upsert by slug, never delete recipes or ingredients.
- Matching logic stays a pure function in `lib/match.ts` with tests in `lib/match.test.ts`.

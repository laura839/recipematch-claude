# RecipeMatch

Find recipes you can cook with the ingredients you already have. Pick ingredients from an
autocomplete, and RecipeMatch ranks recipes by how many of their ingredients you have and shows
what's missing.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Prisma · PostgreSQL on Railway · Vitest

## How it works

- **Matching** lives in [`lib/match.ts`](lib/match.ts), a pure function with unit tests.
  - Match % = available non-staple ingredients ÷ all non-staple ingredients of a recipe.
  - Staples (salt, black pepper, water) are ignored; cooking oil is a regular ingredient.
  - Only recipes with at least one match are shown; staple-only recipes never appear.
  - Sort: highest match % → fewest missing → shortest prep time.
- **Data**: ~130 original recipes in [`data/recipes/`](data/recipes) and standardized ingredients in
  [`data/ingredients.ts`](data/ingredients.ts). [`prisma/seed.ts`](prisma/seed.ts) upserts them by slug
  (idempotent, never deletes).
- **No accounts**: selected ingredients and favorites are stored in the browser's localStorage.

## API

| Route | Purpose |
| --- | --- |
| `GET /api/ingredients` | Non-staple ingredients for the autocomplete |
| `GET /api/recipes?ingredients=a,b&category=pasta&offset=0` | Ranked matches (20 per page) or category browse |
| `GET /api/recipes/lookup?slugs=a,b&ingredients=x` | Cards for favorites |
| `GET /api/health` | Health check (verifies the database has recipes) |

## Development rules

See [`CLAUDE.md`](CLAUDE.md). In short: no local database or server; `npm test` and `npm run build`
must pass before pushing to `main`, which Railway deploys automatically.

## Deployment (Railway)

Configured in [`railway.json`](railway.json):

1. Build: `npm run build` (`prisma generate && next build`; no database needed).
2. Start: `npm run start`, which first runs `npm run db:deploy` (`prisma migrate deploy && prisma db seed`)
   and then `next start`.
3. Health check: `/api/health` (fails with 503 until the database is migrated and seeded).

`DATABASE_URL` must be set on the app service (reference to the Railway PostgreSQL service).

### Adding a migration without a local database

Edit `prisma/schema.prisma`, then generate the SQL offline:

```bash
npx prisma migrate diff --from-schema-datamodel <old-schema> --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/<NNNN_name>/migration.sql
```

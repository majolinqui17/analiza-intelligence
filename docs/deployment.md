# Deployment

## Environments

Recommended environments:

- local development
- staging
- production

Production deployment requires explicit user authorization.

## Environment Variables

Required public variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Server-only secrets for future connectors must not use `NEXT_PUBLIC_` prefixes.

## Supabase

The repository currently has Supabase client helpers but no local `supabase/` migration folder. Phase 1 will add migrations, RLS, and seed DEMO data.

## Build Checks

Before deployment:

- lint
- typecheck
- tests
- build
- security review for secrets and RLS
- visual review of modified screens

The current `npm run build` command uses `next build --webpack` so local and CI builds do not depend on Turbopack internals that may require restricted process or port behavior in sandboxed environments. This is reversible when the target deployment environment supports Turbopack builds reliably.

## First Super Admin

The first `super_admin` should be created by a controlled server-side or SQL process after Supabase Auth user creation. This process must not expose service role keys in browser code.

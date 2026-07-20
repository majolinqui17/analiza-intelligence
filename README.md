# Analiza Intelligence

Analiza Intelligence is a corporate Business Intelligence web platform for Analiza operations in Central America. It is designed to centralize, validate, analyze, and visualize operational and financial data across countries, business units, branches, managers, professionals, services, and data sources.

Initial business units:

- Analiza Fisioterapia
- Analiza Laboratorio
- Analiza Imagenes

Initial countries:

- Guatemala
- Belice
- El Salvador
- Honduras
- Nicaragua
- Costa Rica
- Panama

## Stack

- Next.js App Router
- TypeScript strict mode
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Row Level Security
- Tailwind CSS
- shadcn/ui primitives
- lucide-react icons

## Current Phase

Phase 0 is the foundation phase:

- repository diagnosis
- product and architecture documentation
- security and data rules
- implementation plan
- validation scripts

The next phase will add Supabase migrations, RLS, users, roles, and the country/company/branch selection model.

## Local Setup

Create `.env.local` from `.env.example` and configure:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Do not add service role keys to browser-exposed variables.

Install dependencies if needed:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

## Validation

Run these checks before completing each phase:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Documentation

Start with:

- [Agent rules](AGENTS.md)
- [Product scope](docs/product-scope.md)
- [Architecture](docs/architecture.md)
- [Database design](docs/database-design.md)
- [Security model](docs/security-model.md)
- [Design system](docs/design-system.md)
- [KPI dictionary](docs/kpi-dictionary.md)
- [Data ingestion](docs/data-ingestion.md)
- [Connectors](docs/connectors.md)
- [Implementation plan](docs/implementation-plan.md)
- [Deployment](docs/deployment.md)
- [User guide](docs/user-guide.md)

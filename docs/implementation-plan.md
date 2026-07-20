# Implementation Plan

## Phase 0: Diagnosis And Documentation

- Inspect repository state, dependencies, Next.js, and Supabase setup.
- Create agent rules.
- Create initial product, architecture, database, security, design, KPI, ingestion, connector, deployment, and user documentation.
- Add basic validation scripts.
- Run lint, typecheck, tests, and build.
- Commit the phase.

## Phase 1: Database, Auth, Roles, RLS, Context

- Add Supabase migrations for operational core.
- Add RLS policies and helper functions.
- Disable public registration in product UI.
- Add profile, role, and assignment queries.
- Add country, company, and branch selection after login.

## Phase 2: Layout, Navigation, Filters, DEMO Executive Dashboard

- Replace starter UI.
- Add role-aware sidebar.
- Add persistent context selector.
- Add executive DEMO dashboard with data coverage labels.

## Phase 3: Appointments, Capacity, Occupancy, Branches, Managers

- Add appointment and capacity facts.
- Add normalized status mapping.
- Add occupancy formulas and manager branch views.

## Phase 4: Fisioterapia, Laboratorio, Imagenes

- Add unit-specific facts, templates, and dashboards.
- Add authorized scraping shell for fisioterapia with DEMO adapter.

## Phase 5: Finance, Targets, Manager Performance

- Add billing, collections, costs, targets, and contribution margin.
- Add configurable manager performance components.

## Phase 6: Imports, Templates, Validations, Data Quality

- Build import assistant.
- Generate templates.
- Add quality dashboard and issue workflows.

## Phase 7: Connectors, APIs, Authorized Scraping, Sync

- Implement connector framework.
- Add secure internal endpoints.
- Add DEMO adapters and disabled real adapters.

## Phase 8: Insights, Alerts, Traceability, Audit

- Add deterministic rule engine.
- Add traceability detail views.
- Expand audit coverage.

## Phase 9: Exports, Final Tests, Security, Deployment Prep

- Add CSV, XLSX, and executive PDF exports.
- Complete E2E coverage.
- Harden security.
- Finalize Supabase and deployment guides.


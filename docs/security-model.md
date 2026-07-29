# Security Model

## Authentication

Supabase Auth is the authentication provider. The app supports login, password recovery, logout, secure sessions, and protected routes. Public self-registration must be disabled from the product flow.

Local DEMO administrator access is available for exploration before real users are provisioned. It uses an HTTP-only cookie, is labeled DEMO, is disabled in Vercel production, and can be disabled locally with `ANALIZA_DISABLE_DEMO_ADMIN=true`.

## Roles

Official Analiza roles:

- `webmaster_admin`: webmaster or administrator. Designs dashboards, configures modules, creates users, assigns roles, and manages system settings.
- `ceo`: reads the executive BI view for Analiza and all assigned business lines, countries, and branches.
- `gerente_operaciones`: manages one business line, loads branch templates, validates data, and monitors operational results.
- `gerente_area`: supervises a group of assigned branches, validates monthly discipline, and compares branch manager performance.
- `gerente_sucursal`: registers the assigned branch monthly close through the controlled form and reads branch results.

## Authorization

RLS must enforce access by:

- organization
- country
- company
- branch
- role
- direct assignments

Users only see assigned countries, companies, branches, and allowed consolidated views.

Phase 1 adds RLS helper functions:

- `current_user_is_super_admin`
- `current_user_has_role`
- `current_user_can_access_org`
- `current_user_can_access_country`
- `current_user_can_access_company`
- `current_user_can_access_branch`

These functions are used by policies on the initial tenant, catalog, assignment, data source, and audit tables.

`current_user_is_super_admin` is retained as a compatibility helper name, but it now maps to the product role `webmaster_admin`.

Phase 3 extends RLS to appointments, capacity, professionals, anonymous patients, and service events. Operational reads are scoped through `current_user_can_access_branch`.

Write access to operational data is limited to `webmaster_admin`, `gerente_operaciones`, `gerente_area`, and the controlled monthly form path for `gerente_sucursal`. Published closes require authorization before replacement.

## Secret Handling

- Service role keys are server-only.
- Connector credentials stay server-side.
- Logs and audit entries must not contain secrets.
- Credential metadata may describe configured credentials without storing secret values in public tables.

## Patient Privacy

- Do not use real patient data in development.
- Do not show individual clinical results on executive dashboards.
- Use anonymous patient IDs for analytics.
- Avoid PII in imports, exports, logs, and demo data.

## File Safety

- Validate files on the server.
- Restrict extension and size.
- Sanitize file names.
- Preserve original uploads for traceability where appropriate.
- Block dangerous spreadsheet formulas in generated CSV/XLSX exports.

# Security Model

## Authentication

Supabase Auth is the authentication provider. The app supports login, password recovery, logout, secure sessions, and protected routes. Public self-registration must be disabled from the product flow.

## Roles

Initial roles:

- `super_admin`
- `director_ejecutivo_grupo`
- `director_pais`
- `director_empresa`
- `director_financiero`
- `director_operaciones`
- `gerente_sucursal`
- `analista_bi`
- `cargador_datos`
- `auditor`
- `viewer`

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

Phase 3 extends RLS to appointments, capacity, professionals, anonymous patients, and service events. Operational reads are scoped through `current_user_can_access_branch`.

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

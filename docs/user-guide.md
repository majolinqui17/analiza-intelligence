# User Guide

## Login

Users sign in with an assigned account. Public self-registration is not part of the product flow and the visible UI does not provide a sign-up path. Password recovery is available through Supabase Auth.

## Context Selection

After login, users select:

1. Country.
2. Company.
3. Branch.

Executive roles may access regional or consolidated views when assigned. Other users only see countries, companies, and branches assigned to their profile.

Phase 1 provides a protected context selection screen at:

```text
/protected/context
```

The current UI uses DEMO bootstrap context until Supabase assignments are populated from the Phase 1 migration and seed.

## Header Selector

The app header will keep persistent selectors for:

- country
- company
- branch
- period

The protected header now stores these values in the browser under the Analiza context key so the selection survives navigation.

## Dashboards

Every dashboard should show:

- selected period
- last update
- data coverage
- sources used
- completeness percentage
- DEMO label when applicable

The Phase 2 executive dashboard is available at:

```text
/protected/overview
```

It uses DEMO values only and labels them visibly.

## Operational Views

Phase 3 adds DEMO operational views:

- `/protected/citas`
- `/protected/capacidad`
- `/protected/sucursales`
- `/protected/gerentes`

Manager performance uses separated components and does not present a score when capacity or data completeness is insufficient.

## Imports

The import center guides users through template download, file upload, column mapping, validation, preview, error review, confirmation, processing, and audit history.

## Data Quality

When data is incomplete or invalid, affected dashboards show warnings and avoid conclusive insights.

# Architecture

## System Shape

Analiza Intelligence uses Next.js App Router as the web application layer and Supabase as the authentication, database, storage, and policy platform.

The expected hierarchy is:

```text
Grupo Analiza
  Pais
    Empresa o unidad de negocio
      Sucursal
        Gerente de sucursal
        Profesionales
        Servicios
```

The selected country, company, branch, and period must persist while the user navigates.

## Application Layers

- Web UI: Next.js App Router, server components by default, client components for forms and interaction.
- Authentication: Supabase Auth with protected routes.
- Authorization: PostgreSQL RLS using organization, country, company, branch, role, and direct assignments.
- Data ingestion: imports, templates, connectors, sync jobs, and raw records.
- Analytics: dimensions, facts, KPI functions, and dashboard views.
- Audit: immutable records for sensitive actions and data movement.

## Data Pipeline

```text
RAW -> STAGING -> ANALYTICS
```

- RAW: data exactly as received, immutable, tied to source and import.
- STAGING: cleaning, normalization, mapping, deduplication, validation.
- ANALYTICS: dimensions, facts, KPIs, aggregates, and insights.

## Connector Boundary

Connectors run only on the server. Browser code may initiate allowed actions, but it must never receive connector secrets. Real connectors can remain disabled until credentials are configured. DEMO adapters provide safe sample behavior.

## UI Boundary

The UI should feel executive, professional, clean, responsive, accessible, and presentation-ready. It must avoid excessive gradients, unnecessary animation, misleading rankings, and metrics without data sufficiency.


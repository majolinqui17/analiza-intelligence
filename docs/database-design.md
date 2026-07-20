# Database Design

## Required Conventions

All primary identifiers use UUID. Operational and analytic records include these fields when applicable:

- `organization_id`
- `country_id`
- `company_id`
- `branch_id`
- `source_id`
- `import_id`
- `created_at`
- `updated_at`

Patient names are not identifiers. Analytics uses anonymous patient references only.

## Phase 1 Migration

The first versioned migration is:

```text
supabase/migrations/20260720000100_phase1_core.sql
```

It creates the multi-tenant core for organizations, currencies, countries, companies, branches, profiles, roles, permissions, direct access assignments, branch managers, services, data sources, and audit logs. It also enables RLS on every Phase 1 table.

The initial DEMO seed is:

```text
supabase/seed.sql
```

The seed includes the seven initial countries, three business units, sample DEMO branches, roles, and baseline permissions. It does not create real users.

## Phase 3 Operational Migration

The operational migration is:

```text
supabase/migrations/20260720000200_phase3_operations.sql
```

It adds appointment status catalog, professionals, professional schedules, anonymous patients, appointments, appointment status history, capacity records, service events, `safe_ratio`, and `v_branch_capacity_summary` with `security_invoker` so RLS is respected.

## Operational Core

Initial migrations will create:

- `organizations`
- `countries`
- `currencies`
- `companies`
- `branches`
- `branch_managers`
- `profiles`
- `roles`
- `permissions`
- `user_roles`
- `user_country_access`
- `user_company_access`
- `user_branch_access`
- `professionals`
- `professional_schedules`
- `service_categories`
- `services`
- `service_standard_durations`
- `anonymous_patients`
- `appointments`
- `appointment_status_history`
- `service_events`
- `capacity_records`
- `invoices`
- `invoice_items`
- `payments`
- `direct_costs`
- `payers`
- `targets`
- `data_sources`
- `uploaded_files`
- `template_definitions`
- `template_versions`
- `data_imports`
- `data_import_rows`
- `data_quality_issues`
- `connectors`
- `connector_mappings`
- `sync_jobs`
- `sync_job_runs`
- `insight_rules`
- `generated_insights`
- `audit_logs`

## Connector Tables

Connector-specific migrations will include:

- `connector_credentials_metadata`
- `sync_errors`
- `webhooks`
- `raw_ingestion_records`

Secret values are not stored in publicly readable tables.

## Analytics Model

Dimensions:

- `dim_date`
- `dim_country`
- `dim_company`
- `dim_branch`
- `dim_manager`
- `dim_professional`
- `dim_service`
- `dim_payer`
- `dim_data_source`
- `dim_patient_anonymous`

Facts:

- `fact_appointments`
- `fact_capacity`
- `fact_services`
- `fact_finance`
- `fact_payments`
- `fact_costs`
- `fact_physio_sessions`
- `fact_lab_orders`
- `fact_lab_tests`
- `fact_imaging_studies`
- `fact_equipment_utilization`
- `fact_targets`

## Appointment Status Catalog

Normalized statuses:

- `scheduled`
- `confirmed`
- `arrived`
- `in_progress`
- `completed`
- `cancelled_by_patient`
- `cancelled_by_branch`
- `no_show`
- `rescheduled`
- `failed`
- `pending`
- `unknown`

Unknown source statuses must appear in data quality workflows.

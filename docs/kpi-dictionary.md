# KPI Dictionary

## Data Sufficiency

Do not show a KPI when essential fields are missing. If capacity is missing, show:

```text
Pendiente de cargar capacidad disponible
```

No future appointments are included in historical compliance indicators.

## Occupancy

Scheduled occupancy:

```text
scheduled_minutes / available_minutes
```

Effective occupancy:

```text
completed_or_attended_minutes / available_minutes
```

Attendance gap:

```text
scheduled_occupancy - effective_occupancy
```

Completion rate:

```text
completed_appointments / applicable_scheduled_appointments
```

No-show rate:

```text
no_show_appointments / applicable_scheduled_appointments
```

Cancellation rate:

```text
cancelled_appointments / applicable_scheduled_appointments
```

Reschedule rate:

```text
rescheduled_appointments / applicable_scheduled_appointments
```

## Executive Cards

- invoiced revenue
- collected revenue
- accounts receivable
- patients or clients served
- scheduled appointments
- completed appointments
- cancelled appointments
- no-shows
- rescheduled appointments
- performed services
- average ticket
- scheduled occupancy
- effective occupancy
- attendance gap
- available capacity
- contribution margin, only when direct costs exist
- revenue target attainment
- operating target attainment
- variance against prior period
- variance against same period last year, when data exists

The Phase 2 dashboard implements DEMO versions of these executive cards. Each card includes a tooltip with definition, formula, source, and last update.

## Financial Rules

- Do not calculate net profit without complete operating expenses.
- If only direct costs exist, use `Margen de contribucion estimado`.
- Label financial data as loaded, calculated, estimated, or pending.

## Manager Performance

The manager performance index is configurable and must show component values separately:

- revenue attainment
- effective occupancy
- completion and attendance
- contribution margin
- productivity
- data quality

Do not show a score when comparability, capacity, financial essentials, or data completeness are insufficient.

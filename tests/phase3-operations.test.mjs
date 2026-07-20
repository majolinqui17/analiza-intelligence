import { readFileSync, statSync } from "node:fs";
import {
  calculateAppointmentRates,
  calculateOccupancy,
  formatPercent,
  formatPercentagePoints,
  safeRatio,
} from "../lib/analytics/operations.ts";

const migrationPath = "supabase/migrations/20260720000200_phase3_operations.sql";
const operationsComponentPath = "components/operations-modules.tsx";

statSync(migrationPath);
statSync(operationsComponentPath);

const migration = readFileSync(migrationPath, "utf8");
const operationsComponent = readFileSync(operationsComponentPath, "utf8");

for (const table of [
  "appointment_status_catalog",
  "professionals",
  "professional_schedules",
  "anonymous_patients",
  "appointments",
  "appointment_status_history",
  "capacity_records",
  "service_events",
]) {
  if (!migration.includes(`create table public.${table}`)) {
    throw new Error(`Missing Phase 3 table: ${table}`);
  }

  if (!migration.includes(`alter table public.${table} enable row level security`)) {
    throw new Error(`Missing Phase 3 RLS enablement: ${table}`);
  }
}

for (const status of [
  "scheduled",
  "confirmed",
  "arrived",
  "in_progress",
  "completed",
  "cancelled_by_patient",
  "cancelled_by_branch",
  "no_show",
  "rescheduled",
  "failed",
  "pending",
  "unknown",
]) {
  if (!migration.includes(`('${status}'`)) {
    throw new Error(`Missing normalized appointment status: ${status}`);
  }
}

const occupancy = calculateOccupancy({
  availableMinutes: 100,
  scheduledMinutes: 80,
  attendedMinutes: 65,
});

if (occupancy.scheduledOccupancy !== 0.8) {
  throw new Error("Scheduled occupancy formula is incorrect.");
}

if (occupancy.effectiveOccupancy !== 0.65) {
  throw new Error("Effective occupancy formula is incorrect.");
}

if (occupancy.attendanceGap !== 0.15000000000000002) {
  throw new Error("Attendance gap formula is incorrect.");
}

const emptyOccupancy = calculateOccupancy({
  availableMinutes: 0,
  scheduledMinutes: 80,
  attendedMinutes: 65,
});

if (emptyOccupancy.scheduledOccupancy !== null) {
  throw new Error("Capacity gaps must return null when capacity is missing.");
}

const rates = calculateAppointmentRates({
  scheduledApplicable: 10,
  completed: 7,
  cancelled: 1,
  noShow: 1,
  rescheduled: 1,
});

if (
  rates.completionRate !== 0.7 ||
  rates.cancellationRate !== 0.1 ||
  rates.noShowRate !== 0.1 ||
  rates.rescheduleRate !== 0.1
) {
  throw new Error("Appointment rate formulas are incorrect.");
}

if (safeRatio(1, 0) !== null) {
  throw new Error("safeRatio must return null for zero denominator.");
}

if (formatPercent(0.875) !== "88%") {
  throw new Error("formatPercent should round to whole percentages by default.");
}

if (formatPercentagePoints(0.09) !== "9 pp") {
  throw new Error("formatPercentagePoints should format percentage points.");
}

for (const requiredText of [
  "Rendimiento de Gerentes",
  "Pendiente de cargar capacidad disponible",
  "Estados normalizados",
  "Ocupacion agendada",
]) {
  if (!operationsComponent.includes(requiredText)) {
    throw new Error(`Missing Phase 3 UI text: ${requiredText}`);
  }
}

console.log("Phase 3 operations checks passed.");


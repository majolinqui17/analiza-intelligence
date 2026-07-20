import { readFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";

const migrationPath = "supabase/migrations/20260720000100_phase1_core.sql";
const seedPath = "supabase/seed.sql";

statSync(migrationPath);
statSync(seedPath);

const migration = readFileSync(migrationPath, "utf8");
const seed = readFileSync(seedPath, "utf8");

const requiredTables = [
  "organizations",
  "countries",
  "currencies",
  "companies",
  "branches",
  "profiles",
  "roles",
  "permissions",
  "user_roles",
  "user_country_access",
  "user_company_access",
  "user_branch_access",
  "branch_managers",
  "services",
  "data_sources",
  "audit_logs",
];

for (const table of requiredTables) {
  if (!migration.includes(`create table public.${table}`)) {
    throw new Error(`Missing table in migration: ${table}`);
  }
  if (!migration.includes(`alter table public.${table} enable row level security`)) {
    throw new Error(`Missing RLS enablement for table: ${table}`);
  }
}

const requiredFunctions = [
  "current_user_is_super_admin",
  "current_user_has_role",
  "current_user_can_access_org",
  "current_user_can_access_country",
  "current_user_can_access_company",
  "current_user_can_access_branch",
];

for (const fn of requiredFunctions) {
  if (!migration.includes(`function public.${fn}`)) {
    throw new Error(`Missing RLS helper function: ${fn}`);
  }
}

const roleKeys = [
  "super_admin",
  "director_ejecutivo_grupo",
  "director_pais",
  "director_empresa",
  "director_financiero",
  "director_operaciones",
  "gerente_sucursal",
  "analista_bi",
  "cargador_datos",
  "auditor",
  "viewer",
];

for (const roleKey of roleKeys) {
  if (!seed.includes(roleKey)) {
    throw new Error(`Missing seed role: ${roleKey}`);
  }
}

const countries = [
  "Guatemala",
  "Belice",
  "El Salvador",
  "Honduras",
  "Nicaragua",
  "Costa Rica",
  "Panama",
];

for (const country of countries) {
  if (!seed.includes(country)) {
    throw new Error(`Missing seed country: ${country}`);
  }
}

let signUpReferences = "";
try {
  signUpReferences = execFileSync(
    "rg",
    ["sign-up|Sign up|signUp", "app", "components", "lib"],
    { encoding: "utf8" },
  );
} catch (error) {
  if (
    typeof error !== "object" ||
    error === null ||
    !("status" in error) ||
    error.status !== 1
  ) {
    throw error;
  }
}

if (signUpReferences.trim().length > 0) {
  throw new Error(`Unexpected public sign-up reference:\n${signUpReferences}`);
}

console.log("Phase 1 core checks passed.");

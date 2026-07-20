import { readFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";

const navigationPath = "lib/navigation.ts";
const dashboardDataPath = "lib/analytics/demo-dashboard.ts";
const dashboardComponentPath = "components/executive-dashboard.tsx";
const contextHeaderPath = "components/tenant-context-header.tsx";

for (const file of [
  navigationPath,
  dashboardDataPath,
  dashboardComponentPath,
  contextHeaderPath,
]) {
  statSync(file);
}

const navigation = readFileSync(navigationPath, "utf8");
const dashboardData = readFileSync(dashboardDataPath, "utf8");
const dashboardComponent = readFileSync(dashboardComponentPath, "utf8");
const contextHeader = readFileSync(contextHeaderPath, "utf8");

const requiredNavigationTitles = [
  "Resumen ejecutivo",
  "Operacion",
  "Finanzas",
  "Citas",
  "Capacidad y ocupacion",
  "Sucursales",
  "Gerentes",
  "Profesionales",
  "Servicios",
  "Fisioterapia",
  "Laboratorio",
  "Imagenes",
  "Insights",
  "Importaciones",
  "Plantillas",
  "Conectores",
  "Calidad de datos",
  "Metas",
  "Usuarios y permisos",
  "Configuracion",
  "Auditoria",
];

for (const title of requiredNavigationTitles) {
  if (!navigation.includes(`title: "${title}"`)) {
    throw new Error(`Missing navigation item: ${title}`);
  }
}

if (!navigation.includes("getNavigationForRole")) {
  throw new Error("Navigation must expose role-aware filtering.");
}

const requiredKpis = [
  "Ingresos facturados",
  "Ingresos cobrados",
  "Cuentas por cobrar",
  "Citas agendadas",
  "Citas completadas",
  "No-shows",
  "Ocupacion agendada",
  "Ocupacion efectiva",
  "Brecha de asistencia",
  "Margen contribucion estimado",
  "Meta de ingresos",
];

for (const kpi of requiredKpis) {
  if (!dashboardData.includes(`label: "${kpi}"`)) {
    throw new Error(`Missing executive KPI: ${kpi}`);
  }
}

for (const requiredText of [
  "Entorno DEMO",
  "Completitud",
  "Fuentes utilizadas",
  "Ultima actualizacion",
]) {
  if (!dashboardComponent.includes(requiredText)) {
    throw new Error(`Dashboard is missing required text: ${requiredText}`);
  }
}

if (!contextHeader.includes("analiza:selected-context")) {
  throw new Error("Header context selector must persist selected context.");
}

let starterReferences = "";
try {
  starterReferences = execFileSync(
    "rg",
    ["Next.js Supabase Starter|Supabase Starter Kit", "app", "components"],
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

if (starterReferences.trim().length > 0) {
  throw new Error(`Starter text should not be visible:\n${starterReferences}`);
}

console.log("Phase 2 dashboard checks passed.");


import { readFileSync, statSync } from "node:fs";

const modelPath = "lib/analytics/business-control-center.ts";
const connectorsPath = "components/crm-connectors-dashboard.tsx";
const qualityPath = "components/data-quality-analia-dashboard.tsx";
const goalsPath = "components/goals-advances-dashboard.tsx";
const modulePagePath = "app/protected/[module]/page.tsx";
const docsPath = "docs/business-control-center.md";
const packagePath = "package.json";

for (const file of [
  modelPath,
  connectorsPath,
  qualityPath,
  goalsPath,
  modulePagePath,
  docsPath,
  packagePath,
]) {
  statSync(file);
}

const model = readFileSync(modelPath, "utf8");
const connectors = readFileSync(connectorsPath, "utf8");
const quality = readFileSync(qualityPath, "utf8");
const goals = readFileSync(goalsPath, "utf8");
const modulePage = readFileSync(modulePagePath, "utf8");
const docs = readFileSync(docsPath, "utf8");
const packageJson = readFileSync(packagePath, "utf8");

for (const requiredModelText of [
  "crmConnectorPlans",
  "analiaQualitySuggestions",
  "goalStrategySuggestions",
  "maskDemoApiKey",
  "buildDemoApiKey",
  "az_lab_demo",
  "az_fis_demo",
  "az_img_demo",
  "/api/connectors/crm/laboratorio/orders",
  "/api/connectors/crm/fisioterapia/appointments",
  "/api/connectors/crm/imagenes/studies",
  "simulatedRoiLow",
  "guardrail",
]) {
  if (!model.includes(requiredModelText)) {
    throw new Error(`Business control model is missing: ${requiredModelText}`);
  }
}

for (const requiredConnectorsText of [
  "CrmConnectorsDashboard",
  "Generar llave DEMO",
  "Credenciales reales solo en servidor",
  "No se debe pegar una llave real",
  "Copiar endpoint",
  "Fallback sin conector",
]) {
  if (!connectors.includes(requiredConnectorsText)) {
    throw new Error(`CRM connectors dashboard is missing: ${requiredConnectorsText}`);
  }
}

for (const requiredQualityText of [
  "DataQualityAnaliaDashboard",
  "Calidad de datos por AnaliA",
  "Aplicar",
  "Plantillas",
  "Dashboards",
  "tarea auditada",
  "sin inventar datos",
]) {
  if (!quality.includes(requiredQualityText)) {
    throw new Error(`Data quality dashboard is missing: ${requiredQualityText}`);
  }
}

for (const requiredGoalsText of [
  "GoalsAdvancesDashboard",
  "ROI simulado",
  "Sugerencias cautelosas",
  "Aprobar DEMO",
  "Colocacion de bonos",
  "Condicion para aprobar",
  "supuestos DEMO",
]) {
  if (!goals.includes(requiredGoalsText)) {
    throw new Error(`Goals dashboard is missing: ${requiredGoalsText}`);
  }
}

for (const requiredRouteText of [
  "CrmConnectorsDashboard",
  "DataQualityAnaliaDashboard",
  "GoalsAdvancesDashboard",
  'module === "conectores"',
  'module === "calidad-datos"',
  'module === "metas"',
]) {
  if (!modulePage.includes(requiredRouteText)) {
    throw new Error(`Module route is missing: ${requiredRouteText}`);
  }
}

for (const requiredDocsText of [
  "Conectores CRM",
  "llaves reales",
  "server-side",
  "Calidad de datos por AnaliA",
  "Metas, avances, bonos y ROI",
  "ROI es un rango `DEMO` simulado",
]) {
  if (!docs.includes(requiredDocsText)) {
    throw new Error(`Business control docs are missing: ${requiredDocsText}`);
  }
}

if (!packageJson.includes("tests/business-control-center.test.mjs")) {
  throw new Error("Test script must include business control center checks.");
}

console.log("Business control center checks passed.");

import { readFileSync, statSync } from "node:fs";

const modelPath = "lib/analytics/dashboard-validation-agent.ts";
const componentPath = "components/dashboard-validation-agent.tsx";
const appLayoutPath = "app/layout.tsx";
const globalStylesPath = "app/globals.css";
const docsPath = "docs/analia-data-science-agent.md";
const packagePath = "package.json";

for (const file of [
  modelPath,
  componentPath,
  appLayoutPath,
  globalStylesPath,
  docsPath,
  packagePath,
]) {
  statSync(file);
}

const model = readFileSync(modelPath, "utf8");
const component = readFileSync(componentPath, "utf8");
const appLayout = readFileSync(appLayoutPath, "utf8");
const globalStyles = readFileSync(globalStylesPath, "utf8");
const docs = readFileSync(docsPath, "utf8");
const packageJson = readFileSync(packagePath, "utf8");

for (const requiredModelText of [
  "DashboardValidationAudit",
  "DashboardAnalysisModel",
  "DashboardDensityStatus",
  "Lectura visual correcta",
  "Muy cargada",
  "Exploratorio",
  "Descriptivo",
  "Predictivo",
  "getDashboardAuditForPath",
  "getDashboardValidationSummary",
  "AnaliaScreenChatResponse",
  "createAnaliaScreenChatResponse",
  "comparacion",
  "detectChatIntent",
  "getScreenSignals",
  "compactChatBullets",
  "looksLikeNavigationDump",
  "getBusinessLineComparisonSummary",
  "getSingleLineComparisonSummary",
  "Si, pero la mejora es parcial",
  "dataStatus: \"DEMO\"",
  "/protected/overview",
  "/protected/operacion",
  "/protected/finanzas",
  "/protected/citas",
  "/protected/capacidad",
  "/protected/sucursales",
  "/protected/gerentes",
  "/protected/profesionales",
  "/protected/servicios",
  "/protected/fisioterapia",
  "/protected/laboratorio",
  "/protected/imagenes",
  "/protected/insights",
  "/protected/importaciones",
  "/protected/plantillas",
]) {
  if (!model.includes(requiredModelText)) {
    throw new Error(`Dashboard validation model is missing: ${requiredModelText}`);
  }
}

for (const requiredComponentText of [
  "DashboardValidationAgent",
  "Hablar con AnaliA",
  "Preguntar a AnaliA sobre esta pantalla",
  "Resumeme los insights mas importantes",
  "Hay algo critico?",
  "Lee esta pantalla",
  "Que hago primero?",
  "getReadableScreenText",
  "getFriendlyBullets",
  "rounded-br-sm",
  "rounded-bl-sm",
  "max-w-[82%]",
  "createAnaliaScreenChatResponse",
  "Fuentes:",
  "data-analia-dashboard-mode",
  "data-analia-dashboard-density",
  "Chat con AnaliA",
  "Ajustes aplicados",
  "Validacion",
  "usePathname",
]) {
  if (!component.includes(requiredComponentText)) {
    throw new Error(`Dashboard validation component is missing: ${requiredComponentText}`);
  }
}

if (!appLayout.includes("DashboardValidationAgent")) {
  throw new Error("Root layout must mount DashboardValidationAgent.");
}

for (const requiredStyleText of [
  '[data-analia-dashboard-mode="visual"]',
  '[data-analia-dashboard-density="Muy cargada"]',
  "scroll-padding-bottom",
]) {
  if (!globalStyles.includes(requiredStyleText)) {
    throw new Error(`Visual reading styles are missing: ${requiredStyleText}`);
  }
}

for (const requiredDocsText of [
  "Auditoria visual de dashboards",
  "cada pestana del BI",
  "Lectura visual correcta",
  "Cargada",
  "Muy cargada",
  "Burbuja de chat global",
  "lectura de la pantalla visible",
  "burbujas breves",
  "filtra navegacion",
  "motor `DEMO` deterministico",
]) {
  if (!docs.includes(requiredDocsText)) {
    throw new Error(`AnaliA docs are missing: ${requiredDocsText}`);
  }
}

if (!packageJson.includes("tests/dashboard-validation-agent.test.mjs")) {
  throw new Error("Test script must include dashboard validation checks.");
}

console.log("Dashboard validation agent checks passed.");

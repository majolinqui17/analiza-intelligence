import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function readWorkspaceFile(path) {
  return readFileSync(join(root, path), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

const componentPath = "components/manual-monthly-entry-dashboard.tsx";
const component = readWorkspaceFile(componentPath);
const importDashboard = readWorkspaceFile(
  "components/import-operations-dashboard.tsx",
);
const importOperations = readWorkspaceFile("lib/analytics/import-operations.ts");
const modulePage = readWorkspaceFile("app/protected/[module]/page.tsx");
const navigation = readWorkspaceFile("lib/navigation.ts");
const packageJson = readWorkspaceFile("package.json");
const documentationExists = existsSync(join(root, "docs/manual-monthly-entry.md"));

assert(
  component.includes("Formulario mensual de cierre"),
  "Manual monthly dashboard must expose the monthly closing form.",
);
assert(
  component.includes("analiza:manual-monthly-history"),
  "Manual monthly dashboard must persist DEMO history locally.",
);
assert(
  component.includes("Guardar avance DEMO") &&
    component.includes("Publicar cierre DEMO"),
  "Manual monthly dashboard must support draft and publish actions.",
);
assert(
  component.includes("useActiveBusinessLine"),
  "Manual monthly dashboard must be driven by the selected business line.",
);
assert(
  component.includes("demoBranches") &&
    component.includes("getBranchOptionsForLine") &&
    component.includes("Selecciona una sucursal"),
  "Manual monthly dashboard must render branch_reported as a branch selector.",
);
assert(
  importDashboard.includes("ManualMonthlyEntryDashboard"),
  "Import operations must render the manual monthly dashboard.",
);
assert(
  modulePage.includes('module === "plantillas"') &&
    modulePage.includes("ManualMonthlyEntryDashboard"),
  "The Plantillas route must render the manual monthly dashboard.",
);
assert(
  navigation.includes('title: "Formulario mensual"') &&
    navigation.includes('href: "/protected/plantillas"'),
  "Navigation must expose the monthly form where Plantillas used to be.",
);
assert(
  importOperations.includes("manualMonthlyFormSteps") &&
    importOperations.includes("manualMonthlyHistory"),
  "Import operations data model must include form steps and history.",
);

for (const businessLine of ["Laboratorio", "Fisioterapia", "Imagenes"]) {
  assert(
    importOperations.includes(`businessLine: "${businessLine}"`) ||
      importOperations.includes(`appliesTo: ["${businessLine}"]`),
    `Manual monthly model must include ${businessLine}.`,
  );
}

assert(
  importOperations.includes("sourceTrace"),
  "Manual monthly history must preserve source traceability.",
);
assert(
  documentationExists,
  "Manual monthly entry decision must be documented.",
);
assert(
  packageJson.includes("manual-monthly-entry.test.mjs"),
  "The manual monthly entry test must run in npm test.",
);

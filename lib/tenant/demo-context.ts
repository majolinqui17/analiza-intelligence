import { elSalvadorBranchResultTemplates } from "@/lib/analytics/el-salvador-result-templates";
import type { BusinessLineCode } from "@/lib/analytics/kpi-registry";

export type CountryOption = {
  id: string;
  iso2: string;
  name: string;
  currencyCode: string;
  timeZone: string;
  dateFormat: string;
  scope?: "country" | "regional";
  isDemo: true;
};

export type CompanyOption = {
  id: string;
  key: string;
  name: string;
  unitType: "consolidado" | "fisioterapia" | "laboratorio" | "imagenes";
  isConsolidated?: true;
  isDemo: true;
};

export type BusinessLineOption = {
  id: string;
  code: BusinessLineCode;
  name: string;
  companyId: string | null;
  unitType: CompanyOption["unitType"];
  isConsolidated?: true;
  isDemo: true;
};

export type BranchOption = {
  id: string;
  countryId: string;
  companyId: string;
  code: string;
  name: string;
  city: string;
  isDemo: true;
};

export type RoleKey =
  | "webmaster_admin"
  | "ceo"
  | "gerente_operaciones"
  | "gerente_sucursal";

export const demoCountries: CountryOption[] = [
  {
    id: "30000000-0000-4000-8000-000000000001",
    iso2: "GT",
    name: "Guatemala",
    currencyCode: "GTQ",
    timeZone: "America/Guatemala",
    dateFormat: "dd/MM/yyyy",
    isDemo: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000002",
    iso2: "BZ",
    name: "Belice",
    currencyCode: "BZD",
    timeZone: "America/Belize",
    dateFormat: "dd/MM/yyyy",
    isDemo: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000003",
    iso2: "SV",
    name: "El Salvador",
    currencyCode: "USD",
    timeZone: "America/El_Salvador",
    dateFormat: "dd/MM/yyyy",
    isDemo: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000004",
    iso2: "HN",
    name: "Honduras",
    currencyCode: "HNL",
    timeZone: "America/Tegucigalpa",
    dateFormat: "dd/MM/yyyy",
    isDemo: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000005",
    iso2: "NI",
    name: "Nicaragua",
    currencyCode: "NIO",
    timeZone: "America/Managua",
    dateFormat: "dd/MM/yyyy",
    isDemo: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000006",
    iso2: "CR",
    name: "Costa Rica",
    currencyCode: "CRC",
    timeZone: "America/Costa_Rica",
    dateFormat: "dd/MM/yyyy",
    isDemo: true,
  },
  {
    id: "30000000-0000-4000-8000-000000000007",
    iso2: "PA",
    name: "Panama",
    currencyCode: "PAB",
    timeZone: "America/Panama",
    dateFormat: "dd/MM/yyyy",
    isDemo: true,
  },
];

export const regionalCountryId = "__regional__";

export const regionalCountry: CountryOption = {
  id: regionalCountryId,
  iso2: "REG",
  name: "Vista regional",
  currencyCode: "MULTI",
  timeZone: "America/El_Salvador",
  dateFormat: "dd/MM/yyyy",
  scope: "regional",
  isDemo: true,
};

export const demoCountryOptions: CountryOption[] = [
  regionalCountry,
  ...demoCountries,
];

export const demoCompanies: CompanyOption[] = [
  {
    id: "40000000-0000-4000-8000-000000000001",
    key: "analiza-fisioterapia",
    name: "Analiza Fisioterapia",
    unitType: "fisioterapia",
    isDemo: true,
  },
  {
    id: "40000000-0000-4000-8000-000000000002",
    key: "analiza-laboratorio",
    name: "Analiza Laboratorio",
    unitType: "laboratorio",
    isDemo: true,
  },
  {
    id: "40000000-0000-4000-8000-000000000003",
    key: "analiza-imagenes",
    name: "Analiza Imagenes",
    unitType: "imagenes",
    isDemo: true,
  },
];

export const consolidatedCompanyId = "__consolidated__";

export const consolidatedCompany: CompanyOption = {
  id: consolidatedCompanyId,
  key: "vista-consolidada",
  name: "Vista consolidada",
  unitType: "consolidado",
  isConsolidated: true,
  isDemo: true,
};

export const demoCompanyOptions: CompanyOption[] = [
  consolidatedCompany,
  ...demoCompanies,
];

export const demoBusinessLineOptions: BusinessLineOption[] = [
  {
    id: consolidatedCompanyId,
    code: "CONSOLIDATED",
    name: "Consolidado",
    companyId: null,
    unitType: "consolidado",
    isConsolidated: true,
    isDemo: true,
  },
  {
    id: "business-line-fisioterapia",
    code: "PHYSIOTHERAPY",
    name: "Analiza Fisioterapia",
    companyId: "40000000-0000-4000-8000-000000000001",
    unitType: "fisioterapia",
    isDemo: true,
  },
  {
    id: "business-line-laboratorio",
    code: "LABORATORY",
    name: "Analiza Laboratorio",
    companyId: "40000000-0000-4000-8000-000000000002",
    unitType: "laboratorio",
    isDemo: true,
  },
  {
    id: "business-line-imagenes",
    code: "IMAGING",
    name: "Analiza Imagenes",
    companyId: "40000000-0000-4000-8000-000000000003",
    unitType: "imagenes",
    isDemo: true,
  },
];

export function getBusinessLineForCompany(companyId: string) {
  return (
    demoBusinessLineOptions.find((line) => line.companyId === companyId) ??
    demoBusinessLineOptions[0]
  );
}

export function getCompanyForBusinessLine(businessLineId: string) {
  const businessLine = demoBusinessLineOptions.find(
    (line) => line.id === businessLineId,
  );

  if (!businessLine || businessLine.isConsolidated || !businessLine.companyId) {
    return consolidatedCompany;
  }

  return (
    demoCompanies.find((company) => company.id === businessLine.companyId) ??
    consolidatedCompany
  );
}

const elSalvadorCountryId = "30000000-0000-4000-8000-000000000003";
const laboratorioCompanyId = "40000000-0000-4000-8000-000000000002";

const demoCountryCities: Record<string, string> = {
  GT: "Ciudad de Guatemala",
  BZ: "Belice",
  SV: "San Salvador",
  HN: "Tegucigalpa",
  NI: "Managua",
  CR: "San Jose",
  PA: "Panama",
};

const demoUnitCodes: Record<CompanyOption["unitType"], string> = {
  consolidado: "CON",
  fisioterapia: "FIS",
  laboratorio: "LAB",
  imagenes: "IMG",
};

function getBusinessUnitName(company: CompanyOption) {
  return company.name.replace("Analiza ", "");
}

const generatedDemoBranches: BranchOption[] = demoCountries.flatMap((country) =>
  demoCompanies.map((company) => ({
    id: `demo-branch-${country.iso2}-${company.key}`,
    countryId: country.id,
    companyId: company.id,
    code: `${country.iso2}-${demoUnitCodes[company.unitType]}-DEMO`,
    name: `Sucursal DEMO ${getBusinessUnitName(company)} ${country.name}`,
    city: demoCountryCities[country.iso2] ?? country.name,
    isDemo: true,
  })),
);

export const elSalvadorResultBranches: BranchOption[] =
  elSalvadorBranchResultTemplates.map((branch) => ({
    id: branch.id,
    countryId: elSalvadorCountryId,
    companyId: laboratorioCompanyId,
    code: branch.branchCode,
    name: branch.branchName,
    city: branch.city,
    isDemo: true,
  }));

export const demoBranches: BranchOption[] = [
  ...generatedDemoBranches.filter(
    (branch) =>
      !(
        branch.countryId === elSalvadorCountryId &&
        branch.companyId === laboratorioCompanyId
      ),
  ),
  ...elSalvadorResultBranches,
];

export const roleKeys: RoleKey[] = [
  "webmaster_admin",
  "ceo",
  "gerente_operaciones",
  "gerente_sucursal",
];

export const demoRoleProfiles: Record<
  RoleKey,
  {
    label: string;
    description: string;
    accessSummary: string;
  }
> = {
  webmaster_admin: {
    label: "Webmaster / Administrador",
    description:
      "Disena dashboards, configura modulos, crea usuarios y asigna roles.",
    accessSummary: "Acceso total al sistema Analiza BI.",
  },
  ceo: {
    label: "CEO",
    description:
      "Consulta la salud ejecutiva de Analiza y sus lineas de negocio.",
    accessSummary: "Lectura ejecutiva regional, por negocio y por sucursal.",
  },
  gerente_operaciones: {
    label: "Gerente de operaciones",
    description:
      "Gestiona una linea de negocio y carga plantillas de sucursales.",
    accessSummary: "Carga plantillas y revisa operacion de su linea.",
  },
  gerente_sucursal: {
    label: "Gerente de sucursal",
    description:
      "Consulta resultados de su sucursal para exponerlos al CEO.",
    accessSummary: "Solo lectura de resultados de plantillas asignadas.",
  },
};

export const demoDefaultPeriod = "2026-07";

export function getDefaultPeriod() {
  return demoDefaultPeriod;
}

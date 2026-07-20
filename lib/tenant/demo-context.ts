export type CountryOption = {
  id: string;
  iso2: string;
  name: string;
  currencyCode: string;
  timeZone: string;
  dateFormat: string;
  isDemo: true;
};

export type CompanyOption = {
  id: string;
  key: string;
  name: string;
  unitType: "fisioterapia" | "laboratorio" | "imagenes";
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
  | "super_admin"
  | "director_ejecutivo_grupo"
  | "director_pais"
  | "director_empresa"
  | "director_financiero"
  | "director_operaciones"
  | "gerente_sucursal"
  | "analista_bi"
  | "cargador_datos"
  | "auditor"
  | "viewer";

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

export const demoBranches: BranchOption[] = [
  {
    id: "50000000-0000-4000-8000-000000000001",
    countryId: "30000000-0000-4000-8000-000000000004",
    companyId: "40000000-0000-4000-8000-000000000001",
    code: "HN-FIS-001",
    name: "Sucursal DEMO Fisioterapia Norte",
    city: "San Pedro Sula",
    isDemo: true,
  },
  {
    id: "50000000-0000-4000-8000-000000000002",
    countryId: "30000000-0000-4000-8000-000000000004",
    companyId: "40000000-0000-4000-8000-000000000002",
    code: "HN-LAB-001",
    name: "Sucursal DEMO Laboratorio Central",
    city: "Tegucigalpa",
    isDemo: true,
  },
  {
    id: "50000000-0000-4000-8000-000000000003",
    countryId: "30000000-0000-4000-8000-000000000004",
    companyId: "40000000-0000-4000-8000-000000000003",
    code: "HN-IMG-001",
    name: "Sucursal DEMO Imagenes Este",
    city: "Tegucigalpa",
    isDemo: true,
  },
  {
    id: "50000000-0000-4000-8000-000000000004",
    countryId: "30000000-0000-4000-8000-000000000003",
    companyId: "40000000-0000-4000-8000-000000000001",
    code: "SV-FIS-001",
    name: "Sucursal DEMO Fisioterapia Centro",
    city: "San Salvador",
    isDemo: true,
  },
  {
    id: "50000000-0000-4000-8000-000000000005",
    countryId: "30000000-0000-4000-8000-000000000006",
    companyId: "40000000-0000-4000-8000-000000000002",
    code: "CR-LAB-001",
    name: "Sucursal DEMO Laboratorio Oeste",
    city: "San Jose",
    isDemo: true,
  },
  {
    id: "50000000-0000-4000-8000-000000000006",
    countryId: "30000000-0000-4000-8000-000000000007",
    companyId: "40000000-0000-4000-8000-000000000003",
    code: "PA-IMG-001",
    name: "Sucursal DEMO Imagenes Pacifico",
    city: "Panama",
    isDemo: true,
  },
];

export const roleKeys: RoleKey[] = [
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

export function getDefaultPeriod() {
  return new Date().toISOString().slice(0, 7);
}


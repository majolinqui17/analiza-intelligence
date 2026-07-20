"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, CalendarDays, CheckCircle2, Globe2, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type BranchOption,
  type CompanyOption,
  type CountryOption,
  getDefaultPeriod,
} from "@/lib/tenant/demo-context";

const allBranchesValue = "__all__";
const storageKey = "analiza:selected-context";

type ContextSelectionFormProps = {
  userEmail: string;
  countries: CountryOption[];
  companies: CompanyOption[];
  branches: BranchOption[];
};

type StoredContext = {
  countryId: string;
  countryName: string;
  companyId: string;
  companyName: string;
  branchId: string;
  branchName: string;
  period: string;
  isDemo: boolean;
};

function firstCountryWithBranches(
  countries: CountryOption[],
  branches: BranchOption[],
) {
  return (
    countries.find((country) =>
      branches.some((branch) => branch.countryId === country.id),
    ) ?? countries[0]
  );
}

export function ContextSelectionForm({
  userEmail,
  countries,
  companies,
  branches,
}: ContextSelectionFormProps) {
  const router = useRouter();
  const initialCountry = firstCountryWithBranches(countries, branches);
  const [countryId, setCountryId] = useState(initialCountry?.id ?? "");
  const [companyId, setCompanyId] = useState("");
  const [branchId, setBranchId] = useState(allBranchesValue);
  const [period, setPeriod] = useState(getDefaultPeriod());

  const countryBranches = useMemo(
    () => branches.filter((branch) => branch.countryId === countryId),
    [branches, countryId],
  );

  const availableCompanies = useMemo(() => {
    const companyIds = new Set(
      countryBranches.map((branch) => branch.companyId),
    );

    return companies.filter((company) => companyIds.has(company.id));
  }, [companies, countryBranches]);

  const availableBranches = useMemo(
    () =>
      countryBranches.filter((branch) => branch.companyId === companyId),
    [companyId, countryBranches],
  );

  useEffect(() => {
    const nextCompany = availableCompanies[0]?.id ?? "";
    setCompanyId((currentCompanyId) =>
      availableCompanies.some((company) => company.id === currentCompanyId)
        ? currentCompanyId
        : nextCompany,
    );
  }, [availableCompanies]);

  useEffect(() => {
    setBranchId((currentBranchId) =>
      currentBranchId === allBranchesValue ||
      availableBranches.some((branch) => branch.id === currentBranchId)
        ? currentBranchId
        : allBranchesValue,
    );
  }, [availableBranches]);

  const selectedCountry = countries.find((country) => country.id === countryId);
  const selectedCompany = companies.find((company) => company.id === companyId);
  const selectedBranch =
    branchId === allBranchesValue
      ? null
      : branches.find((branch) => branch.id === branchId);

  const canContinue =
    selectedCountry !== undefined &&
    selectedCompany !== undefined &&
    period.length > 0;

  function saveContext() {
    if (!selectedCountry || !selectedCompany) {
      return;
    }

    const context: StoredContext = {
      countryId: selectedCountry.id,
      countryName: selectedCountry.name,
      companyId: selectedCompany.id,
      companyName: selectedCompany.name,
      branchId,
      branchName: selectedBranch?.name ?? "Todas las sucursales permitidas",
      period,
      isDemo: true,
    };

    window.localStorage.setItem(storageKey, JSON.stringify(context));
    router.push("/protected/overview");
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 py-8">
      <div className="flex flex-col gap-3">
        <Badge className="w-fit bg-amber-100 text-amber-800 hover:bg-amber-100">
          Entorno DEMO
        </Badge>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">{userEmail}</p>
          <h1 className="text-3xl font-semibold tracking-normal text-foreground">
            Seleccion de contexto
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Elige el alcance operativo para mantener pais, empresa, sucursal y
            periodo al navegar.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <label className="flex min-h-32 flex-col gap-3 rounded-md border bg-card p-4">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Globe2 className="size-4 text-primary" />
            Pais
          </span>
          <select
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            value={countryId}
            onChange={(event) => setCountryId(event.target.value)}
          >
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          <span className="text-xs text-muted-foreground">
            {selectedCountry?.currencyCode ?? "Sin moneda"}
          </span>
        </label>

        <label className="flex min-h-32 flex-col gap-3 rounded-md border bg-card p-4">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Building2 className="size-4 text-primary" />
            Empresa
          </span>
          <select
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            value={companyId}
            onChange={(event) => setCompanyId(event.target.value)}
            disabled={availableCompanies.length === 0}
          >
            {availableCompanies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          <span className="text-xs text-muted-foreground">
            {availableCompanies.length} empresas habilitadas
          </span>
        </label>

        <label className="flex min-h-32 flex-col gap-3 rounded-md border bg-card p-4">
          <span className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="size-4 text-primary" />
            Sucursal
          </span>
          <select
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            value={branchId}
            onChange={(event) => setBranchId(event.target.value)}
            disabled={availableBranches.length === 0}
          >
            <option value={allBranchesValue}>
              Todas las sucursales permitidas
            </option>
            {availableBranches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          <span className="text-xs text-muted-foreground">
            {availableBranches.length} sucursales disponibles
          </span>
        </label>

        <label className="flex min-h-32 flex-col gap-3 rounded-md border bg-card p-4">
          <span className="flex items-center gap-2 text-sm font-medium">
            <CalendarDays className="size-4 text-primary" />
            Periodo
          </span>
          <input
            className="h-10 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            type="month"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          />
          <span className="text-xs text-muted-foreground">
            Periodo activo para filtros
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-4 rounded-md border bg-card p-4 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-1 text-sm">
          <span className="font-medium">Contexto seleccionado</span>
          <span className="text-muted-foreground">
            {selectedCountry?.name ?? "Sin pais"} /{" "}
            {selectedCompany?.name ?? "Sin empresa"} /{" "}
            {selectedBranch?.name ?? "Todas las sucursales permitidas"} /{" "}
            {period}
          </span>
        </div>
        <Button
          className="gap-2"
          disabled={!canContinue}
          onClick={saveContext}
          type="button"
        >
          <CheckCircle2 className="size-4" />
          Continuar
        </Button>
      </div>
    </section>
  );
}


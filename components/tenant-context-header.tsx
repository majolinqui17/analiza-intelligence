"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Globe2, MapPin, Building2 } from "lucide-react";

import {
  demoBranches,
  demoCompanies,
  demoCountries,
  getDefaultPeriod,
} from "@/lib/tenant/demo-context";

const allBranchesValue = "__all__";
const storageKey = "analiza:selected-context";

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

function getInitialCountryId() {
  return (
    demoCountries.find((country) =>
      demoBranches.some((branch) => branch.countryId === country.id),
    )?.id ?? demoCountries[0]?.id ?? ""
  );
}

function readStoredContext() {
  const rawContext = window.localStorage.getItem(storageKey);
  if (!rawContext) {
    return null;
  }

  try {
    return JSON.parse(rawContext) as StoredContext;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

export function TenantContextHeader() {
  const [countryId, setCountryId] = useState(getInitialCountryId());
  const [companyId, setCompanyId] = useState("");
  const [branchId, setBranchId] = useState(allBranchesValue);
  const [period, setPeriod] = useState(getDefaultPeriod());

  const countryBranches = useMemo(
    () => demoBranches.filter((branch) => branch.countryId === countryId),
    [countryId],
  );

  const companies = useMemo(() => {
    const companyIds = new Set(
      countryBranches.map((branch) => branch.companyId),
    );
    return demoCompanies.filter((company) => companyIds.has(company.id));
  }, [countryBranches]);

  const branches = useMemo(
    () => countryBranches.filter((branch) => branch.companyId === companyId),
    [companyId, countryBranches],
  );

  useEffect(() => {
    const storedContext = readStoredContext();
    if (!storedContext) {
      return;
    }

    setCountryId(storedContext.countryId);
    setCompanyId(storedContext.companyId);
    setBranchId(storedContext.branchId);
    setPeriod(storedContext.period);
  }, []);

  useEffect(() => {
    const nextCompanyId = companies[0]?.id ?? "";
    setCompanyId((currentCompanyId) =>
      companies.some((company) => company.id === currentCompanyId)
        ? currentCompanyId
        : nextCompanyId,
    );
  }, [companies]);

  useEffect(() => {
    setBranchId((currentBranchId) =>
      currentBranchId === allBranchesValue ||
      branches.some((branch) => branch.id === currentBranchId)
        ? currentBranchId
        : allBranchesValue,
    );
  }, [branches]);

  useEffect(() => {
    const country = demoCountries.find((item) => item.id === countryId);
    const company = demoCompanies.find((item) => item.id === companyId);
    const branch = demoBranches.find((item) => item.id === branchId);

    if (!country || !company) {
      return;
    }

    const context: StoredContext = {
      countryId: country.id,
      countryName: country.name,
      companyId: company.id,
      companyName: company.name,
      branchId,
      branchName: branch?.name ?? "Todas las sucursales permitidas",
      period,
      isDemo: true,
    };

    window.localStorage.setItem(storageKey, JSON.stringify(context));
  }, [branchId, companyId, countryId, period]);

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2 lg:justify-end">
      <label className="flex h-9 items-center gap-2 rounded-md border bg-background px-2 text-xs">
        <Globe2 className="size-3.5 text-muted-foreground" />
        <select
          className="min-w-28 bg-transparent outline-none"
          value={countryId}
          onChange={(event) => setCountryId(event.target.value)}
        >
          {demoCountries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex h-9 items-center gap-2 rounded-md border bg-background px-2 text-xs">
        <Building2 className="size-3.5 text-muted-foreground" />
        <select
          className="min-w-36 bg-transparent outline-none"
          value={companyId}
          onChange={(event) => setCompanyId(event.target.value)}
        >
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex h-9 items-center gap-2 rounded-md border bg-background px-2 text-xs">
        <MapPin className="size-3.5 text-muted-foreground" />
        <select
          className="min-w-44 bg-transparent outline-none"
          value={branchId}
          onChange={(event) => setBranchId(event.target.value)}
        >
          <option value={allBranchesValue}>Todas las sucursales</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex h-9 items-center gap-2 rounded-md border bg-background px-2 text-xs">
        <CalendarDays className="size-3.5 text-muted-foreground" />
        <input
          className="w-32 bg-transparent outline-none"
          type="month"
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
        />
      </label>
    </div>
  );
}


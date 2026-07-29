"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  LineChart,
  LockKeyhole,
  UserPlus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  moduleConfigs,
  type ModuleConfig,
  type ModuleInsight,
  type ModuleMetric,
} from "@/lib/analytics/demo-business-modules";
import {
  demoBranches,
  demoCompanyOptions,
  demoRoleProfiles,
  roleKeys,
  type RoleKey,
} from "@/lib/tenant/demo-context";
import { cn } from "@/lib/utils";

const storageKey = "analiza:selected-context";
const contextChangeEvent = "analiza:context-change";
const roleStorageKey = "analiza:demo-role";
const roleChangeEvent = "analiza:role-change";
const demoUsersStorageKey = "analiza:demo-users";

type StoredContext = {
  countryName: string;
  companyName: string;
  branchName: string;
  period?: string;
  periodStart?: string;
  periodEnd?: string;
  isDemo: boolean;
};

type BusinessModuleDashboardProps = {
  module: string;
};

type DemoManagedUser = {
  id: string;
  fullName: string;
  email: string;
  roleKey: RoleKey;
  businessScope: string;
  areaScope?: string;
  branchScope: string;
  status: "Activo" | "Pendiente";
  createdAt: string;
};

const businessHealth = [
  {
    business: "Fisioterapia",
    financial: 89,
    operational: 91,
    target: 94,
    note: "Alta demanda, vigilar asistencia efectiva",
  },
  {
    business: "Laboratorio",
    financial: 78,
    operational: 86,
    target: 90,
    note: "Costo variable y tiempos de entrega en observacion",
  },
  {
    business: "Imagenes",
    financial: 74,
    operational: 80,
    target: 87,
    note: "Capacidad ociosa y costos fijos pendientes",
  },
];

const allBusinessScope = "Todas las lineas de negocio";
const allAreaScope = "Todas las gerencias de area";
const allBranchScope = "Todas las sucursales";
const initialDemoUsers: DemoManagedUser[] = [
  {
    id: "demo-admin",
    fullName: "Administrador DEMO",
    email: "admin.demo@analiza.local",
    roleKey: "webmaster_admin",
    businessScope: allBusinessScope,
    areaScope: allAreaScope,
    branchScope: allBranchScope,
    status: "Activo",
    createdAt: "2026-07-21",
  },
];

function readStoredContext() {
  if (typeof window === "undefined") {
    return null;
  }

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

function readActiveDemoRole(): RoleKey {
  if (typeof window === "undefined") {
    return "webmaster_admin";
  }

  const storedRole = window.localStorage.getItem(roleStorageKey);

  if (roleKeys.includes(storedRole as RoleKey)) {
    return storedRole as RoleKey;
  }

  return "webmaster_admin";
}

function readDemoUsers() {
  if (typeof window === "undefined") {
    return initialDemoUsers;
  }

  const rawUsers = window.localStorage.getItem(demoUsersStorageKey);
  if (!rawUsers) {
    return initialDemoUsers;
  }

  try {
    const parsedUsers = JSON.parse(rawUsers) as DemoManagedUser[];
    return parsedUsers.length > 0 ? parsedUsers : initialDemoUsers;
  } catch {
    window.localStorage.removeItem(demoUsersStorageKey);
    return initialDemoUsers;
  }
}

function persistDemoUsers(users: DemoManagedUser[]) {
  window.localStorage.setItem(demoUsersStorageKey, JSON.stringify(users));
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function metricToneClass(tone: ModuleMetric["tone"]) {
  if (tone === "positive") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  if (tone === "warning") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  if (tone === "negative") {
    return "border-red-200 bg-red-50 text-red-800";
  }

  return "border-border bg-muted text-muted-foreground";
}

function priorityClass(priority: ModuleInsight["priority"]) {
  if (priority === "alta") {
    return "bg-red-100 text-red-800 hover:bg-red-100";
  }

  if (priority === "media") {
    return "bg-amber-100 text-amber-800 hover:bg-amber-100";
  }

  return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
}

function MetricCard({ metric }: { metric: ModuleMetric }) {
  return (
    <article className="flex min-h-32 flex-col justify-between rounded-md border bg-card p-4">
      <div className="grid gap-1">
        <h2 className="text-sm font-medium text-muted-foreground">
          {metric.label}
        </h2>
        <p className="text-2xl font-semibold tracking-normal">
          {metric.value}
        </p>
      </div>
      <span
        className={cn(
          "w-fit rounded-md border px-2 py-1 text-xs font-medium",
          metricToneClass(metric.tone),
        )}
      >
        {metric.note}
      </span>
    </article>
  );
}

function HealthBar({
  label,
  value,
  tone = "primary",
}: {
  label: string;
  value: number;
  tone?: "primary" | "muted";
}) {
  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div
          className={cn(
            "h-2 rounded-full",
            tone === "primary" ? "bg-primary" : "bg-muted-foreground",
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ScopeCard({ context }: { context: StoredContext | null }) {
  const period =
    context?.period ??
    (context?.periodStart && context?.periodEnd
      ? `${context.periodStart} a ${context.periodEnd}`
      : "Rango pendiente");

  return (
    <aside className="rounded-md border bg-card p-4 text-sm">
      <div className="mb-2 flex items-center gap-2 font-medium">
        <CheckCircle2 className="size-4 text-primary" />
        Filtro aplicado
      </div>
      <div className="grid gap-1 text-muted-foreground">
        <span>{context?.countryName ?? "Vista regional"}</span>
        <span>{context?.companyName ?? "Vista consolidada"}</span>
        <span>{context?.branchName ?? "Todas las sucursales"}</span>
        <span>Periodo: {period}</span>
      </div>
    </aside>
  );
}

function BusinessHealthSection() {
  return (
    <section className="rounded-md border bg-card p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium">
        <LineChart className="size-4 text-primary" />
        Salud financiera y operativa por negocio
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {businessHealth.map((item) => (
          <article className="grid gap-3 rounded-md border p-3" key={item.business}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">{item.business}</h3>
              <Badge variant="outline">Meta {item.target}%</Badge>
            </div>
            <HealthBar label="Salud financiera" value={item.financial} />
            <HealthBar label="Salud operativa" value={item.operational} />
            <HealthBar label="Avance meta" tone="muted" value={item.target} />
            <p className="text-xs leading-5 text-muted-foreground">{item.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ModuleInsights({ config }: { config: ModuleConfig }) {
  return (
    <section className="rounded-md border bg-card p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium">
        <AlertTriangle className="size-4 text-primary" />
        Insights y acciones sugeridas
      </div>
      <div className="grid gap-3">
        {config.insights.map((insight) => (
          <article
            className="grid gap-2 border-t py-3 first:border-t-0 first:pt-0 last:pb-0"
            key={insight.title}
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={priorityClass(insight.priority)}>
                {insight.priority}
              </Badge>
              <h3 className="text-sm font-semibold">{insight.title}</h3>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {insight.detail}
            </p>
            <p className="text-sm font-medium">Accion: {insight.action}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ModuleRows({ config }: { config: ModuleConfig }) {
  return (
    <section className="rounded-md border bg-card p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium">
        <ClipboardList className="size-4 text-primary" />
        Detalle operativo
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs text-muted-foreground">
            <tr className="border-b">
              <th className="py-2 pr-4 font-medium">Concepto</th>
              <th className="py-2 pr-4 font-medium">Responsable</th>
              <th className="py-2 pr-4 font-medium">Resultado</th>
              <th className="py-2 pr-4 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {config.rows.map((row) => (
              <tr className="border-b last:border-b-0" key={`${row.label}-${row.owner}`}>
                <td className="py-3 pr-4 font-medium">{row.label}</td>
                <td className="py-3 pr-4">{row.owner}</td>
                <td className="py-3 pr-4">{row.value}</td>
                <td className="py-3 pr-4 text-muted-foreground">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function UsersAndPermissionsManager({
  context,
}: {
  context: StoredContext | null;
}) {
  const [activeRole, setActiveRole] = useState<RoleKey>("webmaster_admin");
  const [users, setUsers] = useState<DemoManagedUser[]>(initialDemoUsers);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [roleKey, setRoleKey] = useState<RoleKey>("gerente_sucursal");
  const [businessScope, setBusinessScope] = useState(allBusinessScope);
  const [areaScope, setAreaScope] = useState(allAreaScope);
  const [branchScope, setBranchScope] = useState(allBranchScope);
  const [message, setMessage] = useState("");

  const isWebmaster = activeRole === "webmaster_admin";
  const businessOptions = useMemo(
    () => [
      allBusinessScope,
      ...demoCompanyOptions
        .filter((company) => !company.isConsolidated)
        .map((company) => company.name),
    ],
    [],
  );
  const branchOptions = useMemo(
    () => [
      allBranchScope,
      ...Array.from(new Set(demoBranches.map((branch) => branch.name))).sort(),
    ],
    [],
  );
  const areaOptions = useMemo(
    () => [
      allAreaScope,
      ...Array.from(
        new Set(
          demoBranches
            .map((branch) => branch.areaManagerName)
            .filter((managerName): managerName is string =>
              Boolean(managerName),
            ),
        ),
      ).sort(),
    ],
    [],
  );

  useEffect(() => {
    setUsers(readDemoUsers());

    function refreshRole() {
      setActiveRole(readActiveDemoRole());
    }

    refreshRole();
    window.addEventListener("storage", refreshRole);
    window.addEventListener(roleChangeEvent, refreshRole);

    return () => {
      window.removeEventListener("storage", refreshRole);
      window.removeEventListener(roleChangeEvent, refreshRole);
    };
  }, []);

  useEffect(() => {
    if (context?.companyName) {
      setBusinessScope(
        businessOptions.includes(context.companyName)
          ? context.companyName
          : allBusinessScope,
      );
    }

    if (context?.branchName) {
      setBranchScope(
        branchOptions.includes(context.branchName)
          ? context.branchName
          : allBranchScope,
      );
    }
  }, [
    branchOptions,
    businessOptions,
    context?.branchName,
    context?.companyName,
  ]);

  function createDemoUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isWebmaster) {
      setMessage("Solo Webmaster / Administrador puede crear usuarios.");
      return;
    }

    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName || !normalizedEmail) {
      setMessage("Completa nombre y correo para crear el usuario.");
      return;
    }

    if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      setMessage("Ese correo ya existe en usuarios DEMO.");
      return;
    }

    const nextUsers: DemoManagedUser[] = [
      {
        id: `demo-user-${Date.now()}`,
        fullName: normalizedName,
        email: normalizedEmail,
        roleKey,
        businessScope:
          roleKey === "webmaster_admin" || roleKey === "ceo"
            ? allBusinessScope
            : businessScope,
        areaScope: roleKey === "gerente_area" ? areaScope : allAreaScope,
        branchScope: roleKey === "gerente_sucursal" ? branchScope : allBranchScope,
        status: "Activo",
        createdAt: todayIsoDate(),
      },
      ...users,
    ];

    setUsers(nextUsers);
    persistDemoUsers(nextUsers);
    setFullName("");
    setEmail("");
    setRoleKey("gerente_sucursal");
    setAreaScope(allAreaScope);
    setMessage("Usuario DEMO creado con su rol asignado.");
  }

  function updateUserRole(userId: string, nextRole: RoleKey) {
    if (!isWebmaster) {
      setMessage("Solo Webmaster / Administrador puede cambiar roles.");
      return;
    }

    const nextUsers = users.map((user) =>
      user.id === userId
        ? {
            ...user,
            roleKey: nextRole,
            businessScope:
              nextRole === "webmaster_admin" || nextRole === "ceo"
                ? allBusinessScope
                : user.businessScope,
            areaScope:
              nextRole === "gerente_area"
                ? user.areaScope ?? allAreaScope
                : allAreaScope,
            branchScope:
              nextRole === "gerente_sucursal" ? user.branchScope : allBranchScope,
          }
        : user,
    );

    setUsers(nextUsers);
    persistDemoUsers(nextUsers);
    setMessage("Rol actualizado en usuarios DEMO.");
  }

  return (
    <section className="grid gap-4 xl:grid-cols-[420px_1fr]">
      <form
        className="grid gap-4 rounded-md border bg-card p-4"
        onSubmit={createDemoUser}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <UserPlus className="size-4 text-primary" />
            Crear usuario DEMO
          </div>
          <Badge variant={isWebmaster ? "outline" : "secondary"}>
            {demoRoleProfiles[activeRole].label}
          </Badge>
        </div>

        {!isWebmaster ? (
          <div className="flex gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
            <LockKeyhole className="mt-0.5 size-4 shrink-0" />
            Solo Webmaster / Administrador puede crear usuarios y asignar roles.
          </div>
        ) : null}

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Nombre</span>
          <Input
            disabled={!isWebmaster}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Nombre del usuario"
            value={fullName}
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Correo</span>
          <Input
            disabled={!isWebmaster}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="correo@analiza.com"
            type="email"
            value={email}
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Rol</span>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            disabled={!isWebmaster}
            onChange={(event) => setRoleKey(event.target.value as RoleKey)}
            value={roleKey}
          >
            {roleKeys.map((role) => (
              <option key={role} value={role}>
                {demoRoleProfiles[role].label}
              </option>
            ))}
          </select>
          <span className="text-xs leading-5 text-muted-foreground">
            {demoRoleProfiles[roleKey].accessSummary}
          </span>
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Linea de negocio</span>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            disabled={
              !isWebmaster || roleKey === "webmaster_admin" || roleKey === "ceo"
            }
            onChange={(event) => setBusinessScope(event.target.value)}
            value={
              roleKey === "webmaster_admin" || roleKey === "ceo"
                ? allBusinessScope
                : businessScope
            }
          >
            {businessOptions.map((business) => (
              <option key={business} value={business}>
                {business}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Gerencia de area</span>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            disabled={!isWebmaster || roleKey !== "gerente_area"}
            onChange={(event) => setAreaScope(event.target.value)}
            value={roleKey === "gerente_area" ? areaScope : allAreaScope}
          >
            {areaOptions.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium">Sucursal</span>
          <select
            className="h-9 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            disabled={!isWebmaster || roleKey !== "gerente_sucursal"}
            onChange={(event) => setBranchScope(event.target.value)}
            value={roleKey === "gerente_sucursal" ? branchScope : allBranchScope}
          >
            {branchOptions.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </label>

        {message ? (
          <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            {message}
          </div>
        ) : null}

        <Button disabled={!isWebmaster} type="submit">
          <UserPlus className="size-4" />
          Crear usuario
        </Button>
      </form>

      <section className="rounded-md border bg-card p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium">
          <ClipboardList className="size-4 text-primary" />
          Usuarios creados
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 pr-4 font-medium">Usuario</th>
                <th className="py-2 pr-4 font-medium">Rol</th>
                <th className="py-2 pr-4 font-medium">Linea</th>
                <th className="py-2 pr-4 font-medium">Gerencia de area</th>
                <th className="py-2 pr-4 font-medium">Sucursal</th>
                <th className="py-2 pr-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr className="border-b last:border-b-0" key={user.id}>
                  <td className="py-3 pr-4">
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.email}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <select
                      className="h-8 rounded-md border bg-background px-2 text-xs outline-none disabled:opacity-60"
                      disabled={!isWebmaster || user.id === "demo-admin"}
                      onChange={(event) =>
                        updateUserRole(user.id, event.target.value as RoleKey)
                      }
                      value={user.roleKey}
                    >
                      {roleKeys.map((role) => (
                        <option key={role} value={role}>
                          {demoRoleProfiles[role].label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-4">{user.businessScope}</td>
                  <td className="py-3 pr-4">
                    {user.areaScope ?? allAreaScope}
                  </td>
                  <td className="py-3 pr-4">{user.branchScope}</td>
                  <td className="py-3 pr-4">
                    <Badge variant="outline">{user.status}</Badge>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {user.createdAt}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

export function BusinessModuleDashboard({ module }: BusinessModuleDashboardProps) {
  const [context, setContext] = useState<StoredContext | null>(null);
  const config = moduleConfigs[module];

  useEffect(() => {
    function refreshContext() {
      setContext(readStoredContext());
    }

    refreshContext();
    window.addEventListener("storage", refreshContext);
    window.addEventListener(contextChangeEvent, refreshContext);

    return () => {
      window.removeEventListener("storage", refreshContext);
      window.removeEventListener(contextChangeEvent, refreshContext);
    };
  }, []);

  const scopeText = useMemo(() => {
    const company = context?.companyName ?? "Vista consolidada";
    const branch = context?.branchName ?? "Todas las sucursales";
    return `${company} / ${branch}`;
  }, [context?.branchName, context?.companyName]);

  if (!config) {
    return null;
  }

  return (
    <section className="flex w-full flex-col gap-6 px-4 py-6 lg:px-6">
      <div className="grid gap-4 xl:grid-cols-[1fr_360px] xl:items-end">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="w-fit bg-amber-100 text-amber-800 hover:bg-amber-100">
              Entorno DEMO
            </Badge>
            <Badge variant="outline">{config.audience}</Badge>
          </div>
          <div className="grid gap-2">
            <h1 className="text-3xl font-semibold tracking-normal">
              {config.title}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              {config.description}
            </p>
            <p className="text-xs leading-5 text-muted-foreground">
              Vista actual: {scopeText}. Cambia negocio, sucursal o fechas en el
              selector superior para recalcular este panel.
            </p>
          </div>
        </div>
        <ScopeCard context={context} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {config.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      {(module === "operacion" || module === "finanzas") && (
        <BusinessHealthSection />
      )}

      {module === "usuarios-permisos" ? (
        <UsersAndPermissionsManager context={context} />
      ) : null}

      {config.explanation ? (
        <section className="rounded-md border bg-card p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <BarChart3 className="size-4 text-primary" />
            Que significa
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            {config.explanation}
          </p>
        </section>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <ModuleInsights config={config} />
        <ModuleRows config={config} />
      </div>
    </section>
  );
}

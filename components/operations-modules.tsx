import type { ReactNode } from "react";
import {
  AlertTriangle,
  CalendarClock,
  Gauge,
  MapPin,
  UsersRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  appointmentRateSummary,
  appointmentStatusRows,
  branchPerformanceRows,
  getCapacityViewRows,
  managerPerformanceRows,
} from "@/lib/analytics/demo-operations";
import { formatPercent } from "@/lib/analytics/operations";

type OperationsModuleProps = {
  module: string;
};

export const operationsModuleSlugs = [
  "citas",
  "capacidad",
  "sucursales",
  "gerentes",
] as const;

function ProgressValue({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-24 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
      <span className="w-10 text-right text-xs font-medium">{value}%</span>
    </div>
  );
}

function PageHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Badge className="w-fit bg-amber-100 text-amber-800 hover:bg-amber-100">
        Entorno DEMO
      </Badge>
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-md border bg-card">
          {icon}
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-normal">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

function AppointmentsModule() {
  return (
    <section className="flex w-full flex-col gap-6 px-4 py-6 lg:px-6">
      <PageHeader
        description="Estados normalizados, tasas operativas y alertas de mapeo."
        icon={<CalendarClock className="size-5 text-primary" />}
        title="Citas"
      />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-md border bg-card p-4">
          <div className="text-sm text-muted-foreground">Finalizacion</div>
          <div className="mt-2 text-2xl font-semibold">
            {formatPercent(appointmentRateSummary.completionRate)}
          </div>
        </div>
        <div className="rounded-md border bg-card p-4">
          <div className="text-sm text-muted-foreground">Cancelacion</div>
          <div className="mt-2 text-2xl font-semibold">
            {formatPercent(appointmentRateSummary.cancellationRate)}
          </div>
        </div>
        <div className="rounded-md border bg-card p-4">
          <div className="text-sm text-muted-foreground">No-show</div>
          <div className="mt-2 text-2xl font-semibold">
            {formatPercent(appointmentRateSummary.noShowRate)}
          </div>
        </div>
        <div className="rounded-md border bg-card p-4">
          <div className="text-sm text-muted-foreground">Reprogramacion</div>
          <div className="mt-2 text-2xl font-semibold">
            {formatPercent(appointmentRateSummary.rescheduleRate)}
          </div>
        </div>
      </div>

      <section className="rounded-md border bg-card p-4">
        <div className="mb-4 text-sm font-medium">Estados normalizados</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 pr-4 font-medium">Estado</th>
                <th className="py-2 pr-4 font-medium">Registros</th>
                <th className="py-2 pr-4 font-medium">Calidad</th>
              </tr>
            </thead>
            <tbody>
              {appointmentStatusRows.map((row) => (
                <tr className="border-b last:border-b-0" key={row.status}>
                  <td className="py-3 pr-4 font-medium">{row.status}</td>
                  <td className="py-3 pr-4">{row.count}</td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {row.qualityNote}
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

function CapacityModule() {
  const rows = getCapacityViewRows();

  return (
    <section className="flex w-full flex-col gap-6 px-4 py-6 lg:px-6">
      <PageHeader
        description="Ocupacion agendada, efectiva y brecha de asistencia."
        icon={<Gauge className="size-5 text-primary" />}
        title="Capacidad y ocupacion"
      />
      <section className="rounded-md border bg-card p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 pr-4 font-medium">Sucursal</th>
                <th className="py-2 pr-4 font-medium">Empresa</th>
                <th className="py-2 pr-4 font-medium">Capacidad</th>
                <th className="py-2 pr-4 font-medium">Agendada</th>
                <th className="py-2 pr-4 font-medium">Efectiva</th>
                <th className="py-2 pr-4 font-medium">Brecha</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr className="border-b last:border-b-0" key={row.branch}>
                  <td className="py-3 pr-4 font-medium">{row.branch}</td>
                  <td className="py-3 pr-4">{row.company}</td>
                  <td className="py-3 pr-4">{row.availableHours}</td>
                  <td className="py-3 pr-4">{row.scheduledOccupancy}</td>
                  <td className="py-3 pr-4">{row.effectiveOccupancy}</td>
                  <td className="py-3 pr-4">{row.attendanceGap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

function BranchesModule() {
  return (
    <section className="flex w-full flex-col gap-6 px-4 py-6 lg:px-6">
      <PageHeader
        description="Comparativos ajustados por capacidad, calidad y metas."
        icon={<MapPin className="size-5 text-primary" />}
        title="Sucursales"
      />
      <div className="grid gap-4 xl:grid-cols-3">
        {branchPerformanceRows.map((row) => (
          <article className="rounded-md border bg-card p-4" key={row.branch}>
            <div className="mb-4 grid gap-1">
              <h2 className="text-sm font-semibold">{row.branch}</h2>
              <p className="text-xs text-muted-foreground">
                {row.country} / {row.company} / {row.manager}
              </p>
            </div>
            <dl className="grid gap-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Tamano</dt>
                <dd>{row.capacitySize}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Meta ingresos</dt>
                <dd>
                  <ProgressValue value={row.revenueTarget} />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Meta operativa</dt>
                <dd>
                  <ProgressValue value={row.operatingTarget} />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Calidad de datos</dt>
                <dd>
                  <ProgressValue value={row.dataQuality} />
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function ManagersModule() {
  return (
    <section className="flex w-full flex-col gap-6 px-4 py-6 lg:px-6">
      <PageHeader
        description="Componentes separados para evitar rankings de caja negra."
        icon={<UsersRound className="size-5 text-primary" />}
        title="Rendimiento de Gerentes"
      />
      <div className="grid gap-4 xl:grid-cols-3">
        {managerPerformanceRows.map((row) => (
          <article className="rounded-md border bg-card p-4" key={row.manager}>
            <div className="mb-4 grid gap-1">
              <h2 className="text-sm font-semibold">{row.manager}</h2>
              <p className="text-xs text-muted-foreground">
                {row.country} / {row.company} / {row.branch}
              </p>
            </div>
            <div className="mb-4">
              {row.capacityAdjustedIndex === null ? (
                <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  Pendiente de cargar capacidad disponible
                </div>
              ) : (
                <ProgressValue value={row.capacityAdjustedIndex} />
              )}
            </div>
            <div className="grid gap-3 text-sm">
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  Fortalezas
                </div>
                <div className="flex flex-wrap gap-2">
                  {row.strengths.map((item) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">
                  Alertas
                </div>
                <div className="flex flex-wrap gap-2">
                  {row.alerts.map((item) => (
                    <Badge
                      className="bg-amber-100 text-amber-800 hover:bg-amber-100"
                      key={item}
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function OperationsModule({ module }: OperationsModuleProps) {
  if (module === "citas") {
    return <AppointmentsModule />;
  }

  if (module === "capacidad") {
    return <CapacityModule />;
  }

  if (module === "sucursales") {
    return <BranchesModule />;
  }

  if (module === "gerentes") {
    return <ManagersModule />;
  }

  return null;
}

"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  Database,
  Info,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  appointmentStatus,
  demoDashboardMeta,
  executiveKpis,
  insightPreviews,
  managerPerformance,
  occupancyByUnit,
  revenueByCompany,
  revenueByMonth,
  targetVsActual,
  type BarPoint,
  type ExecutiveKpi,
} from "@/lib/analytics/demo-dashboard";
import { cn } from "@/lib/utils";

const storageKey = "analiza:selected-context";

type StoredContext = {
  countryName: string;
  companyName: string;
  branchName: string;
  period: string;
  isDemo: boolean;
};

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

function kpiToneClass(tone: ExecutiveKpi["tone"]) {
  if (tone === "positive") {
    return "text-emerald-700 bg-emerald-50";
  }

  if (tone === "warning") {
    return "text-amber-700 bg-amber-50";
  }

  if (tone === "negative") {
    return "text-red-700 bg-red-50";
  }

  return "text-muted-foreground bg-muted";
}

function BarList({
  data,
  suffix = "",
}: {
  data: BarPoint[];
  suffix?: string;
}) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="grid gap-3">
      {data.map((item) => (
        <div className="grid gap-1" key={item.label}>
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="truncate text-muted-foreground">
              {item.label}
            </span>
            <span className="font-medium">
              {item.value}
              {suffix}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${Math.max((item.value / maxValue) * 100, 4)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function KpiCard({ kpi }: { kpi: ExecutiveKpi }) {
  return (
    <article
      className="flex min-h-36 flex-col justify-between rounded-md border bg-card p-4"
      title={`Definicion: ${kpi.definition}\nFormula: ${kpi.formula}\nFuente: ${kpi.source}\nUltima actualizacion: ${kpi.updatedAt}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid gap-1">
          <h3 className="text-sm font-medium text-muted-foreground">
            {kpi.label}
          </h3>
          <p className="text-2xl font-semibold tracking-normal">{kpi.value}</p>
        </div>
        <Info className="size-4 shrink-0 text-muted-foreground" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "rounded-md px-2 py-1 text-xs font-medium",
            kpiToneClass(kpi.tone),
          )}
        >
          {kpi.change}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {kpi.source}
        </span>
      </div>
    </article>
  );
}

export function ExecutiveDashboard() {
  const [context, setContext] = useState<StoredContext | null>(null);

  useEffect(() => {
    setContext(readStoredContext());
  }, []);

  return (
    <section className="flex w-full flex-col gap-6 px-4 py-6 lg:px-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Entorno DEMO
          </Badge>
          <Badge variant="outline">Completitud {demoDashboardMeta.completeness}%</Badge>
          <Badge variant="outline">{demoDashboardMeta.dataCoverage}</Badge>
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-end">
          <div className="grid gap-2">
            <h1 className="text-3xl font-semibold tracking-normal">
              Resumen ejecutivo
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Vista consolidada DEMO con indicadores financieros, operativos,
              ocupacion, metas, calidad y fuentes utilizadas.
            </p>
          </div>
          <div className="rounded-md border bg-card p-4 text-sm">
            <div className="mb-2 flex items-center gap-2 font-medium">
              <CheckCircle2 className="size-4 text-primary" />
              Contexto activo
            </div>
            <div className="grid gap-1 text-muted-foreground">
              <span>
                {context?.countryName ?? "Pais pendiente"} /{" "}
                {context?.companyName ?? "Empresa pendiente"}
              </span>
              <span>{context?.branchName ?? "Sucursal pendiente"}</span>
              <span>
                Periodo: {context?.period ?? demoDashboardMeta.selectedPeriod}
              </span>
              <span>Ultima actualizacion: {demoDashboardMeta.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {executiveKpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="rounded-md border bg-card p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="size-4 text-primary" />
            Ingresos por mes
          </div>
          <BarList data={revenueByMonth} suffix="K" />
        </section>

        <section className="rounded-md border bg-card p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium">
            <CircleDollarSign className="size-4 text-primary" />
            Participacion por empresa
          </div>
          <BarList data={revenueByCompany} suffix="%" />
        </section>

        <section className="rounded-md border bg-card p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium">
            <BarChart3 className="size-4 text-primary" />
            Citas por estado
          </div>
          <BarList data={appointmentStatus} />
        </section>

        <section className="rounded-md border bg-card p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium">
            <Database className="size-4 text-primary" />
            Ocupacion efectiva por unidad
          </div>
          <BarList data={occupancyByUnit} suffix="%" />
        </section>

        <section className="rounded-md border bg-card p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="size-4 text-primary" />
            Metas vs resultados
          </div>
          <BarList data={targetVsActual} suffix="K" />
        </section>

        <section className="rounded-md border bg-card p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="size-4 text-primary" />
            Rendimiento ajustado por sucursal
          </div>
          <BarList data={managerPerformance} suffix="%" />
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Comparativo DEMO ajustado por capacidad, tamano, mezcla de
            servicios y calidad de datos.
          </p>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <section className="rounded-md border bg-card p-4">
          <div className="mb-4 text-sm font-medium">Insights DEMO</div>
          <div className="grid gap-3">
            {insightPreviews.map((insight) => (
              <article
                className="grid gap-2 border-t py-3 first:border-t-0 first:pt-0 last:pb-0"
                key={insight.title}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    className={cn(
                      insight.priority === "alta" &&
                        "bg-red-100 text-red-800 hover:bg-red-100",
                      insight.priority === "media" &&
                        "bg-amber-100 text-amber-800 hover:bg-amber-100",
                      insight.priority === "baja" &&
                        "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
                    )}
                  >
                    {insight.priority}
                  </Badge>
                  <span className="text-sm font-medium">{insight.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Indicador: {insight.affectedIndicator}
                </p>
                <p className="text-sm text-muted-foreground">
                  {insight.recommendation}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-md border bg-card p-4">
          <div className="mb-4 text-sm font-medium">Fuentes utilizadas</div>
          <ul className="grid gap-3 text-sm text-muted-foreground">
            {demoDashboardMeta.sources.map((source) => (
              <li className="flex items-center gap-2" key={source}>
                <CheckCircle2 className="size-4 text-emerald-600" />
                {source}
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-md bg-amber-50 p-3 text-xs leading-5 text-amber-800">
            Las metricas son DEMO. No usar como informacion operativa,
            financiera o clinica real.
          </div>
        </section>
      </div>
    </section>
  );
}

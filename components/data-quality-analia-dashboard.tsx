"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  FileSpreadsheet,
  Lightbulb,
  ShieldCheck,
  Wand2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  analiaQualitySuggestions,
  type AnaliaQualitySuggestion,
} from "@/lib/analytics/business-control-center";
import { useActiveBusinessLine } from "@/hooks/use-active-business-line";
import { cn } from "@/lib/utils";

function priorityClass(priority: AnaliaQualitySuggestion["priority"]) {
  if (priority === "Alta") {
    return "bg-red-100 text-red-800 hover:bg-red-100";
  }

  if (priority === "Media") {
    return "bg-amber-100 text-amber-800 hover:bg-amber-100";
  }

  return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-muted">
      <div
        className="h-2 rounded-full bg-primary"
        style={{ width: `${Math.max(6, Math.min(value, 100))}%` }}
      />
    </div>
  );
}

export function DataQualityAnaliaDashboard() {
  const activeBusinessLine = useActiveBusinessLine();
  const [appliedIds, setAppliedIds] = useState<Set<string>>(() => new Set());
  const visibleSuggestions = useMemo(
    () =>
      activeBusinessLine.isConsolidated
        ? analiaQualitySuggestions
        : analiaQualitySuggestions.filter(
            (suggestion) =>
              suggestion.line === activeBusinessLine.line ||
              suggestion.line === "Consolidado",
          ),
    [activeBusinessLine.isConsolidated, activeBusinessLine.line],
  );
  const pendingSuggestions = visibleSuggestions.filter(
    (suggestion) => !appliedIds.has(suggestion.id),
  );
  const appliedCount = visibleSuggestions.filter((suggestion) =>
    appliedIds.has(suggestion.id),
  ).length;
  const qualityScore = useMemo(
    () => Math.min(94, 72 + appliedCount * 5),
    [appliedCount],
  );

  function applySuggestion(id: string) {
    setAppliedIds((current) => {
      const next = new Set(current);
      next.add(id);
      return next;
    });
  }

  return (
    <section className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 lg:px-6">
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge className="w-fit bg-amber-100 text-amber-800 hover:bg-amber-100">
              Entorno DEMO
            </Badge>
            <Badge variant="outline">Recomendaciones aplicables por AnaliA</Badge>
            <Badge variant="outline">Filtro: {activeBusinessLine.line}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md border bg-card">
              <Bot className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-normal">
                Calidad de datos por AnaliA
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                AnaliA revisa plantillas, conectores y dashboards para sugerir
                cambios que mejoren la lectura de la operacion y salud
                financiera sin inventar datos.
              </p>
            </div>
          </div>
        </div>

        <aside className="rounded-md border bg-card p-4 text-sm">
          <div className="mb-2 flex items-center gap-2 font-medium">
            <ShieldCheck className="size-4 text-primary" />
            Score de confiabilidad DEMO
          </div>
          <div className="text-3xl font-semibold">{qualityScore}%</div>
          <ProgressBar value={qualityScore} />
          <p className="mt-2 leading-6 text-muted-foreground">
            Sube solo cuando aplicas reglas de validacion o mejoras de lectura.
            No convierte datos DEMO en datos reales.
          </p>
        </aside>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        {[
          {
            icon: FileSpreadsheet,
            label: "Plantillas",
            value: `${visibleSuggestions.filter((item) => item.target === "Plantilla de resultados").length} mejoras`,
          },
          {
            icon: BarChart3,
            label: "Dashboards",
            value: `${visibleSuggestions.filter((item) => item.target === "Dashboard").length} lecturas`,
          },
          { icon: ClipboardCheck, label: "Aplicadas", value: `${appliedCount}` },
          { icon: Lightbulb, label: "Pendientes", value: `${pendingSuggestions.length}` },
        ].map((metric) => {
          const Icon = metric.icon;

          return (
            <article className="rounded-md border bg-card p-4" key={metric.label}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="size-4 text-primary" />
                {metric.label}
              </div>
              <div className="mt-2 text-2xl font-semibold">{metric.value}</div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-3">
          {visibleSuggestions.map((suggestion) => {
            const applied = appliedIds.has(suggestion.id);

            return (
              <article
                className={cn(
                  "rounded-md border bg-card p-4",
                  applied && "border-emerald-200 bg-emerald-50",
                )}
                key={suggestion.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={priorityClass(suggestion.priority)}>
                        {suggestion.priority}
                      </Badge>
                      <Badge variant="outline">{suggestion.line}</Badge>
                      <Badge variant="outline">{suggestion.target}</Badge>
                    </div>
                    <h2 className="mt-3 text-lg font-semibold">
                      {suggestion.module}: {suggestion.issue}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {suggestion.suggestedChange}
                    </p>
                  </div>
                  <Button
                    disabled={applied}
                    onClick={() => applySuggestion(suggestion.id)}
                    type="button"
                  >
                    <Wand2 className="size-4" />
                    {applied ? "Aplicado" : "Aplicar"}
                  </Button>
                </div>

                <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                  <div className="rounded-md border bg-background p-3">
                    <div className="font-medium">Impacto esperado</div>
                    <p className="mt-1 text-muted-foreground">
                      {suggestion.expectedImpact}
                    </p>
                  </div>
                  <div className="rounded-md border bg-background p-3">
                    <div className="font-medium">Dashboards afectados</div>
                    <p className="mt-1 text-muted-foreground">
                      {suggestion.affectedDashboards.join(", ")}
                    </p>
                  </div>
                  <div className="rounded-md border bg-background p-3">
                    <div className="font-medium">Trazabilidad</div>
                    <p className="mt-1 text-muted-foreground">
                      {suggestion.sourceTrace}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="grid gap-3">
          <div className="rounded-md border bg-card p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="size-4 text-primary" />
              Insights para mejorar lectura
            </div>
            <div className="grid gap-3 text-sm leading-6 text-muted-foreground">
              <p>
                En plantillas de resultados, separar venta, costo directo,
                gasto operativo y utilidad para que Finanzas no duplique
                informacion de Operacion.
              </p>
              <p>
                En dashboards operativos, mostrar primero grafica, meta y
                brecha; dejar texto largo solo como detalle expandible.
              </p>
              <p>
                En Salud financiera, bloquear conclusiones si faltan costos
                variables, costos fijos o trazabilidad de sucursal.
              </p>
            </div>
          </div>

          <div className="rounded-md border bg-card p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="size-4 text-primary" />
              Lo que hace el boton Aplicar
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              En DEMO marca la recomendacion como aplicada y recalcula el score
              de confiabilidad. En produccion debe crear una tarea auditada para
              modificar plantilla, conector o dashboard con aprobacion humana.
            </p>
          </div>
        </aside>
      </section>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronDown,
  Eye,
  LineChart,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getDashboardAuditForPath,
  getDashboardValidationSummary,
  type DashboardValidationAudit,
} from "@/lib/analytics/dashboard-validation-agent";
import { cn } from "@/lib/utils";

const collapsedStorageKey = "analiza:analia-dashboard-agent-collapsed";

function getDensityTone(audit: DashboardValidationAudit) {
  if (audit.densityStatus === "Muy cargada") {
    return "border-orange-200 bg-orange-50 text-orange-950";
  }

  if (audit.densityStatus === "Cargada") {
    return "border-amber-200 bg-amber-50 text-amber-950";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-950";
}

function MiniBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="truncate text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary"
          style={{ width: `${Math.max(6, Math.min(value, 100))}%` }}
        />
      </div>
    </div>
  );
}

export function DashboardValidationAgent() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const audit = useMemo(
    () => getDashboardAuditForPath(pathname),
    [pathname],
  );
  const summary = useMemo(() => getDashboardValidationSummary(), []);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(collapsedStorageKey);
    setIsOpen(storedValue === "false");
  }, []);

  useEffect(() => {
    if (!audit) {
      document.documentElement.removeAttribute("data-analia-dashboard-mode");
      document.documentElement.removeAttribute("data-analia-dashboard-density");
      return;
    }

    document.documentElement.setAttribute(
      "data-analia-dashboard-mode",
      audit.readingMode,
    );
    document.documentElement.setAttribute(
      "data-analia-dashboard-density",
      audit.densityStatus,
    );

    return () => {
      document.documentElement.removeAttribute("data-analia-dashboard-mode");
      document.documentElement.removeAttribute("data-analia-dashboard-density");
    };
  }, [audit]);

  if (!audit || isHidden || !pathname.startsWith("/protected")) {
    return null;
  }

  function toggleOpen() {
    setIsOpen((current) => {
      const nextValue = !current;
      window.localStorage.setItem(collapsedStorageKey, String(!nextValue));
      return nextValue;
    });
  }

  return (
    <aside className="fixed bottom-3 left-3 right-3 z-40 mx-auto max-w-5xl print:hidden lg:left-auto lg:right-4 lg:max-w-xl">
      <div className={cn("rounded-md border bg-card shadow-lg", getDensityTone(audit))}>
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
          <button
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
            onClick={toggleOpen}
            type="button"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background/80">
              <Bot className="size-4 text-primary" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">
                AnaliA valido {audit.module}
              </span>
              <span className="block truncate text-xs opacity-80">
                {audit.densityStatus} · vista {audit.readingMode} · DEMO
              </span>
            </span>
          </button>
          <div className="flex items-center gap-2">
            <Badge className="bg-background/80 text-foreground hover:bg-background/80">
              {audit.densityScore}/100
            </Badge>
            <Button
              aria-label={isOpen ? "Contraer auditoria" : "Expandir auditoria"}
              onClick={toggleOpen}
              size="icon"
              type="button"
              variant="ghost"
            >
              <ChevronDown
                className={cn("size-4 transition-transform", isOpen && "rotate-180")}
              />
            </Button>
            <Button
              aria-label="Ocultar auditoria"
              onClick={() => setIsHidden(true)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {isOpen ? (
          <div className="grid gap-3 border-t border-current/10 bg-card/92 p-3 text-foreground">
            <div className="grid gap-3 sm:grid-cols-3">
              <MiniBar label="Carga visual" value={audit.densityScore} />
              <MiniBar
                label="Cobertura auditada"
                value={Math.round((summary.reviewedCount / 21) * 100)}
              />
              <MiniBar
                label="Modo visual"
                value={Math.round((summary.visualModeCount / summary.reviewedCount) * 100)}
              />
            </div>

            <div className="grid gap-2 text-xs sm:grid-cols-3">
              <div className="rounded-md border bg-background p-2">
                <div className="mb-1 flex items-center gap-1 font-medium">
                  <Eye className="size-3.5 text-primary" />
                  Lectura
                </div>
                {audit.decisionPrompt}
              </div>
              <div className="rounded-md border bg-background p-2">
                <div className="mb-1 flex items-center gap-1 font-medium">
                  <BarChart3 className="size-3.5 text-primary" />
                  Graficas
                </div>
                {audit.chartPriority.slice(0, 2).join(" / ")}
              </div>
              <div className="rounded-md border bg-background p-2">
                <div className="mb-1 flex items-center gap-1 font-medium">
                  <LineChart className="size-3.5 text-primary" />
                  Modelos
                </div>
                {audit.models.join(" + ")}
              </div>
            </div>

            <div className="grid gap-2 text-xs sm:grid-cols-2">
              <div className="rounded-md border bg-background p-2">
                <div className="mb-2 flex items-center gap-1 font-medium">
                  <Sparkles className="size-3.5 text-primary" />
                  Ajustes aplicados
                </div>
                <div className="grid gap-1">
                  {audit.editsApplied.map((edit) => (
                    <span className="flex gap-1" key={edit}>
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      {edit}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-md border bg-background p-2">
                <div className="mb-2 flex items-center gap-1 font-medium">
                  <ShieldCheck className="size-3.5 text-primary" />
                  Validacion
                </div>
                <div className="grid gap-1">
                  {audit.validationChecks.slice(0, 3).map((check) => (
                    <span className="flex gap-1" key={check}>
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      {check}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

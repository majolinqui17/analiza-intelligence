"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Database, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const storageKey = "analiza:selected-context";

type StoredContext = {
  countryName: string;
  companyName: string;
  branchName: string;
  period: string;
  isDemo: boolean;
};

export function ContextOverview() {
  const [context, setContext] = useState<StoredContext | null>(null);

  useEffect(() => {
    const rawContext = window.localStorage.getItem(storageKey);
    if (!rawContext) {
      return;
    }

    try {
      setContext(JSON.parse(rawContext) as StoredContext);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-8">
      <div className="flex flex-col gap-3">
        <Badge className="w-fit bg-amber-100 text-amber-800 hover:bg-amber-100">
          Entorno DEMO
        </Badge>
        <h1 className="text-3xl font-semibold tracking-normal">
          Base operativa lista
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Fase 1 deja preparado el acceso protegido, el modelo multi-tenant y
          el contexto persistente para dashboards e importaciones.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border bg-card p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium">
            <ShieldCheck className="size-4 text-primary" />
            Contexto activo
          </div>
          {context ? (
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Pais</dt>
                <dd className="font-medium">{context.countryName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Empresa</dt>
                <dd className="font-medium">{context.companyName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Sucursal</dt>
                <dd className="font-medium">{context.branchName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Periodo</dt>
                <dd className="font-medium">{context.period}</dd>
              </div>
            </dl>
          ) : (
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p>No hay contexto seleccionado en este navegador.</p>
              <Button asChild className="w-fit gap-2">
                <Link href="/protected/context">
                  Seleccionar contexto
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-md border bg-card p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium">
            <Database className="size-4 text-primary" />
            Estado de Fase 1
          </div>
          <ul className="grid gap-3 text-sm text-muted-foreground">
            <li>Autenticacion protegida por Supabase.</li>
            <li>Registro publico libre deshabilitado en la UI.</li>
            <li>Roles, asignaciones y RLS base definidos en SQL.</li>
            <li>Seed DEMO preparado para paises, empresas y sucursales.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}


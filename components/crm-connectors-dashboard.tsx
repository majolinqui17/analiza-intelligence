"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  Copy,
  DatabaseZap,
  KeyRound,
  LockKeyhole,
  PlugZap,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  buildDemoApiKey,
  crmConnectorPlans,
  maskDemoApiKey,
  type BusinessControlLine,
} from "@/lib/analytics/business-control-center";

const lineOptions: BusinessControlLine[] = [
  "Laboratorio",
  "Fisioterapia",
  "Imagenes",
];

export function CrmConnectorsDashboard() {
  const [selectedLine, setSelectedLine] =
    useState<BusinessControlLine>("Laboratorio");
  const [baseUrl, setBaseUrl] = useState("https://crm.analiza.local");
  const [demoKeys, setDemoKeys] = useState<Record<BusinessControlLine, string>>({
    Fisioterapia: maskDemoApiKey("az_fis_demo", "F3P8"),
    Imagenes: maskDemoApiKey("az_img_demo", "I9M4"),
    Laboratorio: maskDemoApiKey("az_lab_demo", "L7A2"),
  });
  const [notice, setNotice] = useState<string | null>(null);
  const selectedPlan = useMemo(
    () => crmConnectorPlans.find((plan) => plan.line === selectedLine) ?? crmConnectorPlans[0],
    [selectedLine],
  );

  function generateDemoKey() {
    const key = buildDemoApiKey(selectedPlan.keyPrefix);

    setDemoKeys((current) => ({
      ...current,
      [selectedPlan.line]: key,
    }));
    setNotice(
      "Llave DEMO generada para validar el flujo. En produccion la llave real debe generarse en servidor y guardarse en secreto.",
    );
  }

  async function copyEndpoint(path: string) {
    const endpoint = `${baseUrl}${path}`;

    try {
      await navigator.clipboard.writeText(endpoint);
      setNotice(`Endpoint copiado: ${endpoint}`);
    } catch {
      setNotice(endpoint);
    }
  }

  return (
    <section className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 lg:px-6">
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge className="w-fit bg-amber-100 text-amber-800 hover:bg-amber-100">
              Entorno DEMO
            </Badge>
            <Badge variant="outline">Credenciales reales solo en servidor</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md border bg-card">
              <DatabaseZap className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-normal">
                Conectores CRM por linea de negocio
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                Genera llaves DEMO, endpoints e instrucciones para conectar el
                CRM de cada linea. Si el CRM no tiene API disponible, las
                plantillas siguen alimentando el sistema.
              </p>
            </div>
          </div>
        </div>

        <aside className="rounded-md border bg-card p-4 text-sm">
          <div className="mb-2 flex items-center gap-2 font-medium">
            <ShieldCheck className="size-4 text-primary" />
            Regla de seguridad
          </div>
          <p className="leading-6 text-muted-foreground">
            No se debe pegar una llave real en el navegador, Excel o dashboard.
            Produccion debe crearla server-side, guardarla cifrada y mostrar
            solo ultimos 4 caracteres.
          </p>
        </aside>
      </div>

      {notice ? (
        <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
          {notice}
        </div>
      ) : null}

      <section className="grid gap-3 md:grid-cols-[220px_1fr]">
        <div className="rounded-md border bg-card p-3">
          <div className="mb-3 text-sm font-medium">Linea a conectar</div>
          <div className="grid gap-2">
            {lineOptions.map((line) => (
              <Button
                className="justify-start"
                key={line}
                onClick={() => setSelectedLine(line)}
                type="button"
                variant={selectedLine === line ? "default" : "outline"}
              >
                <PlugZap className="size-4" />
                {line}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-md border bg-card p-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold">{selectedPlan.line}</h2>
                <Badge variant="outline">{selectedPlan.owner}</Badge>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                  DEMO
                </Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Objeto CRM: {selectedPlan.crmObject}
              </p>
            </div>

            <div className="rounded-md border bg-background p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <KeyRound className="size-4 text-primary" />
                API key DEMO
              </div>
              <div className="break-all rounded-md bg-muted px-3 py-2 font-mono text-xs">
                {demoKeys[selectedPlan.line]}
              </div>
              <Button className="mt-3 w-full" onClick={generateDemoKey} type="button">
                Generar llave DEMO
              </Button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-3">
              <label className="grid gap-1 text-sm">
                <span className="font-medium">URL base del CRM o API gateway</span>
                <Input
                  value={baseUrl}
                  onChange={(event) => setBaseUrl(event.target.value)}
                />
              </label>

              <div className="grid gap-3">
                {selectedPlan.endpoints.map((endpoint) => (
                  <article className="rounded-md border bg-background p-3" key={endpoint.path}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Badge variant="outline">{endpoint.method}</Badge>
                          <span className="font-mono text-xs">{endpoint.path}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {endpoint.purpose}
                        </p>
                      </div>
                      <Button
                        onClick={() => copyEndpoint(endpoint.path)}
                        size="sm"
                        type="button"
                        variant="outline"
                      >
                        <Copy className="size-4" />
                        Copiar endpoint
                      </Button>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs md:grid-cols-2">
                      <div>
                        <div className="font-medium">Campos minimos</div>
                        <p className="mt-1 text-muted-foreground">
                          {endpoint.requiredFields.join(", ")}
                        </p>
                      </div>
                      <div>
                        <div className="font-medium">Alimenta</div>
                        <p className="mt-1 text-muted-foreground">
                          {endpoint.feedsModules.join(", ")}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="grid gap-3">
              <div className="rounded-md border bg-background p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <ClipboardList className="size-4 text-primary" />
                  Paso a paso
                </div>
                <ol className="grid gap-2 text-sm leading-6 text-muted-foreground">
                  {selectedPlan.setupSteps.map((step, index) => (
                    <li className="flex gap-2" key={step}>
                      <span className="font-semibold text-foreground">{index + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-md border bg-background p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <LockKeyhole className="size-4 text-primary" />
                  Se necesita
                </div>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  {selectedPlan.requirements.map((requirement) => (
                    <span className="flex gap-2" key={requirement}>
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      {requirement}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-md border bg-background p-3">
                <div className="mb-2 text-sm font-medium">Fallback sin conector</div>
                <p className="text-sm leading-6 text-muted-foreground">
                  Si no existe API viable, cargar masivamente:
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedPlan.fallbackDocuments.map((document) => (
                    <Badge key={document} variant="outline">{document}</Badge>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </section>
  );
}

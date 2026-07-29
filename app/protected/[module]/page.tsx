import { notFound } from "next/navigation";

import { CrmConnectorsDashboard } from "@/components/crm-connectors-dashboard";
import { DataQualityAnaliaDashboard } from "@/components/data-quality-analia-dashboard";
import {
  OperationsModule,
  operationsModuleSlugs,
} from "@/components/operations-modules";
import { ImportOperationsDashboard } from "@/components/import-operations-dashboard";
import { GoalsAdvancesDashboard } from "@/components/goals-advances-dashboard";
import { ManualMonthlyEntryDashboard } from "@/components/manual-monthly-entry-dashboard";
import { Badge } from "@/components/ui/badge";
import { navigationItems } from "@/lib/navigation";

type ModulePageProps = {
  params: Promise<{
    module: string;
  }>;
};

export function generateStaticParams() {
  return navigationItems
    .filter((item) => item.href !== "/protected/overview")
    .map((item) => ({
      module: item.href.replace("/protected/", ""),
    }));
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { module } = await params;
  const item = navigationItems.find(
    (navigationItem) => navigationItem.href === `/protected/${module}`,
  );

  if (!item) {
    notFound();
  }

  const Icon = item.icon;

  if (module === "importaciones") {
    return <ImportOperationsDashboard />;
  }

  if (module === "plantillas") {
    return (
      <section className="flex w-full flex-col gap-6 px-4 py-6 lg:px-6">
        <ManualMonthlyEntryDashboard />
      </section>
    );
  }

  if (module === "conectores") {
    return <CrmConnectorsDashboard />;
  }

  if (module === "calidad-datos") {
    return <DataQualityAnaliaDashboard />;
  }

  if (module === "metas") {
    return <GoalsAdvancesDashboard />;
  }

  if (
    operationsModuleSlugs.includes(
      module as (typeof operationsModuleSlugs)[number],
    )
  ) {
    return <OperationsModule module={module} />;
  }

  return (
    <section className="flex w-full flex-col gap-6 px-4 py-6 lg:px-6">
      <div className="flex flex-col gap-3">
        <Badge className="w-fit bg-amber-100 text-amber-800 hover:bg-amber-100">
          Entorno DEMO
        </Badge>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-md border bg-card">
            <Icon className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">
              {item.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              Modulo preparado para fases posteriores.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

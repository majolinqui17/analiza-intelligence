import { Suspense } from "react";
import { redirect } from "next/navigation";

import { ContextSelectionForm } from "@/components/context-selection-form";
import { createClient } from "@/lib/supabase/server";
import {
  demoBranches,
  demoCompanies,
  demoCountries,
} from "@/lib/tenant/demo-context";

function getClaimString(claims: unknown, key: string) {
  if (typeof claims !== "object" || claims === null) {
    return null;
  }

  const value = (claims as Record<string, unknown>)[key];
  return typeof value === "string" ? value : null;
}

async function ContextSelectionGate() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <ContextSelectionForm
      branches={demoBranches}
      companies={demoCompanies}
      countries={demoCountries}
      userEmail={getClaimString(data.claims, "email") ?? "usuario autorizado"}
    />
  );
}

export default function ContextPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-5xl px-5 py-10 text-sm text-muted-foreground">
          Cargando contexto autorizado...
        </div>
      }
    >
      <ContextSelectionGate />
    </Suspense>
  );
}

import { Suspense } from "react";
import { redirect } from "next/navigation";

import { ContextOverview } from "@/components/context-overview";
import { createClient } from "@/lib/supabase/server";

async function OverviewGate() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return <ContextOverview />;
}

export default function OverviewPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-5xl px-5 py-10 text-sm text-muted-foreground">
          Cargando espacio de trabajo...
        </div>
      }
    >
      <OverviewGate />
    </Suspense>
  );
}

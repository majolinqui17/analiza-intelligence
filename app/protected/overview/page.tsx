import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ExecutiveDashboard } from "@/components/executive-dashboard";
import { demoAdminCookieName, hasDemoAdminCookie } from "@/lib/auth/demo-admin";
import { createClient } from "@/lib/supabase/server";

async function OverviewGate() {
  const cookieStore = await cookies();
  const hasDemoAdminSession = hasDemoAdminCookie(
    cookieStore.get(demoAdminCookieName)?.value,
  );

  if (hasDemoAdminSession) {
    return <ExecutiveDashboard />;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return <ExecutiveDashboard />;
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

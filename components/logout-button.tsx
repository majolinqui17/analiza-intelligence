"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await fetch("/auth/demo-admin", { method: "POST" });
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return <Button onClick={logout}>Salir</Button>;
}

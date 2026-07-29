import { AuthButton } from "@/components/auth-button";
import { AppSidebar } from "@/components/app-sidebar";
import { TenantContextHeader } from "@/components/tenant-context-header";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="flex min-h-screen w-full">
        <AppSidebar roleKey="super_admin" />
        <div className="flex min-w-0 flex-1 flex-col">
          <nav className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
            <div className="flex min-h-16 w-full flex-col gap-3 px-4 py-3 text-sm lg:flex-row lg:items-start lg:justify-between lg:px-5">
              <Link
                href="/protected"
                className="font-semibold lg:hidden"
              >
                Analiza Intelligence
              </Link>
              <TenantContextHeader />
              <Suspense>
                <AuthButton />
              </Suspense>
            </div>
          </nav>
          <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
        </div>
      </div>
    </main>
  );
}

import { AuthButton } from "@/components/auth-button";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="flex min-h-screen w-full flex-col">
        <nav className="border-b bg-background">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 text-sm">
            <Link href="/protected/context" className="font-semibold">
              Analiza Intelligence
            </Link>
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </nav>
        <div className="flex-1">{children}</div>
      </div>
    </main>
  );
}

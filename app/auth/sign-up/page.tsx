import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-md bg-muted">
            <ShieldAlert className="size-5 text-primary" />
          </div>
          <CardTitle>Registro no disponible</CardTitle>
          <CardDescription>
            Las cuentas se crean desde administracion con asignaciones de
            pais, empresa, sucursal y rol.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/auth/login">Volver al login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

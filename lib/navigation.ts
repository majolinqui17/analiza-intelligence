import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ClipboardCheck,
  DatabaseZap,
  FileSpreadsheet,
  FlaskConical,
  Gauge,
  Goal,
  HeartPulse,
  ImagePlus,
  Import,
  KeyRound,
  LayoutDashboard,
  Lightbulb,
  Settings,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";

import type { RoleKey } from "@/lib/tenant/demo-context";

export type NavigationItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  allowedRoles: RoleKey[];
};

const executiveRoles: RoleKey[] = [
  "super_admin",
  "director_ejecutivo_grupo",
  "director_pais",
  "director_empresa",
  "director_financiero",
  "director_operaciones",
  "analista_bi",
  "auditor",
  "viewer",
];

const operationsRoles: RoleKey[] = [
  "super_admin",
  "director_ejecutivo_grupo",
  "director_pais",
  "director_empresa",
  "director_operaciones",
  "gerente_sucursal",
  "analista_bi",
  "auditor",
  "viewer",
];

const dataRoles: RoleKey[] = [
  "super_admin",
  "director_ejecutivo_grupo",
  "analista_bi",
  "cargador_datos",
  "auditor",
];

const adminRoles: RoleKey[] = ["super_admin"];

export const navigationItems: NavigationItem[] = [
  {
    title: "Resumen ejecutivo",
    href: "/protected/overview",
    icon: LayoutDashboard,
    allowedRoles: executiveRoles,
  },
  {
    title: "Operacion",
    href: "/protected/operacion",
    icon: Activity,
    allowedRoles: operationsRoles,
  },
  {
    title: "Finanzas",
    href: "/protected/finanzas",
    icon: BriefcaseBusiness,
    allowedRoles: executiveRoles,
  },
  {
    title: "Citas",
    href: "/protected/citas",
    icon: CalendarClock,
    allowedRoles: operationsRoles,
  },
  {
    title: "Capacidad y ocupacion",
    href: "/protected/capacidad",
    icon: Gauge,
    allowedRoles: operationsRoles,
  },
  {
    title: "Sucursales",
    href: "/protected/sucursales",
    icon: Building2,
    allowedRoles: operationsRoles,
  },
  {
    title: "Gerentes",
    href: "/protected/gerentes",
    icon: UsersRound,
    allowedRoles: operationsRoles,
  },
  {
    title: "Profesionales",
    href: "/protected/profesionales",
    icon: Stethoscope,
    allowedRoles: operationsRoles,
  },
  {
    title: "Servicios",
    href: "/protected/servicios",
    icon: ClipboardCheck,
    allowedRoles: operationsRoles,
  },
  {
    title: "Fisioterapia",
    href: "/protected/fisioterapia",
    icon: HeartPulse,
    allowedRoles: operationsRoles,
  },
  {
    title: "Laboratorio",
    href: "/protected/laboratorio",
    icon: FlaskConical,
    allowedRoles: operationsRoles,
  },
  {
    title: "Imagenes",
    href: "/protected/imagenes",
    icon: ImagePlus,
    allowedRoles: operationsRoles,
  },
  {
    title: "Insights",
    href: "/protected/insights",
    icon: Lightbulb,
    allowedRoles: executiveRoles,
  },
  {
    title: "Importaciones",
    href: "/protected/importaciones",
    icon: Import,
    allowedRoles: dataRoles,
  },
  {
    title: "Plantillas",
    href: "/protected/plantillas",
    icon: FileSpreadsheet,
    allowedRoles: dataRoles,
  },
  {
    title: "Conectores",
    href: "/protected/conectores",
    icon: DatabaseZap,
    allowedRoles: dataRoles,
  },
  {
    title: "Calidad de datos",
    href: "/protected/calidad-datos",
    icon: ShieldCheck,
    allowedRoles: dataRoles,
  },
  {
    title: "Metas",
    href: "/protected/metas",
    icon: Goal,
    allowedRoles: executiveRoles,
  },
  {
    title: "Usuarios y permisos",
    href: "/protected/usuarios-permisos",
    icon: KeyRound,
    allowedRoles: adminRoles,
  },
  {
    title: "Configuracion",
    href: "/protected/configuracion",
    icon: Settings,
    allowedRoles: adminRoles,
  },
  {
    title: "Auditoria",
    href: "/protected/auditoria",
    icon: BarChart3,
    allowedRoles: ["super_admin", "auditor", "analista_bi"],
  },
];

export function getNavigationForRole(roleKey: RoleKey) {
  return navigationItems.filter((item) => item.allowedRoles.includes(roleKey));
}


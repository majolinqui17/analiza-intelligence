import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ClipboardCheck,
  DatabaseZap,
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

const allRoles: RoleKey[] = [
  "webmaster_admin",
  "ceo",
  "gerente_operaciones",
  "gerente_area",
  "gerente_sucursal",
];

const executiveRoles: RoleKey[] = ["webmaster_admin", "ceo"];

const operationsRoles: RoleKey[] = [
  "webmaster_admin",
  "ceo",
  "gerente_operaciones",
  "gerente_area",
  "gerente_sucursal",
];

const businessLineRoles: RoleKey[] = [
  "webmaster_admin",
  "ceo",
  "gerente_operaciones",
  "gerente_area",
  "gerente_sucursal",
];

const dataUploadRoles: RoleKey[] = ["webmaster_admin", "gerente_operaciones"];

const dataReadRoles: RoleKey[] = [
  "webmaster_admin",
  "ceo",
  "gerente_operaciones",
  "gerente_area",
  "gerente_sucursal",
];

const adminRoles: RoleKey[] = ["webmaster_admin"];

export const navigationItems: NavigationItem[] = [
  {
    title: "Resumen ejecutivo",
    href: "/protected/overview",
    icon: LayoutDashboard,
    allowedRoles: allRoles,
  },
  {
    title: "Operacion ejecutiva",
    href: "/protected/operacion",
    icon: Activity,
    allowedRoles: operationsRoles,
  },
  {
    title: "Salud financiera",
    href: "/protected/finanzas",
    icon: BriefcaseBusiness,
    allowedRoles: dataReadRoles,
  },
  {
    title: "Citas por negocio",
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
    title: "Gerentes y bonos",
    href: "/protected/gerentes",
    icon: UsersRound,
    allowedRoles: businessLineRoles,
  },
  {
    title: "Profesionales",
    href: "/protected/profesionales",
    icon: Stethoscope,
    allowedRoles: businessLineRoles,
  },
  {
    title: "Servicios",
    href: "/protected/servicios",
    icon: ClipboardCheck,
    allowedRoles: businessLineRoles,
  },
  {
    title: "Fisioterapia",
    href: "/protected/fisioterapia",
    icon: HeartPulse,
    allowedRoles: businessLineRoles,
  },
  {
    title: "Laboratorio",
    href: "/protected/laboratorio",
    icon: FlaskConical,
    allowedRoles: businessLineRoles,
  },
  {
    title: "Imagenes",
    href: "/protected/imagenes",
    icon: ImagePlus,
    allowedRoles: businessLineRoles,
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
    allowedRoles: dataUploadRoles,
  },
  {
    title: "Formulario mensual",
    href: "/protected/plantillas",
    icon: ClipboardCheck,
    allowedRoles: dataReadRoles,
  },
  {
    title: "Conectores",
    href: "/protected/conectores",
    icon: DatabaseZap,
    allowedRoles: adminRoles,
  },
  {
    title: "Calidad de datos",
    href: "/protected/calidad-datos",
    icon: ShieldCheck,
    allowedRoles: dataReadRoles,
  },
  {
    title: "Metas y avances",
    href: "/protected/metas",
    icon: Goal,
    allowedRoles: operationsRoles,
  },
  {
    title: "Usuarios y permisos",
    href: "/protected/usuarios-permisos",
    icon: KeyRound,
    allowedRoles: adminRoles,
  },
  {
    title: "Mi cuenta",
    href: "/protected/configuracion",
    icon: Settings,
    allowedRoles: allRoles,
  },
  {
    title: "Auditoria",
    href: "/protected/auditoria",
    icon: BarChart3,
    allowedRoles: executiveRoles,
  },
];

export function getNavigationForRole(roleKey: RoleKey) {
  return navigationItems.filter((item) => item.allowedRoles.includes(roleKey));
}

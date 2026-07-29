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
  group: NavigationGroupKey;
  allowedRoles: RoleKey[];
};

export type NavigationGroupKey =
  | "direccion"
  | "operacion"
  | "gestion"
  | "lineas"
  | "datos"
  | "sistema";

export type NavigationGroup = {
  key: NavigationGroupKey;
  title: string;
  description: string;
};

export const navigationGroups: NavigationGroup[] = [
  {
    key: "direccion",
    title: "Direccion",
    description: "Lectura ejecutiva, riesgos y decisiones.",
  },
  {
    key: "operacion",
    title: "Operacion",
    description: "Flujo, capacidad y sucursales.",
  },
  {
    key: "gestion",
    title: "Gestion",
    description: "Personas, bonos y portafolio.",
  },
  {
    key: "lineas",
    title: "Lineas de negocio",
    description: "Vistas de presentacion por unidad.",
  },
  {
    key: "datos",
    title: "Datos",
    description: "Captura, conectores y calidad.",
  },
  {
    key: "sistema",
    title: "Sistema",
    description: "Usuarios, cuenta y auditoria.",
  },
];

const adminRoles: RoleKey[] = ["super_admin", "webmaster_admin"];

const allRoles: RoleKey[] = [
  "super_admin",
  "webmaster_admin",
  "ceo",
  "gerente_operaciones",
  "gerente_area",
  "gerente_sucursal",
  "usuario_operativo",
  "viewer",
];

const executiveRoles: RoleKey[] = [...adminRoles, "ceo"];

const dataReadRoles: RoleKey[] = [
  ...adminRoles,
  "ceo",
  "gerente_operaciones",
  "gerente_area",
  "gerente_sucursal",
  "usuario_operativo",
  "viewer",
];

const connectorAdminRoles: RoleKey[] = adminRoles;

const delegatedUserAdminRoles: RoleKey[] = [
  ...adminRoles,
  "gerente_operaciones",
  "gerente_area",
];

const ceoFocusedRoles: RoleKey[] = [...adminRoles, "ceo"];
const operationsFocusedRoles: RoleKey[] = [...adminRoles, "gerente_operaciones"];
const areaFocusedRoles: RoleKey[] = [
  ...adminRoles,
  "gerente_operaciones",
  "gerente_area",
];
const branchFocusedRoles: RoleKey[] = [
  ...adminRoles,
  "gerente_operaciones",
  "gerente_area",
  "gerente_sucursal",
];
const linePresentationRoles: RoleKey[] = adminRoles;

export const navigationItems: NavigationItem[] = [
  {
    title: "Resumen ejecutivo",
    href: "/protected/overview",
    icon: LayoutDashboard,
    group: "direccion",
    allowedRoles: ceoFocusedRoles,
  },
  {
    title: "Operacion ejecutiva",
    href: "/protected/operacion",
    icon: Activity,
    group: "operacion",
    allowedRoles: operationsFocusedRoles,
  },
  {
    title: "Salud financiera",
    href: "/protected/finanzas",
    icon: BriefcaseBusiness,
    group: "direccion",
    allowedRoles: ceoFocusedRoles,
  },
  {
    title: "Citas por negocio",
    href: "/protected/citas",
    icon: CalendarClock,
    group: "operacion",
    allowedRoles: areaFocusedRoles,
  },
  {
    title: "Capacidad y ocupacion",
    href: "/protected/capacidad",
    icon: Gauge,
    group: "operacion",
    allowedRoles: areaFocusedRoles,
  },
  {
    title: "Sucursales",
    href: "/protected/sucursales",
    icon: Building2,
    group: "operacion",
    allowedRoles: [...branchFocusedRoles, "ceo"],
  },
  {
    title: "Gerentes y bonos",
    href: "/protected/gerentes",
    icon: UsersRound,
    group: "gestion",
    allowedRoles: [...branchFocusedRoles, "ceo"],
  },
  {
    title: "Profesionales",
    href: "/protected/profesionales",
    icon: Stethoscope,
    group: "gestion",
    allowedRoles: operationsFocusedRoles,
  },
  {
    title: "Servicios",
    href: "/protected/servicios",
    icon: ClipboardCheck,
    group: "gestion",
    allowedRoles: operationsFocusedRoles,
  },
  {
    title: "Fisioterapia",
    href: "/protected/fisioterapia",
    icon: HeartPulse,
    group: "lineas",
    allowedRoles: linePresentationRoles,
  },
  {
    title: "Laboratorio",
    href: "/protected/laboratorio",
    icon: FlaskConical,
    group: "lineas",
    allowedRoles: linePresentationRoles,
  },
  {
    title: "Imagenes",
    href: "/protected/imagenes",
    icon: ImagePlus,
    group: "lineas",
    allowedRoles: linePresentationRoles,
  },
  {
    title: "Insights",
    href: "/protected/insights",
    icon: Lightbulb,
    group: "direccion",
    allowedRoles: dataReadRoles,
  },
  {
    title: "Importaciones",
    href: "/protected/importaciones",
    icon: Import,
    group: "datos",
    allowedRoles: operationsFocusedRoles,
  },
  {
    title: "Formulario mensual",
    href: "/protected/plantillas",
    icon: ClipboardCheck,
    group: "datos",
    allowedRoles: [...branchFocusedRoles, "usuario_operativo"],
  },
  {
    title: "Conectores",
    href: "/protected/conectores",
    icon: DatabaseZap,
    group: "datos",
    allowedRoles: connectorAdminRoles,
  },
  {
    title: "Calidad de datos",
    href: "/protected/calidad-datos",
    icon: ShieldCheck,
    group: "datos",
    allowedRoles: operationsFocusedRoles,
  },
  {
    title: "Metas y avances",
    href: "/protected/metas",
    icon: Goal,
    group: "direccion",
    allowedRoles: [...branchFocusedRoles, "ceo"],
  },
  {
    title: "Usuarios y permisos",
    href: "/protected/usuarios-permisos",
    icon: KeyRound,
    group: "sistema",
    allowedRoles: delegatedUserAdminRoles,
  },
  {
    title: "Mi cuenta",
    href: "/protected/configuracion",
    icon: Settings,
    group: "sistema",
    allowedRoles: allRoles,
  },
  {
    title: "Auditoria",
    href: "/protected/auditoria",
    icon: BarChart3,
    group: "sistema",
    allowedRoles: executiveRoles,
  },
];

export function getNavigationForRole(roleKey: RoleKey) {
  return navigationItems.filter((item) => item.allowedRoles.includes(roleKey));
}

export function getGroupedNavigationForRole(roleKey: RoleKey) {
  const visibleItems = getNavigationForRole(roleKey);

  return navigationGroups
    .map((group) => ({
      ...group,
      items: visibleItems.filter((item) => item.group === group.key),
    }))
    .filter((group) => group.items.length > 0);
}

export type DashboardAnalysisModel =
  | "Exploratorio"
  | "Descriptivo"
  | "Predictivo";

export type DashboardDensityStatus =
  | "Lectura visual correcta"
  | "Cargada"
  | "Muy cargada";

export type DashboardReadingMode = "estandar" | "visual";

export type DashboardValidationAudit = {
  href: string;
  module: string;
  owner: string;
  densityScore: number;
  densityStatus: DashboardDensityStatus;
  readingMode: DashboardReadingMode;
  dataStatus: "DEMO";
  models: DashboardAnalysisModel[];
  chartPriority: string[];
  validationChecks: string[];
  editsApplied: string[];
  decisionPrompt: string;
  lastScanAt: string;
};

const standardChecks = [
  "KPI principal visible antes del detalle",
  "Comparacion contra meta o periodo anterior",
  "Grafica con lectura rapida",
  "Insight accionable y responsable sugerido",
  "Dato DEMO o pendiente marcado sin mezclar con dato real",
];

function buildAudit({
  chartPriority,
  densityScore,
  densityStatus,
  href,
  module,
  owner,
  prompt,
}: {
  chartPriority: string[];
  densityScore: number;
  densityStatus: DashboardDensityStatus;
  href: string;
  module: string;
  owner: string;
  prompt: string;
}): DashboardValidationAudit {
  const readingMode: DashboardReadingMode =
    densityStatus === "Lectura visual correcta" ? "estandar" : "visual";

  return {
    chartPriority,
    dataStatus: "DEMO",
    decisionPrompt: prompt,
    densityScore,
    densityStatus,
    editsApplied:
      readingMode === "visual"
        ? [
            "Priorizar graficas y KPI antes de texto largo",
            "Comprimir explicacion a lectura de decision",
            "Separar alerta, causa y accion en bloques visuales",
          ]
        : [
            "Mantener lectura ejecutiva actual",
            "Validar que cada grafica conserve tooltip o dato exacto",
          ],
    href,
    lastScanAt: "2026-07-24 10:30",
    models: ["Exploratorio", "Descriptivo", "Predictivo"],
    module,
    owner,
    readingMode,
    validationChecks: standardChecks,
  };
}

export const dashboardValidationAudits: DashboardValidationAudit[] = [
  buildAudit({
    chartPriority: ["Tabla comparativa por linea", "Metas vs resultados", "Tendencia de ingresos"],
    densityScore: 42,
    densityStatus: "Lectura visual correcta",
    href: "/protected/overview",
    module: "Resumen ejecutivo",
    owner: "CEO",
    prompt: "Detectar rapido que linea esta sana, en riesgo o fuera de meta.",
  }),
  buildAudit({
    chartPriority: ["Volumen operativo", "Tiempo de proceso", "Productividad y errores"],
    densityScore: 68,
    densityStatus: "Cargada",
    href: "/protected/operacion",
    module: "Operacion ejecutiva",
    owner: "Gerencia de operaciones",
    prompt: "Explicar que paso en la operacion y donde intervenir hoy.",
  }),
  buildAudit({
    chartPriority: ["Venta vs costo", "Margen", "Gasto fijo y variable"],
    densityScore: 66,
    densityStatus: "Cargada",
    href: "/protected/finanzas",
    module: "Salud financiera",
    owner: "Direccion financiera",
    prompt: "Separar cuanto se produjo de cuanto dinero dejo la produccion.",
  }),
  buildAudit({
    chartPriority: ["Estado del flujo", "Conversion", "Demanda no atendida"],
    densityScore: 62,
    densityStatus: "Cargada",
    href: "/protected/citas",
    module: "Citas por negocio",
    owner: "Operaciones",
    prompt: "Ver si la demanda llega, se agenda y se convierte en atencion real.",
  }),
  buildAudit({
    chartPriority: ["Ocupacion efectiva", "Capacidad perdida", "Brecha contra meta"],
    densityScore: 64,
    densityStatus: "Cargada",
    href: "/protected/capacidad",
    module: "Capacidad y ocupacion",
    owner: "Operaciones",
    prompt: "Distinguir saturacion real de capacidad disponible no aprovechada.",
  }),
  buildAudit({
    chartPriority: ["Ranking integral", "Matriz rentabilidad-operacion", "Mapa de sucursales"],
    densityScore: 78,
    densityStatus: "Muy cargada",
    href: "/protected/sucursales",
    module: "Sucursales",
    owner: "Gerentes de sucursal",
    prompt: "Leer que sucursal necesita apoyo y cual puede servir como modelo.",
  }),
  buildAudit({
    chartPriority: ["Score de gerente", "Bono proyectado", "Causas de ajuste"],
    densityScore: 70,
    densityStatus: "Cargada",
    href: "/protected/gerentes",
    module: "Gerentes y bonos",
    owner: "CEO y operaciones",
    prompt: "Asignar bonos con evidencia, no solo por venta.",
  }),
  buildAudit({
    chartPriority: ["Desempeno individual", "Calidad", "Comparables por rol"],
    densityScore: 71,
    densityStatus: "Cargada",
    href: "/protected/profesionales",
    module: "Profesionales",
    owner: "Operaciones",
    prompt: "Ver productividad sin castigar roles no comparables.",
  }),
  buildAudit({
    chartPriority: ["Rentabilidad por servicio", "Brecha de meta", "Portafolio"],
    densityScore: 69,
    densityStatus: "Cargada",
    href: "/protected/servicios",
    module: "Servicios",
    owner: "Direccion comercial",
    prompt: "Decidir que servicio crecer, corregir o dejar de impulsar.",
  }),
  buildAudit({
    chartPriority: ["Continuidad terapeutica", "Sesiones", "No-show y abandono"],
    densityScore: 76,
    densityStatus: "Muy cargada",
    href: "/protected/fisioterapia",
    module: "Fisioterapia",
    owner: "Linea Fisioterapia",
    prompt: "Contar agenda, continuidad y resultado sin mezclarlo con laboratorio.",
  }),
  buildAudit({
    chartPriority: ["Ordenes", "Muestras", "Pruebas rentables e inventario"],
    densityScore: 77,
    densityStatus: "Muy cargada",
    href: "/protected/laboratorio",
    module: "Laboratorio",
    owner: "Linea Laboratorio",
    prompt: "Conectar volumen tecnico con margen, reactivos y entregas.",
  }),
  buildAudit({
    chartPriority: ["Estudios", "Equipos", "Informes y modalidad"],
    densityScore: 77,
    densityStatus: "Muy cargada",
    href: "/protected/imagenes",
    module: "Imagenes",
    owner: "Linea Imagenes",
    prompt: "Leer equipos, estudios e informes sin reciclar la vista de laboratorio.",
  }),
  buildAudit({
    chartPriority: ["Alertas tempranas", "Predicciones", "Acciones trazables"],
    densityScore: 82,
    densityStatus: "Muy cargada",
    href: "/protected/insights",
    module: "Insights",
    owner: "AnaliA Data Science",
    prompt: "Priorizar lo que requiere decision hoy y dejar trazabilidad.",
  }),
  buildAudit({
    chartPriority: ["Cobertura de documentos", "Errores de carga", "Actualizacion"],
    densityScore: 66,
    densityStatus: "Cargada",
    href: "/protected/importaciones",
    module: "Importaciones",
    owner: "Gerencia de operaciones",
    prompt: "Saber que falta cargar antes de confiar en un dashboard.",
  }),
  buildAudit({
    chartPriority: ["Paquetes por linea", "Ultima subida", "Siguiente mes"],
    densityScore: 63,
    densityStatus: "Cargada",
    href: "/protected/plantillas",
    module: "Plantillas",
    owner: "Gerencia de operaciones",
    prompt: "Descargar el Excel correcto sin confundir linea, sucursal o periodo.",
  }),
  buildAudit({
    chartPriority: ["Estado del conector", "Fuente pendiente", "Modulo afectado"],
    densityScore: 45,
    densityStatus: "Lectura visual correcta",
    href: "/protected/conectores",
    module: "Conectores",
    owner: "Webmaster",
    prompt: "Ver que fuente real esta conectada y cual sigue deshabilitada.",
  }),
  buildAudit({
    chartPriority: ["Completitud", "Errores criticos", "Dashboards afectados"],
    densityScore: 67,
    densityStatus: "Cargada",
    href: "/protected/calidad-datos",
    module: "Calidad de datos",
    owner: "Operaciones y datos",
    prompt: "Bloquear conclusiones cuando falte calidad o trazabilidad.",
  }),
  buildAudit({
    chartPriority: ["Avance mensual", "Meta sugerida", "Meta final CEO"],
    densityScore: 65,
    densityStatus: "Cargada",
    href: "/protected/metas",
    module: "Metas y avances",
    owner: "CEO",
    prompt: "Comparar meta sugerida por datos contra meta final aprobada.",
  }),
  buildAudit({
    chartPriority: ["Roles", "Permisos", "Usuarios creados"],
    densityScore: 48,
    densityStatus: "Lectura visual correcta",
    href: "/protected/usuarios-permisos",
    module: "Usuarios y permisos",
    owner: "Webmaster",
    prompt: "Validar quien puede crear usuarios, cargar datos y solo leer.",
  }),
  buildAudit({
    chartPriority: ["Cambios personales", "Seguridad", "Preferencias"],
    densityScore: 36,
    densityStatus: "Lectura visual correcta",
    href: "/protected/configuracion",
    module: "Mi cuenta",
    owner: "Usuario",
    prompt: "Mantener configuracion personal simple y sin mezclarla con BI.",
  }),
  buildAudit({
    chartPriority: ["Acciones sensibles", "Cambios de datos", "Trazabilidad"],
    densityScore: 60,
    densityStatus: "Cargada",
    href: "/protected/auditoria",
    module: "Auditoria",
    owner: "Webmaster y CEO",
    prompt: "Ver quien cambio datos, permisos, metas o modelos.",
  }),
];

export function getDashboardAuditForPath(pathname: string) {
  const normalizedPath = pathname.replace(/\/$/, "") || "/";

  return (
    dashboardValidationAudits.find((audit) => audit.href === normalizedPath) ??
    dashboardValidationAudits.find((audit) =>
      normalizedPath.startsWith(`${audit.href}/`),
    ) ??
    null
  );
}

export function getDashboardValidationSummary() {
  const overloaded = dashboardValidationAudits.filter(
    (audit) => audit.densityStatus === "Muy cargada",
  );
  const visualMode = dashboardValidationAudits.filter(
    (audit) => audit.readingMode === "visual",
  );
  const averageDensity =
    dashboardValidationAudits.reduce(
      (total, audit) => total + audit.densityScore,
      0,
    ) / dashboardValidationAudits.length;

  return {
    averageDensity: Math.round(averageDensity),
    dataStatus: "DEMO" as const,
    lastScanAt: "2026-07-24 10:30",
    overloadedCount: overloaded.length,
    reviewedCount: dashboardValidationAudits.length,
    visualModeCount: visualMode.length,
  };
}

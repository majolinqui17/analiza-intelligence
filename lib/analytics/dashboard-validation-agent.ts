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

export type AnaliaScreenChatIntent =
  | "resumen"
  | "critico"
  | "lectura"
  | "accion";

export type AnaliaScreenChatResponse = {
  intent: AnaliaScreenChatIntent;
  title: string;
  directAnswer: string;
  bullets: string[];
  criticalItems: string[];
  suggestedNextStep: string;
  sources: string[];
  confidence: number;
  caveat: string;
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

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function detectChatIntent(question: string): AnaliaScreenChatIntent {
  const normalizedQuestion = normalizeText(question);

  if (
    normalizedQuestion.includes("critico") ||
    normalizedQuestion.includes("riesgo") ||
    normalizedQuestion.includes("alerta") ||
    normalizedQuestion.includes("urgente")
  ) {
    return "critico";
  }

  if (
    normalizedQuestion.includes("lee") ||
    normalizedQuestion.includes("leer") ||
    normalizedQuestion.includes("pantalla") ||
    normalizedQuestion.includes("completa")
  ) {
    return "lectura";
  }

  if (
    normalizedQuestion.includes("accion") ||
    normalizedQuestion.includes("hacer") ||
    normalizedQuestion.includes("primero") ||
    normalizedQuestion.includes("recomienda")
  ) {
    return "accion";
  }

  return "resumen";
}

function getScreenSignals(screenText: string) {
  const lines = screenText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 3)
    .filter(
      (line, index, allLines) =>
        allLines.findIndex((candidate) => candidate === line) === index,
    );
  const relevantLines = lines
    .filter((line) => {
      const normalizedLine = normalizeText(line);

      return (
        normalizedLine.includes("meta") ||
        normalizedLine.includes("roi") ||
        normalizedLine.includes("riesgo") ||
        normalizedLine.includes("pendiente") ||
        normalizedLine.includes("critico") ||
        normalizedLine.includes("demo") ||
        normalizedLine.includes("costo") ||
        normalizedLine.includes("margen") ||
        normalizedLine.includes("ocupacion") ||
        normalizedLine.includes("bono") ||
        normalizedLine.includes("conector") ||
        normalizedLine.includes("calidad")
      );
    })
    .slice(0, 6);

  return relevantLines.length > 0 ? relevantLines : lines.slice(0, 6);
}

function getCriticalItems(audit: DashboardValidationAudit, screenText: string) {
  const normalizedScreen = normalizeText(screenText);
  const criticalItems: string[] = [];

  if (audit.densityStatus === "Muy cargada") {
    criticalItems.push(
      `La pantalla ${audit.module} esta muy cargada: conviene priorizar grafica, KPI y accion antes de texto largo.`,
    );
  }

  if (audit.densityStatus === "Cargada") {
    criticalItems.push(
      `La pantalla ${audit.module} requiere lectura guiada: hay riesgo de perder la decision principal entre varios bloques.`,
    );
  }

  if (normalizedScreen.includes("pendiente")) {
    criticalItems.push(
      "Hay elementos pendientes en la pantalla; no conviene cerrar conclusiones sin revisar fuente o responsable.",
    );
  }

  if (
    normalizedScreen.includes("riesgo") ||
    normalizedScreen.includes("critico") ||
    normalizedScreen.includes("alerta")
  ) {
    criticalItems.push(
      "La pantalla contiene senales de riesgo o alerta que deben revisarse antes de aprobar decisiones.",
    );
  }

  if (criticalItems.length === 0) {
    criticalItems.push(
      "No aparece una senal critica concluyente en esta vista DEMO; revisar calidad de datos antes de decidir.",
    );
  }

  return criticalItems.slice(0, 4);
}

export function createAnaliaScreenChatResponse({
  audit,
  businessLine,
  question,
  screenText,
}: {
  audit: DashboardValidationAudit;
  businessLine: string;
  question: string;
  screenText: string;
}): AnaliaScreenChatResponse {
  const intent = detectChatIntent(question);
  const screenSignals = getScreenSignals(screenText);
  const criticalItems = getCriticalItems(audit, screenText);
  const sources = [
    `Pantalla visible: ${audit.module}`,
    `Linea activa: ${businessLine}`,
    "Auditoria visual AnaliA DEMO",
  ];
  const confidence =
    audit.dataStatus === "DEMO"
      ? Math.max(68, Math.min(88, 100 - Math.round(audit.densityScore / 3)))
      : 72;

  if (intent === "critico") {
    return {
      bullets: criticalItems,
      caveat:
        "No ejecuto acciones ni apruebo metas; solo priorizo senales con datos DEMO visibles.",
      confidence,
      criticalItems,
      directAnswer:
        criticalItems[0] ??
        "No detecte una criticidad concluyente en esta pantalla DEMO.",
      intent,
      sources,
      suggestedNextStep:
        "Abrir el bloque con mayor riesgo, validar fuente y asignar responsable antes de decidir.",
      title: `Revision critica de ${audit.module}`,
    };
  }

  if (intent === "lectura") {
    return {
      bullets: [
        `Modulo: ${audit.module}.`,
        `Linea activa: ${businessLine}.`,
        `Lectura principal: ${audit.decisionPrompt}`,
        ...screenSignals.slice(0, 5),
      ],
      caveat:
        "Leo y resumo la pantalla visible; para datos reales necesito fuentes conectadas o plantillas validadas.",
      confidence,
      criticalItems,
      directAnswer:
        "Lei la pantalla visible y la condense en los puntos que afectan la decision.",
      intent,
      sources,
      suggestedNextStep:
        "Pedir: 'que es lo mas importante' o 'hay algo critico' para separar decision, causa y accion.",
      title: `Lectura de pantalla: ${audit.module}`,
    };
  }

  if (intent === "accion") {
    return {
      bullets: [
        `Prioridad: ${audit.decisionPrompt}`,
        `Grafica a mirar primero: ${audit.chartPriority[0]}.`,
        `Validacion minima: ${audit.validationChecks[0]}.`,
        ...criticalItems.slice(0, 2),
      ],
      caveat:
        "Las acciones son recomendaciones DEMO; en produccion deben quedar auditadas y aprobadas por el rol correspondiente.",
      confidence,
      criticalItems,
      directAnswer:
        "La primera accion es revisar el KPI principal de la pantalla contra meta y confirmar si la fuente esta completa.",
      intent,
      sources,
      suggestedNextStep:
        "Validar fuente, responsable, meta y periodo antes de mover una decision a ejecucion.",
      title: `Accion sugerida en ${audit.module}`,
    };
  }

  return {
    bullets: [
      `Lo mas importante: ${audit.decisionPrompt}`,
      `Prioridad visual: ${audit.chartPriority.slice(0, 2).join(" y ")}.`,
      `Estado de lectura: ${audit.densityStatus}, score ${audit.densityScore}/100.`,
      ...screenSignals.slice(0, 3),
    ],
    caveat:
      "Resumen generado sobre entorno DEMO; no sustituye validacion de datos reales.",
    confidence,
    criticalItems,
    directAnswer:
      `Resumen de ${audit.module}: enfocate en ${audit.chartPriority[0].toLowerCase()} y confirma si la lectura responde la decision del modulo.`,
    intent,
    sources,
    suggestedNextStep:
      "Pedir a AnaliA una revision critica si quieres separar riesgo, causa y accion.",
    title: `Resumen de insights: ${audit.module}`,
  };
}

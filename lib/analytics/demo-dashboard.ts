export type ExecutiveKpi = {
  label: string;
  value: string;
  change: string;
  tone: "positive" | "warning" | "negative" | "neutral";
  definition: string;
  formula: string;
  source: string;
  updatedAt: string;
};

export type BarPoint = {
  label: string;
  value: number;
};

export type InsightPreview = {
  title: string;
  priority: "alta" | "media" | "baja";
  affectedIndicator: string;
  recommendation: string;
};

export const demoDashboardMeta = {
  environment: "DEMO",
  selectedPeriod: "Contexto activo",
  lastUpdated: "2026-07-20 09:00",
  dataCoverage: "6 sucursales DEMO",
  completeness: 82,
  sources: [
    "Carga manual DEMO",
    "Facturacion DEMO",
    "Citas DEMO",
    "Capacidad DEMO",
  ],
};

export const executiveKpis: ExecutiveKpi[] = [
  {
    label: "Ingresos facturados",
    value: "$248.6K",
    change: "+8.4%",
    tone: "positive",
    definition: "Total facturado en el periodo seleccionado.",
    formula: "sum(invoice_net_amount)",
    source: "Facturacion DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "Ingresos cobrados",
    value: "$211.9K",
    change: "+5.1%",
    tone: "positive",
    definition: "Cobros aplicados a facturas del periodo.",
    formula: "sum(payment_amount)",
    source: "Cobros DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "Cuentas por cobrar",
    value: "$36.7K",
    change: "+3.3%",
    tone: "warning",
    definition: "Facturacion neta menos cobros aplicados.",
    formula: "net_invoicing - collections",
    source: "Facturacion DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "Pacientes o clientes atendidos",
    value: "3,842",
    change: "+6.2%",
    tone: "positive",
    definition: "Personas atendidas con identificador anonimo.",
    formula: "count(distinct anonymous_patient_id)",
    source: "Servicios DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "Citas agendadas",
    value: "5,418",
    change: "+4.8%",
    tone: "positive",
    definition: "Citas aplicables agendadas en el periodo.",
    formula: "count(appointments)",
    source: "Citas DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "Citas completadas",
    value: "4,876",
    change: "+3.9%",
    tone: "positive",
    definition: "Citas con estado normalizado completed.",
    formula: "completed / applicable_scheduled",
    source: "Citas DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "Cancelaciones",
    value: "318",
    change: "-1.2%",
    tone: "positive",
    definition: "Citas canceladas por paciente o sucursal.",
    formula: "cancelled / applicable_scheduled",
    source: "Citas DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "No-shows",
    value: "224",
    change: "+2.8%",
    tone: "warning",
    definition: "Citas agendadas aplicables con no asistencia.",
    formula: "no_show / applicable_scheduled",
    source: "Citas DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "Servicios realizados",
    value: "7,140",
    change: "+7.0%",
    tone: "positive",
    definition: "Servicios completados en unidades habilitadas.",
    formula: "count(service_events)",
    source: "Servicios DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "Ticket promedio",
    value: "$64.70",
    change: "+1.5%",
    tone: "positive",
    definition: "Ingreso facturado dividido entre servicios o visitas.",
    formula: "net_revenue / completed_visits",
    source: "Facturacion DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "Ocupacion agendada",
    value: "78%",
    change: "+4 pp",
    tone: "positive",
    definition: "Minutos agendados sobre minutos disponibles.",
    formula: "scheduled_minutes / available_minutes",
    source: "Capacidad DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "Ocupacion efectiva",
    value: "69%",
    change: "+2 pp",
    tone: "warning",
    definition: "Minutos completados o atendidos sobre minutos disponibles.",
    formula: "attended_minutes / available_minutes",
    source: "Capacidad DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "Brecha de asistencia",
    value: "9 pp",
    change: "+2 pp",
    tone: "warning",
    definition: "Diferencia entre ocupacion agendada y efectiva.",
    formula: "scheduled_occupancy - effective_occupancy",
    source: "Capacidad DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "Capacidad disponible",
    value: "1,284 h",
    change: "-3.1%",
    tone: "neutral",
    definition: "Horas configuradas y disponibles para atencion.",
    formula: "sum(available_minutes) / 60",
    source: "Capacidad DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "Margen contribucion estimado",
    value: "34%",
    change: "-1.6 pp",
    tone: "warning",
    definition: "Margen calculado solo con costos directos cargados.",
    formula: "(net_revenue - direct_costs) / net_revenue",
    source: "Finanzas DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "Meta de ingresos",
    value: "91%",
    change: "+6 pp",
    tone: "positive",
    definition: "Ingresos facturados contra meta configurada.",
    formula: "actual_revenue / revenue_target",
    source: "Metas DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "Meta operativa",
    value: "87%",
    change: "+4 pp",
    tone: "positive",
    definition: "Resultado operativo contra meta configurada.",
    formula: "actual_operating_metric / operating_target",
    source: "Metas DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
  {
    label: "Variacion anual",
    value: "+12.3%",
    change: "YoY",
    tone: "positive",
    definition: "Variacion contra mismo periodo del anio anterior.",
    formula: "(current_period - prior_year_period) / prior_year_period",
    source: "Analytics DEMO",
    updatedAt: demoDashboardMeta.lastUpdated,
  },
];

export const revenueByMonth: BarPoint[] = [
  { label: "Ene", value: 178 },
  { label: "Feb", value: 186 },
  { label: "Mar", value: 205 },
  { label: "Abr", value: 198 },
  { label: "May", value: 226 },
  { label: "Jun", value: 249 },
];

export const revenueByCompany: BarPoint[] = [
  { label: "Fisioterapia", value: 42 },
  { label: "Laboratorio", value: 35 },
  { label: "Imagenes", value: 23 },
];

export const appointmentStatus: BarPoint[] = [
  { label: "Completadas", value: 4876 },
  { label: "Canceladas", value: 318 },
  { label: "No-show", value: 224 },
  { label: "Reprogramadas", value: 412 },
];

export const occupancyByUnit: BarPoint[] = [
  { label: "Fisioterapia", value: 74 },
  { label: "Laboratorio", value: 68 },
  { label: "Imagenes", value: 63 },
];

export const targetVsActual: BarPoint[] = [
  { label: "Meta", value: 273 },
  { label: "Real", value: 249 },
];

export const managerPerformance: BarPoint[] = [
  { label: "Sucursal Norte", value: 86 },
  { label: "Central", value: 82 },
  { label: "Este", value: 77 },
  { label: "Centro", value: 74 },
];

export const insightPreviews: InsightPreview[] = [
  {
    title: "Ocupacion agendada alta con brecha efectiva",
    priority: "alta",
    affectedIndicator: "Brecha de asistencia",
    recommendation: "Revisar confirmaciones, recordatorios y causas de no-show.",
  },
  {
    title: "Crecimiento de ingresos con margen presionado",
    priority: "media",
    affectedIndicator: "Margen contribucion estimado",
    recommendation: "Comparar mezcla de servicios y costos directos por unidad.",
  },
  {
    title: "Datos de capacidad incompletos en sucursales DEMO",
    priority: "media",
    affectedIndicator: "Completitud",
    recommendation: "Completar horarios antes de presentar conclusiones ejecutivas.",
  },
];


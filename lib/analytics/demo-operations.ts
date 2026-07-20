import {
  calculateAppointmentRates,
  calculateOccupancy,
  formatPercent,
  formatPercentagePoints,
} from "@/lib/analytics/operations";

export type AppointmentStatusRow = {
  status: string;
  count: number;
  qualityNote: string;
};

export type CapacityRow = {
  branch: string;
  company: string;
  availableMinutes: number;
  scheduledMinutes: number;
  attendedMinutes: number;
};

export type BranchPerformanceRow = {
  branch: string;
  country: string;
  company: string;
  manager: string;
  capacitySize: string;
  dataQuality: number;
  revenueTarget: number;
  operatingTarget: number;
};

export type ManagerPerformanceRow = {
  manager: string;
  country: string;
  company: string;
  branch: string;
  capacityAdjustedIndex: number | null;
  strengths: string[];
  alerts: string[];
  dataQuality: number;
};

export const appointmentStatusRows: AppointmentStatusRow[] = [
  {
    status: "completed",
    count: 4876,
    qualityNote: "Mapeado desde estados completados DEMO",
  },
  {
    status: "cancelled_by_patient",
    count: 224,
    qualityNote: "Cancelaciones por paciente DEMO",
  },
  {
    status: "cancelled_by_branch",
    count: 94,
    qualityNote: "Cancelaciones por sucursal DEMO",
  },
  {
    status: "no_show",
    count: 224,
    qualityNote: "Inasistencias DEMO",
  },
  {
    status: "rescheduled",
    count: 412,
    qualityNote: "Reprogramaciones DEMO",
  },
  {
    status: "unknown",
    count: 18,
    qualityNote: "Revisar mapeo de origen",
  },
];

export const capacityRows: CapacityRow[] = [
  {
    branch: "Sucursal DEMO Fisioterapia Norte",
    company: "Analiza Fisioterapia",
    availableMinutes: 9600,
    scheduledMinutes: 7680,
    attendedMinutes: 6720,
  },
  {
    branch: "Sucursal DEMO Laboratorio Central",
    company: "Analiza Laboratorio",
    availableMinutes: 8400,
    scheduledMinutes: 6300,
    attendedMinutes: 5880,
  },
  {
    branch: "Sucursal DEMO Imagenes Este",
    company: "Analiza Imagenes",
    availableMinutes: 7200,
    scheduledMinutes: 5040,
    attendedMinutes: 4380,
  },
];

export const branchPerformanceRows: BranchPerformanceRow[] = [
  {
    branch: "Sucursal DEMO Fisioterapia Norte",
    country: "Honduras",
    company: "Analiza Fisioterapia",
    manager: "Gerente DEMO Norte",
    capacitySize: "160 h disponibles",
    dataQuality: 88,
    revenueTarget: 94,
    operatingTarget: 91,
  },
  {
    branch: "Sucursal DEMO Laboratorio Central",
    country: "Honduras",
    company: "Analiza Laboratorio",
    manager: "Gerente DEMO Central",
    capacitySize: "140 h disponibles",
    dataQuality: 84,
    revenueTarget: 89,
    operatingTarget: 86,
  },
  {
    branch: "Sucursal DEMO Imagenes Este",
    country: "Honduras",
    company: "Analiza Imagenes",
    manager: "Gerente DEMO Este",
    capacitySize: "120 h disponibles",
    dataQuality: 79,
    revenueTarget: 83,
    operatingTarget: 80,
  },
];

export const managerPerformanceRows: ManagerPerformanceRow[] = [
  {
    manager: "Gerente DEMO Norte",
    country: "Honduras",
    company: "Analiza Fisioterapia",
    branch: "Sucursal DEMO Fisioterapia Norte",
    capacityAdjustedIndex: 86,
    strengths: ["Meta de ingresos", "Ocupacion efectiva"],
    alerts: ["Brecha de asistencia"],
    dataQuality: 88,
  },
  {
    manager: "Gerente DEMO Central",
    country: "Honduras",
    company: "Analiza Laboratorio",
    branch: "Sucursal DEMO Laboratorio Central",
    capacityAdjustedIndex: 82,
    strengths: ["Finalizacion", "Calidad de datos"],
    alerts: ["Tiempo de entrega pendiente"],
    dataQuality: 84,
  },
  {
    manager: "Gerente DEMO Este",
    country: "Honduras",
    company: "Analiza Imagenes",
    branch: "Sucursal DEMO Imagenes Este",
    capacityAdjustedIndex: null,
    strengths: ["Demanda estable"],
    alerts: ["Completitud insuficiente para puntuacion"],
    dataQuality: 62,
  },
];

export const appointmentRateSummary = calculateAppointmentRates({
  scheduledApplicable: 5830,
  completed: 4876,
  cancelled: 318,
  noShow: 224,
  rescheduled: 412,
});

export function getCapacityViewRows() {
  return capacityRows.map((row) => {
    const occupancy = calculateOccupancy(row);

    return {
      ...row,
      availableHours: `${Math.round(row.availableMinutes / 60)} h`,
      scheduledOccupancy: formatPercent(occupancy.scheduledOccupancy),
      effectiveOccupancy: formatPercent(occupancy.effectiveOccupancy),
      attendanceGap: formatPercentagePoints(occupancy.attendanceGap),
    };
  });
}


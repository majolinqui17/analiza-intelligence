"use client";

import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  DatabaseZap,
  History,
  LockKeyhole,
  Save,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  calculateManualMonthlyHistorySummary,
  getManualMonthlyFormStepsForLine,
  getManualMonthlyHistoryForLine,
  importBusinessLines,
  type ImportBusinessLine,
  type ManualMonthlyDeadlineStatus,
  type ManualMonthlyFormField,
  type ManualMonthlyHistoryEntry,
  type ManualMonthlySubmissionStatus,
} from "@/lib/analytics/import-operations";
import {
  type ActiveBusinessLine,
  useActiveBusinessLine,
} from "@/hooks/use-active-business-line";
import {
  demoBranches,
  demoBusinessLineOptions,
  demoCountryOptions,
  regionalCountryId,
  type BranchOption,
} from "@/lib/tenant/demo-context";
import { cn } from "@/lib/utils";

const contextStorageKey = "analiza:selected-context";
const contextChangeEvent = "analiza:context-change";
const manualHistoryStorageKey = "analiza:manual-monthly-history";

type StoredContext = {
  branchId?: string;
  businessLineCode?: string;
  businessLineId?: string;
  businessLineName?: string;
  companyId?: string;
  countryName?: string;
  countryId?: string;
  companyName?: string;
  branchName?: string;
  managerName?: string;
  period?: string;
  periodStart?: string;
  periodEnd?: string;
};

type LocalManualMonthlySubmission = ManualMonthlyHistoryEntry & {
  answers: Record<string, string>;
};

type ManualMetricCardProps = {
  icon: typeof ClipboardList;
  label: string;
  note: string;
  value: string;
};

const manualStatuses: ManualMonthlySubmissionStatus[] = [
  "Borrador DEMO",
  "Publicado DEMO",
  "Bloqueado por calidad DEMO",
];

const businessLineTone: Record<
  ImportBusinessLine,
  {
    accent: string;
    badge: string;
    border: string;
    soft: string;
    text: string;
  }
> = {
  Consolidado: {
    accent: "bg-slate-700",
    badge: "bg-slate-100 text-slate-800 hover:bg-slate-100",
    border: "border-slate-300",
    soft: "bg-slate-50",
    text: "text-slate-800",
  },
  Laboratorio: {
    accent: "bg-indigo-600",
    badge: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
    border: "border-indigo-300",
    soft: "bg-indigo-50",
    text: "text-indigo-900",
  },
  Fisioterapia: {
    accent: "bg-emerald-600",
    badge: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
    border: "border-emerald-300",
    soft: "bg-emerald-50",
    text: "text-emerald-900",
  },
  Imagenes: {
    accent: "bg-sky-600",
    badge: "bg-sky-100 text-sky-800 hover:bg-sky-100",
    border: "border-sky-300",
    soft: "bg-sky-50",
    text: "text-sky-900",
  },
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isStringRecord(value: unknown): value is Record<string, string> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(isString);
}

function isImportBusinessLine(value: unknown): value is ImportBusinessLine {
  return isString(value) && importBusinessLines.includes(value as ImportBusinessLine);
}

function isManualSubmissionStatus(
  value: unknown,
): value is ManualMonthlySubmissionStatus {
  return isString(value) && manualStatuses.includes(value as ManualMonthlySubmissionStatus);
}

function isLocalManualMonthlySubmission(
  value: unknown,
): value is LocalManualMonthlySubmission {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isImportBusinessLine(value.businessLine) &&
    isString(value.branch) &&
    isString(value.period) &&
    isString(value.manager) &&
    isNumber(value.netRevenue) &&
    isNumber(value.revenueTarget) &&
    isNumber(value.grossMarginRate) &&
    isNumber(value.effectiveOccupancyRate) &&
    isNumber(value.activityVolume) &&
    isNumber(value.dataQualityScore) &&
    isManualSubmissionStatus(value.status) &&
    isString(value.sourceTrace) &&
    isString(value.createdAt) &&
    value.demoFlag === true &&
    isStringRecord(value.answers)
  );
}

function readStoredContext() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawContext =
    window.localStorage.getItem(contextStorageKey) ??
    window.sessionStorage.getItem(contextStorageKey);

  if (!rawContext) {
    return null;
  }

  try {
    return JSON.parse(rawContext) as StoredContext;
  } catch {
    return null;
  }
}

function readLocalManualHistory() {
  if (typeof window === "undefined") {
    return [];
  }

  const rawHistory = window.localStorage.getItem(manualHistoryStorageKey);

  if (!rawHistory) {
    return [];
  }

  try {
    const parsedHistory: unknown = JSON.parse(rawHistory);
    return Array.isArray(parsedHistory)
      ? parsedHistory.filter(isLocalManualMonthlySubmission)
      : [];
  } catch {
    window.localStorage.removeItem(manualHistoryStorageKey);
    return [];
  }
}

function toImportBusinessLine(line: ActiveBusinessLine): ImportBusinessLine {
  if (line === "Laboratorio") {
    return "Laboratorio";
  }

  if (line === "Fisioterapia") {
    return "Fisioterapia";
  }

  if (line === "Imagenes") {
    return "Imagenes";
  }

  return "Consolidado";
}

function getBusinessLineCompanyId(line: ImportBusinessLine) {
  const lineCode: Record<ImportBusinessLine, string> = {
    Consolidado: "CONSOLIDATED",
    Fisioterapia: "PHYSIOTHERAPY",
    Imagenes: "IMAGING",
    Laboratorio: "LABORATORY",
  };
  const businessLine = demoBusinessLineOptions.find(
    (option) => option.code === lineCode[line],
  );

  return businessLine?.companyId ?? null;
}

function getBranchCountryName(countryId: string) {
  return (
    demoCountryOptions.find((country) => country.id === countryId)?.name ??
    "Pais pendiente"
  );
}

function formatBranchOption(branch: BranchOption) {
  const branchManager = branch.branchManagerName ?? "Sin gerente asignado";
  const areaManager = branch.areaManagerName ?? "Area pendiente";

  return `${branch.name} · ${branchManager} · Area: ${areaManager} · ${getBranchCountryName(branch.countryId)}`;
}

function getBranchOptionsForLine(
  line: ImportBusinessLine,
  context: StoredContext | null,
) {
  const companyId = getBusinessLineCompanyId(line);

  if (!companyId) {
    return [];
  }

  return demoBranches
    .filter((branch) => branch.companyId === companyId)
    .filter(
      (branch) =>
        !context?.countryId ||
        context.countryId === regionalCountryId ||
        branch.countryId === context.countryId,
    )
    .sort((left, right) =>
      formatBranchOption(left).localeCompare(formatBranchOption(right)),
    );
}

function uniqueSortedNames(names: Array<string | undefined>) {
  return Array.from(
    new Set(names.map((name) => name?.trim()).filter(isString).filter(Boolean)),
  ).sort((left, right) => left.localeCompare(right));
}

function getBranchManagerOptions(branchOptions: BranchOption[]) {
  return uniqueSortedNames(
    branchOptions.map((branch) => branch.branchManagerName),
  );
}

function getAreaManagerOptions(branchOptions: BranchOption[]) {
  return uniqueSortedNames(branchOptions.map((branch) => branch.areaManagerName));
}

function resolveBranchName(
  branchId: string | undefined,
  branchOptions: BranchOption[],
) {
  if (!branchId) {
    return "";
  }

  return (
    branchOptions.find((branch) => branch.id === branchId)?.name ??
    branchId
  );
}

function findSelectedBranch(
  branchId: string | undefined,
  branchOptions: BranchOption[],
) {
  if (!branchId) {
    return null;
  }

  return branchOptions.find((branch) => branch.id === branchId) ?? null;
}

function getMonthEndDate(period: string) {
  if (!/^\d{4}-\d{2}$/.test(period)) {
    return "2026-07-31";
  }

  const [yearValue, monthValue] = period.split("-").map(Number);
  const monthEndDate = new Date(Date.UTC(yearValue, monthValue, 0));

  return monthEndDate.toISOString().slice(0, 10);
}

function getMonthlyLoadDeadline(period: string) {
  if (!/^\d{4}-\d{2}$/.test(period)) {
    return "2026-08-05";
  }

  const [yearValue, monthValue] = period.split("-").map(Number);
  const deadlineDate = new Date(Date.UTC(yearValue, monthValue, 5));

  return deadlineDate.toISOString().slice(0, 10);
}

function getDeadlineStatus(
  period: string,
  createdAt: string,
): ManualMonthlyDeadlineStatus {
  if (!/^\d{4}-\d{2}$/.test(period)) {
    return "Pendiente DEMO";
  }

  return createdAt <= getMonthlyLoadDeadline(period)
    ? "A tiempo DEMO"
    : "Tarde DEMO";
}

function getPunctualityScore(status: ManualMonthlyDeadlineStatus) {
  if (status === "A tiempo DEMO") {
    return 100;
  }

  if (status === "Tarde DEMO") {
    return 70;
  }

  return 0;
}

function applyBranchMetadata(
  values: Record<string, string>,
  branch: BranchOption | null,
) {
  return {
    ...values,
    area_manager_name: branch?.areaManagerName ?? values.area_manager_name ?? "",
    area_zone: branch?.areaZone ?? values.area_zone ?? "",
    manager_name: branch?.branchManagerName ?? values.manager_name ?? "",
  };
}

function normalizeMonthValue(context: StoredContext | null) {
  if (context?.periodStart && /^\d{4}-\d{2}/.test(context.periodStart)) {
    return context.periodStart.slice(0, 7);
  }

  if (context?.period && /^\d{4}-\d{2}/.test(context.period)) {
    return context.period.slice(0, 7);
  }

  return "2026-07";
}

function buildInitialFormValues(
  line: ImportBusinessLine,
  context: StoredContext | null,
  branchOptions: BranchOption[],
) {
  const fields = getManualMonthlyFormStepsForLine(line).flatMap(
    (step) => step.fields,
  );
  const values = fields.reduce<Record<string, string>>((currentValue, field) => {
    currentValue[field.id] = "";
    return currentValue;
  }, {});

  values.period = normalizeMonthValue(context);
  const contextBranchId =
    context?.branchId && context.branchId !== "__all__"
      ? context.branchId
      : "";
  const branchByName = branchOptions.find(
    (branch) => branch.name === context?.branchName,
  );

  values.branch_reported = branchOptions.some(
    (branch) => branch.id === contextBranchId,
  )
    ? contextBranchId
    : branchByName?.id ?? "";
  values.data_cutoff_date = context?.periodEnd ?? getMonthEndDate(values.period);
  values.load_deadline_date = getMonthlyLoadDeadline(values.period);
  values.manager_attestation =
    "Confirmo cierre mensual anonimo, conciliado y sin datos personales visibles.";
  const contextManagerName =
    context?.managerName && context.managerName !== "Todos los gerentes"
      ? context.managerName
      : values.manager_name;

  return applyBranchMetadata(
    {
      ...values,
      manager_name: contextManagerName,
    },
    findSelectedBranch(values.branch_reported, branchOptions),
  );
}

function numberFromValue(value: string | undefined) {
  const parsedValue = Number((value ?? "").replace(/,/g, ""));
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}

function resolveActivityVolume(
  line: ImportBusinessLine,
  values: Record<string, string>,
) {
  if (line === "Laboratorio") {
    return (
      numberFromValue(values.lab_orders) ||
      numberFromValue(values.lab_tests) ||
      numberFromValue(values.appointments_completed)
    );
  }

  if (line === "Fisioterapia") {
    return (
      numberFromValue(values.therapy_sessions) ||
      numberFromValue(values.active_treatment_plans) ||
      numberFromValue(values.appointments_completed)
    );
  }

  if (line === "Imagenes") {
    return (
      numberFromValue(values.imaging_studies) ||
      numberFromValue(values.reports_pending) ||
      numberFromValue(values.appointments_completed)
    );
  }

  return numberFromValue(values.appointments_completed);
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function statusClass(status: ManualMonthlySubmissionStatus) {
  if (status === "Publicado DEMO") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  if (status === "Bloqueado por calidad DEMO") {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }

  return "border-blue-200 bg-blue-50 text-blue-800";
}

function ManualMetricCard({ icon: Icon, label, note, value }: ManualMetricCardProps) {
  return (
    <article className="grid min-h-28 gap-2 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <Icon className="size-4 text-primary" />
      </div>
      <strong className="text-2xl font-semibold tracking-normal">{value}</strong>
      <span className="text-xs leading-5 text-muted-foreground">{note}</span>
    </article>
  );
}

function fieldInputType(field: ManualMonthlyFormField) {
  if (
    field.inputType === "currency" ||
    field.inputType === "number" ||
    field.inputType === "percent"
  ) {
    return "number";
  }

  return field.inputType;
}

function fieldInputStep(field: ManualMonthlyFormField) {
  if (field.inputType === "currency") {
    return "0.01";
  }

  if (field.inputType === "percent") {
    return "0.1";
  }

  if (field.inputType === "number") {
    return "1";
  }

  return undefined;
}

function ManualField({
  areaManagerOptions,
  branchManagerOptions,
  branchOptions,
  field,
  onChange,
  readOnly,
  value,
}: {
  areaManagerOptions: string[];
  branchManagerOptions: string[];
  branchOptions: BranchOption[];
  field: ManualMonthlyFormField;
  onChange: (value: string) => void;
  readOnly?: boolean;
  value: string;
}) {
  const isCurrency = field.inputType === "currency";
  const isPercent = field.inputType === "percent";
  const isNumeric =
    field.inputType === "currency" ||
    field.inputType === "number" ||
    field.inputType === "percent";
  const isBranchSelector = field.id === "branch_reported";
  const isBranchManagerSelector = field.id === "manager_name";
  const isAreaManagerSelector = field.id === "area_manager_name";
  const isSelectField =
    isBranchSelector || isBranchManagerSelector || isAreaManagerSelector;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }

  function renderTextOption(option: string) {
    return (
      <option key={option} value={option}>
        {option}
      </option>
    );
  }

  return (
    <label className="grid gap-2 rounded-md border bg-background p-3 text-sm">
      <span className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{field.label}</span>
        <Badge variant="outline">{field.required ? "Obligatorio" : "Opcional"}</Badge>
      </span>
      <span className="min-h-10 text-xs leading-5 text-muted-foreground">
        {field.description}
      </span>
      <span className="relative">
        {isBranchSelector ? (
          <select
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            disabled={readOnly}
            onChange={(event) => onChange(event.target.value)}
            value={value}
          >
            <option value="">Selecciona una sucursal</option>
            {branchOptions.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {formatBranchOption(branch)}
              </option>
            ))}
          </select>
        ) : isBranchManagerSelector ? (
          <select
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            disabled={readOnly}
            onChange={(event) => onChange(event.target.value)}
            value={value}
          >
            <option value="">{field.placeholder}</option>
            {value && !branchManagerOptions.includes(value)
              ? renderTextOption(value)
              : null}
            {branchManagerOptions.map(renderTextOption)}
          </select>
        ) : isAreaManagerSelector ? (
          <select
            className="h-11 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            disabled={readOnly}
            onChange={(event) => onChange(event.target.value)}
            value={value}
          >
            <option value="">{field.placeholder}</option>
            {value && !areaManagerOptions.includes(value)
              ? renderTextOption(value)
              : null}
            {areaManagerOptions.map(renderTextOption)}
          </select>
        ) : isCurrency ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            $
          </span>
        ) : null}
        {!isSelectField ? (
          <Input
            className={cn(
              "h-11",
              isCurrency && "pl-8",
              isPercent && "pr-10",
              readOnly && "bg-muted text-muted-foreground",
            )}
            inputMode={isNumeric ? "decimal" : undefined}
            max={field.max}
            min={field.min}
            onChange={handleChange}
            placeholder={field.placeholder}
            readOnly={readOnly}
            step={fieldInputStep(field)}
            type={fieldInputType(field)}
            value={value}
          />
        ) : null}
        {isPercent && !isSelectField ? (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        ) : null}
      </span>
      <span className="text-[11px] leading-4 text-muted-foreground">
        Unidad: {field.unit}
      </span>
    </label>
  );
}

function HistoryTable({ entries }: { entries: ManualMonthlyHistoryEntry[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1040px] text-left text-sm">
        <thead className="text-xs text-muted-foreground">
          <tr className="border-b">
            <th className="py-2 pr-4 font-medium">Periodo</th>
            <th className="py-2 pr-4 font-medium">Linea</th>
            <th className="py-2 pr-4 font-medium">Sucursal</th>
            <th className="py-2 pr-4 font-medium">Gerente de area</th>
            <th className="py-2 pr-4 font-medium">Ingreso neto</th>
            <th className="py-2 pr-4 font-medium">Margen</th>
            <th className="py-2 pr-4 font-medium">Ocupacion</th>
            <th className="py-2 pr-4 font-medium">Calidad</th>
            <th className="py-2 pr-4 font-medium">Puntualidad</th>
            <th className="py-2 pr-4 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody>
          {entries.slice(0, 8).map((entry) => (
            <tr className="border-b last:border-b-0" key={entry.id}>
              <td className="py-3 pr-4 font-medium">{entry.period}</td>
              <td className="py-3 pr-4">{entry.businessLine}</td>
              <td className="py-3 pr-4">{entry.branch}</td>
              <td className="py-3 pr-4">{entry.areaManager ?? "Pendiente"}</td>
              <td className="py-3 pr-4">{formatCurrency(entry.netRevenue)}</td>
              <td className="py-3 pr-4">{formatPercent(entry.grossMarginRate)}</td>
              <td className="py-3 pr-4">
                {formatPercent(entry.effectiveOccupancyRate)}
              </td>
              <td className="py-3 pr-4">{formatPercent(entry.dataQualityScore)}</td>
              <td className="py-3 pr-4">
                <Badge variant="outline">
                  {entry.deadlineStatus ?? "Pendiente DEMO"}
                </Badge>
              </td>
              <td className="py-3 pr-4">
                <Badge className={statusClass(entry.status)}>{entry.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ManualMonthlyEntryDashboard() {
  const activeBusinessLine = useActiveBusinessLine();
  const activeLine = toImportBusinessLine(activeBusinessLine.line);
  const [context, setContext] = useState<StoredContext | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [localHistory, setLocalHistory] = useState<LocalManualMonthlySubmission[]>(
    [],
  );
  const [todayIsoDate, setTodayIsoDate] = useState("2026-07-29");
  const [notice, setNotice] = useState(
    "El formulario mensual sera la via manual principal mientras no haya conectores.",
  );

  useEffect(() => {
    function refreshContext() {
      setContext(readStoredContext());
    }

    refreshContext();
    window.addEventListener("storage", refreshContext);
    window.addEventListener(contextChangeEvent, refreshContext);

    return () => {
      window.removeEventListener("storage", refreshContext);
      window.removeEventListener(contextChangeEvent, refreshContext);
    };
  }, []);

  useEffect(() => {
    setLocalHistory(readLocalManualHistory());
  }, []);

  useEffect(() => {
    setTodayIsoDate(new Date().toISOString().slice(0, 10));
  }, []);

  const formSteps = useMemo(
    () => getManualMonthlyFormStepsForLine(activeLine),
    [activeLine],
  );
  const branchOptions = useMemo(
    () => getBranchOptionsForLine(activeLine, context),
    [activeLine, context],
  );
  const branchManagerOptions = useMemo(
    () => getBranchManagerOptions(branchOptions),
    [branchOptions],
  );
  const areaManagerOptions = useMemo(
    () => getAreaManagerOptions(branchOptions),
    [branchOptions],
  );
  const selectedBranch = useMemo(
    () => findSelectedBranch(formValues.branch_reported, branchOptions),
    [branchOptions, formValues.branch_reported],
  );
  const selectedBranchManagerName =
    formValues.manager_name || selectedBranch?.branchManagerName;
  const selectedAreaManagerName =
    formValues.area_manager_name || selectedBranch?.areaManagerName;
  const branchGroupCount = useMemo(() => {
    if (!selectedAreaManagerName) {
      return 0;
    }

    return branchOptions.filter(
      (branch) => branch.areaManagerName === selectedAreaManagerName,
    ).length;
  }, [branchOptions, selectedAreaManagerName]);

  useEffect(() => {
    setFormValues(buildInitialFormValues(activeLine, context, branchOptions));
    setActiveStepIndex(0);
  }, [activeLine, branchOptions, context]);

  const allFields = useMemo(
    () => formSteps.flatMap((step) => step.fields),
    [formSteps],
  );
  const requiredMissing = useMemo(
    () =>
      allFields.filter(
        (field) => field.required && !formValues[field.id]?.trim(),
      ),
    [allFields, formValues],
  );
  const completionPercent =
    allFields.length > 0
      ? Math.round(
          ((allFields.length - requiredMissing.length) / allFields.length) *
            100,
        )
      : 0;
  const currentStep = formSteps[activeStepIndex] ?? formSteps[0];
  const canUseManualForm = activeLine !== "Consolidado";
  const historyLine = activeLine === "Consolidado" ? "Todas" : activeLine;
  const demoHistory = useMemo(
    () => getManualMonthlyHistoryForLine(historyLine),
    [historyLine],
  );
  const filteredLocalHistory = useMemo(
    () =>
      localHistory.filter((entry) =>
        historyLine === "Todas" ? true : entry.businessLine === historyLine,
      ),
    [historyLine, localHistory],
  );
  const historyEntries = useMemo(
    () =>
      [...filteredLocalHistory, ...demoHistory].sort(
        (left, right) =>
          right.period.localeCompare(left.period) ||
          right.createdAt.localeCompare(left.createdAt),
      ),
    [demoHistory, filteredLocalHistory],
  );
  const summary = useMemo(
    () => calculateManualMonthlyHistorySummary(historyEntries),
    [historyEntries],
  );
  const tone = businessLineTone[activeLine];
  const deadlineDate =
    formValues.load_deadline_date || getMonthlyLoadDeadline(formValues.period ?? "");
  const currentDeadlineStatus = getDeadlineStatus(
    formValues.period ?? "",
    todayIsoDate,
  );

  function updateField(fieldId: string, value: string) {
    setFormValues((currentValue) => {
      if (fieldId === "branch_reported") {
        return applyBranchMetadata(
          {
            ...currentValue,
            branch_reported: value,
          },
          findSelectedBranch(value, branchOptions),
        );
      }

      if (fieldId === "period") {
        return {
          ...currentValue,
          data_cutoff_date: getMonthEndDate(value),
          load_deadline_date: getMonthlyLoadDeadline(value),
          period: value,
        };
      }

      return {
        ...currentValue,
        [fieldId]: value,
      };
    });
  }

  function persistHistory(entries: LocalManualMonthlySubmission[]) {
    setLocalHistory(entries);
    window.localStorage.setItem(manualHistoryStorageKey, JSON.stringify(entries));
  }

  function buildSubmission(
    status: ManualMonthlySubmissionStatus,
  ): LocalManualMonthlySubmission | null {
    if (!canUseManualForm) {
      return null;
    }

    const period = formValues.period?.trim() || normalizeMonthValue(context);
    const branch =
      resolveBranchName(formValues.branch_reported, branchOptions) ||
      context?.branchName ||
      "Sucursal pendiente";
    const createdAt = todayIsoDate;
    const deadlineStatus = getDeadlineStatus(period, createdAt);
    const qualityScore = clampPercent(
      numberFromValue(formValues.data_quality_score) ||
        (requiredMissing.length > 0 ? 65 : 86),
    );
    const submissionStatus =
      status === "Publicado DEMO" && qualityScore < 70
        ? "Bloqueado por calidad DEMO"
        : status;

    return {
      answers: formValues,
      activityVolume: resolveActivityVolume(activeLine, formValues),
      areaManager: formValues.area_manager_name?.trim() || "Gerente de area pendiente",
      branch,
      branchManager: formValues.manager_name?.trim() || "Gerente pendiente",
      businessLine: activeLine,
      createdAt,
      dataQualityScore: qualityScore,
      deadlineDate: getMonthlyLoadDeadline(period),
      deadlineStatus,
      demoFlag: true,
      effectiveOccupancyRate: clampPercent(
        numberFromValue(formValues.effective_occupancy_rate),
      ),
      grossMarginRate: clampPercent(numberFromValue(formValues.gross_margin_rate)),
      id: `manual-${activeLine.toLowerCase()}-${period}-${Date.now()}`,
      manager: formValues.manager_name?.trim() || "Gerente pendiente",
      netRevenue: numberFromValue(formValues.net_revenue),
      period,
      punctualityScore: getPunctualityScore(deadlineStatus),
      revenueTarget: numberFromValue(formValues.revenue_target),
      sourceTrace: `DEMO formulario mensual ${activeLine} ${period} / ${selectedBranch?.sourceTrace ?? "catalogo demo"}`,
      status: submissionStatus,
    };
  }

  function saveSubmission(status: ManualMonthlySubmissionStatus) {
    if (!canUseManualForm) {
      setNotice("Selecciona una linea de negocio arriba para llenar el cierre mensual.");
      return;
    }

    if (status === "Publicado DEMO" && requiredMissing.length > 0) {
      setNotice(
        `Faltan ${requiredMissing.length} campos obligatorios antes de publicar el cierre.`,
      );
      return;
    }

    const submission = buildSubmission(status);

    if (!submission) {
      return;
    }

    const submissionKey = `${submission.businessLine}|${submission.branch}|${submission.period}`;
    const alreadyPublished = historyEntries.some(
      (entry) =>
        `${entry.businessLine}|${entry.branch}|${entry.period}` ===
          submissionKey && entry.status === "Publicado DEMO",
    );

    if (alreadyPublished && !formValues.edit_authorization_code?.trim()) {
      setNotice(
        "Ese cierre ya fue publicado. Para reemplazarlo necesitas autorizacion del administrador.",
      );
      return;
    }

    const nextHistory = [
      submission,
      ...localHistory.filter(
        (entry) =>
          `${entry.businessLine}|${entry.branch}|${entry.period}` !==
          submissionKey,
      ),
    ];
    persistHistory(nextHistory);
    setNotice(
      `${submission.status} guardado para ${submission.businessLine}, ${submission.branch}, ${submission.period}. Puntualidad: ${submission.deadlineStatus}.`,
    );
  }

  function showPreviousStep() {
    setActiveStepIndex((currentValue) => Math.max(0, currentValue - 1));
  }

  function showNextStep() {
    setActiveStepIndex((currentValue) =>
      Math.min(formSteps.length - 1, currentValue + 1),
    );
  }

  return (
    <section className={cn("grid gap-5 rounded-md border bg-card p-4", tone.border)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
              DEMO
            </Badge>
            <Badge className={tone.badge}>{activeLine}</Badge>
            <Badge variant="outline">Manual sin conectores</Badge>
          </div>
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-md text-white",
                tone.accent,
              )}
            >
              <ClipboardList className="size-5" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold tracking-normal">
                Formulario mensual de cierre
              </h2>
              <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
                Los gerentes llenan un cierre mensual por linea y sucursal. El
                sistema guarda historial, valida completitud y deja trazabilidad
                para que AnaliA actualice Insights.
              </p>
            </div>
          </div>
        </div>

        <aside className={cn("w-full rounded-md border p-3 text-sm xl:w-80", tone.soft)}>
          <div className={cn("mb-2 flex items-center gap-2 font-medium", tone.text)}>
            <DatabaseZap className="size-4" />
            Manual ahora, conector despues
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            Cuando exista API, este mismo mapa de datos servira para conectar
            CRM, agenda, facturacion, inventario o ERP sin cambiar los KPIs.
          </p>
        </aside>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <ManualMetricCard
          icon={ClipboardList}
          label="Campos completos"
          note={`${requiredMissing.length} obligatorios pendientes.`}
          value={`${completionPercent}%`}
        />
        <ManualMetricCard
          icon={History}
          label="Cierres historicos"
          note={`${summary.publishedEntries} publicados DEMO.`}
          value={`${summary.totalEntries}`}
        />
        <ManualMetricCard
          icon={Sparkles}
          label="Ultimo ingreso"
          note={`Ultimo periodo: ${summary.lastPeriod}.`}
          value={formatCurrency(summary.lastNetRevenue)}
        />
        <ManualMetricCard
          icon={ShieldCheck}
          label="Calidad media"
          note={`${summary.qualityWarnings} cierres con alerta.`}
          value={formatPercent(summary.averageDataQualityScore)}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <article className="grid gap-2 rounded-md border bg-background p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <UsersRound className="size-4 text-primary" />
            Jerarquia de gerencia
          </div>
          <div className="grid gap-1 text-xs leading-5 text-muted-foreground">
            <span>
              Sucursal: {selectedBranch?.name ?? "Seleccion pendiente"}
            </span>
            <span>
              Gerente sucursal:{" "}
              {selectedBranchManagerName ?? "Pendiente de asignar"}
            </span>
            <span>
              Gerente de area:{" "}
              {selectedAreaManagerName ?? "Pendiente de asignar"}
            </span>
          </div>
        </article>
        <article className="grid gap-2 rounded-md border bg-background p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarClock className="size-4 text-primary" />
            Fecha limite
          </div>
          <div className="grid gap-1 text-xs leading-5 text-muted-foreground">
            <span>Deadline: {deadlineDate}</span>
            <span>Estado: {currentDeadlineStatus}</span>
            <span>
              Penalizacion demo:{" "}
              {currentDeadlineStatus === "Tarde DEMO"
                ? "impacta score y bono"
                : "sin penalizacion"}
            </span>
          </div>
        </article>
        <article className="grid gap-2 rounded-md border bg-background p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ShieldCheck className="size-4 text-primary" />
            Grupo de area
          </div>
          <div className="grid gap-1 text-xs leading-5 text-muted-foreground">
            <span>{branchGroupCount || 0} sucursales bajo esta gerencia.</span>
            <span>Zona: {selectedBranch?.areaZone ?? "Pendiente"}</span>
            <span>Fuente: {selectedBranch?.sourceTrace ?? "Catalogo DEMO"}</span>
          </div>
        </article>
      </div>

      {!canUseManualForm ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Selecciona una linea de negocio arriba para registrar un cierre
          mensual. La vista consolidada solo muestra historial y no debe mezclar
          datos operativos de negocios distintos.
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[280px_1fr_320px]">
          <nav className="grid content-start gap-2 rounded-md border bg-muted/30 p-3">
            {formSteps.map((step, index) => (
              <button
                className={cn(
                  "grid gap-1 rounded-md border bg-background p-3 text-left text-sm transition-colors hover:border-primary/50",
                  activeStepIndex === index && "border-primary bg-primary/5",
                )}
                key={step.id}
                onClick={() => setActiveStepIndex(index)}
                type="button"
              >
                <span className="font-medium">
                  {index + 1}. {step.title}
                </span>
                <span className="text-xs leading-5 text-muted-foreground">
                  {step.fields.length} campos
                </span>
              </button>
            ))}
          </nav>

          <article className="grid gap-4 rounded-md border bg-muted/20 p-4">
            <div className="grid gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-xl font-semibold tracking-normal">
                  {currentStep?.title}
                </h3>
                <Badge variant="outline">
                  Paso {activeStepIndex + 1} de {formSteps.length}
                </Badge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {currentStep?.description}
              </p>
              <p className="rounded-md border bg-background px-3 py-2 text-xs leading-5 text-muted-foreground">
                {currentStep?.ownerNote}
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              {currentStep?.fields.map((field) => (
                <ManualField
                  areaManagerOptions={areaManagerOptions}
                  branchManagerOptions={branchManagerOptions}
                  branchOptions={branchOptions}
                  field={field}
                  key={field.id}
                  onChange={(value) => updateField(field.id, value)}
                  readOnly={
                    ["area_zone", "load_deadline_date"].includes(field.id)
                  }
                  value={formValues[field.id] ?? ""}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background p-3">
              <div className="grid gap-1 text-xs text-muted-foreground">
                <span>{notice}</span>
                <span>
                  Pais: {context?.countryName ?? "El Salvador"} · Sucursal:{" "}
                  {selectedBranch?.name ?? "pendiente"} · Area:{" "}
                  {selectedBranch?.areaManagerName ?? "pendiente"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={activeStepIndex === 0}
                  onClick={showPreviousStep}
                  type="button"
                  variant="outline"
                >
                  <ArrowLeft className="size-4" />
                  Anterior
                </Button>
                <Button
                  disabled={activeStepIndex >= formSteps.length - 1}
                  onClick={showNextStep}
                  type="button"
                  variant="outline"
                >
                  Siguiente
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  onClick={() => saveSubmission("Borrador DEMO")}
                  type="button"
                  variant="secondary"
                >
                  <Save className="size-4" />
                  Guardar avance DEMO
                </Button>
                <Button
                  onClick={() => saveSubmission("Publicado DEMO")}
                  type="button"
                >
                  <CheckCircle2 className="size-4" />
                  Publicar cierre DEMO
                </Button>
              </div>
            </div>
          </article>

          <aside className="grid content-start gap-3">
            <div className="rounded-md border bg-card p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <LockKeyhole className="size-4 text-primary" />
                Reglas de cierre
              </div>
              <div className="grid gap-2 text-xs leading-5 text-muted-foreground">
                <span>Datos personales no entran a dashboards.</span>
                <span>Un cierre publicado conserva fuente, periodo y usuario.</span>
                <span>La carga despues del dia 5 reduce puntualidad y bono.</span>
                <span>Editar un cierre publicado requiere autorizacion.</span>
                <span>AnaliA marca alerta si calidad baja de 70%.</span>
                <span>La evaluacion 360 es anonima y se usa para coaching.</span>
              </div>
            </div>

            <div className="rounded-md border bg-card p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="size-4 text-primary" />
                Datos que alimenta
              </div>
              <div className="grid gap-2 text-xs leading-5 text-muted-foreground">
                <span>Resumen ejecutivo y salud financiera.</span>
                <span>Operacion, citas, capacidad y ocupacion.</span>
                <span>Sucursales, profesionales, servicios y bonos.</span>
                <span>Insights, alertas tempranas y metas sugeridas.</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      <section className="grid gap-3 rounded-md border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold tracking-normal">
              Historico mensual guardado
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Cada mes queda separado por linea, sucursal, periodo y fuente DEMO.
            </p>
          </div>
          <Badge className={tone.badge}>{historyLine}</Badge>
        </div>
        <HistoryTable entries={historyEntries} />
      </section>
    </section>
  );
}

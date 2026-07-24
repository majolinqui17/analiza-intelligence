"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  CheckCircle2,
  ChevronDown,
  Eye,
  LineChart,
  MessageSquareText,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createAnaliaScreenChatResponse,
  getDashboardAuditForPath,
  getDashboardValidationSummary,
  type AnaliaScreenChatResponse,
  type DashboardValidationAudit,
} from "@/lib/analytics/dashboard-validation-agent";
import { useActiveBusinessLine } from "@/hooks/use-active-business-line";
import { cn } from "@/lib/utils";

const openStorageKey = "analiza:analia-screen-chat-open";

type AnaliaScreenChatMessage = {
  id: string;
  question: string;
  response: AnaliaScreenChatResponse;
  createdAt: string;
};

const quickQuestions = [
  "Resumeme los insights mas importantes",
  "Hay algo critico?",
  "Lee esta pantalla",
  "Que hago primero?",
];

function getDensityTone(audit: DashboardValidationAudit) {
  if (audit.densityStatus === "Muy cargada") {
    return "border-orange-200 bg-orange-50 text-orange-950";
  }

  if (audit.densityStatus === "Cargada") {
    return "border-amber-200 bg-amber-50 text-amber-950";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-950";
}

function MiniBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="truncate text-muted-foreground">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary"
          style={{ width: `${Math.max(6, Math.min(value, 100))}%` }}
        />
      </div>
    </div>
  );
}

function getReadableScreenText() {
  const root = document.querySelector("main") ?? document.body;
  const clonedNode = root.cloneNode(true);

  if (!(clonedNode instanceof HTMLElement)) {
    return document.body.innerText.slice(0, 6000);
  }

  clonedNode
    .querySelectorAll("[data-analia-agent], script, style")
    .forEach((node) => node.remove());

  return clonedNode.innerText
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 6000);
}

function formatChatTime() {
  return new Date().toLocaleTimeString("es-SV", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardValidationAgent() {
  const pathname = usePathname();
  const activeBusinessLine = useActiveBusinessLine();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<AnaliaScreenChatMessage[]>([]);
  const audit = useMemo(
    () => getDashboardAuditForPath(pathname),
    [pathname],
  );
  const summary = useMemo(() => getDashboardValidationSummary(), []);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(openStorageKey);
    setIsOpen(storedValue === "true");
  }, []);

  useEffect(() => {
    if (!audit) {
      document.documentElement.removeAttribute("data-analia-dashboard-mode");
      document.documentElement.removeAttribute("data-analia-dashboard-density");
      return;
    }

    document.documentElement.setAttribute(
      "data-analia-dashboard-mode",
      audit.readingMode,
    );
    document.documentElement.setAttribute(
      "data-analia-dashboard-density",
      audit.densityStatus,
    );

    return () => {
      document.documentElement.removeAttribute("data-analia-dashboard-mode");
      document.documentElement.removeAttribute("data-analia-dashboard-density");
    };
  }, [audit]);

  if (!audit || isHidden || !pathname.startsWith("/protected")) {
    return null;
  }

  const currentAudit = audit;

  function toggleOpen() {
    setIsOpen((current) => {
      const nextValue = !current;
      window.localStorage.setItem(openStorageKey, String(nextValue));
      return nextValue;
    });
  }

  function askAnalia(questionText: string) {
    const trimmedQuestion = questionText.trim();

    if (!trimmedQuestion) {
      return;
    }

    const response = createAnaliaScreenChatResponse({
      audit: currentAudit,
      businessLine: activeBusinessLine.line,
      question: trimmedQuestion,
      screenText: getReadableScreenText(),
    });

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        createdAt: formatChatTime(),
        id: `analia-screen-chat-${Date.now()}`,
        question: trimmedQuestion,
        response,
      },
    ]);
    setQuestion("");
  }

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    askAnalia(question);
  }

  if (!isOpen) {
    return (
      <aside
        className="fixed bottom-4 right-4 z-50 print:hidden"
        data-analia-agent
      >
        <button
          className={cn(
            "flex items-center gap-2 rounded-full border bg-card px-4 py-3 text-left shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl",
            getDensityTone(audit),
          )}
          onClick={toggleOpen}
          type="button"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background/90">
            <Bot className="size-5 text-primary" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block text-sm font-semibold">Hablar con AnaliA</span>
            <span className="block text-xs opacity-80">
              {audit.module} - {audit.densityScore}/100
            </span>
          </span>
          <Badge className="bg-background/80 text-foreground hover:bg-background/80">
            DEMO
          </Badge>
        </button>
      </aside>
    );
  }

  return (
    <aside
      className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-2xl print:hidden lg:left-auto lg:right-4"
      data-analia-agent
    >
      <div className={cn("rounded-md border bg-card shadow-lg", getDensityTone(audit))}>
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
          <button
            className="flex min-w-0 flex-1 items-center gap-2 text-left"
            onClick={() => setIsAuditOpen((current) => !current)}
            type="button"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-background/80">
              <Bot className="size-4 text-primary" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">
                Chat con AnaliA
              </span>
              <span className="block truncate text-xs opacity-80">
                {audit.module} - {activeBusinessLine.line} - DEMO
              </span>
            </span>
          </button>
          <div className="flex items-center gap-2">
            <Badge className="bg-background/80 text-foreground hover:bg-background/80">
              {audit.densityScore}/100
            </Badge>
            <Button
              aria-label={isAuditOpen ? "Ocultar auditoria" : "Ver auditoria"}
              onClick={() => setIsAuditOpen((current) => !current)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  isAuditOpen && "rotate-180",
                )}
              />
            </Button>
            <Button
              aria-label="Cerrar chat"
              onClick={toggleOpen}
              size="icon"
              type="button"
              variant="ghost"
            >
              <MessageSquareText className="size-4" />
            </Button>
            <Button
              aria-label="Ocultar AnaliA"
              onClick={() => setIsHidden(true)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-3 border-t border-current/10 bg-card/95 p-3 text-foreground">
          <div className="rounded-md border bg-background p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-primary" />
              Preguntar a AnaliA sobre esta pantalla
            </div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((item) => (
                <Button
                  key={item}
                  onClick={() => askAnalia(item)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid max-h-[44vh] gap-3 overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <div className="rounded-md border bg-background p-3 text-sm leading-6 text-muted-foreground">
                Puedes pedirme un resumen, una lectura completa de la pantalla
                visible o una alerta critica. Uso el filtro activo, la auditoria
                visual y el texto visible; todo queda marcado como DEMO.
              </div>
            ) : (
              messages.map((message) => (
                <article className="grid gap-2" key={message.id}>
                  <div className="rounded-md border bg-muted/60 p-3 text-sm">
                    <span className="font-medium">Tu pregunta: </span>
                    {message.question}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {message.createdAt}
                    </span>
                  </div>
                  <div className="rounded-md border bg-background p-3 text-sm">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{message.response.intent}</Badge>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                        Confianza {message.response.confidence}%
                      </Badge>
                    </div>
                    <h2 className="font-semibold">{message.response.title}</h2>
                    <p className="mt-2 leading-6 text-muted-foreground">
                      {message.response.directAnswer}
                    </p>
                    <div className="mt-3 grid gap-2">
                      {message.response.bullets.map((bullet) => (
                        <span className="flex gap-2" key={bullet}>
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          {bullet}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs leading-5 text-amber-900">
                      <div className="mb-1 flex items-center gap-1 font-medium">
                        <AlertTriangle className="size-3.5" />
                        Siguiente paso
                      </div>
                      {message.response.suggestedNextStep}
                    </div>
                    <div className="mt-2 text-xs leading-5 text-muted-foreground">
                      {message.response.caveat}
                    </div>
                    <div className="mt-2 text-xs leading-5 text-muted-foreground">
                      Fuentes: {message.response.sources.join(" / ")}
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <form className="flex flex-col gap-2 sm:flex-row" onSubmit={submitQuestion}>
            <Input
              aria-label="Pregunta para AnaliA"
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Pregunta: resumen, critico, leer pantalla..."
              value={question}
            />
            <Button type="submit">
              <Send className="size-4" />
              Preguntar
            </Button>
          </form>

          {isAuditOpen ? (
            <div className="grid gap-3 border-t border-current/10 pt-3 text-xs">
              <div className="grid gap-3 sm:grid-cols-3">
                <MiniBar label="Carga visual" value={audit.densityScore} />
                <MiniBar
                  label="Cobertura auditada"
                  value={Math.round((summary.reviewedCount / 21) * 100)}
                />
                <MiniBar
                  label="Modo visual"
                  value={Math.round((summary.visualModeCount / summary.reviewedCount) * 100)}
                />
              </div>

              <div className="grid gap-2 text-xs sm:grid-cols-3">
                <div className="rounded-md border bg-background p-2">
                  <div className="mb-1 flex items-center gap-1 font-medium">
                    <Eye className="size-3.5 text-primary" />
                    Lectura
                  </div>
                  {audit.decisionPrompt}
                </div>
                <div className="rounded-md border bg-background p-2">
                  <div className="mb-1 flex items-center gap-1 font-medium">
                    <BarChart3 className="size-3.5 text-primary" />
                    Graficas
                  </div>
                  {audit.chartPriority.slice(0, 2).join(" / ")}
                </div>
                <div className="rounded-md border bg-background p-2">
                  <div className="mb-1 flex items-center gap-1 font-medium">
                    <LineChart className="size-3.5 text-primary" />
                    Modelos
                  </div>
                  {audit.models.join(" + ")}
                </div>
              </div>

              <div className="grid gap-2 text-xs sm:grid-cols-2">
                <div className="rounded-md border bg-background p-2">
                  <div className="mb-2 flex items-center gap-1 font-medium">
                    <Sparkles className="size-3.5 text-primary" />
                    Ajustes aplicados
                  </div>
                  <div className="grid gap-1">
                    {audit.editsApplied.map((edit) => (
                      <span className="flex gap-1" key={edit}>
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        {edit}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-md border bg-background p-2">
                  <div className="mb-2 flex items-center gap-1 font-medium">
                    <ShieldCheck className="size-3.5 text-primary" />
                    Validacion
                  </div>
                  <div className="grid gap-1">
                    {audit.validationChecks.slice(0, 3).map((check) => (
                      <span className="flex gap-1" key={check}>
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        {check}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

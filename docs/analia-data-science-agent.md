# AnaliA: agente de ciencia de datos para Insights

## Objetivo

AnaliA es la capa de ciencia de datos de la pestaña Insights. Su responsabilidad es monitorear indicadores por linea de negocio, detectar alertas tempranas, priorizar hallazgos y preparar acciones trazables para revision humana.

En el entorno actual funciona como `DEMO`. No mezcla datos demo con datos reales y no presenta predicciones como concluyentes cuando la calidad de datos es insuficiente.

## Tipos de modelos

- Exploratorio: identifica patrones, dispersiones, anomalias y fuentes faltantes.
- Descriptivo: explica variaciones con puentes de volumen, ticket, canal, margen, capacidad o mezcla.
- Predictivo: anticipa riesgo, brecha o tendencia usando historicos validados y umbrales del registro de KPIs.

## Alertas tempranas

Cada alerta conserva:

- Linea de negocio.
- Indicador.
- Resultado actual.
- Meta.
- Comparativo.
- Horizonte.
- Score de riesgo.
- Confianza.
- Calidad de datos.
- Modelos usados.
- Insight relacionado.
- Responsable sugerido.
- Ruta al modulo de detalle.

Si falta una fuente esencial, la alerta queda como `Pendiente de conexion de datos` y no inventa resultado operativo, financiero ni clinico.

## Monitoreo

La interfaz muestra un ciclo de monitoreo visible. En produccion, el ciclo debe moverse a backend o job programado:

- Revisar KPIs y plantillas nuevas.
- Ejecutar reglas y modelos.
- Actualizar hallazgos en Insights.
- Crear alertas tempranas.
- Registrar auditoria de fuentes, formulas, filtros y version de modelo.

## Auditoria visual de dashboards

AnaliA tambien revisa cada pestana del BI como una superficie de decision. La auditoria clasifica cada pantalla como `Lectura visual correcta`, `Cargada` o `Muy cargada`, y activa una vista visual cuando la densidad de contenido puede dificultar la lectura ejecutiva.

La validacion por pestana revisa:

- KPI principal visible antes del detalle.
- Comparacion contra meta, periodo anterior o ano anterior.
- Grafica prioritaria para leer la decision sin depender de texto largo.
- Insight accionable con responsable sugerido.
- Estado DEMO, pendiente o dato real claramente marcado.

Cuando una pantalla queda `Cargada` o `Muy cargada`, AnaliA no inventa informacion: reordena la lectura, resalta graficas, reduce friccion visual y deja visible que la vista esta en modo DEMO.

## Burbuja de chat global

AnaliA esta disponible como burbuja flotante en las pantallas protegidas. El usuario puede pedir:

- resumen de los insights mas importantes de la pantalla;
- revision de elementos criticos;
- lectura de la pantalla visible;
- siguiente accion sugerida.
- comparacion contra ano anterior, periodo comparable o 2025.
- estado del propio agente cuando no entiende, contesta otra cosa o esta en modo DEMO.

El chat usa la linea de negocio activa, el modulo actual, la auditoria visual y el texto visible de la pantalla. Cuando `OPENAI_API_KEY` esta configurada en servidor, la burbuja llama a `/api/analia-chat` para que AnaliA responda como agente conversacional de IA usando la pantalla visible y el historial reciente. Si falta la llave o el modelo no responde, vuelve al motor `DEMO` deterministico; no consulta datos privados, no ejecuta acciones y no presenta resultados como reales.

Cada respuesta se presenta en burbujas breves de conversacion: la pregunta del usuario queda separada de la respuesta de AnaliA, con bullets cortos, siguiente paso, fuentes usadas, confianza y una cautela. Antes de responder, el chat filtra navegacion, filtros, botones y textos demasiado largos para evitar que el menu completo se mezcle con los insights. Si el usuario pide algo critico, AnaliA prioriza senales como riesgo, pendiente, alerta, densidad visual o falta de trazabilidad. Si pregunta por mejora contra el ano pasado, AnaliA responde directamente si la mejora es sana, parcial o insuficiente segun crecimiento, margen, meta, ocupacion y estado de la linea activa. Si pregunta por que el chat no contesta bien, AnaliA debe responder sobre su propio estado en vez de generar un resumen del dashboard.

## Seguridad y permisos

AnaliA solo prepara interpretaciones y borradores de accion. No ejecuta acciones sensibles sin confirmacion humana. Credenciales de conectores, llaves privilegiadas, `OPENAI_API_KEY` y validaciones de archivos deben permanecer en servidor. El navegador nunca recibe la llave; solo envia pregunta, modulo, linea activa e informacion visible filtrada.

## Conexion a datos reales

Para reemplazar DEMO:

1. Conectar plantillas validadas, facturacion, agenda, CRM e inventario.
2. Anonimizar identificadores de pacientes antes de analitica.
3. Guardar trazabilidad por archivo, conector, importacion y transformacion.
4. Bloquear insights concluyentes cuando el score de calidad sea insuficiente.
5. Versionar cada modelo y registrar su ultima ejecucion.

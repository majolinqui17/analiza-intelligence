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

## Seguridad y permisos

AnaliA solo prepara interpretaciones y borradores de accion. No ejecuta acciones sensibles sin confirmacion humana. Credenciales de conectores, llaves privilegiadas y validaciones de archivos deben permanecer en servidor.

## Conexion a datos reales

Para reemplazar DEMO:

1. Conectar plantillas validadas, facturacion, agenda, CRM e inventario.
2. Anonimizar identificadores de pacientes antes de analitica.
3. Guardar trazabilidad por archivo, conector, importacion y transformacion.
4. Bloquear insights concluyentes cuando el score de calidad sea insuficiente.
5. Versionar cada modelo y registrar su ultima ejecucion.

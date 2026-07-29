# Formulario mensual manual

## Decision

La via manual principal para actualizar Analiza Intelligence sera un formulario mensual por linea de negocio, sucursal y periodo. Este formulario vive en `/protected/plantillas`, con etiqueta de menu `Formulario mensual`, reemplazando la antigua biblioteca de descargas Excel. El flujo de Excel queda como respaldo para migraciones, reemplazos especiales o fuentes que todavia no esten cubiertas por el formulario.

## Alcance

- Cada gerente registra un cierre mensual por linea de negocio.
- El cierre captura contexto, resultados comerciales, operacion, citas, capacidad, costos, margen y calidad.
- Cada registro conserva historial por linea, sucursal, periodo, fuente, estado y marca `DEMO`.
- La vista consolidada solo muestra historial; no permite publicar cierres porque no se deben mezclar negocios distintos.
- AnaliA puede usar estos cierres para Insights, alertas tempranas, metas sugeridas y lectura de salud financiera.

## Historial

En el prototipo, los cierres guardados por el formulario viven en `localStorage` bajo `analiza:manual-monthly-history` para demostrar la experiencia de uso. En produccion, este historial debe persistir en base de datos con:

- Organizacion, pais, empresa, linea de negocio, sucursal y periodo.
- Usuario responsable, rol, fecha de captura, fecha de publicacion y estado.
- Version activa, version anterior, motivo de reemplazo y auditoria.
- Fuente de datos: formulario, conector, carga Excel o correccion aprobada.
- Score de calidad y lista de reglas bloqueantes o advertencias.

## Calidad y privacidad

- No se deben capturar nombres, telefonos, documentos ni datos clinicos identificables de pacientes.
- No se publica un cierre si faltan campos obligatorios.
- Si el score de calidad baja de 70%, el cierre debe quedar bloqueado o marcado con advertencia.
- Los dashboards ejecutivos no deben presentar conclusiones fuertes cuando la calidad sea insuficiente.

## Conectores

Cuando existan APIs oficiales, el conector debe alimentar los mismos campos del formulario. Si el conector no cumple reglas de calidad, se mantiene el formulario como fallback hasta corregir la integracion.

insert into public.organizations (id, name, slug, is_demo)
values ('10000000-0000-4000-8000-000000000001', 'Grupo Analiza DEMO', 'grupo-analiza-demo', true)
on conflict (slug) do update set
  name = excluded.name,
  is_demo = excluded.is_demo;

insert into public.currencies (id, code, name, symbol)
values
  ('20000000-0000-4000-8000-000000000001', 'GTQ', 'Quetzal guatemalteco', 'Q'),
  ('20000000-0000-4000-8000-000000000002', 'BZD', 'Dolar beliceno', 'BZ$'),
  ('20000000-0000-4000-8000-000000000003', 'USD', 'Dolar estadounidense', '$'),
  ('20000000-0000-4000-8000-000000000004', 'HNL', 'Lempira hondureno', 'L'),
  ('20000000-0000-4000-8000-000000000005', 'NIO', 'Cordoba nicaraguense', 'C$'),
  ('20000000-0000-4000-8000-000000000006', 'CRC', 'Colon costarricense', 'CRC'),
  ('20000000-0000-4000-8000-000000000007', 'PAB', 'Balboa panameno', 'B/.')
on conflict (code) do update set
  name = excluded.name,
  symbol = excluded.symbol;

insert into public.countries (
  id,
  organization_id,
  currency_id,
  iso2,
  name,
  time_zone,
  date_format,
  tax_config,
  is_demo
)
values
  ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'GT', 'Guatemala', 'America/Guatemala', 'dd/MM/yyyy', '{"future": true}', true),
  ('30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', 'BZ', 'Belice', 'America/Belize', 'dd/MM/yyyy', '{"future": true}', true),
  ('30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000003', 'SV', 'El Salvador', 'America/El_Salvador', 'dd/MM/yyyy', '{"future": true}', true),
  ('30000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000004', 'HN', 'Honduras', 'America/Tegucigalpa', 'dd/MM/yyyy', '{"future": true}', true),
  ('30000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000005', 'NI', 'Nicaragua', 'America/Managua', 'dd/MM/yyyy', '{"future": true}', true),
  ('30000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000006', 'CR', 'Costa Rica', 'America/Costa_Rica', 'dd/MM/yyyy', '{"future": true}', true),
  ('30000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000007', 'PA', 'Panama', 'America/Panama', 'dd/MM/yyyy', '{"future": true}', true)
on conflict (organization_id, iso2) do update set
  currency_id = excluded.currency_id,
  name = excluded.name,
  time_zone = excluded.time_zone,
  date_format = excluded.date_format,
  tax_config = excluded.tax_config,
  is_demo = excluded.is_demo;

insert into public.companies (id, organization_id, key, name, unit_type, is_demo)
values
  ('40000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'analiza-fisioterapia', 'Analiza Fisioterapia', 'fisioterapia', true),
  ('40000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'analiza-laboratorio', 'Analiza Laboratorio', 'laboratorio', true),
  ('40000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'analiza-imagenes', 'Analiza Imagenes', 'imagenes', true)
on conflict (organization_id, key) do update set
  name = excluded.name,
  unit_type = excluded.unit_type,
  is_demo = excluded.is_demo;

insert into public.branches (id, organization_id, country_id, company_id, code, name, city, time_zone, is_demo)
values
  ('50000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000001', 'HN-FIS-001', 'Sucursal DEMO Fisioterapia Norte', 'San Pedro Sula', 'America/Tegucigalpa', true),
  ('50000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000002', 'HN-LAB-001', 'Sucursal DEMO Laboratorio Central', 'Tegucigalpa', 'America/Tegucigalpa', true),
  ('50000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000003', 'HN-IMG-001', 'Sucursal DEMO Imagenes Este', 'Tegucigalpa', 'America/Tegucigalpa', true),
  ('50000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000001', 'SV-FIS-001', 'Sucursal DEMO Fisioterapia Centro', 'San Salvador', 'America/El_Salvador', true),
  ('50000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000006', '40000000-0000-4000-8000-000000000002', 'CR-LAB-001', 'Sucursal DEMO Laboratorio Oeste', 'San Jose', 'America/Costa_Rica', true),
  ('50000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000007', '40000000-0000-4000-8000-000000000003', 'PA-IMG-001', 'Sucursal DEMO Imagenes Pacifico', 'Panama', 'America/Panama', true)
on conflict (organization_id, country_id, company_id, code) do update set
  name = excluded.name,
  city = excluded.city,
  time_zone = excluded.time_zone,
  is_demo = excluded.is_demo;

insert into public.roles (id, key, name, description)
values
  ('60000000-0000-4000-8000-000000000001', 'super_admin', 'Super Admin', 'Acceso completo a configuracion y datos autorizados.'),
  ('60000000-0000-4000-8000-000000000002', 'director_ejecutivo_grupo', 'Director ejecutivo del grupo', 'Vista consolidada regional.'),
  ('60000000-0000-4000-8000-000000000003', 'director_pais', 'Director pais', 'Acceso a empresas y sucursales asignadas en un pais.'),
  ('60000000-0000-4000-8000-000000000004', 'director_empresa', 'Director empresa', 'Acceso a una empresa en paises asignados.'),
  ('60000000-0000-4000-8000-000000000005', 'director_financiero', 'Director financiero', 'Acceso financiero segun asignaciones.'),
  ('60000000-0000-4000-8000-000000000006', 'director_operaciones', 'Director operaciones', 'Acceso operativo segun asignaciones.'),
  ('60000000-0000-4000-8000-000000000007', 'gerente_sucursal', 'Gerente sucursal', 'Acceso a su sucursal asignada.'),
  ('60000000-0000-4000-8000-000000000008', 'analista_bi', 'Analista BI', 'Acceso analitico e importaciones segun asignaciones.'),
  ('60000000-0000-4000-8000-000000000009', 'cargador_datos', 'Cargador de datos', 'Carga y correccion de archivos.'),
  ('60000000-0000-4000-8000-000000000010', 'auditor', 'Auditor', 'Lectura, trazabilidad y auditoria.'),
  ('60000000-0000-4000-8000-000000000011', 'viewer', 'Viewer', 'Lectura limitada segun asignaciones.')
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description;

insert into public.permissions (id, key, name, description)
values
  ('70000000-0000-4000-8000-000000000001', 'context.read', 'Leer contexto', 'Ver paises, empresas y sucursales asignadas.'),
  ('70000000-0000-4000-8000-000000000002', 'config.manage', 'Gestionar configuracion', 'Administrar paises, empresas, sucursales y roles.'),
  ('70000000-0000-4000-8000-000000000003', 'imports.manage', 'Gestionar importaciones', 'Cargar, validar y corregir archivos.'),
  ('70000000-0000-4000-8000-000000000004', 'audit.read', 'Leer auditoria', 'Consultar trazabilidad e historial.'),
  ('70000000-0000-4000-8000-000000000005', 'dashboards.read', 'Leer dashboards', 'Consultar indicadores autorizados.')
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.key = 'super_admin'
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.key in ('context.read', 'dashboards.read', 'audit.read')
where r.key in ('director_ejecutivo_grupo', 'director_pais', 'director_empresa', 'director_financiero', 'director_operaciones', 'analista_bi', 'auditor', 'viewer')
on conflict do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on p.key in ('context.read', 'imports.manage')
where r.key = 'cargador_datos'
on conflict do nothing;

insert into public.branch_managers (id, organization_id, branch_id, display_name, email, is_demo, starts_on)
values
  ('80000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', 'Gerente DEMO Norte', 'gerente.norte.demo@example.com', true, '2026-01-01'),
  ('80000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000002', 'Gerente DEMO Central', 'gerente.central.demo@example.com', true, '2026-01-01'),
  ('80000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000003', 'Gerente DEMO Este', 'gerente.este.demo@example.com', true, '2026-01-01')
on conflict (id) do update set
  display_name = excluded.display_name,
  email = excluded.email,
  is_demo = excluded.is_demo,
  starts_on = excluded.starts_on;

insert into public.service_categories (id, organization_id, company_id, name, is_demo)
values
  ('81000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', 'Terapia DEMO', true),
  ('81000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000002', 'Pruebas DEMO', true),
  ('81000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000003', 'Estudios DEMO', true)
on conflict (organization_id, company_id, name) do update set
  is_demo = excluded.is_demo;

insert into public.services (id, organization_id, company_id, category_id, code, name, is_demo)
values
  ('82000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001', '81000000-0000-4000-8000-000000000001', 'FIS-DEMO-01', 'Sesion fisioterapia DEMO', true),
  ('82000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000002', '81000000-0000-4000-8000-000000000002', 'LAB-DEMO-01', 'Prueba laboratorio DEMO', true),
  ('82000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000003', '81000000-0000-4000-8000-000000000003', 'IMG-DEMO-01', 'Estudio imagenes DEMO', true)
on conflict (organization_id, company_id, code) do update set
  name = excluded.name,
  is_demo = excluded.is_demo;

insert into public.professionals (id, organization_id, country_id, company_id, branch_id, code, display_name, professional_type, is_demo)
values
  ('83000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', 'PRO-FIS-01', 'Profesional DEMO Fisio A', 'fisioterapeuta', true),
  ('83000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000002', 'PRO-LAB-01', 'Profesional DEMO Lab A', 'tecnico_laboratorio', true),
  ('83000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000003', '50000000-0000-4000-8000-000000000003', 'PRO-IMG-01', 'Profesional DEMO Imagen A', 'tecnico_imagenes', true)
on conflict (organization_id, branch_id, code) do update set
  display_name = excluded.display_name,
  professional_type = excluded.professional_type,
  is_demo = excluded.is_demo;

insert into public.anonymous_patients (id, organization_id, anonymous_key, is_demo)
values
  ('84000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'DEMO-PATIENT-001', true),
  ('84000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'DEMO-PATIENT-002', true),
  ('84000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', 'DEMO-PATIENT-003', true)
on conflict (organization_id, anonymous_key) do update set
  is_demo = excluded.is_demo;

insert into public.capacity_records (
  id,
  organization_id,
  country_id,
  company_id,
  branch_id,
  professional_id,
  service_id,
  period_start,
  period_end,
  available_minutes,
  scheduled_minutes,
  attended_minutes,
  is_demo
)
values
  ('85000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', '83000000-0000-4000-8000-000000000001', '82000000-0000-4000-8000-000000000001', '2026-07-01', '2026-07-31', 9600, 7680, 6720, true),
  ('85000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000002', '83000000-0000-4000-8000-000000000002', '82000000-0000-4000-8000-000000000002', '2026-07-01', '2026-07-31', 8400, 6300, 5880, true),
  ('85000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000003', '50000000-0000-4000-8000-000000000003', '83000000-0000-4000-8000-000000000003', '82000000-0000-4000-8000-000000000003', '2026-07-01', '2026-07-31', 7200, 5040, 4380, true)
on conflict (id) do update set
  available_minutes = excluded.available_minutes,
  scheduled_minutes = excluded.scheduled_minutes,
  attended_minutes = excluded.attended_minutes,
  is_demo = excluded.is_demo;

insert into public.appointments (
  id,
  organization_id,
  country_id,
  company_id,
  branch_id,
  professional_id,
  service_id,
  anonymous_patient_id,
  external_reference,
  scheduled_start_at,
  scheduled_end_at,
  scheduled_minutes,
  attended_minutes,
  normalized_status,
  original_status,
  is_demo
)
values
  ('86000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', '83000000-0000-4000-8000-000000000001', '82000000-0000-4000-8000-000000000001', '84000000-0000-4000-8000-000000000001', 'DEMO-APT-001', '2026-07-06 09:00:00-06', '2026-07-06 10:00:00-06', 60, 60, 'completed', 'Completada DEMO', true),
  ('86000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', '83000000-0000-4000-8000-000000000001', '82000000-0000-4000-8000-000000000001', '84000000-0000-4000-8000-000000000002', 'DEMO-APT-002', '2026-07-06 10:00:00-06', '2026-07-06 11:00:00-06', 60, 0, 'no_show', 'No asistio DEMO', true),
  ('86000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000002', '83000000-0000-4000-8000-000000000002', '82000000-0000-4000-8000-000000000002', '84000000-0000-4000-8000-000000000003', 'DEMO-APT-003', '2026-07-07 08:00:00-06', '2026-07-07 08:30:00-06', 30, 30, 'completed', 'Entregada DEMO', true)
on conflict (id) do update set
  normalized_status = excluded.normalized_status,
  original_status = excluded.original_status,
  attended_minutes = excluded.attended_minutes,
  is_demo = excluded.is_demo;

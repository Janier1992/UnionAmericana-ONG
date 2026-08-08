-- ==============================================================================
-- MIGRACIÓN: HOJA DE VIDA EN VOLUNTARIOS - LA UNIÓN AMERICANA
-- Ya fue ejecutada en producción (2026-07-26). Este archivo queda como
-- referencia/documentación del cambio, y por si necesitas re-aplicarlo
-- en otro entorno (ej. una copia de desarrollo de la base de datos).
-- ==============================================================================

ALTER TABLE public.voluntarios
  ADD COLUMN IF NOT EXISTS hoja_vida_key VARCHAR(500);

ALTER TABLE public.voluntarios
  ADD COLUMN IF NOT EXISTS hoja_vida_nombre VARCHAR(255);

-- No se requieren cambios de RLS: las políticas existentes de INSERT
-- (público) y SELECT/UPDATE/DELETE (solo authenticated) de la tabla
-- voluntarios ya cubren estas dos columnas nuevas automáticamente.

-- El archivo físico se guarda en un bucket privado de Storage llamado
-- "hojas-de-vida" (ya creado). hoja_vida_key guarda la clave del objeto
-- dentro de ese bucket; hoja_vida_nombre guarda el nombre original del
-- archivo que subió el voluntario, para mostrarlo en el panel admin.

-- ==============================================================================
-- FIN DEL SCRIPT.
-- ==============================================================================

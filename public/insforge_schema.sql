-- ==============================================================================
-- SCRIPT DE BASE DE DATOS INSFORGE (POSTGRESQL) - LA UNIÓN AMERICANA
-- Implementación Completa para 3 Módulos Diferenciados
-- Tablas: contactos, voluntarios, donaciones
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- TABLA 1: CONTACTOS (Consultas generales e información)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contactos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    pais VARCHAR(150),
    mensaje TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.contactos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on contactos" ON public.contactos;
CREATE POLICY "Allow public insert on contactos" ON public.contactos FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read on contactos" ON public.contactos;
CREATE POLICY "Allow authenticated read on contactos" ON public.contactos FOR SELECT TO authenticated USING (true);


-- ------------------------------------------------------------------------------
-- TABLA 2: VOLUNTARIOS (Página Únete)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.voluntarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL, -- Ej: 'Como Voluntario Digital', 'Organización Aliada'
    pais VARCHAR(150),
    mensaje TEXT, -- Habilidades e intereses
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.voluntarios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on voluntarios" ON public.voluntarios;
CREATE POLICY "Allow public insert on voluntarios" ON public.voluntarios FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read on voluntarios" ON public.voluntarios;
CREATE POLICY "Allow authenticated read on voluntarios" ON public.voluntarios FOR SELECT TO authenticated USING (true);


-- ------------------------------------------------------------------------------
-- TABLA 3: DONACIONES (Página Donaciones y Contribuciones)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.donaciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL, -- Ej: 'Insumos Médicos', 'Patrocinio'
    pais VARCHAR(150),
    mensaje TEXT, -- Detalles del aporte
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.donaciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on donaciones" ON public.donaciones;
CREATE POLICY "Allow public insert on donaciones" ON public.donaciones FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read on donaciones" ON public.donaciones;
CREATE POLICY "Allow authenticated read on donaciones" ON public.donaciones FOR SELECT TO authenticated USING (true);


-- ------------------------------------------------------------------------------
-- ÍNDICES DE VELOCIDAD
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_contactos_email ON public.contactos(email);
CREATE INDEX IF NOT EXISTS idx_voluntarios_email ON public.voluntarios(email);
CREATE INDEX IF NOT EXISTS idx_donaciones_email ON public.donaciones(email);


-- ------------------------------------------------------------------------------
-- PERMISOS GLOBALES POSTGREST (Obligatorio para Supabase/Insforge)
-- ------------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Permisos tabla contactos
GRANT INSERT ON public.contactos TO anon;
GRANT SELECT ON public.contactos TO authenticated;

-- Permisos tabla voluntarios
GRANT INSERT ON public.voluntarios TO anon;
GRANT SELECT ON public.voluntarios TO authenticated;

-- Permisos tabla donaciones
GRANT INSERT ON public.donaciones TO anon;
GRANT SELECT ON public.donaciones TO authenticated;

-- ==============================================================================
-- FIN DEL SCRIPT.
-- Ejecutar completo en el editor SQL para aprovisionar toda la infraestructura.
-- ==============================================================================

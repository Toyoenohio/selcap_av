-- Ejecutar en el SQL Editor de Supabase (https://app.supabase.com → SQL Editor)
-- Esto crea la tabla de pacientes y habilita acceso público de lectura/escritura

-- 1. Crear la tabla
CREATE TABLE IF NOT EXISTS public.pacientes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  edad INTEGER,
  cedula TEXT,
  centro TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Índice para búsqueda rápida por nombre y apellido
CREATE INDEX IF NOT EXISTS idx_pacientes_nombre ON public.pacientes (nombre);
CREATE INDEX IF NOT EXISTS idx_pacientes_apellido ON public.pacientes (apellido);
CREATE INDEX IF NOT EXISTS idx_pacientes_centro ON public.pacientes (centro);

-- 3. Habilitar Row Level Security
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;

-- 4. Política: cualquiera puede leer (búsqueda pública)
CREATE POLICY "Cualquiera puede leer pacientes" 
  ON public.pacientes FOR SELECT 
  USING (true);

-- 5. Política: cualquiera puede insertar (registro abierto — emergencia)
CREATE POLICY "Cualquiera puede registrar pacientes" 
  ON public.pacientes FOR INSERT 
  WITH CHECK (true);

-- 6. (Opcional) Insertar algunos datos de prueba
INSERT INTO public.pacientes (nombre, apellido, edad, cedula, centro) VALUES
  ('Carlos', 'Rodríguez', 45, 'V-12345678', 'Hospital Central de Maracay'),
  ('Ana', 'Martínez', 32, 'V-23456789', 'Hospital Central de Maracay'),
  ('Luis', 'García', 67, NULL, 'Clínica La Floresta'),
  ('Elena', 'Hernández', 28, 'V-45678901', 'Hospital Militar de Valencia');

# Registro de Pacientes — Emergencia Venezuela

App ligera para registrar y buscar personas afectadas por el terremoto. Hecha con Vue 3 + Supabase, sin build step.

## Configuración (3 pasos)

### 1. Crear tabla en Supabase
Ve a tu proyecto de Supabase → **SQL Editor** → pega el contenido de [`setup.sql`](./setup.sql) y ejecuta.

### 2. Obtener credenciales
En Supabase → **Settings** → **API**:
- Copia la **URL** (`Project URL`)
- Copia la **anon key** (`Project API keys → anon public`)

### 3. Configurar el HTML
Edita `index.html` y reemplaza las líneas 177-178:

```js
supabaseUrl: 'https://TU_PROJECT_ID.supabase.co',
supabaseKey: 'TU_ANON_KEY',
```

## Despliegue

La app ya está en `public/pacientes/` del proyecto selcap_av. Al hacer deploy en Vercel, estará disponible en:

```
https://tudominio.vercel.app/pacientes/
```

## Uso

- **Pestaña Buscar**: Escribe nombre/apellido para filtrar en tiempo real. Usa el dropdown para filtrar por centro.
- **Pestaña Registrar**: Formulario para añadir pacientes. Cualquiera puede hacerlo (sistema abierto, contexto de emergencia).

Los datos se sincronizan en tiempo real cada 60 segundos. Usa el botón 🔄 para refrescar manualmente.

import { Metadata } from "next"
import { requireRole } from "@/lib/dal"
import { Card } from "@/components/ui/Card"
import { Settings, Globe, Mail, Key } from "lucide-react"

export const metadata: Metadata = {
  title: "Configuración",
}

export default async function AdminConfigPage() {
  await requireRole(["ADMIN"])

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-3xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-neutral-900">Configuración</h1>
        <p className="text-neutral-500">
          Administra las configuraciones generales de la plataforma.
        </p>
      </div>

      <Card className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-primary-600" />
          <h2 className="font-bold text-neutral-900">WooCommerce</h2>
        </div>
        <p className="text-sm text-neutral-500">
          La integración con WooCommerce se configura mediante variables de entorno en Vercel.
          Asegúrate de tener configuradas las siguientes variables:
        </p>
        <div className="bg-neutral-50 rounded-lg p-4 font-mono text-sm text-neutral-700 space-y-1">
          <p>WOOCOMMERCE_URL=https://tutienda.com</p>
          <p>WOOCOMMERCE_CONSUMER_KEY=ck_xxx</p>
          <p>WOOCOMMERCE_CONSUMER_SECRET=cs_xxx</p>
          <p>WOOCOMMERCE_WEBHOOK_SECRET=tu-secreto</p>
        </div>
      </Card>

      <Card className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-primary-600" />
          <h2 className="font-bold text-neutral-900">Email (Resend)</h2>
        </div>
        <p className="text-sm text-neutral-500">
          El envío de emails (bienvenida, recuperación de contraseña, certificados)
          se configura con Resend. Variables requeridas:
        </p>
        <div className="bg-neutral-50 rounded-lg p-4 font-mono text-sm text-neutral-700 space-y-1">
          <p>RESEND_API_KEY=re_xxx</p>
          <p>EMAIL_FROM=noreply@tudominio.com</p>
        </div>
      </Card>

      <Card className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5 text-primary-600" />
          <h2 className="font-bold text-neutral-900">Seguridad</h2>
        </div>
        <p className="text-sm text-neutral-500">
          Configuración de JWT y claves de seguridad. Variables requeridas:
        </p>
        <div className="bg-neutral-50 rounded-lg p-4 font-mono text-sm text-neutral-700 space-y-1">
          <p>JWT_SECRET=clave-secreta-minimo-16-caracteres</p>
          <p>JWT_EXPIRATION=7d</p>
          <p>N8N_WEBHOOK_SECRET=secreto-para-n8n</p>
        </div>
      </Card>

      <Card className="p-6 flex flex-col gap-4 border-dashed bg-neutral-50">
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-neutral-500" />
          <h2 className="font-bold text-neutral-900">Base de Datos</h2>
        </div>
        <p className="text-sm text-neutral-500">
          La conexión a PostgreSQL se gestiona con <code className="bg-neutral-200 px-1.5 py-0.5 rounded text-xs">DATABASE_URL</code>.
          En Vercel, esta variable se configura automáticamente si usas Neon o Supabase integration.
        </p>
      </Card>
    </div>
  )
}

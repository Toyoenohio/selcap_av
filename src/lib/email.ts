import 'server-only'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@aulavirtual.com'
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Aula Virtual'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!resend) {
    console.log(`[EMAIL MOCK] To: ${to}, Subject: ${subject}`)
    console.log(`[EMAIL MOCK] Body: ${html.substring(0, 200)}...`)
    return
  }

  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
  })
}

// ─── Email Templates ─────────────────────────────────────

export async function sendWelcomeEmail(params: {
  to: string
  firstName: string
  tempPassword: string
}) {
  const { to, firstName, tempPassword } = params
  await sendEmail({
    to,
    subject: `Bienvenido a ${APP_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #297EBE; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">${APP_NAME}</h1>
        </div>
        <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1F2937;">¡Hola ${firstName}!</h2>
          <p style="color: #4B5563; line-height: 1.6;">
            Tu cuenta ha sido creada exitosamente. Aquí están tus credenciales de acceso:
          </p>
          <div style="background: #F5F7FA; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Email:</strong> ${to}</p>
            <p style="margin: 4px 0;"><strong>Contraseña temporal:</strong> ${tempPassword}</p>
          </div>
          <p style="color: #4B5563; line-height: 1.6;">
            Te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.
          </p>
          <a href="${APP_URL}/login" style="display: inline-block; background: #297EBE; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">
            Iniciar Sesión
          </a>
        </div>
      </div>
    `,
  })
}

export async function sendEnrollmentEmail(params: {
  to: string
  firstName: string
  courseName: string
}) {
  const { to, firstName, courseName } = params
  await sendEmail({
    to,
    subject: `Inscripción confirmada: ${courseName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #297EBE; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">${APP_NAME}</h1>
        </div>
        <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1F2937;">¡Hola ${firstName}!</h2>
          <p style="color: #4B5563; line-height: 1.6;">
            Has sido inscrito exitosamente en el curso:
          </p>
          <div style="background: #EBF4FB; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #297EBE;">
            <h3 style="color: #1E5F8F; margin: 0;">${courseName}</h3>
          </div>
          <a href="${APP_URL}/mis-cursos" style="display: inline-block; background: #297EBE; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">
            Ir a Mis Cursos
          </a>
        </div>
      </div>
    `,
  })
}

export async function sendExamResultEmail(params: {
  to: string
  firstName: string
  courseName: string
  examName: string
  score: number
  passed: boolean
}) {
  const { to, firstName, courseName, examName, score, passed } = params
  const statusColor = passed ? '#10B981' : '#EF4444'
  const statusText = passed ? 'APROBADO' : 'REPROBADO'
  await sendEmail({
    to,
    subject: `Resultado de evaluación: ${examName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #297EBE; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">${APP_NAME}</h1>
        </div>
        <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1F2937;">¡Hola ${firstName}!</h2>
          <p style="color: #4B5563; line-height: 1.6;">
            Aquí están los resultados de tu evaluación:
          </p>
          <div style="background: #F5F7FA; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Curso:</strong> ${courseName}</p>
            <p style="margin: 4px 0;"><strong>Evaluación:</strong> ${examName}</p>
            <p style="margin: 4px 0;"><strong>Calificación:</strong> ${score.toFixed(1)}%</p>
            <p style="margin: 4px 0;">
              <strong>Estado:</strong> 
              <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span>
            </p>
          </div>
          <a href="${APP_URL}/mis-cursos" style="display: inline-block; background: #297EBE; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">
            Ver Mis Cursos
          </a>
        </div>
      </div>
    `,
  })
}

export async function sendCertificateEmail(params: {
  to: string
  firstName: string
  courseName: string
  certificateNumber: string
}) {
  const { to, firstName, courseName, certificateNumber } = params
  await sendEmail({
    to,
    subject: `¡Certificado disponible! — ${courseName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #297EBE; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">${APP_NAME}</h1>
        </div>
        <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1F2937;">🎉 ¡Felicitaciones ${firstName}!</h2>
          <p style="color: #4B5563; line-height: 1.6;">
            Has completado exitosamente el curso <strong>${courseName}</strong>. Tu certificado está listo para descargar.
          </p>
          <div style="background: #D1FAE5; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
            <p style="margin: 4px 0;"><strong>Número de certificado:</strong> ${certificateNumber}</p>
          </div>
          <a href="${APP_URL}/certificados" style="display: inline-block; background: #10B981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">
            Descargar Certificado
          </a>
        </div>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(params: {
  to: string
  firstName: string
  resetToken: string
}) {
  const { to, firstName, resetToken } = params
  await sendEmail({
    to,
    subject: `Restablecer contraseña — ${APP_NAME}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #297EBE; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">${APP_NAME}</h1>
        </div>
        <div style="background: white; padding: 32px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1F2937;">Hola ${firstName}</h2>
          <p style="color: #4B5563; line-height: 1.6;">
            Recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón a continuación:
          </p>
          <a href="${APP_URL}/restablecer-clave?token=${resetToken}" style="display: inline-block; background: #297EBE; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 20px 0;">
            Restablecer Contraseña
          </a>
          <p style="color: #9CA3AF; font-size: 14px; margin-top: 20px;">
            Este enlace expira en 1 hora. Si no solicitaste esto, ignora este email.
          </p>
        </div>
      </div>
    `,
  })
}

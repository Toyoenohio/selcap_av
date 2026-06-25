import { z } from 'zod'

// ─── Auth Schemas ────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export const registerSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// ─── Course Schemas ──────────────────────────────────────

export const courseSchema = z.object({
  sku: z.string().min(1, 'El SKU es requerido'),
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  teacherId: z.string().optional().nullable(),
  isSequential: z.boolean().default(false),
  passingGrade: z.number().min(0).max(100).default(70),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
})

export const sectionSchema = z.object({
  courseId: z.string(),
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  sortOrder: z.number().default(0),
})

export const lessonSchema = z.object({
  sectionId: z.string(),
  title: z.string().min(1, 'El título es requerido'),
  contentHtml: z.string().default(''),
  videoUrl: z.string().url().optional().nullable().or(z.literal('')),
  sortOrder: z.number().default(0),
})

// ─── Evaluation Schemas ──────────────────────────────────

export const evaluationSchema = z.object({
  sectionId: z.string(),
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  maxAttempts: z.number().min(1).default(3),
  sortOrder: z.number().default(0),
})

export const questionSchema = z.object({
  evaluationId: z.string(),
  text: z.string().min(1, 'La pregunta es requerida'),
  type: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE']),
  points: z.number().min(1).default(1),
  sortOrder: z.number().default(0),
  answers: z.array(z.object({
    text: z.string().min(1, 'La respuesta es requerida'),
    isCorrect: z.boolean().default(false),
  })).min(2, 'Debe tener al menos 2 respuestas'),
})

// ─── User Schemas ────────────────────────────────────────

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).default('STUDENT'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
})

export const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT']).optional(),
  isActive: z.boolean().optional(),
})

// ─── Enrollment Schemas ──────────────────────────────────

export const enrollmentSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  source: z.enum(['MANUAL', 'WOOCOMMERCE']).default('MANUAL'),
})

// ─── Category Schemas ────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  sortOrder: z.number().default(0),
})

// ─── Certificate Template Schemas ────────────────────────

export const certificateTemplateSchema = z.object({
  courseId: z.string().optional().nullable(),
  name: z.string().min(1, 'El nombre es requerido'),
  backgroundImageUrl: z.string().url('URL de imagen inválida'),
  textFields: z.array(z.object({
    key: z.string(),
    label: z.string(),
    x: z.number(),
    y: z.number(),
    fontSize: z.number().default(24),
    fontColor: z.string().default('#000000'),
    fontWeight: z.string().default('normal'),
    textAlign: z.string().default('center'),
    maxWidth: z.number().optional(),
  })).default([]),
})

// ─── Evaluation Submission ───────────────────────────────

export const submitEvaluationSchema = z.object({
  evaluationId: z.string(),
  answers: z.array(z.object({
    questionId: z.string(),
    selectedAnswerIds: z.array(z.string()),
  })),
})

// ─── Type exports ────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CourseInput = z.infer<typeof courseSchema>
export type SectionInput = z.infer<typeof sectionSchema>
export type LessonInput = z.infer<typeof lessonSchema>
export type EvaluationInput = z.infer<typeof evaluationSchema>
export type QuestionInput = z.infer<typeof questionSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type EnrollmentInput = z.infer<typeof enrollmentSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type CertificateTemplateInput = z.infer<typeof certificateTemplateSchema>
export type SubmitEvaluationInput = z.infer<typeof submitEvaluationSchema>

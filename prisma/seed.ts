import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aulavirtual.com' },
    update: {},
    create: {
      email: 'admin@aulavirtual.com',
      passwordHash: adminPassword,
      firstName: 'Administrador',
      lastName: 'Sistema',
      role: 'ADMIN',
    },
  })
  console.log(`  ✅ Admin: ${admin.email}`)

  // Create teacher
  const teacherPassword = await bcrypt.hash('teacher123', 12)
  const teacher = await prisma.user.upsert({
    where: { email: 'profesor@aulavirtual.com' },
    update: {},
    create: {
      email: 'profesor@aulavirtual.com',
      passwordHash: teacherPassword,
      firstName: 'María',
      lastName: 'González',
      role: 'TEACHER',
    },
  })
  console.log(`  ✅ Profesor: ${teacher.email}`)

  // Create student
  const studentPassword = await bcrypt.hash('student123', 12)
  const student = await prisma.user.upsert({
    where: { email: 'alumno@aulavirtual.com' },
    update: {},
    create: {
      email: 'alumno@aulavirtual.com',
      passwordHash: studentPassword,
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      role: 'STUDENT',
    },
  })
  console.log(`  ✅ Alumno: ${student.email}`)

  // Create categories
  const catProgramacion = await prisma.category.upsert({
    where: { slug: 'programacion' },
    update: {},
    create: {
      name: 'Programación',
      slug: 'programacion',
      description: 'Cursos de desarrollo de software y programación',
      sortOrder: 1,
    },
  })

  const catDiseno = await prisma.category.upsert({
    where: { slug: 'diseno' },
    update: {},
    create: {
      name: 'Diseño',
      slug: 'diseno',
      description: 'Cursos de diseño gráfico y UX/UI',
      sortOrder: 2,
    },
  })

  const catMarketing = await prisma.category.upsert({
    where: { slug: 'marketing' },
    update: {},
    create: {
      name: 'Marketing Digital',
      slug: 'marketing-digital',
      description: 'Cursos de marketing digital y redes sociales',
      sortOrder: 3,
    },
  })
  console.log(`  ✅ Categorías creadas`)

  // Create a sample course
  const course = await prisma.course.upsert({
    where: { sku: 'INTRO-JS-001' },
    update: {},
    create: {
      sku: 'INTRO-JS-001',
      title: 'Introducción a JavaScript',
      description: 'Aprende los fundamentos de JavaScript desde cero. Este curso cubre variables, funciones, objetos, arrays, y más.',
      categoryId: catProgramacion.id,
      teacherId: teacher.id,
      isSequential: true,
      passingGrade: 70,
      status: 'PUBLISHED',
    },
  })
  console.log(`  ✅ Curso: ${course.title}`)

  // Create sections with lessons and evaluations
  const section1 = await prisma.section.create({
    data: {
      courseId: course.id,
      title: 'Fundamentos de JavaScript',
      description: 'Conceptos básicos del lenguaje',
      sortOrder: 1,
    },
  })

  await prisma.lesson.createMany({
    data: [
      {
        sectionId: section1.id,
        title: '¿Qué es JavaScript?',
        contentHtml: '<h2>Introducción a JavaScript</h2><p>JavaScript es un lenguaje de programación dinámico que se utiliza principalmente para crear contenido interactivo en sitios web.</p><p>Fue creado en 1995 por Brendan Eich mientras trabajaba en Netscape Communications Corporation.</p><h3>Características principales</h3><ul><li>Es un lenguaje interpretado</li><li>Tipado dinámico</li><li>Orientado a objetos</li><li>Funcional</li></ul>',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        sortOrder: 1,
      },
      {
        sectionId: section1.id,
        title: 'Variables y Tipos de Datos',
        contentHtml: '<h2>Variables en JavaScript</h2><p>Las variables son contenedores para almacenar datos. En JavaScript moderno, usamos <code>let</code> y <code>const</code> para declarar variables.</p><h3>let vs const</h3><p><code>let</code> permite reasignar valores, mientras que <code>const</code> crea constantes que no pueden ser reasignadas.</p><h3>Tipos de datos</h3><ul><li><strong>String</strong>: Cadenas de texto</li><li><strong>Number</strong>: Números</li><li><strong>Boolean</strong>: true o false</li><li><strong>Array</strong>: Colecciones de datos</li><li><strong>Object</strong>: Colecciones de pares clave-valor</li></ul>',
        sortOrder: 2,
      },
      {
        sectionId: section1.id,
        title: 'Operadores',
        contentHtml: '<h2>Operadores en JavaScript</h2><p>Los operadores nos permiten realizar operaciones con los datos.</p><h3>Aritméticos</h3><p><code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>%</code></p><h3>Comparación</h3><p><code>===</code>, <code>!==</code>, <code>></code>, <code><</code>, <code>>=</code>, <code><=</code></p><h3>Lógicos</h3><p><code>&&</code>, <code>||</code>, <code>!</code></p>',
        sortOrder: 3,
      },
    ],
  })

  // Create evaluation for section 1
  const eval1 = await prisma.evaluation.create({
    data: {
      sectionId: section1.id,
      title: 'Quiz: Fundamentos de JavaScript',
      description: 'Evalúa tus conocimientos sobre los fundamentos de JavaScript',
      maxAttempts: 3,
      sortOrder: 1,
    },
  })

  // Create questions with answers
  const q1 = await prisma.question.create({
    data: {
      evaluationId: eval1.id,
      text: '¿En qué año fue creado JavaScript?',
      type: 'SINGLE_CHOICE',
      points: 1,
      sortOrder: 1,
      answers: {
        createMany: {
          data: [
            { text: '1993', isCorrect: false, sortOrder: 1 },
            { text: '1995', isCorrect: true, sortOrder: 2 },
            { text: '1997', isCorrect: false, sortOrder: 3 },
            { text: '2000', isCorrect: false, sortOrder: 4 },
          ],
        },
      },
    },
  })

  const q2 = await prisma.question.create({
    data: {
      evaluationId: eval1.id,
      text: '¿Cuál de las siguientes NO es una forma de declarar variables en JavaScript moderno?',
      type: 'SINGLE_CHOICE',
      points: 1,
      sortOrder: 2,
      answers: {
        createMany: {
          data: [
            { text: 'let', isCorrect: false, sortOrder: 1 },
            { text: 'const', isCorrect: false, sortOrder: 2 },
            { text: 'var', isCorrect: false, sortOrder: 3 },
            { text: 'define', isCorrect: true, sortOrder: 4 },
          ],
        },
      },
    },
  })

  const q3 = await prisma.question.create({
    data: {
      evaluationId: eval1.id,
      text: 'JavaScript es un lenguaje compilado.',
      type: 'TRUE_FALSE',
      points: 1,
      sortOrder: 3,
      answers: {
        createMany: {
          data: [
            { text: 'Verdadero', isCorrect: false, sortOrder: 1 },
            { text: 'Falso', isCorrect: true, sortOrder: 2 },
          ],
        },
      },
    },
  })

  // Create section 2
  const section2 = await prisma.section.create({
    data: {
      courseId: course.id,
      title: 'Funciones y Control de Flujo',
      description: 'Aprende a crear funciones y controlar el flujo de tu programa',
      sortOrder: 2,
    },
  })

  await prisma.lesson.createMany({
    data: [
      {
        sectionId: section2.id,
        title: 'Funciones',
        contentHtml: '<h2>Funciones en JavaScript</h2><p>Las funciones son bloques de código reutilizables que realizan una tarea específica.</p><h3>Declaración de funciones</h3><pre><code>function saludar(nombre) {\n  return `Hola, ${nombre}!`;\n}</code></pre><h3>Arrow Functions</h3><pre><code>const saludar = (nombre) => `Hola, ${nombre}!`;</code></pre>',
        sortOrder: 1,
      },
      {
        sectionId: section2.id,
        title: 'Condicionales',
        contentHtml: '<h2>Condicionales</h2><p>Los condicionales permiten ejecutar código basándose en condiciones.</p><h3>if / else</h3><pre><code>if (edad >= 18) {\n  console.log("Mayor de edad");\n} else {\n  console.log("Menor de edad");\n}</code></pre>',
        sortOrder: 2,
      },
    ],
  })

  // Enroll student in course
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: course.id,
      },
    },
    update: {},
    create: {
      userId: student.id,
      courseId: course.id,
      source: 'MANUAL',
      status: 'ACTIVE',
    },
  })
  console.log(`  ✅ Alumno inscrito en: ${course.title}`)

  // Create second course
  const course2 = await prisma.course.upsert({
    where: { sku: 'DISENO-UI-001' },
    update: {},
    create: {
      sku: 'DISENO-UI-001',
      title: 'Diseño de Interfaces UI/UX',
      description: 'Domina los principios del diseño de interfaces de usuario y experiencia de usuario.',
      categoryId: catDiseno.id,
      teacherId: teacher.id,
      isSequential: false,
      passingGrade: 60,
      status: 'PUBLISHED',
    },
  })

  const s2s1 = await prisma.section.create({
    data: {
      courseId: course2.id,
      title: 'Principios de Diseño',
      description: 'Fundamentos del diseño visual',
      sortOrder: 1,
    },
  })

  await prisma.lesson.create({
    data: {
      sectionId: s2s1.id,
      title: 'Introducción al Diseño UI',
      contentHtml: '<h2>¿Qué es el Diseño UI?</h2><p>El diseño de interfaz de usuario (UI) se enfoca en la apariencia visual y la interactividad de un producto digital.</p>',
      sortOrder: 1,
    },
  })

  console.log(`  ✅ Curso: ${course2.title}`)

  console.log('')
  console.log('🎉 Seed completado!')
  console.log('')
  console.log('📋 Credenciales de prueba:')
  console.log('  Admin:    admin@aulavirtual.com / admin123')
  console.log('  Profesor: profesor@aulavirtual.com / teacher123')
  console.log('  Alumno:   alumno@aulavirtual.com / student123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

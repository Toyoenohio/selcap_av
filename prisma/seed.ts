// prisma/seed.ts — Demo data for Aula Virtual MVP
// Run with: npx tsx prisma/seed.ts
// Requires DATABASE_URL in .env

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Sembrando datos de demo...')

  // Clean existing data (order matters due to foreign keys)
  await prisma.certificate.deleteMany()
  await prisma.evaluationAttempt.deleteMany()
  await prisma.lessonProgress.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.answer.deleteMany()
  await prisma.question.deleteMany()
  await prisma.evaluation.deleteMany()
  await prisma.lessonAttachment.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.section.deleteMany()
  await prisma.certificateTemplate.deleteMany()
  await prisma.course.deleteMany()
  await prisma.category.deleteMany()
  await prisma.passwordReset.deleteMany()
  await prisma.user.deleteMany()
  await prisma.systemConfig.deleteMany()

  const passwordHash = await bcrypt.hash('demo1234', 12)

  // ─── Users ───────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      email: 'admin@aulavirtual.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'Principal',
      role: 'ADMIN',
      isActive: true,
    }
  })

  const teacher = await prisma.user.create({
    data: {
      email: 'profesor@aulavirtual.com',
      passwordHash,
      firstName: 'Carlos',
      lastName: 'Mendoza',
      role: 'TEACHER',
      isActive: true,
    }
  })

  const student = await prisma.user.create({
    data: {
      email: 'alumno@aulavirtual.com',
      passwordHash,
      firstName: 'María',
      lastName: 'González',
      role: 'STUDENT',
      isActive: true,
    }
  })

  const student2 = await prisma.user.create({
    data: {
      email: 'juan@email.com',
      passwordHash,
      firstName: 'Juan',
      lastName: 'Pérez',
      role: 'STUDENT',
      isActive: true,
    }
  })

  console.log('✅ Usuarios creados: admin, profesor, 2 alumnos')
  console.log('   🔑 admin@aulavirtual.com / demo1234')
  console.log('   🔑 profesor@aulavirtual.com / demo1234')
  console.log('   🔑 alumno@aulavirtual.com / demo1234')

  // ─── Categories ──────────────────────────────────────────
  const catTech = await prisma.category.create({
    data: { name: 'Tecnología', slug: 'tecnologia', sortOrder: 0 }
  })
  const catBusiness = await prisma.category.create({
    data: { name: 'Negocios', slug: 'negocios', sortOrder: 1 }
  })
  const catDesign = await prisma.category.create({
    data: { name: 'Diseño', slug: 'diseno', sortOrder: 2 }
  })

  // ─── Course 1: React Fundamentals ────────────────────────
  const course1 = await prisma.course.create({
    data: {
      sku: 'REACT-101',
      title: 'React desde Cero: Fundamentos',
      description: 'Aprende React desde las bases hasta construir aplicaciones web modernas con hooks, estado y componentes. Este curso te llevará de cero a crear tu primera SPA completa.',
      categoryId: catTech.id,
      teacherId: teacher.id,
      isSequential: true,
      passingGrade: 70,
      status: 'PUBLISHED',
    }
  })

  // Sections
  const s1 = await prisma.section.create({
    data: { courseId: course1.id, title: 'Introducción a React', description: 'Fundamentos y conceptos básicos', sortOrder: 0 }
  })
  const s2 = await prisma.section.create({
    data: { courseId: course1.id, title: 'Componentes y Estado', description: 'El corazón de React', sortOrder: 1 }
  })
  const s3 = await prisma.section.create({
    data: { courseId: course1.id, title: 'Proyecto Final', description: 'Aplica todo lo aprendido', sortOrder: 2 }
  })

  // Section 1 lessons
  await prisma.lesson.create({
    data: {
      sectionId: s1.id, title: '¿Qué es React?',
      contentHtml: `<h2>React: La biblioteca de UI de Facebook</h2>
<p>React es una <strong>biblioteca de JavaScript</strong> para construir interfaces de usuario interactivas. Fue creada por Facebook en 2013 y hoy es mantenida por Meta y una gran comunidad open-source.</p>
<h3>¿Por qué React?</h3>
<ul>
<li><strong>Componentes reutilizables:</strong> Divide tu UI en piezas independientes.</li>
<li><strong>Virtual DOM:</strong> Actualizaciones eficientes sin tocar el DOM real directamente.</li>
<li><strong>Declarativo:</strong> Describe cómo debe verse tu UI para cada estado.</li>
<li><strong>Ecosistema masivo:</strong> Next.js, React Native, millones de librerías.</li>
</ul>
<blockquote>React te permite construir aplicaciones web que se sienten como apps nativas.</blockquote>`,
      sortOrder: 0
    }
  })
  await prisma.lesson.create({
    data: {
      sectionId: s1.id, title: 'Configuración del Entorno',
      contentHtml: `<h2>Preparando tu espacio de trabajo</h2>
<p>Para empezar con React necesitas:</p>
<ol>
<li><strong>Node.js</strong> (v18 o superior) — Descarga desde nodejs.org</li>
<li><strong>Un editor de código</strong> — Recomendamos VS Code</li>
<li><strong>Vite</strong> — El bundler más rápido para React</li>
</ol>
<h3>Creando tu primer proyecto</h3>
<pre><code>npm create vite@latest mi-app -- --template react
cd mi-app
npm install
npm run dev</code></pre>
<p>¡Listo! Tienes tu app de React corriendo en <code>http://localhost:5173</code></p>`,
      sortOrder: 1
    }
  })
  await prisma.lesson.create({
    data: {
      sectionId: s1.id, title: 'JSX: JavaScript + HTML',
      contentHtml: `<h2>JSX: La sintaxis que parece HTML</h2>
<p>JSX es una extensión de sintaxis para JavaScript que te permite escribir código similar a HTML dentro de tus componentes.</p>
<h3>Ejemplo básico</h3>
<pre><code>function Saludo() {
  const nombre = "María";
  return &lt;h1&gt;¡Hola, {nombre}!&lt;/h1&gt;;
}</code></pre>
<h3>Reglas de JSX</h3>
<ul>
<li>Un solo elemento raíz por componente</li>
<li>Usa <code>className</code> en vez de <code>class</code></li>
<li>Las expresiones JS van entre llaves <code>{}</code></li>
<li>Todas las etiquetas deben cerrarse</li>
</ul>`,
      sortOrder: 2
    }
  })

  // Section 2 lessons
  await prisma.lesson.create({
    data: {
      sectionId: s2.id, title: 'Componentes Funcionales',
      contentHtml: `<h2>Componentes: Los bloques de construcción</h2>
<p>En React moderno, los componentes son <strong>funciones de JavaScript</strong> que retornan JSX.</p>
<h3>Anatomía de un componente</h3>
<pre><code>function Boton({ texto, onClick }) {
  return (
    &lt;button 
      onClick={onClick}
      className="btn-primary"
    &gt;
      {texto}
    &lt;/button&gt;
  );
}</code></pre>
<h3>Props</h3>
<p>Las props (propiedades) son la forma de pasar datos de un componente padre a uno hijo. Son <strong>inmutables</strong> — el componente hijo no debe modificarlas.</p>`,
      sortOrder: 0
    }
  })
  await prisma.lesson.create({
    data: {
      sectionId: s2.id, title: 'useState: El Hook de Estado',
      contentHtml: `<h2>useState: Dando memoria a tus componentes</h2>
<p>El hook <code>useState</code> te permite añadir estado a componentes funcionales.</p>
<pre><code>import { useState } from 'react'

function Contador() {
  const [count, setCount] = useState(0)
  
  return (
    &lt;div&gt;
      &lt;p&gt;Has hecho clic {count} veces&lt;/p&gt;
      &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
        Incrementar
      &lt;/button&gt;
    &lt;/div&gt;
  )
}</code></pre>
<h3>Puntos clave</h3>
<ul>
<li><code>useState</code> retorna un array: [valor, función para actualizar]</li>
<li>Nunca modifiques el estado directamente — usa la función setter</li>
<li>React re-renderiza el componente cuando el estado cambia</li>
</ul>`,
      sortOrder: 1
    }
  })

  // Section 3: Project
  await prisma.lesson.create({
    data: {
      sectionId: s3.id, title: 'Construyendo un Todo App',
      contentHtml: `<h2>Proyecto Final: Lista de Tareas</h2>
<p>Vamos a construir una aplicación completa de lista de tareas (To-Do) aplicando todo lo aprendido.</p>
<h3>Funcionalidades</h3>
<ul>
<li>✅ Añadir tareas nuevas</li>
<li>✅ Marcar tareas como completadas</li>
<li>✅ Eliminar tareas</li>
<li>✅ Filtrar por estado (todas, activas, completadas)</li>
<li>✅ Persistencia en localStorage</li>
</ul>
<h3>Estructura de componentes</h3>
<pre><code>App
├── TodoForm       (input + botón añadir)
├── TodoList       (lista de tareas)
│   └── TodoItem   (cada tarea individual)
└── TodoFilter     (filtros: todas/activas/completadas)</code></pre>
<p>¡Manos a la obra! Sigue las instrucciones paso a paso en el código de ejemplo.</p>`,
      sortOrder: 0
    }
  })

  // Evaluation for Section 2
  const eval1 = await prisma.evaluation.create({
    data: {
      sectionId: s2.id,
      title: 'Quiz: Componentes y Estado',
      description: 'Demuestra que entendiste los conceptos de componentes, props y useState.',
      maxAttempts: 3,
      sortOrder: 0
    }
  })

  const q1 = await prisma.question.create({
    data: { evaluationId: eval1.id, text: '¿Qué son las props en React?', type: 'SINGLE_CHOICE', points: 10, sortOrder: 0 }
  })
  await prisma.answer.createMany({
    data: [
      { questionId: q1.id, text: 'Variables globales accesibles desde cualquier componente', isCorrect: false, sortOrder: 0 },
      { questionId: q1.id, text: 'Datos que un componente padre pasa a un componente hijo', isCorrect: true, sortOrder: 1 },
      { questionId: q1.id, text: 'Funciones que modifican el estado del componente', isCorrect: false, sortOrder: 2 },
      { questionId: q1.id, text: 'Una forma de estilizar componentes', isCorrect: false, sortOrder: 3 },
    ]
  })

  const q2 = await prisma.question.create({
    data: { evaluationId: eval1.id, text: '¿Qué retorna el hook useState?', type: 'SINGLE_CHOICE', points: 10, sortOrder: 1 }
  })
  await prisma.answer.createMany({
    data: [
      { questionId: q2.id, text: 'Un objeto con las propiedades value y setter', isCorrect: false, sortOrder: 0 },
      { questionId: q2.id, text: 'Un array con [valor, función para actualizarlo]', isCorrect: true, sortOrder: 1 },
      { questionId: q2.id, text: 'El valor del estado directamente', isCorrect: false, sortOrder: 2 },
      { questionId: q2.id, text: 'Nada, solo actualiza el DOM', isCorrect: false, sortOrder: 3 },
    ]
  })

  const q3 = await prisma.question.create({
    data: { evaluationId: eval1.id, text: 'JSX es obligatorio para usar React', type: 'TRUE_FALSE', points: 5, sortOrder: 2 }
  })
  await prisma.answer.createMany({
    data: [
      { questionId: q3.id, text: 'Verdadero', isCorrect: false, sortOrder: 0 },
      { questionId: q3.id, text: 'Falso', isCorrect: true, sortOrder: 1 },
    ]
  })

  const q4 = await prisma.question.create({
    data: { evaluationId: eval1.id, text: '¿Cuál es la forma correcta de actualizar el estado? (Selecciona todas las correctas)', type: 'MULTIPLE_CHOICE', points: 15, sortOrder: 3 }
  })
  await prisma.answer.createMany({
    data: [
      { questionId: q4.id, text: 'setState(nuevoValor)', isCorrect: true, sortOrder: 0 },
      { questionId: q4.id, text: 'state = nuevoValor', isCorrect: false, sortOrder: 1 },
      { questionId: q4.id, text: 'setState(prev => prev + 1)', isCorrect: true, sortOrder: 2 },
      { questionId: q4.id, text: 'this.state = nuevoValor', isCorrect: false, sortOrder: 3 },
    ]
  })

  // Evaluation for Section 3
  const eval2 = await prisma.evaluation.create({
    data: {
      sectionId: s3.id,
      title: 'Evaluación Final: React Fundamentals',
      description: 'Examen final del curso. Debes obtener al menos 70% para aprobar.',
      maxAttempts: 2,
      sortOrder: 0
    }
  })

  const q5 = await prisma.question.create({
    data: { evaluationId: eval2.id, text: '¿Cuál es el hook utilizado para ejecutar efectos secundarios en React?', type: 'SINGLE_CHOICE', points: 20, sortOrder: 0 }
  })
  await prisma.answer.createMany({
    data: [
      { questionId: q5.id, text: 'useState', isCorrect: false, sortOrder: 0 },
      { questionId: q5.id, text: 'useEffect', isCorrect: true, sortOrder: 1 },
      { questionId: q5.id, text: 'useContext', isCorrect: false, sortOrder: 2 },
      { questionId: q5.id, text: 'useReducer', isCorrect: false, sortOrder: 3 },
    ]
  })

  const q6 = await prisma.question.create({
    data: { evaluationId: eval2.id, text: 'En JSX se usa className en lugar de class porque class es una palabra reservada en JavaScript.', type: 'TRUE_FALSE', points: 10, sortOrder: 1 }
  })
  await prisma.answer.createMany({
    data: [
      { questionId: q6.id, text: 'Verdadero', isCorrect: true, sortOrder: 0 },
      { questionId: q6.id, text: 'Falso', isCorrect: false, sortOrder: 1 },
    ]
  })

  // ─── Course 2: Marketing Digital ─────────────────────────
  const course2 = await prisma.course.create({
    data: {
      sku: 'MKT-201',
      title: 'Marketing Digital para Emprendedores',
      description: 'Domina las estrategias de marketing digital que necesitas para hacer crecer tu negocio: redes sociales, email marketing, SEO básico y analítica web.',
      categoryId: catBusiness.id,
      teacherId: teacher.id,
      isSequential: false,
      passingGrade: 60,
      status: 'PUBLISHED',
    }
  })

  const mktS1 = await prisma.section.create({
    data: { courseId: course2.id, title: 'Fundamentos de Marketing Digital', description: 'Conceptos básicos', sortOrder: 0 }
  })
  const mktS2 = await prisma.section.create({
    data: { courseId: course2.id, title: 'Estrategia en Redes Sociales', description: 'Instagram, Facebook, TikTok', sortOrder: 1 }
  })

  await prisma.lesson.create({
    data: {
      sectionId: mktS1.id, title: '¿Qué es el Marketing Digital?',
      contentHtml: `<h2>Marketing Digital: Mucho más que redes sociales</h2>
<p>El marketing digital engloba <strong>todas las estrategias de mercadeo</strong> que se ejecutan en canales digitales: buscadores, redes sociales, email, sitios web y aplicaciones móviles.</p>
<h3>Canales principales</h3>
<ul>
<li><strong>SEO:</strong> Posicionamiento orgánico en buscadores</li>
<li><strong>SEM:</strong> Publicidad pagada en Google Ads</li>
<li><strong>Social Media:</strong> Instagram, Facebook, TikTok, LinkedIn</li>
<li><strong>Email Marketing:</strong> Comunicación directa con tu audiencia</li>
<li><strong>Content Marketing:</strong> Blogs, videos, podcasts</li>
</ul>
<p>Un emprendedor no necesita dominarlos todos — solo los que funcionan para su negocio.</p>`,
      sortOrder: 0
    }
  })

  await prisma.lesson.create({
    data: {
      sectionId: mktS1.id, title: 'Definiendo tu Buyer Persona',
      contentHtml: `<h2>Conoce a tu cliente ideal</h2>
<p>Un <strong>Buyer Persona</strong> es una representación semi-ficticia de tu cliente ideal basada en datos reales y algunas suposiciones fundamentadas.</p>
<h3>¿Qué define a un Buyer Persona?</h3>
<ul>
<li><strong>Demografía:</strong> Edad, ubicación, ingresos, educación</li>
<li><strong>Psicografía:</strong> Intereses, valores, estilo de vida</li>
<li><strong>Comportamiento:</strong> Hábitos de compra, redes que usa</li>
<li><strong>Dolores:</strong> Problemas que tu producto resuelve</li>
</ul>
<blockquote>Si le hablas a todo el mundo, no le hablas a nadie.</blockquote>`,
      sortOrder: 1
    }
  })

  await prisma.lesson.create({
    data: {
      sectionId: mktS2.id, title: 'Instagram para Negocios',
      contentHtml: `<h2>Instagram: Tu vitrina digital</h2>
<p>Con más de <strong>2 mil millones de usuarios activos</strong>, Instagram es la plataforma visual por excelencia para conectar con tu audiencia.</p>
<h3>Tipos de contenido</h3>
<ul>
<li><strong>Reels</strong> — Mayor alcance orgánico. Videos cortos y dinámicos.</li>
<li><strong>Stories</strong> — Contenido efímero para engagement diario.</li>
<li><strong>Carruseles</strong> — Ideales para contenido educativo.</li>
<li><strong>Posts estáticos</strong> — Imágenes de alta calidad.</li>
</ul>
<h3>Tips para emprendedores</h3>
<ol>
<li>Publica al menos 3-4 veces por semana</li>
<li>Usa hashtags relevantes (5-10 por post)</li>
<li>Responde todos los comentarios y DMs</li>
<li>Muestra el detrás de cámaras de tu negocio</li>
</ol>`,
      sortOrder: 0
    }
  })

  await prisma.lesson.create({
    data: {
      sectionId: mktS2.id, title: 'Email Marketing Efectivo',
      contentHtml: `<h2>El email sigue siendo el rey del ROI</h2>
<p>Por cada <strong>$1 invertido en email marketing</strong>, el retorno promedio es de <strong>$36</strong>. Ningún otro canal tiene ese ROI.</p>
<h3>Tipos de emails que debes enviar</h3>
<ul>
<li><strong>Bienvenida:</strong> La primera impresión cuenta. Automatízala.</li>
<li><strong>Newsletter:</strong> Contenido de valor semanal/quincenal.</li>
<li><strong>Promocionales:</strong> Ofertas y lanzamientos (máximo 20% de tus envíos).</li>
<li><strong>Carrito abandonado:</strong> Recupera ventas perdidas.</li>
</ul>
<h3>Herramientas recomendadas</h3>
<ul>
<li>Mailchimp (gratis hasta 500 contactos)</li>
<li>Brevo (antes Sendinblue) — ilimitados contactos, límite de envíos</li>
<li>Resend — ideal para developers</li>
</ul>`,
      sortOrder: 1
    }
  })

  // Evaluation for Marketing
  const evalMkt = await prisma.evaluation.create({
    data: {
      sectionId: mktS2.id,
      title: 'Quiz: Marketing Digital',
      description: 'Evalúa tus conocimientos de marketing digital.',
      maxAttempts: 2,
      sortOrder: 0
    }
  })

  const qMkt1 = await prisma.question.create({
    data: { evaluationId: evalMkt.id, text: '¿Cuál de estos NO es un canal de marketing digital?', type: 'SINGLE_CHOICE', points: 10, sortOrder: 0 }
  })
  await prisma.answer.createMany({
    data: [
      { questionId: qMkt1.id, text: 'SEO', isCorrect: false, sortOrder: 0 },
      { questionId: qMkt1.id, text: 'Email Marketing', isCorrect: false, sortOrder: 1 },
      { questionId: qMkt1.id, text: 'Volanteo puerta a puerta', isCorrect: true, sortOrder: 2 },
      { questionId: qMkt1.id, text: 'Instagram Ads', isCorrect: false, sortOrder: 3 },
    ]
  })

  const qMkt2 = await prisma.question.create({
    data: { evaluationId: evalMkt.id, text: 'El ROI promedio del email marketing es de $36 por cada $1 invertido.', type: 'TRUE_FALSE', points: 10, sortOrder: 1 }
  })
  await prisma.answer.createMany({
    data: [
      { questionId: qMkt2.id, text: 'Verdadero', isCorrect: true, sortOrder: 0 },
      { questionId: qMkt2.id, text: 'Falso', isCorrect: false, sortOrder: 1 },
    ]
  })

  // ─── Enrollments ─────────────────────────────────────────
  await prisma.enrollment.create({
    data: { userId: student.id, courseId: course1.id, source: 'MANUAL', status: 'ACTIVE' }
  })
  await prisma.enrollment.create({
    data: { userId: student.id, courseId: course2.id, source: 'MANUAL', status: 'ACTIVE' }
  })
  await prisma.enrollment.create({
    data: { userId: student2.id, courseId: course1.id, source: 'MANUAL', status: 'ACTIVE' }
  })

  console.log('✅ Cursos creados con secciones, lecciones y evaluaciones')
  console.log('✅ Alumnos inscritos en los cursos')
  console.log('')
  console.log('📋 Resumen:')
  console.log('   - 2 cursos publicados')
  console.log('   - 5 secciones')
  console.log('   - 10 lecciones con contenido HTML')
  console.log('   - 3 evaluaciones con preguntas y respuestas')
  console.log('')
  console.log('🚀 ¡Demo lista! Entra con:')
  console.log('   Admin:  admin@aulavirtual.com / demo1234')
  console.log('   Alumno: alumno@aulavirtual.com / demo1234')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error en el seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

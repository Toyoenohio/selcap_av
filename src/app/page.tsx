import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function HomePage() {
  const session = await getSession()
  
  if (session) {
    if (session.role === 'ADMIN' || session.role === 'TEACHER') {
      redirect('/admin')
    }
    redirect('/panel')
  }
  
  redirect('/login')
}

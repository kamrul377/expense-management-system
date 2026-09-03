import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import DashboardApp from '@/components/dashboard-app'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return <DashboardApp user={{ name: session.user.name, email: session.user.email, role: (session.user as { role?: string }).role ?? 'SUPPORT' }} />
}

export const dynamic = 'force-dynamic'

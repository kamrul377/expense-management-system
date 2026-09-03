import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { AuthForm } from '@/components/auth-form'

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/')
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center"><div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xl font-bold">N</div><h1 className="text-2xl font-semibold">Welcome back</h1><p className="mt-2 text-sm text-muted-foreground">Sign in to Netra Expense Operations</p></div>
        <AuthForm mode="sign-in" />
      </div>
    </main>
  )
}

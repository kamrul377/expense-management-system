'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { createInitialAdmin } from '@/app/actions/setup-admin'

export default function SetupAdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const result = await createInitialAdmin(form)
    if (result.error) toast.error(result.error)
    else {
      toast.success('Administrator created. You can now sign in.')
      router.push('/sign-in')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <section className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">N</div>
          <div><p className="text-xs font-semibold uppercase tracking-wider text-primary">Netra ISP</p><h1 className="text-2xl font-semibold">Create first admin</h1></div>
        </div>
        <p className="mb-6 text-sm leading-6 text-muted-foreground">Use this one-time setup page to create the administrator account. After the first account exists, this setup is permanently locked.</p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          {([['name', 'Full name', 'text'], ['email', 'Email address', 'email'], ['password', 'Password (8+ characters)', 'password']] as const).map(([key, label, type]) => (
            <label key={key} className="flex flex-col gap-2 text-sm font-medium">{label}<input className="h-10 rounded-md border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring" type={type} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required minLength={key === 'password' ? 8 : undefined} /></label>
          ))}
          <Button type="submit" disabled={loading}>{loading ? 'Creating administrator…' : 'Create administrator'}</Button>
        </form>
        <Link href="/sign-in" className="mt-5 block text-center text-sm text-muted-foreground underline">Back to sign in</Link>
      </section>
    </main>
  )
}

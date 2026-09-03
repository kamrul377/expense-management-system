'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'

const inputClass = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring'

export function AuthForm({ mode = 'sign-in' }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = mode === 'sign-in'
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name })
      if (result.error) throw new Error(result.error.message || 'Authentication failed')
      router.push('/')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {mode === 'sign-up' && <div className="flex flex-col gap-2"><label htmlFor="name" className="text-sm font-medium">Full name</label><input id="name" className={inputClass} type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" /></div>}
      <div className="flex flex-col gap-2"><label htmlFor="email" className="text-sm font-medium">Email</label><input id="email" className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" /></div>
      <div className="flex flex-col gap-2"><label htmlFor="password" className="text-sm font-medium">Password</label><input id="password" className={inputClass} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" /></div>
      <Button type="submit" disabled={loading} className="w-full">{loading ? 'Loading...' : mode === 'sign-in' ? 'Sign in' : 'Create account'}</Button>
      <p className="text-center text-sm text-muted-foreground">{mode === 'sign-in' ? <>Don&apos;t have an account? <Link href="/sign-up" className="underline hover:text-foreground">Sign up</Link></> : <>Already have an account? <Link href="/sign-in" className="underline hover:text-foreground">Sign in</Link></>}</p>
    </form>
  )
}

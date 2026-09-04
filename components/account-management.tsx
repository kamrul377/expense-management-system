'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createManagedAccount, type ManagedRole } from '@/app/actions/user-management'

type Props = { actorRole: string }

export function AccountManagement({ actorRole }: Props) {
  const allowedRoles: ManagedRole[] = actorRole === 'ADMIN' ? ['MANAGER', 'ACCOUNTS', 'SUPPORT'] : ['SUPPORT']
  const [role, setRole] = useState<ManagedRole>(allowedRoles[0])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    const result = await createManagedAccount({ name, email, password, role })
    setLoading(false)
    if (result.error) return toast.error(result.error)
    setName(''); setEmail(''); setPassword('')
    toast.success(`${role} account created successfully`)
  }

  return <div className="account-management panel">
    <div className="panel-heading"><div><h2>Create staff account</h2><p>{actorRole === 'ADMIN' ? 'Create manager, accounts, or support accounts.' : 'Managers can create support accounts only.'}</p></div></div>
    <form className="account-form" onSubmit={submit}>
      <label>Full name<input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} placeholder="Enter full name" /></label>
      <label>Work email<input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" placeholder="name@netra.com" /></label>
      <label>Temporary password<input value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} type="password" placeholder="At least 8 characters" /></label>
      <label>Role<select value={role} onChange={(event) => setRole(event.target.value as ManagedRole)}>{allowedRoles.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <button className="button primary" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
    </form>
  </div>
}

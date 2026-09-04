import Link from 'next/link'

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-xl font-bold">N</div>
        <h1 className="text-2xl font-semibold">Account creation is restricted</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Netra staff accounts can only be created by an administrator or an authorized manager.</p>
        <Link href="/sign-in" className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Back to sign in</Link>
      </div>
    </main>
  )
}

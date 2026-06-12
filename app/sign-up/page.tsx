import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'

export default async function SignUpPage({
  searchParams
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const session = await auth()
  if (session?.user) redirect('/')
  const params = await searchParams
  const redirectTo = params.redirect || undefined
  return <AuthForm mode="sign-up" redirectTo={redirectTo} />
}

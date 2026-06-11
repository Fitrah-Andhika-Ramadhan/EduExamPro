import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'

export default async function SignInPage() {
  const session = await auth()
  if (session?.user) redirect('/')
  return <AuthForm mode="sign-in" />
}

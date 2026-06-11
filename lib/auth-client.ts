'use client'

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession, getSession as nextAuthGetSession } from 'next-auth/react'

export const authClient = {
  signIn: {
    email: async ({ email, password }: { email: string; password: string }) => {
      try {
        const result = await nextAuthSignIn('credentials', {
          email,
          password,
          redirect: false,
        })
        if (result?.error) {
          return {
            data: null,
            error: result.error,
          }
        }
        return {
          data: { user: { email } },
          error: null,
        }
      } catch (err: any) {
        return {
          data: null,
          error: err?.message || 'Sign in failed',
        }
      }
    },
  },
  signOut: async () => {
    try {
      await nextAuthSignOut({ redirect: false })
    } catch (err) {
      console.error('Sign out error:', err)
    }
  },
  signUp: {
    email: async ({
      email,
      password,
      name,
    }: {
      email: string
      password: string
      name: string
    }) => {
      // SignUp is handled by server action
      return {
        data: null,
        error: null,
      }
    },
  },
  getSession: async () => {
    const session = await nextAuthGetSession()
    return { data: session }
  },
}

export { useSession }

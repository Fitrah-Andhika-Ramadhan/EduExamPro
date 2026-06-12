import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
// @ts-ignore
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const users = await db
            .select()
            .from(user)
            .where(eq(user.email, credentials.email as string))

          if (users.length === 0) {
            return null
          }

          const foundUser = users[0]

          if (!foundUser.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            foundUser.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            image: foundUser.image,
            role: foundUser.role,
            plan: foundUser.plan,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
    newUser: '/sign-up',
  },
  callbacks: {
    async jwt({ token, user: authUser }) {
      if (authUser) {
        token.id = authUser.id
        // @ts-ignore
        token.role = authUser.role
        // @ts-ignore
        token.plan = authUser.plan
      } else if (token.id) {
        // Fetch latest plan to ensure upgrades reflect immediately without relogin
        const users = await db.select({ plan: user.plan }).from(user).where(eq(user.id, token.id as string))
        if (users.length > 0) {
          // @ts-ignore
          token.plan = users[0].plan
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        // @ts-ignore
        session.user.role = token.role as string
        // @ts-ignore
        session.user.plan = token.plan as string
      }
      return session
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
})

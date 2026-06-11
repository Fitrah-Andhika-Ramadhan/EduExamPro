import { config } from 'dotenv'
config({ path: '.env.local' })
import { db } from '../lib/db'
import { user } from '../lib/db/schema'
import { eq } from 'drizzle-orm'
// @ts-ignore
import bcrypt from 'bcryptjs'

async function run() {
  const hashedPassword = await bcrypt.hash('admin123456', 10)
  
  const existing = await db.query.user.findFirst({
    where: eq(user.email, 'admin@edubangsa.id')
  })
  
  if (existing) {
    await db.update(user)
      .set({ password: hashedPassword, role: 'admin' })
      .where(eq(user.email, 'admin@edubangsa.id'))
    console.log('Admin password updated to admin123456')
  } else {
    await db.insert(user).values({
      id: crypto.randomUUID(),
      name: 'Admin EduBangsa',
      email: 'admin@edubangsa.id',
      password: hashedPassword,
      role: 'admin',
      emailVerified: true
    })
    console.log('Admin user created with password admin123456')
  }
}
run()

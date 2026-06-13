import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL || ''

// Disable prefetch as it is not supported for "Transaction" pool mode
declare global {
  var postgresClient: postgres.Sql | undefined
}

export const client = globalThis.postgresClient || postgres(connectionString, { prepare: false, max: 10 })
if (process.env.NODE_ENV !== 'production') globalThis.postgresClient = client

export const db = drizzle(client, { schema })

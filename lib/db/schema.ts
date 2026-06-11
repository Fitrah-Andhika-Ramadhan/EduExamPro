import { pgTable, text, integer, index, timestamp, boolean, serial, varchar } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// Better Auth Tables (required)
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  password: text('password'),
  role: text('role', { enum: ['user', 'admin'] }).default('user').notNull(),
  plan: text('plan', { enum: ['free', 'pro'] }).default('free').notNull(),
  planExpiresAt: timestamp('planExpiresAt', { mode: 'date' }),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().$defaultFn(() => new Date()),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().$defaultFn(() => new Date()),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt', { mode: 'date' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: timestamp('expiresAt', { mode: 'date' }),
  password: text('password'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt', { mode: 'date' }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date' }),
  updatedAt: timestamp('updatedAt', { mode: 'date' }),
})

// EduBangsa Tables
export const categories = pgTable(
  'categories',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique(),
    description: text('description'),
    userId: text('userId').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    userIdx: index('idx_categories_user').on(table.userId),
  })
)

export const questions = pgTable(
  'questions',
  {
    id: serial('id').primaryKey(),
    categoryId: integer('categoryId').notNull(),
    type: varchar('type', { length: 50 }).default('multiple_choice'),
    questionText: text('question_text').notNull(),
    explanation: text('explanation'),
    difficulty: varchar('difficulty', { length: 20 }).default('medium'),
    userId: text('userId').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    categoryIdx: index('idx_questions_category').on(table.categoryId),
    userIdx: index('idx_questions_user').on(table.userId),
  })
)

export const options = pgTable(
  'options',
  {
    id: serial('id').primaryKey(),
    questionId: integer('questionId').notNull(),
    optionText: text('option_text').notNull(),
    isCorrect: boolean('is_correct').default(false),
    orderIndex: integer('order_index'),
    createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    questionIdx: index('idx_options_question').on(table.questionId),
  })
)

export const tests = pgTable(
  'tests',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    categoryId: integer('categoryId').notNull(),
    durationMinutes: integer('duration_minutes').default(60),
    passingScore: integer('passing_score').default(70),
    showResults: boolean('show_results').default(true),
    showAnswers: boolean('show_answers').default(false),
    isPublished: boolean('is_published').default(false),
    userId: text('userId').notNull(),
    createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    categoryIdx: index('idx_tests_category').on(table.categoryId),
    userIdx: index('idx_tests_user').on(table.userId),
    publishedIdx: index('idx_tests_published').on(table.isPublished),
  })
)

export const testQuestions = pgTable(
  'test_questions',
  {
    id: serial('id').primaryKey(),
    testId: integer('testId').notNull(),
    questionId: integer('questionId').notNull(),
    orderIndex: integer('order_index'),
    createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    testIdx: index('idx_test_questions_test').on(table.testId),
  })
)

export const results = pgTable(
  'results',
  {
    id: serial('id').primaryKey(),
    testId: integer('testId').notNull(),
    userId: text('userId').notNull(),
    score: integer('score'),
    percentage: text('percentage'), // text to store formatting like "85.5"
    passed: boolean('passed'),
    durationSeconds: integer('duration_seconds'),
    startedAt: timestamp('started_at', { mode: 'date' }),
    completedAt: timestamp('completed_at', { mode: 'date' }),
    createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    testIdx: index('idx_results_test').on(table.testId),
    userIdx: index('idx_results_user').on(table.userId),
  })
)

export const transactions = pgTable(
  'transactions',
  {
    id: text('id').primaryKey(), // Midtrans Order ID
    userId: text('userId').notNull().references(() => user.id),
    amount: integer('amount').notNull(),
    status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, settlement, cancel, expire, deny
    paymentType: varchar('payment_type', { length: 50 }),
    snapToken: text('snap_token'),
    createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    userIdx: index('idx_transactions_user').on(table.userId),
  })
)

export const userAnswers = pgTable(
  'user_answers',
  {
    id: serial('id').primaryKey(),
    resultId: integer('resultId').notNull(),
    questionId: integer('questionId').notNull(),
    optionId: integer('optionId'),
    answerText: text('answer_text'),
    isCorrect: boolean('is_correct'),
    createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    resultIdx: index('idx_user_answers_result').on(table.resultId),
  })
)

export const coupons = pgTable(
  'coupons',
  {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    discountPercent: integer('discount_percent').notNull(),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('createdAt', { mode: 'date' }).$defaultFn(() => new Date()),
  }
)

export const settings = pgTable(
  'settings',
  {
    id: text('id').primaryKey(),
    value: text('value').notNull(),
    updatedAt: timestamp('updatedAt', { mode: 'date' }).$defaultFn(() => new Date()),
  }
)

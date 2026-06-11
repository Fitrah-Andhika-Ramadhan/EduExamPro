import { sqliteTable, text, integer, index, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// Better Auth Tables (required)
export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  password: text('password'),
  role: text('role', { enum: ['user', 'admin'] }).default('user').notNull(),
  plan: text('plan', { enum: ['free', 'pro'] }).default('free').notNull(),
  planExpiresAt: integer('planExpiresAt', { mode: 'timestamp' }),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const session = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
})

export const account = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }),
  password: text('password'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
})

export const verification = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }),
})

// EduBangsa Tables
export const categories = sqliteTable(
  'categories',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name', { length: 255 }).notNull(),
    slug: text('slug', { length: 255 }).unique(),
    description: text('description'),
    userId: text('userId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    userIdx: index('idx_categories_user').on(table.userId),
  })
)

export const questions = sqliteTable(
  'questions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    categoryId: integer('categoryId').notNull(),
    type: text('type', { length: 50 }).default('multiple_choice'),
    questionText: text('question_text').notNull(),
    explanation: text('explanation'),
    difficulty: text('difficulty', { length: 20 }).default('medium'),
    userId: text('userId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    categoryIdx: index('idx_questions_category').on(table.categoryId),
    userIdx: index('idx_questions_user').on(table.userId),
  })
)

export const options = sqliteTable(
  'options',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    questionId: integer('questionId').notNull(),
    optionText: text('option_text').notNull(),
    isCorrect: integer('is_correct', { mode: 'boolean' }).default(false),
    orderIndex: integer('order_index'),
    createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    questionIdx: index('idx_options_question').on(table.questionId),
  })
)

export const tests = sqliteTable(
  'tests',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title', { length: 255 }).notNull(),
    description: text('description'),
    categoryId: integer('categoryId').notNull(),
    durationMinutes: integer('duration_minutes').default(60),
    passingScore: integer('passing_score').default(70),
    showResults: integer('show_results', { mode: 'boolean' }).default(true),
    showAnswers: integer('show_answers', { mode: 'boolean' }).default(false),
    isPublished: integer('is_published', { mode: 'boolean' }).default(false),
    userId: text('userId').notNull(),
    createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    categoryIdx: index('idx_tests_category').on(table.categoryId),
    userIdx: index('idx_tests_user').on(table.userId),
    publishedIdx: index('idx_tests_published').on(table.isPublished),
  })
)

export const testQuestions = sqliteTable(
  'test_questions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    testId: integer('testId').notNull(),
    questionId: integer('questionId').notNull(),
    orderIndex: integer('order_index'),
    createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    testIdx: index('idx_test_questions_test').on(table.testId),
  })
)

export const results = sqliteTable(
  'results',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    testId: integer('testId').notNull(),
    userId: text('userId').notNull(),
    score: integer('score'),
    percentage: text('percentage'), // text for decimal equivalent in sqlite
    passed: integer('passed', { mode: 'boolean' }),
    durationSeconds: integer('duration_seconds'),
    startedAt: integer('started_at', { mode: 'timestamp' }),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
    createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    testIdx: index('idx_results_test').on(table.testId),
    userIdx: index('idx_results_user').on(table.userId),
  })
)

export const transactions = sqliteTable(
  'transactions',
  {
    id: text('id').primaryKey(), // Midtrans Order ID
    userId: text('userId').notNull().references(() => user.id),
    amount: integer('amount').notNull(),
    status: text('status', { length: 50 }).notNull().default('pending'), // pending, settlement, cancel, expire, deny
    paymentType: text('payment_type', { length: 50 }),
    snapToken: text('snap_token'),
    createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    userIdx: index('idx_transactions_user').on(table.userId),
  })
)

export const userAnswers = sqliteTable(
  'user_answers',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    resultId: integer('resultId').notNull(),
    questionId: integer('questionId').notNull(),
    optionId: integer('optionId'),
    answerText: text('answer_text'),
    isCorrect: integer('is_correct', { mode: 'boolean' }),
    createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    resultIdx: index('idx_user_answers_result').on(table.resultId),
  })
)

export const coupons = sqliteTable(
  'coupons',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    code: text('code', { length: 50 }).notNull().unique(),
    discountPercent: integer('discount_percent').notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    createdAt: integer('createdAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  }
)

export const settings = sqliteTable(
  'settings',
  {
    id: text('id').primaryKey(),
    value: text('value').notNull(),
    updatedAt: integer('updatedAt', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  }
)

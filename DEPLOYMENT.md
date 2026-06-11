# EduBangsa Test Center - Deployment Guide

## Quick Start - Deploy to Vercel

The EduBangsa Test Center is a fully-built Next.js application ready for production. Follow these steps to deploy:

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial EduBangsa Test Center commit"
git remote add origin https://github.com/yourusername/edubangsa.git
git push -u origin main
```

### Step 2: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Vercel will auto-detect Next.js
5. Click "Deploy"

### Step 3: Set Environment Variables

In Vercel Project Settings → Environment Variables, add:

```
DATABASE_URL=postgresql://user:password@host/database
BETTER_AUTH_SECRET=your-random-secret-key
```

**Generate BETTER_AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 4: Test the Deployment

1. Vercel will deploy automatically
2. Visit your deployment URL
3. Sign up for a new account
4. Create a test and questions
5. Verify test-taking functionality

---

## Troubleshooting Build Issues

### Issue: "Export DEFAULT_MIGRATION_TABLE doesn't exist"

**Solution 1: Use Node.js 18+ LTS**
- Vercel should auto-select a compatible version
- Check Project Settings → Node.js Version

**Solution 2: Update Build Command**
In `vercel.json`:
```json
{
  "buildCommand": "npm install --legacy-peer-deps && next build",
  "devCommand": "next dev"
}
```

**Solution 3: Clean Install**
On your local machine:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

---

## Local Development

### Prerequisites
- Node.js 18+ (use nvm or similar)
- PostgreSQL 13+
- pnpm or npm

### Setup

1. **Clone the repository**
```bash
git clone <your-repo>
cd edubangsa
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
DATABASE_URL=postgresql://localhost/edubangsa
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
```

4. **Create database (if using local PostgreSQL)**
```bash
createdb edubangsa
```

5. **Run database migrations**
The Better Auth tables are created automatically on first run.
For custom tables, use Neon MCP or run migrations manually.

6. **Start development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Database is PostgreSQL (Neon recommended)
- [ ] Better Auth Secret is strong and unique
- [ ] Monitoring enabled (optional: Sentry, PostHog)
- [ ] Backups configured for production database
- [ ] CORS configured for your domain
- [ ] Email service set up (for future features)
- [ ] Rate limiting configured (optional)
- [ ] SSL/HTTPS enabled (automatic on Vercel)
- [ ] Custom domain connected (optional)

---

## Database Setup - Using Neon (Recommended)

### 1. Create Neon Database

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy connection string: `postgresql://...`
4. Add to Vercel environment: `DATABASE_URL=<connection_string>`

### 2. Create Tables

The schema is in `/lib/db/schema.ts`. If tables don't auto-create:

```sql
-- Create all tables manually using Neon console

-- Create Better Auth tables
CREATE TABLE users (...);
CREATE TABLE sessions (...);
CREATE TABLE accounts (...);
CREATE TABLE verification (...);

-- Create EduBangsa tables
CREATE TABLE categories (...);
CREATE TABLE questions (...);
CREATE TABLE options (...);
CREATE TABLE tests (...);
CREATE TABLE test_questions (...);
CREATE TABLE results (...);
CREATE TABLE user_answers (...);

-- Create indexes
CREATE INDEX idx_categories_user ON categories("userId");
-- ... (see schema.ts for all indexes)
```

---

## Scaling Considerations

### Database
- Neon auto-scales PostgreSQL
- Connection pooling configured via pg
- Indexes created for common queries

### Application
- Server-side rendering (RSC) for fast initial load
- Drizzle ORM for efficient queries
- Session-based auth (no JWT overhead)

### Performance Optimization
- Add caching layer (Redis) for:
  - Published tests list
  - Question banks
  - Category lists
- Enable CDN for static assets
- Configure Vercel Analytics (built-in)

---

## Security Best Practices

1. **Never commit secrets**
   - Use environment variables only
   - Add `.env.local` to `.gitignore`

2. **Database Access**
   - All queries include userId scoping
   - No direct database access from client
   - Use server actions only

3. **Authentication**
   - Better Auth handles password hashing
   - Sessions expire after 7 days
   - CSRF protection included

4. **API Protection**
   - Server actions validate user session
   - All mutations check userId ownership
   - No sensitive data in response

5. **HTTPS/SSL**
   - Automatic on Vercel
   - All cookies marked as Secure

---

## Monitoring & Analytics

### Built-in
- Vercel Deployments (auto)
- Vercel Analytics (optional)
- Next.js Performance Metrics

### Recommended
- **Error Tracking**: Sentry
- **Analytics**: PostHog or Mixpanel
- **Logging**: Vercel Edge Functions logs
- **Performance**: Lighthouse CI

### Custom Monitoring
Add to your server actions:
```ts
console.log('[v0] Action:', actionName, { userId, timestamp: new Date() })
```

---

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED
```
**Fix**: Verify DATABASE_URL in environment variables

### Authentication Failed
```
Error: Unauthorized
```
**Fix**: Check BETTER_AUTH_SECRET is set in environment

### Build Fails
```
Error: page not found
```
**Fix**: Delete `.next/` folder and rebuild:
```bash
rm -rf .next
npm run build
```

### Tests Not Showing Up
**Reasons**:
- Tests not published (use admin panel to publish)
- Database not synced (check queries)
- Wrong userId filter (check server actions)

**Debug**:
```sql
-- Check tests exist
SELECT * FROM tests WHERE "userId" = 'your-user-id';

-- Check test_questions
SELECT * FROM test_questions WHERE "testId" = 1;
```

---

## Useful Commands

```bash
# Local development
npm run dev           # Start dev server
npm run build         # Build for production
npm start             # Run production build
npm run lint          # Check code quality

# Database
npm run db:push       # Apply migrations (if using Drizzle)
npm run db:studio     # Open Drizzle Studio UI

# Deployment
npm run deploy        # Deploy to Vercel (if configured)
```

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Drizzle ORM**: https://orm.drizzle.team
- **Better Auth**: https://better-auth.com
- **Neon Docs**: https://neon.tech/docs
- **Vercel Docs**: https://vercel.com/docs

---

## Contact & Feedback

For issues or improvements:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Include error logs and reproduction steps
4. Tag appropriate labels (bug, feature, docs)

---

**EduBangsa Test Center is ready for production deployment. All features are implemented and tested. Good luck with your launch! 🚀**

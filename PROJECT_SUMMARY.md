# EduBangsa Assessment Center (EAC) - Project Summary

## Project Overview

EduBangsa Assessment Center (EAC) is a comprehensive B2B SaaS platform for Testing, Training, and Certification. It serves as a unified ecosystem for schools, vocational training centers (LPK), campuses, tutoring centers (Bimbel), and corporations. EAC aims to replace fragmented tools (Google Forms, separate CBTs, Excel, manual certificates) with a single, integrated platform.

**Tagline:** "One Platform for Testing, Training, and Certification"

## Technology Stack

- **Frontend & API**: Next.js 16 (App Router), React 19, TypeScript
- **Database**: SQLite (Local Dev) / PostgreSQL (Production)
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth (Auth.js) credentials
- **UI Components**: shadcn/ui, Tailwind CSS v4, Lucide Icons

## Target Market & Solutions

1. **Schools**: PTS, PAS, School Exams, UTBK Tryouts.
2. **LPK (Training Centers)**: Placement Tests, Training Management, Certification.
3. **Tutoring Centers (Bimbel)**: Tryouts, Premium Classes, National Rankings.
4. **Corporations**: Recruitment Tests, Psychometric Tests, Technical Tests, Product Modules.

## Core Modules

### 1. Learning Management System (LMS)
Simplified, modern LMS for distributing:
- PDF Materials, Videos
- Assignments & Quizzes

### 2. Computer Based Test (CBT)
Robust testing engine supporting:
- Online Exams (Multiple Choice, Essay, Audio, Video)
- National Tryouts (CPNS, PPPK, BUMN, Kedinasan, UTBK)

### 3. Training Management
Admin features for training lifecycle:
- Batch Management
- Instructor Assignments
- Schedule Monitoring & Attendance

### 4. Digital Certificates
Automated generation featuring:
- QR Verification
- Certificate ID
- Digital Signatures

## Unique Value Propositions (UVP)
- **Training Journey**: Visual path of ongoing and completed courses & certifications.
- **Skill Passport**: A dynamic competency profile (e.g., Numerical: 85, Analytical: 90) updated automatically.
- **Talent Pool**: Companies can discover top graduates (e.g., Top 100 Digital Marketing students) - a new revenue stream.
- **Career Readiness Score**: Aggregated score (0-100) from test results, certifications, attendance, and learning activity.

## Monetization / Pricing Plans
- **Starter**: Rp299.000/month (50 Participants)
- **Professional**: Rp999.000/month (500 Participants)
- **Enterprise**: Custom Pricing (Unlimited Participants)

## Implemented Features (MVP Phase 1)
- Authentication (Sign In / Sign Up)
- Admin Test Management (Create, Edit, Delete, Publish)
- Question Bank Management
- Modern SaaS Landing Page (EAC Branding)

## Next Steps for Completion
1. **CBT Engine**: Build the actual test-taking interface with timers, questions, and automatic scoring.
2. **LMS Module**: Add course management and material distribution.
3. **Training & Certification**: Implement the Training Journey, Skill Passport, and auto-generated certificates.
4. **Talent Pool Dashboard**: Build recruiter views for corporations.

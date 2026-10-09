# Duolingo Clone

A full-stack Duolingo-inspired language learning application built as an assignment.

The project includes a visual learning path, interactive lessons, gamification, persistent progress, achievements, leaderboard, and responsive UI.

## Features

- Visual learning path with locked, available, and completed lessons
- Five exercise types:
  - Multiple Choice
  - Translate / Word Bank
  - Match Pairs
  - Fill in the Blank
  - Type Answer
- Immediate correct/incorrect feedback
- Hearts and gem-based heart refill
- XP, daily goals, and streaks
- Weekly leaderboard
- Achievements
- Profile and progress tracking
- Dark mode
- Browser-based pronunciation using Web Speech API
- Next-lesson navigation after completion
- Developer date simulation for testing streaks and daily goals

Spanish is the currently implemented course. Authentication, payments, social features, and additional languages are simplified or represented as placeholders.

---

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

### Database
- SQLite

---

## Architecture

```text
┌─────────────────────────┐
│     Next.js Frontend    │
│                         │
│ Learning Path           │
│ Lesson Player           │
│ Profile / Leaderboard   │
│ Settings / Courses      │
└────────────┬────────────┘
             │
             │ HTTP / JSON
             ▼
┌─────────────────────────┐
│      FastAPI Backend    │
│                         │
│ Course APIs             │
│ Lesson APIs             │
│ User APIs               │
│ Leaderboard APIs        │
│ Achievement APIs        │
└────────────┬────────────┘
             │
             │ SQLAlchemy
             ▼
┌─────────────────────────┐
│         SQLite          │
│                         │
│ Courses / Units         │
│ Skills / Lessons        │
│ Exercises               │
│ User Progress           │
│ XP / Achievements       │
└─────────────────────────┘


The frontend handles UI state and user interaction, while the backend is the source of truth for lesson validation and persistent progress.

## Project Structure

duolingo-clone/
│
├── backend/
│   ├── app/
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── course.py
│   │   │   ├── debug.py
│   │   │   ├── leaderboard.py
│   │   │   ├── lessons.py
│   │   │   └── user.py
│   │   └── services/
│   │       ├── answers.py
│   │       └── presentation.py
│   ├── seed.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   ├── package.json
│   └── .env.local
│
└── README.md

## Database Schema
Course
  │
  └── Unit
        │
        └── Skill
              │
              └── Lesson
                    │
                    └── Exercise


User
  ├── UserLessonProgress ──► Lesson
  ├── DailyXP
  └── UserAchievement ─────► Achievement

AppSetting

## Main Tables
| Table                | Purpose                     |
|----------------------|-----------------------------|
| `Course`             | Language/course information |
| `Unit`               | Groups related skills       |
| `Skill`              | Learning skill within a unit|
| `Lesson`             | Playable lesson             |
| `Exercise`           | Individual lesson exercises |
| `User`               | Learner gamification state  |
| `UserLessonProgress` | Completed lesson progress   |
| `DailyXP`            | XP earned per day           |
| `Achievement`        | Available achievements      |
| `UserAchievement`.   | Earned achievements         |
| `AppSetting`         | Application-level settings  |


Exercise-specific data is stored as JSON so the same Exercise table can support different exercise types.

## API Overview
| Method | Endpoint                            | Purpose                        |
|--------|-------------------------------------|--------------------------------|
| GET    | `/api/health`                       | Backend health check           |
| GET    | `/api/user`                         | Get current learner data       |
| POST   | `/api/hearts/refill`                | Refill hearts using gems.      |
| GET    | `/api/achievements`                 | Get achievements               |
| GET    | `/api/course/path`                  | Get learning path              |
| GET    | `/api/lessons/{lesson_id}`          | Get a playable lesson          |
| POST   | `/api/lessons/{lesson_id}/answer`   | Submit an exercise answer      |
| POST   | `/api/lessons/{lesson_id}/complete` | Complete a lesson              |
| GET    | `/api/leaderboard`                  | Get weekly leaderboard         |
| POST   | `/api/debug/advance-day`            | Simulate next day              |
| GET    | `/api/debug/today`                  | Get simulated application date |


The backend validates lesson answers and enforces lesson availability before allowing a lesson to be played.

## Seed Data

The project includes seed data for a Spanish course containing:
- 2 units
- 4 skills
- Lessons covering all five exercise types
- 4 achievement definitions
- 10 seeded leaderboard rivals
- 1 demo learner

The demo learner starts with:
- 10 XP
- 1-day streak
- 5 hearts
- 500 gems
- 20 XP daily goal
- First lesson completed

## Setup
1. Clone the repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd duolingo-clone

2. Start the backend

cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py
uvicorn app.main:app --reload

Backend:
http://localhost:8000

3. Start the frontend

Open another terminal:
cd frontend
npm install

Create .env.local:
NEXT_PUBLIC_API_URL=http://localhost:8000

Then:
npm run dev

Frontend:
http://localhost:3000


## Database Reset
To reset the local database to the seeded demo state:
cd backend
python seed.py

This recreates the database tables and seed data.
Note: this is destructive and will reset the current local progress.

## Deployment
The intended deployment setup is:
Vercel
   │
   │ API requests
   ▼
Render / Railway
   │
   ▼
FastAPI + SQLite

## Frontend
Deploy the Next.js application to Vercel and configure:
NEXT_PUBLIC_API_URL=<DEPLOYED_BACKEND_URL>

## Backend
Deploy the FastAPI application to Render or Railway.
The backend CORS configuration should allow the deployed frontend origin.

## SQLite
SQLite is used for assignment simplicity and local development.
Some free hosting environments may use ephemeral filesystems, so SQLite should not be considered production-grade persistent storage in that environment.

## Assumptions and Scope
- Authentication is simplified to a seeded demo learner.
- Spanish is the currently populated course.
- Exercise answers are validated by the backend.
- Exercise-specific content is stored as JSON.
- Speech functionality uses browser Web Speech API pronunciation only.
- Payments/Super and social functionality are mocked or represented as placeholders.
- Debug date endpoints are included to test streak and daily-goal behavior.

## Testing
The main flows have been manually tested, including:
- All five exercise types
- Correct and incorrect answers
- Heart loss and refill
- Locked lessons
- Lesson completion
- XP and streak persistence
- Daily goals
- Achievements
- Leaderboard
- Next-lesson navigation
- Dark mode
- Developer day simulation
The frontend also passes linting and the production build.

## Future Improvements
PostgreSQL for production persistence
Real authentication
More language courses
Real Super/payment integration
Social features
Speech recognition
Automated unit/integration tests
End-to-end testing
Production monitoring







# Release Checklist Tool

A modern web application designed to help developers manage release steps efficiently.  
With this tool, you can create releases, track step completion, update additional info, and see release statuses automatically.

---

## Features

- View a list of all releases
- Create a new release (name, due date, optional additional info)
- Check/uncheck steps for a release
- Update additional information for a release
- Delete a release
- Automatic status computation based on steps:
  - `planned` → no steps completed
  - `ongoing` → some steps completed
  - `done` → all steps completed
- Simple and user-friendly interface
- Full frontend and backend in a single repository

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 18
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **Hosting:** Vercel (frontend + backend)

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or hosted)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ssamit2000/realse-checklist-tool.git
cd realse-checklist-tool
````

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
```

4. Apply Prisma migrations:

```bash
npx prisma migrate dev --name init
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Database Schema

```prisma
model Release {
  id             String   @id @default(cuid())
  name           String
  date           DateTime
  additionalInfo String?
  completedSteps String[] @default([])
  steps          Json
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

---

## API Endpoints

| Method | Endpoint             | Description                               |
| ------ | -------------------- | ----------------------------------------- |
| GET    | `/api/releases`      | Get all releases                          |
| GET    | `/api/releases/[id]` | Get a single release by ID                |
| POST   | `/api/releases`      | Create a new release                      |
| PATCH  | `/api/releases/[id]` | Update completed steps or additional info |
| DELETE | `/api/releases/[id]` | Delete a release                          |

---

## Running Tests

```bash
npm run test
```

> ⚠️ Note: Tests require the local server and a running database. Ensure `DATABASE_URL` is set correctly.

---

## Deployment

* The app can be deployed on Vercel (or similar hosting)
* Make sure to set the `DATABASE_URL` environment variable in your deployment settings

```

---

If you want, I can also **write a very short “Quick Deploy to Vercel” section** for this README, so someone can deploy it in 5 minutes without extra instructions.  

Do you want me to do that?
```

# TO-DO APP — Full-Stack Task Management Platform

A collaborative full-stack To-Do Web Application built with a **React + TypeScript + Vite** frontend, a **Python Flask** REST API secured with **JWT** and **`bcrypt`**, and a **MySQL** relational database supporting **User / Admin Role-Based Access Control (RBAC)**.

---

## Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7, Motion, Lucide React |
| **Reminders & Client State** | Context API, Web Audio API (alarm chime synthesizer), Browser Notifications API, `localStorage` offline fallback |
| **Backend API** | Python, Flask, Flask-JWT-Extended, Flask-CORS, `bcrypt`, `python-dotenv` |
| **Database** | MySQL 8.0+ / MariaDB 10.3+ (`InnoDB`, `utf8mb4`), `mysql-connector-python` / PyMySQL |
| **Architecture & QA** | RESTful APIs, Role-Based Access Control (`user` / `admin`), Git feature-branch workflow, structured QA docs |

---

## Key Features

- **Authentication & Role-Based Access Control (RBAC)**:
  - JWT-authenticated registration (`password >= 8` chars) and login with `bcrypt` password hashing.
  - Role-protected routes (`user` and `admin`) plus an **Admin Panel** (`/admin`) with system statistics, user role management, user deletion, and a cross-user task overview.
- **Task Management & Productivity Views**:
  - Create, edit, complete, delete, search, filter (`All` / `Pending` / `Completed` + priority filter), and sort (`Due Date`, `Priority`, `Recently Added`) tasks.
  - Quick inline task creation bar on **My Tasks**.
  - **Dashboard** with live KPI cards, completion rate, weekly productivity chart, and **Calendar** view for per-day scheduling.
- **Due Time & Alarm Reminders**:
  - Schedule optional due times (`+5m`, `+1h`, or custom time) when adding or editing a task.
  - Automatic in-browser Web Audio alarm chime and notification alert when a task is due, with an interactive ringing dialog (**Mark Done**, **Snooze 5m**, **Dismiss**).
- **Theming & Offline Resilience**:
  - Light & Dark modes, 4 accent color themes (`Sunset Orange`, `Warm Amber`, `Forest Green`, `Cobalt Blue`), multi-tab session sync, and automatic `localStorage` fallback when the local Flask backend is offline.

---

## Team Roles & Responsibilities

| Member Name | Assigned Task | Git Branch | Target Folder |
| :--- | :--- | :--- | :--- |
| **Namit Yadav** | Develop the frontend for TO-DO APP | `feature/frontend` | `frontend/` |
| **Shivani Krishnakumar Gupta** | Connect the frontend with the backend APIs and ensure data is exchanged correctly | `feature/integration` | `frontend/services/` & `backend/` |
| **Kirti Nair** | Database setup for TO-DO APP and merge everything at the end in Git | `feature/database` | `database/` (and final GitHub PR merges) |
| **Gayatri Ganesh Gaikwad** | Develop the backend including APIs for adding, viewing, updating, and deleting tasks | `feature/backend-api` | `backend/` |
| **Samiksha Sangram Patil** | UI/UX design for To-Do App screens (Login, Dashboard, Add Task, Task List) | `feature/ui-ux` | `docs/ui-ux/` & `frontend/styles/` |
| **Aayush Ananda Achare** | Test all app features, identify bugs, prepare test cases, and maintain project docs | `feature/testing-docs` | `docs/` |

---

## Project Structure

```text
.
├── backend/                  # Python Flask REST API
│   ├── app.py                # Flask entry point & blueprint registration
│   ├── config.py             # Environment configuration
│   ├── db.py                 # MySQL connection helper
│   ├── middleware/           # JWT role_required RBAC decorator
│   ├── routes/               # auth_routes.py, task_routes.py, admin_routes.py
│   ├── utils/                # bcrypt password hashing & verification
│   ├── .env.example          # Backend environment variables template
│   └── requirements.txt      # Python dependencies
├── database/                 # MySQL database scripts
│   ├── schema.sql            # todo_app database, users & tasks tables (InnoDB, utf8mb4)
│   └── seed.sql              # Seeded admin & user accounts + sample tasks
├── docs/                     # QA & UI/UX documentation
│   ├── bug-report.md         # Defect log & bug reports (v2.0.0)
│   ├── test-cases.md         # Functional, RBAC & integration test cases (v2.0.0)
│   └── ui-ux/                # Style guide & wireframes
├── frontend/                 # React + TypeScript + Vite frontend
│   ├── public/               # Static assets (favicon.svg)
│   ├── src/                  # Application source code
│   │   ├── components/       # AppShell, Sidebar, TaskModal, TaskRow, AlarmOverlay, ProductivityChart
│   │   ├── context/          # TaskContext (JWT auth, Flask API + offline fallback, alarm scheduler, theme)
│   │   ├── lib/              # api.ts, alarm.ts, storage.ts, date.ts
│   │   ├── pages/            # Login, Dashboard, Tasks, Calendar, Admin, Settings
│   │   ├── types/            # Shared TypeScript interfaces
│   │   ├── App.tsx           # Route configuration & User/Admin guards
│   │   └── index.css         # Tailwind CSS v4 theme & accent overrides
│   ├── .env.example          # Frontend environment variables template
│   └── package.json          # Frontend dependencies & scripts
└── README.md                 # Project overview & setup documentation
```

---

## Getting Started

### Prerequisites
- **Node.js** 18+ and `npm`
- **Python** 3.10+ and `pip`
- **MySQL** 8.0+ (or MariaDB 10.3+)

### 1. Database Setup (MySQL)

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

**Seeded Accounts** (default password for local testing: `Password123!`):
- **Admin**: `admin@todoapp.com` (`role: admin`)
- **User**: `jane.doe@example.com` (`role: user`)
- **User**: `john.smith@example.com` (`role: user`)

> [!WARNING]
> **Security Notice**: Seeded accounts and default credentials (`Password123!`) are strictly intended for local development, staging, and functional testing. Never use these credentials in a public or production environment.

### 2. Backend Setup (Flask API)

```bash
cd backend
cp .env.example .env
```

Update `backend/.env` with your local database and JWT secrets:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=todo_app
SECRET_KEY=your_flask_secret_key
JWT_SECRET_KEY=your_jwt_secret_key
```

Install dependencies and start Flask:
```bash
pip install -r requirements.txt
python app.py
```

The backend API runs at `http://127.0.0.1:5000`.

### 3. Frontend Setup (React + Vite)

From the `frontend/` directory:
```bash
cd frontend
npm install
cp .env.example .env
# Optional: set VITE_API_BASE_URL="http://127.0.0.1:5000"
npm run dev
```

The frontend runs at `http://localhost:5173` (or configured Vite port). If the Flask server is not running locally, the frontend automatically falls back to browser `localStorage` so all UI features remain usable.

### Build & Type Check
```bash
cd frontend
npm run lint    # TypeScript check (tsc --noEmit)
npm run build   # Production Vite build
```

---

## API Endpoint Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Verify backend API status |
| `POST` | `/api/auth/register` | Public | Register a new user (`password >= 8` chars) |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue JWT token |
| `GET` | `/api/tasks` | Authenticated | Fetch tasks belonging to the current user |
| `POST` | `/api/tasks` | Authenticated | Create a new task |
| `PUT` | `/api/tasks/:id` | Authenticated | Update task title, description, status, priority, or due date |
| `DELETE` | `/api/tasks/:id` | Authenticated | Delete a task belonging to the current user |
| `GET` | `/api/admin/stats` | Admin only | Retrieve system-wide user and task counts |
| `GET` | `/api/admin/users` | Admin only | List all registered users |
| `PUT` | `/api/admin/users/:id/role` | Admin only | Update a user's role (`user` / `admin`) |
| `DELETE` | `/api/admin/users/:id` | Admin only | Delete a user account (cascades user's tasks) |
| `GET` | `/api/admin/tasks` | Admin only | View all tasks across all users |

---

## QA Testing Status & Known Issues

Testing was conducted across the integrated codebase. Core frontend task workflows (CRUD, search, priority filter, sorting, calendar, alarms) were manually executed in desktop browsers. Integration tests and administrative live verification remain formally documented as `Blocked` due to local backend runtime constraints and session account-switching limitations.

### Defect Tracking Summary

| Bug ID | Title | Severity | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | Advanced search/filter button unresponsive | Minor | Medium | **Closed / Resolved** |
| **BUG-002** | Notification bell button unresponsive | Minor | Low | **Closed / Resolved** |
| **BUG-003** | Theme swatches in Settings do not apply | Minor | Low | **Cannot Verify (Blocked)** |
| **BUG-004** | No visible logout option to terminate session | Major | High | **New (Open)** |
| **BUG-005** | Productivity chart displays future day data | Minor | Medium | **New (Open)** |
| **BUG-006** | Alarm Snooze permanently dismisses reminder | Major | High | **New (Open)** |
| **BUG-007** | Settings page not discoverable in UI navigation | Minor | Medium | **New (Open)** |
| **BUG-008** | Profile card missing from primary interface | Trivial | Low | **New (Open)** |
| **BUG-009** | No in-app navigation link back to Dashboard | Minor | Medium | **New (Open)** |

For full test scenarios, steps to reproduce, and resolution notes, see:
- **Test Cases**: [`docs/test-cases.md`](docs/test-cases.md)
- **Bug Report**: [`docs/bug-report.md`](docs/bug-report.md)
- **UI/UX Style Guide**: [`docs/ui-ux/style-guide.md`](docs/ui-ux/style-guide.md)

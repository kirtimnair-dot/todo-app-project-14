# TaskFlow Frontend

A responsive To-Do app frontend built with **React, TypeScript, Vite and Tailwind CSS**. The visual direction follows the generated references: orange + white primary palette, warm cream surfaces, yellow accents and green completed states.

## Features
- Login screen (demo-only; any valid email and password with 4+ characters)
- Dashboard summary: total, pending, completed and completion percentage
- Add, edit, delete and complete tasks
- Task search and All / Pending / Completed filters
- Due dates, priority labels and calendar view
- Responsive sidebar navigation and mobile menu
- LocalStorage persistence (no backend required)

## Run locally
```bash
cd frontend
npm install
npm run dev
```
Open the local URL printed by Vite.

## Production build
```bash
npm run build
npm run preview
```

## Folder structure
```text
frontend/
├── public/
│   └── images/                 # Generated reference image crops used by the UI
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── AppShell.tsx
│   │   ├── Brand.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TaskModal.tsx
│   │   └── TaskRow.tsx
│   ├── context/                # Shared task state
│   │   └── TaskContext.tsx
│   ├── lib/                    # LocalStorage helpers
│   │   └── storage.ts
│   ├── pages/                  # Route-level screens
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Tasks.tsx
│   │   ├── Calendar.tsx
│   │   └── Settings.tsx
│   ├── types/                  # TypeScript models
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Notes
- Authentication is a front-end demo only. It does not validate credentials against a server.
- Tasks are saved in the current browser's LocalStorage. Add an API and database later for multi-user sync.
- Generated artwork crops are stored locally in `public/images`; no remote image dependency is required.

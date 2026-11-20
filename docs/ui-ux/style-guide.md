# TaskFlow To-Do App: UI/UX Style Guide
Designer: Samiksha Sangram Patil | Branch: feature/ui-ux
Based on: frontend/design-reference.png and the colors in frontend/tailwind.config.js

## 1. Screens and flow
Register -> Login -> User Dashboard (role = user) or Admin Dashboard (role = admin)

1. Registration: same layout as Login, with name, email, password, Sign Up button, link to Login
2. Login: left side illustration and tagline, right side Welcome Back card with email, password, Sign In button, link to Sign Up
3. User Dashboard: dark sidebar (Dashboard, My Tasks, Calendar, Settings), greeting, 4 stat cards (Total, Pending, Completed, Completion %), productivity chart
4. Add Task form (popup): task title, priority (Low / Medium / High), due date, Cancel and Add Task buttons
5. Task List (My Tasks): search bar, Add Task button, filter tabs (All / Pending / Completed), task rows with status, priority badge, due date, Edit and Delete icons
6. Admin Dashboard: same layout as User Dashboard, with stats (users, tasks, completed), all users list with role badge, all tasks list

## 2. Color palette
Colors already defined in frontend/tailwind.config.js (use these class names, do not add new ones):
| Use | Tailwind class | Hex |
|---|---|---|
| Button, active menu item | brand-500 | #ff6b00 |
| Button hover | brand-600 | #e85d04 |
| Icons, accents | brand-400 | #ff8a32 |
| Highlight background | brand-100 | #ffe5cc |
| Soft highlight | brand-50 | #fff4e9 |
| Page background | cream | #fffaf5 |
| Main text, dark sidebar | ink | #211d1a |
| Card shadow | shadow-soft | 0 12px 36px rgba(63,42,23,.08) |

Other colors (Tailwind defaults):
| Use | Tailwind class | Hex |
|---|---|---|
| Cards, inputs | white | #ffffff |
| Muted text | gray-500 | #6b7280 |
| Borders | gray-200 | #e5e7eb |
| Completed badge | green-100 / green-800 | #dcfce7 / #166534 |
| Pending badge | brand-100 / brand-600 | #ffe5cc / #e85d04 |
| Priority High | red-100 / red-700 | #fee2e2 / #b91c1c |
| Priority Medium | brand-100 / brand-600 | #ffe5cc / #e85d04 |
| Priority Low | gray-100 / gray-600 | #f3f4f6 / #4b5563 |
| Delete / error | red-500 | #ef4444 |

## 3. Typography
- Font: Inter (fallback: Arial, sans-serif)
- Weights: 400 (normal), 600 (bold)
- Sizes: 12px (badges, small labels), 14px (body, inputs), 16px (default), 20px (card titles), 24px (page titles and greeting), 32px (big stat numbers)

## 4. Spacing and shape
- Spacing scale: 4, 8, 12, 16, 24, 32 px
- Cards: rounded-2xl (16px) with shadow-soft
- Buttons and inputs: rounded-xl (12px), height 40px
- Badges: rounded-full
- Sidebar width: 220px

## 5. Responsive layout (mobile first)
- Mobile (under 640px): sidebar hidden behind a menu button, 1 column, task list as cards, stat cards in 2 columns
- Tablet (640px and up): stat cards in 2 columns, sidebar collapses to icons
- Desktop (1024px and up): full sidebar visible, stat cards in 4 columns, task list as rows
- Login and Register: split layout on desktop, single centered card on mobile

## 6. Notes for the frontend developer
- Use the existing brand, ink and cream colors from tailwind.config.js, no new color config is needed.
- Shared CSS (buttons, inputs, badges, cards) will be in frontend/styles/theme.css.
# Test Cases — TaskFlow To-Do Application

**Document Version:** 1.1.0
**Project:** To-Do Web Application (TaskFlow)
**Role:** QA / Testing & Documentation
**Date:** 2026-11-20

---

## Status Key

| Status | Meaning |
| :--- | :--- |
| `Pass` | Test executed; behavior matched expected result. |
| `Fail` | Test executed; behavior did not match expected result. |
| `Blocked` | Test could not be executed due to missing access, missing feature, or missing dependency. |
| `Not Run` | Test not yet executed. |

---

## Application Context

TaskFlow is a client-side React frontend (Vite + TypeScript + Tailwind CSS). Task data is persisted in the browser's `LocalStorage`. Authentication is a demo simulation — no backend server is currently connected. Database schemas and seed files exist in `/database` but are not integrated with the frontend.

---

## Section 1 — Authentication & Login

> **Status:** Tested. Authentication is a frontend demo; the login page explicitly states any valid email and password work.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-AUTH-001` | Login | Successful login with valid email and password | User is on `/login`; not logged in | 1. Enter `tester@example.com`.<br>2. Enter `Pass1234`.<br>3. Click **Sign In**. | User is redirected to Dashboard (`/`); `taskflow.user` is set in LocalStorage. | Redirected to Dashboard; session stored in LocalStorage. | Pass |
| `TC-AUTH-002` | Login | Empty email field prevented by validation | User is on `/login` | 1. Leave email blank.<br>2. Enter a password.<br>3. Click **Sign In**. | Browser HTML5 validation blocks submission; "Please fill out this field" prompt displayed. | Submission blocked; browser validation prompt shown. | Pass |
| `TC-AUTH-003` | Login | Invalid email format prevented by validation | User is on `/login` | 1. Enter `notanemail`.<br>2. Enter a password.<br>3. Click **Sign In**. | Browser email validation blocks submission. | Submission blocked; browser indicates invalid email format. | Pass |
| `TC-AUTH-004` | Login | Password shorter than 4 characters prevented | User is on `/login` | 1. Enter a valid email.<br>2. Enter `abc` (3 characters).<br>3. Click **Sign In**. | Browser minLength validation blocks submission. | Submission blocked; browser indicates minimum length requirement. | Pass |
| `TC-AUTH-005` | Login | Password visibility toggle | User is on `/login` | 1. Enter a password.<br>2. Click the eye icon.<br>3. Click the eye icon again. | Password displays as plain text on first click; masked again on second click. | Toggle works correctly; input type switches between `text` and `password`. | Pass |
| `TC-AUTH-006` | Logout | User can log out from the sidebar | User is logged in | 1. Click the logout icon at the bottom of the sidebar. | `taskflow.user` is removed from LocalStorage; user is redirected to `/login`. | Session cleared; redirected to `/login`. | Pass |
| `TC-AUTH-007` | Route Protection | Unauthenticated user is redirected from protected routes | `taskflow.user` is not in LocalStorage | 1. Navigate directly to `/`.<br>2. Navigate directly to `/tasks`.<br>3. Navigate directly to `/calendar`.<br>4. Navigate directly to `/settings`. | Each protected route redirects to `/login`. | All four routes redirected to `/login` correctly. | Pass |

---

## Section 2 — Task Creation

> **Status:** Tested.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-TASK-CREATE-001` | Task Creation | Create task with title only (minimum required fields) | User is logged in; on `/tasks` or Dashboard | 1. Click **+ Add Task**.<br>2. Enter a title.<br>3. Leave all other fields empty.<br>4. Click **Add Task**. | Modal closes; task appears at the top of the list with Pending status and default Medium priority. | Task created and displayed correctly with Medium priority. | Pass |
| `TC-TASK-CREATE-002` | Task Creation | Create task with all fields populated | User is logged in; task modal open | 1. Enter title, description, priority (High), and a future due date.<br>2. Click **Add Task**. | Modal closes; task appears with High priority badge and due date displayed. | Task created correctly with all fields visible. | Pass |
| `TC-TASK-CREATE-003` | Task Creation | Empty title submission is blocked | User is logged in; task modal open | 1. Leave title blank.<br>2. Click **Add Task**. | Browser HTML5 required validation prevents submission; no task is created. | Submission blocked; browser validation shown. | Pass |
| `TC-TASK-CREATE-004` | Task Creation | Whitespace-only title is silently rejected | User is logged in; task modal open | 1. Enter only spaces in the title field.<br>2. Click **Add Task**. | Submission is prevented; user sees a validation message. | Submission prevented, but no error message is displayed to the user; modal silently does nothing. | Fail |
| `TC-TASK-CREATE-005` | Task Creation | Priority selector allows switching between all options | User is logged in; task modal open | 1. Click **Low**, then **High**, then **Medium**. | Each selected priority button highlights; selection updates correctly. | Priority buttons highlight and update as expected. | Pass |
| `TC-TASK-CREATE-006` | Task Creation | Cancel closes modal without saving | User is logged in; task modal open with partial input | 1. Enter a title.<br>2. Click **Cancel** or click the backdrop. | Modal closes; no new task is added. | Modal closed without saving; task list unchanged. | Pass |

---

## Section 3 — Task Viewing & Dashboard

> **Status:** Tested.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-TASK-VIEW-001` | Task Viewing | Default starter tasks appear on first load | Fresh session (no prior LocalStorage data) | 1. Log in with a fresh browser session. | Default starter tasks render correctly with assigned priorities and statuses. | Starter tasks displayed as expected. | Pass |
| `TC-TASK-VIEW-002` | Dashboard | Metric cards display accurate counts | User is logged in with tasks present | 1. Navigate to Dashboard.<br>2. Observe Total Tasks, Pending, Completed, and progress gauge. | Counts reflect actual task data; progress percentage equals `(Completed / Total) × 100`. | Metric cards calculated and displayed correctly. | Pass |
| `TC-TASK-VIEW-003` | Dashboard | Recent Tasks list is limited to the 4 most recent | User has more than 4 tasks | 1. Create 5 or more tasks.<br>2. Navigate to Dashboard. | At most 4 tasks appear, sorted by creation date descending. | Recent Tasks displayed up to 4 items in correct order. | Pass |
| `TC-TASK-VIEW-004` | Calendar | Tasks appear on correct calendar dates | User is logged in; tasks have due dates set | 1. Navigate to `/calendar`.<br>2. Navigate months using `<` and `>` buttons.<br>3. Verify task placement on due dates. | Month navigation works; tasks appear in the correct day cells and in the upcoming tasks list. | | Not Run |

---

## Section 4 — Task Editing

> **Status:** Tested.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-TASK-EDIT-001` | Task Editing | Edit task title, priority, and due date | At least one task exists | 1. Click the edit (pencil) icon on a task.<br>2. Update title, priority, and due date.<br>3. Click **Save Changes**. | Modal closes; task row reflects all updated values; task ID and created date are unchanged. | Task updated correctly; all fields persisted. | Pass |
| `TC-TASK-EDIT-002` | Task Editing | Empty title is blocked; whitespace-only title is silently rejected | Edit modal open for an existing task | 1. Clear the title field entirely → click **Save Changes**.<br>2. Enter only spaces → click **Save Changes**. | In both cases, submission is prevented and the user is informed. | Empty title blocked by HTML5 validation. Whitespace-only silently aborted with no user feedback. | Fail |
| `TC-TASK-EDIT-003` | Task Editing | Cancel discards changes | Edit modal open for an existing task | 1. Modify the title.<br>2. Click **Cancel** or click the **X** button. | Modal closes; task retains its original values. | Changes discarded on cancel; original task values preserved. | Pass |

---

## Section 5 — Task Completion & Status

> **Status:** Tested and confirmed working.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-TASK-TOGGLE-001` | Task Status | Mark a pending task as completed | A pending task is visible | 1. Click the circular checkbox next to a pending task. | Task title gains strikethrough styling; checkbox turns green with a checkmark; Dashboard completed count increments. | Status toggled correctly; visual updates and dashboard counts updated. | Pass |
| `TC-TASK-TOGGLE-002` | Task Status | Mark a completed task back to pending | A completed task is visible | 1. Click the green checkmark on a completed task. | Strikethrough styling is removed; checkbox reverts to default; pending count increments. | Status toggled back to pending correctly; counts updated. | Pass |

---

## Section 6 — Task Deletion

> **Status:** Tested and confirmed working.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-TASK-DEL-001` | Task Deletion | Delete a task from the list | At least one task exists | 1. Click the trash icon on a task row. | Task is removed immediately from the list; counts update accordingly. | Task deleted immediately; counts updated. Note: no confirmation dialog shown before deletion. | Pass |

---

## Section 7 — Search & Filters

> **Status:** Tested. Filter tabs work correctly. Issues observed with the search icon overlap and the advanced filter button.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-FILTER-001` | Filtering | Filter by Pending tasks | Mixed task list on `/tasks` | 1. Click **Pending** tab. | Only pending tasks displayed; count badge matches visible rows. | Pending filter works correctly. | Pass |
| `TC-FILTER-002` | Filtering | Filter by Completed tasks | Mixed task list on `/tasks` | 1. Click **Completed** tab. | Only completed tasks displayed; count badge matches visible rows. | Completed filter works correctly. | Pass |
| `TC-FILTER-003` | Filtering | Reset filter to All | A filter is currently active | 1. Click **All** tab. | All tasks displayed regardless of status. | All filter resets correctly. | Pass |
| `TC-SEARCH-001` | Search | Search by task title | Multiple tasks exist | 1. Type a keyword from a task title into the search input. | Matching tasks displayed in real time; non-matching tasks hidden. | Title-based search filters correctly. | Pass |
| `TC-SEARCH-002` | Search | Search by task description | A task with a unique description exists | 1. Type a keyword from a task description into the search input. | Tasks with matching description text are displayed. | Description-based search works correctly. | Pass |
| `TC-SEARCH-003` | Search | Search with no matching results shows empty state | Multiple tasks exist | 1. Type a string that matches no task title or description. | Empty state message displayed: "No tasks found. Try another filter or add a new task." | Empty state displayed correctly. | Pass |
| `TC-SEARCH-004` | Search | Active status filter applies alongside search | Tasks exist in both statuses | 1. Select **Completed** tab.<br>2. Type a keyword that only matches a pending task. | No tasks displayed; active filter excludes non-matching status. | Combined search and filter works correctly. | Pass |
| `TC-SEARCH-005` | Search Controls | Advanced filter button is functional | User is on `/tasks` | 1. Locate the slider/filter icon to the right of the search input.<br>2. Click it. | Filter panel, sort options, or other controls appear. | Clicking the icon produces no response; no functionality is triggered. | Fail |

---

## Section 8 — Admin Features

> **Status:** Blocked. No admin interface is accessible in the current frontend build. The database schema defines an `admin` role, but no admin panel, admin routes, or user management UI exists in the frontend.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-ADMIN-001` | Admin Access | Admin user can view all users and tasks | Admin account available; admin UI implemented | 1. Log in with an admin account.<br>2. Navigate to the admin dashboard. | Admin can view system-wide users, tasks, and statistics. | Admin panel does not exist in the current frontend build. | Blocked |
| `TC-ADMIN-002` | Admin Access | Regular user cannot access admin routes | User account; admin routes implemented | 1. Log in as a regular user.<br>2. Navigate directly to `/admin`. | Access is denied; user is redirected. | No admin route exists; test cannot be performed. | Blocked |

---

## Section 9 — Permissions & Security

> **Status:** Tested (manual functional checks only; no penetration testing or exhaustive security audit was performed).

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-SEC-001` | Route Protection | Unauthenticated user cannot access protected pages | User is logged out | 1. Navigate directly to `/tasks`, `/calendar`, or `/settings`. | Redirected to `/login` without accessing protected content. | Route guard works; redirected to `/login` on all protected routes. | Pass |
| `TC-SEC-002` | Input Handling | HTML and script tags in task title are rendered safely | User is logged in; task modal open | 1. Enter `<script>alert("xss")</script>` as task title.<br>2. Save the task. | Script is rendered as plain text; no alert executes. | Input rendered as escaped text; no script execution. | Pass |

---

## Section 10 — UI & General Usability

> **Status:** Tested. Visual and control issues observed as documented below.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-UI-001` | Header Controls | Notification bell button is functional | User is logged in; header visible | 1. Click the bell icon button in the top header. | A notifications panel, dropdown, or placeholder response appears. | Clicking produces no response; button is non-functional. | Fail |
| `TC-UI-002` | Settings — Appearance | Theme color swatches apply appearance changes | User is on `/settings` | 1. Click each color circle in the Appearance section. | The application theme or accent color updates to reflect the selection. | Clicking the color circles produces no change; swatches are non-interactive. | Fail |
| `TC-UI-003` | Settings — Profile | Display name is shown correctly | User is logged in and on `/settings` | 1. Navigate to `/settings`.<br>2. View the Profile section. | The profile section displays the current user's name. | Display name shown correctly from LocalStorage. | Pass |
| `TC-UI-004` | Navigation | All sidebar navigation links load the correct pages | User is logged in | 1. Click **Dashboard**, **My Tasks**, **Calendar**, and **Settings** in the sidebar. | Each link loads the corresponding page; active link is visually highlighted. | All navigation links work; active state highlighted correctly. | Pass |

---

## Section 11 — Edge Cases & Persistence

> **Status:** Partially tested.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-EDGE-001` | Input Handling | Special characters and emojis in task title | Task modal open | 1. Enter `& < > " ' 🚀 !@#$%^*()` as task title.<br>2. Save the task. | Title saves and renders correctly without layout breakage. | Task saved and rendered correctly; no UI breakage. | Pass |
| `TC-EDGE-002` | Input Handling | Very long title and description | Task modal open | 1. Enter a title of 300+ characters.<br>2. Enter a long paragraph as description.<br>3. Save the task. | Task saves; long text is truncated visually in the task row without breaking layout. | | Not Run |
| `TC-EDGE-003` | Persistence | Task data persists after page refresh | User has created or edited tasks | 1. Create or edit a task.<br>2. Refresh the browser (`F5`). | All tasks and their states are preserved after reload. | Task data persisted correctly after refresh. | Pass |
| `TC-EDGE-004` | Persistence | Session persists in a second browser tab | User is logged in on one tab | 1. Open a second browser tab and navigate to `/tasks`. | Session is recognised; tasks are accessible without being redirected to `/login`. | | Not Run |
| `TC-EDGE-005` | Resiliency | Rapid repeated clicks on Add Task submit button | Task modal open with valid input | 1. Click **Add Task** rapidly multiple times. | Only one task is created; duplicates are not added. | | Not Run |

---

## Section 12 — Planned Backend & Integration Tests

> **Status:** Blocked. No backend API server is running. These tests require the backend to be implemented and connected to the frontend before execution.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-INT-AUTH-001` | Backend Auth | Login validated against bcrypt-hashed password in database | Backend and MySQL running with seed data | 1. Submit login with `admin@todoapp.com` / `Password123!`. | Server validates credentials and returns a session token or JWT. | Backend not available. | Blocked |
| `TC-INT-AUTH-002` | Backend Auth | Incorrect password is rejected | Backend and MySQL running | 1. Submit login with `admin@todoapp.com` / `WrongPassword`. | Server returns HTTP 401; no session token issued. | Backend not available. | Blocked |
| `TC-INT-AUTH-003` | Backend Auth | Unregistered email is rejected | Backend and MySQL running | 1. Submit login with `unknown@example.com` / `Password123!`. | Server returns HTTP 401 with an appropriate error message. | Backend not available. | Blocked |
| `TC-RBAC-001` | Authorization | User sees only their own tasks | Backend running; user logged in via API | 1. Fetch the task list via the API as a regular user. | Response includes only tasks owned by the authenticated user. | Backend not available. | Blocked |
| `TC-RBAC-002` | Authorization | User cannot modify another user's task | Backend running; two user accounts available | 1. Send a PUT/DELETE request targeting a task belonging to a different user. | Server returns HTTP 403 Forbidden or HTTP 404 Not Found. | Backend not available. | Blocked |
| `TC-RBAC-003` | Admin | Admin can view all users and tasks | Backend running; admin account available | 1. Log in as admin and access the admin API endpoints. | Admin receives system-wide data for all users and tasks. | Backend not available. | Blocked |
| `TC-DB-001` | DB Integrity | Deleting a user cascades to their tasks | Database initialized | 1. Delete a user record from the `users` table. | All tasks associated with that user are deleted automatically via `ON DELETE CASCADE`. | Database not connected. | Blocked |
| `TC-DB-002` | DB Integrity | Duplicate email is rejected by the database | Database initialized | 1. Insert a new user record with an email already in the `users` table. | Database returns a unique-constraint violation error. | Database not connected. | Blocked |

---

## Sign-Off

| Role | Name | Status | Date |
| :--- | :--- | :--- | :--- |
| QA Tester | | Pending | |
| Lead Developer | | Pending | |
| Project Manager | | Pending | |

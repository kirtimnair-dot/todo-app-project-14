# Test Cases — TaskFlow To-Do Application

**Document Version:** 2.0.0
**Project:** To-Do Web Application (TaskFlow)
**Role:** QA / Testing & Documentation
**Reporter / QA Engineer:** Aayush Ananda Achare
**Date:** 2026-11-21

---

## Status Key

| Status | Meaning |
| :--- | :--- |
| `Pass` | Test executed; behavior matched expected result. |
| `Fail` | Test executed; behavior did not match expected result. |
| `Blocked` | Test could not be executed due to missing access, missing dependency, or prerequisite defect. |
| `Not Run` | Test planned but not executed in this test cycle. |

---

## Application Context

TaskFlow is a collaborative full-stack task management platform built with a **React 19 + TypeScript + Vite** frontend, a **Python Flask** REST API secured with **JWT** and **`bcrypt`**, and a **MySQL** relational database supporting **User / Admin Role-Based Access Control (RBAC)**.

During this post-integration test cycle, manual testing was performed on the integrated frontend application running locally in desktop browsers. The frontend implements an automatic `localStorage` offline fallback mode that preserves client-side state and UI interactions when the Flask backend is not running locally. Backend API and database tests remain formally documented as `Blocked` due to the local environment lacking the configured Python/MySQL runtime.

---

## Section 1 — Authentication & Login

> **Status:** Tested. Registration and login authentication forms execute correctly. Logout and session termination fail due to missing UI controls.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-AUTH-001` | Login | Successful login with valid credentials | User is on `/login`; not logged in | 1. Enter valid email.<br>2. Enter valid password.<br>3. Click **Sign In**. | User is authenticated; redirected to Dashboard (`/dashboard`); session stored. | Redirected to Dashboard; user authenticated successfully. | Pass |
| `TC-AUTH-002` | Login | Empty email field blocked by validation | User is on `/login` | 1. Leave email blank.<br>2. Enter a password.<br>3. Click **Sign In**. | Browser validation blocks submission; user prompted to enter email. | Submission blocked; validation prompt shown. | Pass |
| `TC-AUTH-003` | Login | Invalid email format blocked by validation | User is on `/login` | 1. Enter `notanemail`.<br>2. Enter a password.<br>3. Click **Sign In**. | Browser email validation prevents submission. | Submission blocked; invalid email format indicated. | Pass |
| `TC-AUTH-004` | Login | Password shorter than required characters prevented | User is on `/login` | 1. Enter a valid email.<br>2. Enter fewer than required characters.<br>3. Click **Sign In**. | Validation blocks submission and displays error prompt. | Submission blocked; minimum length requirement enforced. | Pass |
| `TC-AUTH-005` | Login | Password visibility toggle | User is on `/login` | 1. Enter a password.<br>2. Click the eye icon.<br>3. Click the eye icon again. | Password switches between visible plain text and masked characters. | Toggle operates as expected; input type switches between `text` and `password`. | Pass |
| `TC-AUTH-006` | Logout | User can log out and terminate session | User is logged in | 1. Attempt to locate and click logout / sign out option in the visible interface. | Visible logout control allows user to clear session and return to `/login`. | No visible logout button found in interface; session remains active with no logout route (BUG-004). | Fail |
| `TC-AUTH-007` | Route Protection | Unauthenticated user redirected from protected routes | User is not logged in / unauthenticated | 1. Navigate directly to `/dashboard`.<br>2. Navigate directly to `/tasks`.<br>3. Navigate directly to `/calendar`.<br>4. Navigate directly to `/settings`. | Each protected route redirects the user to `/login`. | Unauthenticated access blocked; user redirected to `/login` for all protected routes. | Pass |

---

## Section 2 — Task Creation

> **Status:** Tested. Both modal-based creation and inline Quick Add bar operate as expected.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-TASK-CREATE-001` | Task Creation | Create task with title only via modal | User is logged in; on `/tasks` or Dashboard | 1. Click **+ Add Task**.<br>2. Enter title.<br>3. Click **Add Task**. | Modal closes; task created with Pending status and default Medium priority. | Task created successfully and visible in pending task list. | Pass |
| `TC-TASK-CREATE-002` | Task Creation | Create task with all fields (title, notes, priority, due date, alarm) | Task modal open | 1. Enter title, notes, select High priority, set due date and time.<br>2. Click **Add Task**. | Task created with all metadata saved; badge and due label render accurately. | Task created with priority badge, due date, and reminder parameters. | Pass |
| `TC-TASK-CREATE-003` | Task Creation | Empty title submission is blocked | Task modal open | 1. Leave title blank.<br>2. Click **Add Task**. | Validation prevents submission; task is not created. | Submission blocked; title input indicates required field. | Pass |
| `TC-TASK-CREATE-004` | Task Creation | Whitespace-only title is blocked with error message | Task modal open | 1. Enter only spaces into title field.<br>2. Click **Add Task**. | Submission blocked; visible error message displayed. | Submission blocked; validation feedback provided. | Pass |
| `TC-TASK-CREATE-005` | Task Creation | Priority selector allows toggling all priority levels | Task modal open | 1. Select Low, High, then Medium buttons. | Selected priority highlights; chosen priority is reflected in state. | Buttons highlight correctly and update task draft priority. | Pass |
| `TC-TASK-CREATE-006` | Task Creation | Cancel button closes modal without saving | Task modal open with inputs | 1. Enter draft title.<br>2. Click **Cancel** or backdrop. | Modal closes; no task is added to list. | Modal closed without persisting draft. | Pass |
| `TC-TASK-CREATE-007` | Quick Add | Inline Quick Add bar creates task for today | On `/tasks` page | 1. Type title into Quick Add input.<br>2. Press Enter or click **Add**. | Task is created immediately with today's date and default priority. | Task added instantly to pending list; input field clears. | Pass |

---

## Section 3 — Task Viewing & Dashboard

> **Status:** Tested. Metrics, starter tasks, and calendar rendering pass. Productivity chart displays future completion data incorrectly.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-TASK-VIEW-001` | Task Viewing | Starter tasks populate initial workspace | Fresh session loaded | 1. Log in to workspace.<br>2. Observe task listing. | Starter tasks render with titles, statuses, and priority tags. | Starter tasks render cleanly in task list. | Pass |
| `TC-TASK-VIEW-002` | Dashboard | Metric cards display accurate counts | User has tasks in workspace | 1. View Dashboard.<br>2. Compare Total, Pending, Completed cards with task list. | Metric counts accurately match total, pending, and completed tasks. | Counts calculate correctly and reflect real-time task quantities. | Pass |
| `TC-TASK-VIEW-003` | Dashboard | Recent Tasks card displays latest tasks | User has tasks in workspace | 1. Create multiple tasks.<br>2. View Recent Tasks section on Dashboard. | Tasks appear sorted by creation date with status and title. | Recent tasks list renders latest items accurately. | Pass |
| `TC-TASK-VIEW-004` | Calendar | Calendar view renders tasks on respective due dates | Tasks have assigned due dates | 1. Navigate to `/calendar`.<br>2. Observe current month and upcoming task side-panel. | Tasks appear on correct day cells; month navigation works cleanly. | Tasks render on their assigned due dates without date displacement. | Pass |
| `TC-TASK-VIEW-005` | Productivity Chart | Weekly productivity chart restricts progress to elapsed days | User views Dashboard | 1. Navigate to `/dashboard`.<br>2. Inspect weekly productivity momentum chart for Saturday and Sunday. | Future days should not show completed productivity data before those days occur. | Saturday and Sunday render completed progress percentages ahead of time (BUG-005). | Fail |

---

## Section 4 — Task Editing

> **Status:** Tested. Edit operations, field modifications, and cancellation work reliably.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-TASK-EDIT-001` | Task Editing | Modify task title, priority, notes, and due date | Existing task in list | 1. Click edit (pencil) icon.<br>2. Modify title, priority, and date.<br>3. Click **Save Changes**. | Modal closes; task row updates immediately with modified parameters. | All updated values persist and display correctly. | Pass |
| `TC-TASK-EDIT-002` | Task Editing | Clearing title or entering whitespace blocks saving | Edit modal open | 1. Clear title field completely.<br>2. Click **Save Changes**.<br>3. Enter only spaces and click **Save Changes**. | Validation prevents saving; user receives validation feedback. | Submission blocked; empty/whitespace title cannot be saved. | Pass |
| `TC-TASK-EDIT-003` | Task Editing | Cancel discards pending edits | Edit modal open with edits | 1. Edit task title.<br>2. Click **Cancel** or close icon. | Modal closes; existing task values remain unchanged. | Changes discarded; original task data retained. | Pass |

---

## Section 5 — Task Completion & Status

> **Status:** Tested. Marking tasks as completed and reopening them functions smoothly.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-TASK-TOGGLE-001` | Task Status | Mark pending task as completed | Visible pending task | 1. Click circular checkbox next to pending task. | Checkbox fills; task title receives strikethrough; completed metric increments. | Task marked completed; visual styles and counts updated immediately. | Pass |
| `TC-TASK-TOGGLE-002` | Task Status | Reopen completed task to pending | Visible completed task | 1. Click checkbox of completed task. | Strikethrough removed; task returns to pending status; pending metric increments. | Task reverted to pending; counts update correctly. | Pass |

---

## Section 6 — Task Deletion

> **Status:** Tested and confirmed working.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-TASK-DEL-001` | Task Deletion | Delete individual task from task list | At least one task exists | 1. Click trash icon on a task row. | Task is removed from list; total and pending/completed metrics decrement. | Task deleted instantly; counts updated. | Pass |
| `TC-TASK-DEL-002` | Task Deletion | Clear all completed tasks | Completed tasks exist | 1. Switch to Completed tab on `/tasks`.<br>2. Click **Clear Completed**. | All completed tasks are removed; pending tasks remain untouched. | Completed tasks purged; pending tasks preserved. | Pass |

---

## Section 7 — Search, Filters & Sorting

> **Status:** Tested. Keyword search, tab filters, priority filter dropdown, and sort options function as expected.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-FILTER-001` | Filtering | Filter by Pending tasks | Tasks exist in both statuses | 1. Click **Pending** tab. | Only pending tasks are displayed; count badge matches visible rows. | Pending filter displays only uncompleted tasks. | Pass |
| `TC-FILTER-002` | Filtering | Filter by Completed tasks | Tasks exist in both statuses | 1. Click **Completed** tab. | Only completed tasks are displayed; count badge matches visible rows. | Completed filter displays only completed tasks. | Pass |
| `TC-FILTER-003` | Filtering | Reset status filter to All | Filter is active | 1. Click **All** tab. | All tasks displayed regardless of status. | All tasks displayed; filter reset successful. | Pass |
| `TC-FILTER-004` | Filtering | Filter tasks by priority level | Tasks with diverse priorities | 1. Select **High Priority** in priority filter dropdown. | Only High priority tasks are displayed. | Filter applies accurately across task rows. | Pass |
| `TC-SORT-001` | Sorting | Sort tasks by Due Date, Priority, and Recently Added | Multiple tasks exist | 1. Select **Due Date**.<br>2. Select **Priority**.<br>3. Select **Recently Added**. | Tasks reorder dynamically according to selected sorting criteria. | Sorting reorders task items accurately for each selection. | Pass |
| `TC-SEARCH-001` | Search | Search tasks by title keyword | Multiple tasks exist | 1. Type keyword into search input. | Only tasks whose titles contain keyword are displayed. | Search filters matching task titles in real time. | Pass |
| `TC-SEARCH-002` | Search | Search tasks by notes/description keyword | Task with unique note | 1. Type keyword present in notes. | Matching task displayed. | Description search matches and displays task. | Pass |
| `TC-SEARCH-003` | Search | Non-matching search displays empty state | Multiple tasks exist | 1. Type string matching no task. | Empty state message rendered with clear filters option. | Empty state UI displayed as expected. | Pass |
| `TC-SEARCH-004` | Search | Combined search and status filter | Diverse tasks exist | 1. Select **Pending** tab.<br>2. Search keyword matching completed task. | Task is excluded by active pending filter. | Combined filter criteria applied correctly. | Pass |
| `TC-SEARCH-005` | Search Controls | Advanced filter / sort controls functionality | On `/tasks` page | 1. Verify priority dropdown and sort dropdown controls. | Responsive controls allow selecting priority and sort criteria. | Replaced prior static icon with interactive select dropdowns (BUG-001 resolved). | Pass |

---

## Section 8 — Admin Features & RBAC

> **Status:** Blocked from full verification. Standard session cannot switch accounts to test Admin role due to missing logout / account-switching control. Code inspection confirms Admin routes exist, but live end-to-end testing could not be completed.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-ADMIN-001` | Admin Access | Admin user accesses system overview and user list | Admin account credentials available | 1. Sign in as Admin user (`admin@todoapp.com`).<br>2. Navigate to `/admin`. | Admin dashboard renders system stats, user list, and role management. | Cannot log in as Admin due to lack of account switching/logout (BUG-004); active session remains standard user. Admin UI verification blocked. | Blocked |
| `TC-ADMIN-002` | Admin Security | Non-admin user cannot access `/admin` route | User logged in as standard user | 1. Navigate directly to `/admin` as normal user. | User is denied access and redirected to `/dashboard`. | Route guard redirects non-admin user to `/dashboard` (verified via code inspection in `App.tsx`); live account switching blocked. | Blocked |

---

## Section 9 — Reminders & Alarms

> **Status:** Tested. Alarm audio and overlay trigger accurately at scheduled time. Snooze fails to reschedule.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-ALARM-001` | Alarm Trigger | Alarm triggers when task due time is reached | Task configured with due time | 1. Create task with due time set to current minute.<br>2. Wait for due time. | Alarm dialog displays with audio chime and task details. | Alarm overlay rings and appears with task title, priority, and actions. | Pass |
| `TC-ALARM-002` | Alarm Snooze | Snooze reschedules alarm to sound after 5 minutes | Active alarm ringing | 1. When alarm triggers, click **Snooze 5m**. | Alarm dialog closes; alarm triggers again 5 minutes later. | Alarm dialog dismisses permanently; does not sound again after 5 minutes (BUG-006). | Fail |
| `TC-ALARM-003` | Alarm Dismiss | Dismiss silences and closes active alarm | Active alarm ringing | 1. When alarm triggers, click **Dismiss**. | Alarm silences and dialog closes; task remains pending. | Alarm dialog closes cleanly; task remains pending. | Pass |
| `TC-ALARM-004` | Alarm Complete | Mark Done from alarm dialog completes task | Active alarm ringing | 1. Click **Mark Done** in alarm overlay. | Alarm stops; task status changes to completed. | Alarm stops; task marked completed in task list. | Pass |

---

## Section 10 — UI, Navigation & General Usability

> **Status:** Tested. Header notifications and dark/light mode toggle work. Primary navigation links and profile card exhibit discoverability issues. Theme swatch live retest is blocked due to inaccessible Settings view.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-UI-001` | Header Controls | Notification bell button displays due tasks | Logged in; header visible | 1. Click bell icon button in header. | Notifications dropdown displays upcoming and overdue tasks. | Popover menu opens displaying due and overdue tasks (BUG-002 resolved). | Pass |
| `TC-UI-002` | Settings Navigation | Settings page accessible via in-app UI navigation | User logged in | 1. Attempt to locate Settings navigation item in visible interface. | Accessible link navigates user to `/settings`. | Settings navigation item not found in visible interface layout (BUG-007). | Fail |
| `TC-UI-003` | Profile Display | User profile card visible in application interface | User logged in | 1. Inspect visible interface for user profile information. | User profile card / avatar displays current user details. | Profile card is missing from the primary interface view (BUG-008). | Fail |
| `TC-NAV-001` | Navigation | Direct in-app navigation link back to Dashboard | User on `/tasks` or `/calendar` | 1. Look for visible link/button to return to Dashboard. | Direct navigation link takes user back to Dashboard. | No visible in-app link to Dashboard; requires URL edit or page reload (BUG-009). | Fail |
| `TC-THEME-001` | Theme Toggle | Switch between Light and Dark mode | User logged in | 1. Click theme toggle button. | Interface switches between warm light theme and charcoal dark theme. | Theme switches smoothly; styles applied across application. | Pass |
| `TC-THEME-002` | Appearance | Theme color swatches apply accent color changes | User on `/settings` page | 1. Navigate to `/settings`.<br>2. Click each accent color swatch in Appearance section. | Application accent color updates to match selected swatch. | Cannot access Settings via in-app UI navigation to execute test; code inspection shows `setAccentTheme` implemented, but live UI verification is blocked (BUG-003). | Blocked |

---

## Section 11 — Edge Cases & Persistence

> **Status:** Tested. Client-side resilience and input sanitization operate reliably.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-EDGE-001` | Input Handling | Special characters and emojis in task title | Task modal open | 1. Enter `& < > " ' 🚀 !@#$%^*()` as title.<br>2. Save task. | Title saves and renders safely without layout corruption or XSS execution. | Task saves and renders correctly; characters properly escaped. | Pass |
| `TC-EDGE-002` | Input Handling | HTML/script injection in task fields | Task modal open | 1. Enter `<script>alert("xss")</script>` in title and notes.<br>2. Save task. | Text renders escaped as string; no script executes. | Safely sanitized; no code execution. | Pass |
| `TC-EDGE-003` | Persistence | Task data persists across page reload | Tasks created in session | 1. Refresh browser window (`F5` / `Ctrl+R`). | All tasks, filters, and statuses persist intact. | State preserved via storage; all tasks intact upon reload. | Pass |
| `TC-EDGE-004` | Persistence | Multi-tab session synchronization | User logged in on Tab 1 | 1. Open Tab 2 to same application URL. | Session and tasks remain accessible without re-login. | Session recognized across browser tabs. | Pass |
| `TC-EDGE-005` | Resiliency | Rapid repeated clicks on Add Task submit button | Task modal open with valid input | 1. Click **Add Task** rapidly multiple times. | Only one task is created; duplicates are not added. | Not executed during this test cycle. | Not Run |

---

## Section 12 — Planned Backend & Integration Tests

> **Status:** Blocked. Backend Flask server and MySQL database were not active in the local testing environment. These integration test cases are specified and ready for execution once backend services are running.

| Test Case ID | Feature | Scenario | Preconditions | Steps to Execute | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `TC-INT-AUTH-001` | Backend Auth | Login validated against bcrypt password in database | Flask and MySQL running | 1. Submit `POST /api/auth/login` with `admin@todoapp.com` / `Password123!`. | HTTP 200 with JWT access token and user object. | Backend server offline; test blocked. | Blocked |
| `TC-INT-AUTH-002` | Backend Auth | Incorrect password rejected with HTTP 401 | Flask and MySQL running | 1. Submit `POST /api/auth/login` with wrong password. | HTTP 401 with "Invalid email or password" error. | Backend server offline; test blocked. | Blocked |
| `TC-INT-AUTH-003` | Backend Auth | Unregistered email rejected with HTTP 401 | Flask and MySQL running | 1. Submit `POST /api/auth/login` with unregistered email. | HTTP 401 response with error message. | Backend server offline; test blocked. | Blocked |
| `TC-INT-TASK-001` | Backend Tasks | Fetch authenticated user tasks (`GET /api/tasks`) | Valid JWT token | 1. Send `GET /api/tasks` with `Authorization: Bearer <token>`. | HTTP 200 with JSON array of tasks belonging to user. | Backend server offline; test blocked. | Blocked |
| `TC-INT-TASK-002` | Backend Tasks | Create task via API (`POST /api/tasks`) | Valid JWT token | 1. Send `POST /api/tasks` with title, priority, due date. | HTTP 201 with created task payload and database ID. | Backend server offline; test blocked. | Blocked |
| `TC-INT-TASK-003` | Backend Tasks | Update task via API (`PUT /api/tasks/:id`) | Task exists for user | 1. Send `PUT /api/tasks/:id` with updated status. | HTTP 200 with updated task. | Backend server offline; test blocked. | Blocked |
| `TC-INT-TASK-004` | Backend Tasks | Delete task via API (`DELETE /api/tasks/:id`) | Task exists for user | 1. Send `DELETE /api/tasks/:id`. | HTTP 200 with confirmation message. | Backend server offline; test blocked. | Blocked |
| `TC-RBAC-001` | Authorization | User sees only own tasks (tenant isolation) | Two registered users | 1. Query `GET /api/tasks` as User A.<br>2. Compare with tasks of User B. | User A receives only tasks where `user_id = User A`. | Backend server offline; test blocked. | Blocked |
| `TC-RBAC-002` | Authorization | User cannot modify or delete another user's task | Two registered users | 1. User A sends PUT/DELETE targeting User B's task ID. | HTTP 404 Not Found or HTTP 403 Forbidden. | Backend server offline; test blocked. | Blocked |
| `TC-RBAC-003` | Admin API | Admin can retrieve system stats and manage users | Admin JWT token | 1. Query `GET /api/admin/stats` and `GET /api/admin/users`. | HTTP 200 with system-wide counts and user records. | Backend server offline; test blocked. | Blocked |
| `TC-DB-001` | DB Integrity | Deleting user cascades deletion of associated tasks | MySQL database initialized | 1. Execute `DELETE FROM users WHERE id = X`. | All tasks belonging to user X are removed by `ON DELETE CASCADE`. | MySQL not running locally; test blocked. | Blocked |
| `TC-DB-002` | DB Integrity | Duplicate email registration rejected by database | MySQL database initialized | 1. Insert user with existing email address. | Unique constraint error (MySQL errno 1062) triggered. | MySQL not running locally; test blocked. | Blocked |

---

## Sign-Off

| Role | Name | Status | Date |
| :--- | :--- | :--- | :--- |
| **QA Tester & Documentation** | **Aayush Ananda Achare** | **Completed with outstanding issues** | **2026-11-21** |
| Lead Developer | Namit Yadav | Pending Review | — |
| Database / Release Manager | Kirti Nair | Pending Review | — |

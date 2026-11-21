# Bug Report Documentation — TaskFlow To-Do Application

**Document Version:** 2.0.0
**Project:** To-Do Web Application (TaskFlow)
**Role:** QA / Testing & Documentation
**QA Engineer / Reporter:** Aayush Achare
**Date:** 2026-11-21

---

## 1. Bug Reporting Guidelines

When an issue is identified during test execution:

1. **Reproduce first.** Confirm the defect is consistently reproducible before filing a report.
2. **One issue per ticket.** File separate reports for distinct defects.
3. **Be objective and precise.** Write clear steps, expected behavior, and actual observed behavior.
4. **Attach evidence.** Include screenshots, screen recordings, or browser console output where available.
5. **Set realistic severity and priority.** Refer to the classification definitions below.

---

## 2. Severity Definitions

| Severity | Description |
| :--- | :--- |
| **Critical** | Application crash, unhandled exception blocking core flow, data loss, or significant security vulnerability. |
| **Major** | A core feature is completely broken, inaccessible, or non-functional with no straightforward workaround. |
| **Minor** | A non-core feature fails or malfunctions; a workaround exists or the primary user flow remains operational. |
| **Trivial** | Cosmetic issue, minor visual defect, UI alignment inconsistency, or non-blocking usability flaw. |

---

## 3. Priority Definitions

| Priority | Description |
| :--- | :--- |
| **High** | Must be resolved before release or milestone completion. |
| **Medium** | Should be addressed in the current sprint or stabilization cycle. |
| **Low** | Can be deferred; does not block core task management activities. |

---

## 4. Bug Lifecycle Statuses

| Status | Description |
| :--- | :--- |
| `New` | Reported; awaiting triage or assignment. |
| `Assigned` | Assigned to a developer for investigation. |
| `In Progress` | Fix is actively being developed. |
| `Resolved` | Fix implemented; awaiting QA retest. |
| `Closed` | Retest confirmed the fix. |
| `Reopened` | Defect persists after a previous resolution attempt. |
| `Cannot Verify (Blocked)` | Retest cannot be completed due to environment or navigational dependency. |
| `Cannot Reproduce` | Could not be replicated during investigation. |
| `Won't Fix` | Product decision not to address; or confirmed as intended behavior. |

---

## 5. Master Defect Log

| Bug ID | Title | Module | Severity | Priority | Status | Assigned To | Retest Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | Advanced search/filter button does not respond when clicked | Tasks / Search | Minor | Medium | Closed | Namit Yadav | Pass (Resolved) |
| **BUG-002** | Notification bell button does not respond when clicked | Header / Notifications | Minor | Low | Closed | Namit Yadav | Pass (Resolved) |
| **BUG-003** | Theme color swatches in Settings do not apply any change | Settings / Appearance | Minor | Low | Cannot Verify (Blocked) | Namit Yadav | Blocked (Settings Inaccessible) |
| **BUG-004** | No visible logout option to terminate session or switch accounts | Authentication / Session | Major | High | New | Unassigned | Fail (Reproduced) |
| **BUG-005** | Productivity graph displays completed progress data for future days (Saturday & Sunday) | Dashboard / Analytics | Minor | Medium | New | Unassigned | Fail (Reproduced) |
| **BUG-006** | Alarm "Snooze 5m" permanently dismisses reminder without rescheduling | Alarms / Reminders | Major | High | New | Unassigned | Fail (Reproduced) |
| **BUG-007** | Settings page is not discoverable or accessible via in-app UI navigation | Navigation / Settings | Minor | Medium | New | Unassigned | Fail (Reproduced) |
| **BUG-008** | User profile card is missing from primary application interface | UI / Profile | Trivial | Low | New | Unassigned | Fail (Reproduced) |
| **BUG-009** | No direct in-app navigation link back to Dashboard from other pages | Header / Navigation | Minor | Medium | New | Unassigned | Fail (Reproduced) |

---

## 6. Retested Existing Defects (BUG-001 through BUG-003)

---

### Bug Report: [BUG-001] Advanced search/filter button does not respond when clicked

- **Bug ID:** BUG-001
- **Date Reported:** 2026-11-20
- **Reporter:** Aayush Achare
- **Feature / Module:** Task Management / Search & Filters
- **Environment:** Windows — Desktop Browser (Chrome / Edge)
- **Associated Test Case:** TC-SEARCH-005

#### Preconditions
- User is logged in and on the My Tasks page (`/tasks`).

#### Steps to Reproduce
1. Navigate to `/tasks`.
2. Locate the search bar and filter controls.
3. Observe available controls for priority and sorting.

#### Expected Result
Filter controls should allow users to filter tasks by priority and sort task rows.

#### Actual Result (Initial Test)
Clicking the former slider/filter icon produced no action.

#### Retest Finding (Post-Integration Retest)
**Status: Closed / Resolved.**
The static icon was removed during the frontend overhaul. The `/tasks` toolbar now includes dedicated, fully functional select dropdowns for **Priority Filter** (`All`, `High`, `Medium`, `Low`) and **Sort By** (`Due Date`, `Priority`, `Recently Added`), both of which update the task list in real time.

#### Severity & Priority
- **Severity:** Minor
- **Priority:** Medium

#### Assignment & Resolution Tracking
- **Status:** Closed
- **Assigned Developer:** Namit Yadav
- **Developer Resolution Notes:** Replaced non-functional icon with native responsive `<select>` controls for priority filtering and sorting.
- **Retest Result:** Pass
- **Retest Date:** 2026-11-21
- **Retested By:** Aayush Achare

---

### Bug Report: [BUG-002] Notification bell button does not respond when clicked

- **Bug ID:** BUG-002
- **Date Reported:** 2026-11-20
- **Reporter:** Aayush Achare
- **Feature / Module:** Header / Notifications
- **Environment:** Windows — Desktop Browser
- **Associated Test Case:** TC-UI-001

#### Preconditions
- User is logged in and header is visible.

#### Steps to Reproduce
1. Navigate to any page (`/dashboard`, `/tasks`, `/calendar`).
2. Locate the bell icon button in the top navigation header.
3. Click the bell button.

#### Expected Result
The button should trigger a notifications popover displaying upcoming and overdue tasks.

#### Actual Result (Initial Test)
Clicking the button produced no response.

#### Retest Finding (Post-Integration Retest)
**Status: Closed / Resolved.**
The bell button is now connected to an interactive notifications popover in `AppShell.tsx` that filters pending tasks due on or before today's date, displaying item counts, task titles, due tags, and a "View all tasks" action link.

#### Severity & Priority
- **Severity:** Minor
- **Priority:** Low

#### Assignment & Resolution Tracking
- **Status:** Closed
- **Assigned Developer:** Namit Yadav
- **Developer Resolution Notes:** Implemented stateful `notifOpen` popover with task filtering and click-outside dismissal.
- **Retest Result:** Pass
- **Retest Date:** 2026-11-21
- **Retested By:** Aayush Achare

---

### Bug Report: [BUG-003] Theme color swatches in Settings do not apply any change

- **Bug ID:** BUG-003
- **Date Reported:** 2026-11-20
- **Reporter:** Aayush Achare
- **Feature / Module:** Settings / Appearance
- **Environment:** Windows — Desktop Browser
- **Associated Test Case:** TC-THEME-002

#### Preconditions
- User is logged in and on the Settings page (`/settings`).

#### Steps to Reproduce
1. Attempt to navigate to `/settings`.
2. Locate the Appearance section and click color swatches.

#### Expected Result
Clicking accent color swatches updates the theme palette.

#### Actual Result (Initial Test)
Color circles did not respond to user clicks.

#### Retest Finding (Post-Integration Retest)
**Status: Cannot Verify (Blocked).**
Code review confirms `Settings.tsx` now contains functional swatch handlers (`setAccentTheme`) connected to CSS variables (`--accent-primary`, `--accent-hover`, etc.). However, because the Settings page cannot be accessed via in-app UI navigation in the tested environment (see BUG-007), this fix could not be verified end-to-end through manual UI testing.

#### Severity & Priority
- **Severity:** Minor
- **Priority:** Low

#### Assignment & Resolution Tracking
- **Status:** Cannot Verify (Blocked)
- **Assigned Developer:** Namit Yadav
- **Developer Resolution Notes:** Swatches implemented with `data-accent` attribute in `Settings.tsx`. Retest blocked pending navigation accessibility fix (BUG-007).
- **Retest Result:** Blocked
- **Retest Date:** 2026-11-21
- **Retested By:** Aayush Achare

---

## 7. New Defect Reports (BUG-004 through BUG-009)

---

### Bug Report: [BUG-004] No visible logout option to terminate session or switch accounts

- **Bug ID:** BUG-004
- **Date Reported:** 2026-11-21
- **Reporter:** Aayush Achare
- **Feature / Module:** Authentication & Session Management
- **Environment:** Windows — Desktop Browser (Chrome / Edge)
- **Associated Test Case:** TC-AUTH-006

#### Preconditions
- User is logged into the application with an active session.

#### Steps to Reproduce
1. Log into the application using any credentials.
2. Observe the main application interface, top header, and navigation areas.
3. Attempt to locate a visible "Logout" or "Sign Out" button to end the session or return to the login screen.

#### Expected Result
A clearly visible logout option should be accessible in the application navigation or header, allowing the user to safely terminate their session, clear authentication tokens, and return to `/login`.

#### Actual Result
There is no visible logout option in the header or primary interface. The application automatically retains user authentication in storage, with no discoverable mechanism to log out or switch accounts from the UI.

#### Impact & Severity
- **Severity:** Major — Prevents users from switching accounts, logging out on shared computers, or verifying different user roles.
- **Priority:** High — Must be resolved for secure session lifecycle and multi-user testing.

#### Screenshot / Evidence
- Session persists across page reloads and tab navigation; no sign-out trigger is visible in the primary navigation layout.

#### Assignment & Resolution Tracking
- **Status:** New
- **Assigned Developer:** Unassigned
- **Developer Resolution Notes:** Pending investigation. Recommendation: Provide an explicit Sign Out button in the header or top navigation bar.
- **Retest Result:** Fail (Reproduced)
- **Retest Date:** 2026-11-21
- **Retested By:** Aayush Achare

---

### Bug Report: [BUG-005] Productivity graph displays completed progress data for future days (Saturday & Sunday)

- **Bug ID:** BUG-005
- **Date Reported:** 2026-11-21
- **Reporter:** Aayush Achare
- **Feature / Module:** Dashboard / Productivity Analytics
- **Environment:** Windows — Desktop Browser
- **Associated Test Case:** TC-TASK-VIEW-005

#### Preconditions
- User is logged in and viewing the Dashboard (`/dashboard`).

#### Steps to Reproduce
1. Navigate to `/dashboard`.
2. Locate the "Your Productivity" weekly momentum chart.
3. Observe the daily data points along the X-axis for Saturday and Sunday.

#### Expected Result
Future days of the week should not display completed productivity progress or completion percentages before those days actually occur.

#### Actual Result
The productivity graph plots progress data and displays completion percentages for Saturday and Sunday even though those days are currently in the future. The chart projects completed productivity values prematurely.

#### Impact & Severity
- **Severity:** Minor — Misleading dashboard analytics; core task creation and completion remain unaffected.
- **Priority:** Medium — Should be adjusted to only plot elapsed days or visually distinguish projected vs. actual data.

#### Screenshot / Evidence
- Data points on Saturday and Sunday show positive completion percentages (e.g., 43%, 64%) prior to those calendar dates occurring.

#### Assignment & Resolution Tracking
- **Status:** New
- **Assigned Developer:** Unassigned
- **Developer Resolution Notes:** In `ProductivityChart.tsx`, dynamically compare point days against the current day of the week and clamp future day values to 0 or render them as dashed projected lines.
- **Retest Result:** Fail (Reproduced)
- **Retest Date:** 2026-11-21
- **Retested By:** Aayush Achare

---

### Bug Report: [BUG-006] Alarm "Snooze 5m" permanently dismisses reminder without rescheduling

- **Bug ID:** BUG-006
- **Date Reported:** 2026-11-21
- **Reporter:** Aayush Achare
- **Feature / Module:** Notifications & Reminders / Alarm Overlay
- **Environment:** Windows — Desktop Browser
- **Associated Test Case:** TC-ALARM-002

#### Preconditions
- A task is created with a due time matching the current time, triggering an active alarm.

#### Steps to Reproduce
1. Wait for the alarm to trigger with audio chime and the "Task Alarm Ringing" modal.
2. In the modal, click the **Snooze 5m** button.
3. Observe that the modal closes and audio stops.
4. Wait 5 minutes for the snoozed reminder to trigger again.

#### Expected Result
Clicking "Snooze 5m" should reschedule the alarm due time by +5 minutes, and the alarm should ring again when the snoozed time is reached.

#### Actual Result
The alarm is dismissed permanently. After 5 minutes, no alarm triggers, and no reminder notification appears. The Snooze button effectively functions as a Dismiss action rather than a rescheduling tool.

#### Impact & Severity
- **Severity:** Major — Snooze feature fails its primary purpose of re-alerting the user, potentially causing missed deadlines.
- **Priority:** High — Timed reminders are a key advertised productivity feature.

#### Screenshot / Evidence
- Alarm closes on clicking Snooze; no secondary alarm fires after 5 minutes elapsed.

#### Assignment & Resolution Tracking
- **Status:** New
- **Assigned Developer:** Unassigned
- **Developer Resolution Notes:** Inspect `snoozeAlarm` in `TaskContext.tsx`. Ensure the snoozed task due time updates correctly in storage and that previously fired alarm keys (`loadFiredAlarmKeys`) do not block the newly rescheduled time.
- **Retest Result:** Fail (Reproduced)
- **Retest Date:** 2026-11-21
- **Retested By:** Aayush Achare

---

### Bug Report: [BUG-007] Settings page is not discoverable or accessible via in-app UI navigation

- **Bug ID:** BUG-007
- **Date Reported:** 2026-11-21
- **Reporter:** Aayush Achare
- **Feature / Module:** Navigation / Settings
- **Environment:** Windows — Desktop Browser
- **Associated Test Case:** TC-UI-002

#### Preconditions
- User is logged into the application.

#### Steps to Reproduce
1. Navigate through the primary views of the application.
2. Inspect the visible navigation controls, header, and available menus.
3. Look for a link, icon, or menu item to access Settings.

#### Expected Result
A visible navigation link (e.g., "Settings" in the primary navigation or header) should allow users to open `/settings` to manage preferences, appearance, and profile data.

#### Actual Result
The Settings page cannot be found or accessed from the visible user interface. Users are unaware that `/settings` exists unless they manually enter the route into the browser address bar.

#### Impact & Severity
- **Severity:** Minor — Prevents users from accessing profile preferences, theme swatches, and workspace settings through normal navigation.
- **Priority:** Medium — Usability and discoverability defect.

#### Screenshot / Evidence
- Visible navigation lacks a persistent or accessible Settings button in standard viewport configurations.

#### Assignment & Resolution Tracking
- **Status:** New
- **Assigned Developer:** Unassigned
- **Developer Resolution Notes:** Ensure Settings is exposed as a primary navigation item in the header or persistent navigation bar.
- **Retest Result:** Fail (Reproduced)
- **Retest Date:** 2026-11-21
- **Retested By:** Aayush Achare

---

### Bug Report: [BUG-008] User profile card is missing from primary application interface

- **Bug ID:** BUG-008
- **Date Reported:** 2026-11-21
- **Reporter:** Aayush Achare
- **Feature / Module:** UI / User Profile
- **Environment:** Windows — Desktop Browser
- **Associated Test Case:** TC-UI-003

#### Preconditions
- User is logged into the application.

#### Steps to Reproduce
1. View the main application screens (`/dashboard`, `/tasks`, `/calendar`).
2. Look for a user profile card, user avatar, or user identification section.

#### Expected Result
The user interface should display a profile card or user badge showing the logged-in user's name, email, avatar, or role.

#### Actual Result
The user profile section is missing or hidden from the primary interface, leaving the user without confirmation of who is currently signed in.

#### Impact & Severity
- **Severity:** Trivial — Non-blocking visual/informational defect.
- **Priority:** Low — Does not impair task CRUD operations.

#### Screenshot / Evidence
- Interface displays application brand and navigation, but omits a visible user identity card in the main view.

#### Assignment & Resolution Tracking
- **Status:** New
- **Assigned Developer:** Unassigned
- **Developer Resolution Notes:** Display user avatar, display name, and role badge in the top navigation header.
- **Retest Result:** Fail (Reproduced)
- **Retest Date:** 2026-11-21
- **Retested By:** Aayush Achare

---

### Bug Report: [BUG-009] No direct in-app navigation link back to Dashboard from other pages

- **Bug ID:** BUG-009
- **Date Reported:** 2026-11-21
- **Reporter:** Aayush Achare
- **Feature / Module:** Header / Navigation
- **Environment:** Windows — Desktop Browser
- **Associated Test Case:** TC-NAV-001

#### Preconditions
- User is logged in and has navigated to `/tasks` or `/calendar`.

#### Steps to Reproduce
1. From Dashboard, click into **My Tasks** or **Calendar**.
2. Once on the new page, look for an in-app button or breadcrumb to navigate back to the Dashboard.

#### Expected Result
A visible "Dashboard" or "Home" navigation link should be continuously accessible in the interface header to return to the dashboard overview.

#### Actual Result
There is no visible in-app link to return to the Dashboard. The user is forced to manually edit the browser URL back to `/dashboard` or use browser back/forward buttons.

#### Impact & Severity
- **Severity:** Minor — Degrades navigation convenience and workflow fluidity.
- **Priority:** Medium — Core navigation path between dashboard and task list should be seamless.

#### Screenshot / Evidence
- When viewing `/tasks`, no visible button or link to Dashboard is displayed in the view.

#### Assignment & Resolution Tracking
- **Status:** New
- **Assigned Developer:** Unassigned
- **Developer Resolution Notes:** Add persistent "Dashboard" and "My Tasks" navigation pills/links in the top header.
- **Retest Result:** Fail (Reproduced)
- **Retest Date:** 2026-11-21
- **Retested By:** Aayush Achare

---

## 8. Unconfirmed Observations & QA Testing Limitations

The following items are documented for design, requirement clarification, or testing limitation context:

---

### OBS-001 — Due date input allows selecting dates in the past
- **Observed:** Task modal allows selection of historical dates.
- **Clarification:** May be intentional for logging overdue or back-dated tasks. Requires product owner confirmation.

### OBS-002 — Bulk task actions limited to "Clear Completed"
- **Observed:** No multi-select checkboxes for batch deleting or batch editing tasks.
- **Clarification:** Current scope supports single-task actions plus "Clear Completed". Bulk selection is a potential future enhancement.

### OBS-003 — Admin panel and RBAC features cannot be validated live via UI
- **Observed:** The application UI does not provide an account switcher or visible logout mechanism (BUG-004), preventing the QA engineer from logging into the seeded administrator account (`admin@todoapp.com`) to verify `/admin` functionality live in the browser.
- **Clarification:** Code review of `App.tsx` and `backend/routes/admin_routes.py` confirms that administrative endpoints and role guards are implemented. This is a testing/session access limitation resulting from the missing logout feature, not confirmed evidence of broken backend RBAC logic. Formally recorded as `Blocked` in test cases `TC-ADMIN-001` and `TC-ADMIN-002`.

---

## 9. Confirmed Non-Defect Behaviors

| # | Behavior | Reason |
| :--- | :--- | :--- |
| 1 | Offline `localStorage` Fallback | When the local Flask API is unreachable, the frontend automatically falls back to browser storage. This is an intentional resilience feature to ensure the UI remains usable without a live server. |
| 2 | Password Length Requirement | Registration requires passwords to have a minimum length of 8 characters, enforced consistently across frontend and backend (`backend/routes/auth_routes.py`). |
| 3 | Single-Task Inline Quick Add | The Quick Add bar on `/tasks` creates a single task with today's date and default priority upon pressing Enter; this is designed for rapid entry and operates as intended. |

---

## 10. Reusable Bug Report Template

```markdown
### Bug Report: [BUG-XXX] <Short, descriptive title>

- **Bug ID:** BUG-
- **Date Reported:** YYYY-MM-DD
- **Reporter:** Aayush Achare
- **Feature / Module:**
- **Environment:** OS — Browser & Version
- **Associated Test Case:**

#### Preconditions
-

#### Steps to Reproduce
1.
2.
3.

#### Expected Result


#### Actual Result


#### Severity & Priority
- **Severity:** [Critical | Major | Minor | Trivial]
- **Priority:** [High | Medium | Low]

#### Screenshot / Evidence
- [Attach screenshot, log output, or write "Not recorded"]

#### Assignment & Resolution Tracking
- **Status:** New
- **Assigned Developer:** Unassigned
- **Developer Resolution Notes:** Pending
- **Retest Result:** Not Retested
- **Retest Date:** —
- **Retested By:** —
```

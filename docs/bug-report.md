# Bug Report Documentation — TaskFlow To-Do Application

**Document Version:** 1.2.0
**Project:** To-Do Web Application (TaskFlow)
**Role:** QA / Testing & Documentation
**Date:** 2026-11-20

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
| **Major** | A core feature is completely broken or inaccessible with no workaround. |
| **Minor** | A non-core feature fails or malfunctions; a workaround exists or the core flow is unaffected. |
| **Trivial** | Cosmetic issue, minor visual defect, or spelling error that does not affect functionality. |

---

## 3. Priority Definitions

| Priority | Description |
| :--- | :--- |
| **High** | Must be resolved before the next release or milestone. |
| **Medium** | Should be resolved in the current sprint or cycle. |
| **Low** | Can be deferred; does not block current work. |

---

## 4. Bug Lifecycle Statuses

| Status | Description |
| :--- | :--- |
| `New` | Reported; awaiting triage or assignment. |
| `Assigned` | Assigned to a developer for investigation. |
| `In Progress` | Fix is actively being developed. |
| `Resolved` | Fix implemented; awaiting QA retest. |
| `Closed` | Retest confirmed the fix. |
| `Reopened` | Defect persists after a previous resolution. |
| `Cannot Reproduce` | Could not be replicated during investigation. |
| `Won't Fix` | Product decision not to address; or confirmed as intended behavior. |

---

## 5. Master Defect Log

| Bug ID | Title | Module | Severity | Priority | Status | Assigned To | Retest Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-001** | Advanced search/filter button does not respond when clicked | Task Management / Search | Minor | Medium | New | Unassigned | Not Retested |
| **BUG-002** | Notification bell button does not respond when clicked | Header / Notifications | Minor | Low | New | Unassigned | Not Retested |
| **BUG-003** | Theme color swatches in Settings do not apply any change | Settings / Appearance | Minor | Low | New | Unassigned | Not Retested |

---

## 6. Individual Bug Reports

---

### Bug Report: [BUG-001] Advanced search/filter button does not respond when clicked

- **Bug ID:** BUG-001
- **Date Reported:** 2026-11-20
- **Reporter:** *(Not recorded)*
- **Feature / Module:** Task Management / Search
- **Environment:** Windows — Desktop Browser
- **Associated Test Case:** TC-SEARCH-005

#### Preconditions
- User is logged in and on the My Tasks page (`/tasks`).

#### Steps to Reproduce
1. Navigate to `/tasks`.
2. Locate the slider/filter icon displayed to the right of the search input field.
3. Click the icon.

#### Expected Result
The icon should trigger an action, such as opening advanced filter or sort options.

#### Actual Result
Clicking the icon produces no response. No panel, dropdown, or state change occurs.

#### Severity & Priority
- **Severity:** Minor
- **Priority:** Medium

#### Screenshot / Evidence
- Not recorded. *(Attach screenshot or screen recording if available.)*

#### Assignment & Resolution Tracking
- **Status:** New
- **Assigned Developer:** Unassigned
- **Developer Resolution Notes:** Pending
- **Retest Result:** Not Retested
- **Retest Date:** —
- **Retested By:** —

---

### Bug Report: [BUG-002] Notification bell button does not respond when clicked

- **Bug ID:** BUG-002
- **Date Reported:** 2026-11-20
- **Reporter:** *(Not recorded)*
- **Feature / Module:** Header / Notifications
- **Environment:** Windows — Desktop Browser
- **Associated Test Case:** TC-UI-001

#### Preconditions
- User is logged in. The top application header is visible.

#### Steps to Reproduce
1. Navigate to any page within the application.
2. Locate the bell icon button in the top header, to the right of the search bar.
3. Click the button.

#### Expected Result
The button should open a notifications panel, dropdown, or at minimum display a placeholder indicating notifications are not yet available.

#### Actual Result
Clicking the button produces no response. No visual change or action occurs.

#### Severity & Priority
- **Severity:** Minor
- **Priority:** Low

#### Screenshot / Evidence
- Not recorded. *(Attach screenshot or screen recording if available.)*

#### Assignment & Resolution Tracking
- **Status:** New
- **Assigned Developer:** Unassigned
- **Developer Resolution Notes:** Pending
- **Retest Result:** Not Retested
- **Retest Date:** —
- **Retested By:** —

---

### Bug Report: [BUG-003] Theme color swatches in Settings do not apply any change

- **Bug ID:** BUG-003
- **Date Reported:** 2026-11-20
- **Reporter:** *(Not recorded)*
- **Feature / Module:** Settings / Appearance
- **Environment:** Windows — Desktop Browser
- **Associated Test Case:** TC-UI-002

#### Preconditions
- User is logged in and on the Settings page (`/settings`).

#### Steps to Reproduce
1. Navigate to `/settings`.
2. Scroll to the **Appearance** section.
3. Click each of the four color circles displayed.

#### Expected Result
Selecting a color swatch should update the application's theme or accent color.

#### Actual Result
The color circles do not respond to clicks. No visual change occurs in the application after clicking any swatch.

#### Severity & Priority
- **Severity:** Minor
- **Priority:** Low

#### Screenshot / Evidence
- Not recorded. *(Attach screenshot or screen recording if available.)*

#### Assignment & Resolution Tracking
- **Status:** New
- **Assigned Developer:** Unassigned
- **Developer Resolution Notes:** Pending
- **Retest Result:** Not Retested
- **Retest Date:** —
- **Retested By:** —

---

## 7. Unconfirmed Observations & Requirement Clarifications

The following issues were observed during testing but have not been classified as confirmed bugs. Each item requires further evidence, reproduction steps, or a product/design clarification before it can be promoted to a defect.

---

### OBS-001 — Email icon possibly overlaps input text on the login page

**Observed:** The email field icon may visually overlap with the placeholder or typed text in the email input.
**Needs clarification:** No screenshot was captured. Independent code review indicates sufficient left padding (`pl-11`) is applied to the input. The overlap could not be independently reproduced.
**Why not a confirmed bug:** Insufficient evidence. If a screenshot demonstrates the overlap in a specific browser or resolution, this should be reopened as a confirmed defect.

---

### OBS-002 — Password icon possibly overlaps input text on the login page

**Observed:** The password field icon may overlap with the placeholder or typed text in the password input.
**Needs clarification:** Same as OBS-001. No screenshot captured; not independently reproduced via code review.
**Why not a confirmed bug:** Insufficient evidence.

---

### OBS-003 — Calendar icon possibly overlaps date text in the task modal

**Observed:** The calendar icon inside the due date field may overlap the selected date text.
**Needs clarification:** No screenshot captured. Code review shows `pl-11` applied to the date input. Overlap not independently reproduced.
**Why not a confirmed bug:** Insufficient evidence.

---

### OBS-004 — Search icon possibly overlaps search field placeholder text

**Observed:** The magnifying glass icon in the Tasks page search bar may overlap the placeholder text.
**Needs clarification:** No screenshot captured. The search input is in a flex container where the icon and input are sibling elements, which should prevent overlap. Not independently reproduced.
**Why not a confirmed bug:** Insufficient evidence.

---

### OBS-005 — Dashboard promotional illustration appears cropped

**Observed:** The illustration in the "Stay on Track" card on the Dashboard appeared cropped during testing.
**Needs clarification:** Code review shows `object-contain` is applied to the image, which preserves aspect ratio without cropping. The appearance may differ across screen sizes or browsers.
**Why not a confirmed bug:** Could not be independently reproduced. Attach a screenshot to confirm.

---

### OBS-006 — Bottom-left sidebar profile card does not respond when clicked

**Observed:** Clicking the user profile card at the bottom of the sidebar (showing user name and "Personal workspace") produces no action.
**Needs clarification:** Code review shows the card container (`<div>`) is intentionally non-interactive. The only active control within it is the logout button. This appears to be display-only.
**Why not a confirmed bug:** Behavior appears intentional. No requirement or design specification indicates this area should open a menu. Confirm with the development team if a profile menu is planned.

---

### OBS-007 — Past dates can be selected as task due dates

**Observed:** The due date input does not restrict the user to future dates; past dates can be selected.
**Needs clarification:** No requirement specifying that past dates must be prohibited has been identified. Past dates may be valid for recording overdue tasks or historical entries.
**Why not a confirmed bug:** Requires product confirmation on whether future-only dates are a requirement.

---

### OBS-008 — Display name in Settings cannot be edited

**Observed:** The Profile section in Settings displays the user's name as static text with no edit option.
**Needs clarification:** The application is currently a client-side demo without a user account management backend. It is unclear whether editable profile settings are planned for the demo build or deferred to backend integration.
**Why not a confirmed bug:** The read-only display may be intentional for the current demo scope. Confirm with the team.

---

### OBS-009 — Dashboard layout appears inconsistent in some areas

**Observed:** Some elements on the Dashboard appeared to have inconsistent alignment during manual testing.
**Needs clarification:** No specific element or layout coordinates were recorded. No design specification or Figma reference was available to confirm whether the layout deviates from the intended design.
**Why not a confirmed bug:** Insufficient specifics to classify as a defect. Flagged for UI/UX design review.

---

### OBS-010 — Task priority label not visible on Dashboard task cards

**Observed:** Priority badges visible on the My Tasks page do not appear on the Recent Tasks list in the Dashboard.
**Needs clarification:** The Dashboard's Recent Tasks rows use the same `TaskRow` component as My Tasks. Priority badges are present in the component but may be hidden on small card sizes. It is unclear whether this is an intentional responsive design decision.
**Why not a confirmed bug:** Requires confirmation from the design team on whether priority should be visible on the Dashboard task list.

---

## 8. Confirmed Non-Defect Behaviors

The following behaviors were investigated and confirmed as intentional.

| # | Behavior | Reason |
| :--- | :--- | :--- |
| 1 | Login accepts any email and password | The login page explicitly states: *"Demo app · Any email and password will work."* This is intentional demo behavior, not a defect. |
| 2 | Tasks are stored in browser LocalStorage only | The Settings page explicitly states: *"This demo stores task data in this browser using LocalStorage."* This is documented, intentional behavior. |
| 3 | Admin section is inaccessible | No admin UI exists in the current frontend build. Admin functionality is planned but not yet implemented. |

---

## 9. Reusable Bug Report Template

> Copy this template for each new defect discovered during testing.

```markdown
### Bug Report: [BUG-XXX] <Short, descriptive title>

- **Bug ID:** BUG-
- **Date Reported:** YYYY-MM-DD
- **Reporter:**
- **Feature / Module:**
- **Environment:** OS — Browser & Version
- **Associated Test Case:** [e.g., TC-SEARCH-005 or Exploratory]

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
- [Attach or write "Not recorded"]

#### Assignment & Resolution Tracking
- **Status:** New
- **Assigned Developer:** Unassigned
- **Developer Resolution Notes:** Pending
- **Retest Result:** Not Retested
- **Retest Date:** —
- **Retested By:** —
```

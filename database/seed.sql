-- =============================================================================
-- Seed Data for To-Do Web Application
-- Database: todo_app
-- Purpose: Provides realistic mock data for local testing of User & Admin
--          dashboards (accounts, roles, statuses, priorities, due dates).
-- Note: Default sample password for all seeded accounts is: Password123!
--       The hash below is a valid bcrypt ($2b$12$) hash for 'Password123!'
-- =============================================================================

USE todo_app;

-- -----------------------------------------------------------------------------
-- 1. Seed Users (1 Admin, 2 Regular Users)
-- -----------------------------------------------------------------------------
INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES
(
    1,
    'Admin User',
    'admin@todoapp.com',
    '$2b$12$Eu0fj1Zog2ZY2j.ddUmuGeaj/sxB.nAbvMUVAMxzlKx0bAMWmffF2',
    'admin',
    NOW() - INTERVAL 30 DAY
),
(
    2,
    'Jane Doe',
    'jane.doe@example.com',
    '$2b$12$Eu0fj1Zog2ZY2j.ddUmuGeaj/sxB.nAbvMUVAMxzlKx0bAMWmffF2',
    'user',
    NOW() - INTERVAL 14 DAY
),
(
    3,
    'John Smith',
    'john.smith@example.com',
    '$2b$12$Eu0fj1Zog2ZY2j.ddUmuGeaj/sxB.nAbvMUVAMxzlKx0bAMWmffF2',
    'user',
    NOW() - INTERVAL 7 DAY
)
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    role = VALUES(role);

-- -----------------------------------------------------------------------------
-- 2. Seed Tasks (Spanning Pending & Completed, Low/Med/High Priorities)
-- -----------------------------------------------------------------------------
INSERT INTO tasks (id, user_id, title, description, status, priority, due_date, created_at) VALUES
-- Admin Tasks (user_id = 1)
(
    1,
    1,
    'Audit system user roles and permissions',
    'Review RBAC policies and verify route guards for all administrative endpoints.',
    'pending',
    'high',
    CURDATE() + INTERVAL 5 DAY,
    NOW() - INTERVAL 3 DAY
),
(
    2,
    1,
    'Configure automated database backup schedule',
    'Ensure nightly mysqldump snapshots are archived and encrypted in cloud storage.',
    'completed',
    'medium',
    CURDATE() - INTERVAL 2 DAY,
    NOW() - INTERVAL 10 DAY
),

-- Jane Doe's Tasks (user_id = 2)
(
    3,
    2,
    'Design landing page mockup',
    'Create responsive wireframes and high-fidelity mockups in Figma for desktop and mobile.',
    'pending',
    'high',
    CURDATE() + INTERVAL 2 DAY,
    NOW() - INTERVAL 2 DAY
),
(
    4,
    2,
    'Set up CI/CD pipeline automation',
    'Configure GitHub Actions workflow for linting, unit test execution, and preview deployments.',
    'pending',
    'medium',
    CURDATE() + INTERVAL 7 DAY,
    NOW() - INTERVAL 1 DAY
),
(
    5,
    2,
    'Research dark mode UI color palette',
    'Select WCAG 2.1 AA compliant contrast color tokens for high-contrast dark theme.',
    'pending',
    'low',
    CURDATE() + INTERVAL 14 DAY,
    NOW() - INTERVAL 4 DAY
),
(
    6,
    2,
    'Conduct sprint kickoff meeting',
    'Align engineering and product stakeholders on Sprint 1 roadmap and deliverable milestones.',
    'completed',
    'high',
    CURDATE() - INTERVAL 3 DAY,
    NOW() - INTERVAL 5 DAY
),
(
    7,
    2,
    'Draft functional user stories',
    'Document acceptance criteria and task workflows in Jira backlog.',
    'completed',
    'medium',
    CURDATE() - INTERVAL 6 DAY,
    NOW() - INTERVAL 8 DAY
),

-- John Smith's Tasks (user_id = 3)
(
    8,
    3,
    'Implement JWT authentication flow',
    'Develop register, login, and token refresh endpoints with HTTP-only secure cookie support.',
    'pending',
    'high',
    CURDATE() + INTERVAL 1 DAY,
    NOW() - INTERVAL 2 DAY
),
(
    9,
    3,
    'Optimize query indexing for task filtering',
    'Verify composite index on (user_id, status) using EXPLAIN ANALYZE on high-volume datasets.',
    'pending',
    'medium',
    CURDATE() + INTERVAL 6 DAY,
    NOW() - INTERVAL 1 DAY
),
(
    10,
    3,
    'Update API OpenAPI/Swagger documentation',
    'Write endpoint specifications and request/response schema samples for frontend integration.',
    'pending',
    'low',
    CURDATE() + INTERVAL 12 DAY,
    NOW() - INTERVAL 3 DAY
),
(
    11,
    3,
    'Configure MySQL connection pool in backend',
    'Tune maxConnections, idleTimeout, and connection retry limits for the server runtime.',
    'completed',
    'high',
    CURDATE() - INTERVAL 1 DAY,
    NOW() - INTERVAL 4 DAY
),
(
    12,
    3,
    'Peer code review for pull request #14',
    'Review task filtering UI components and TypeScript interface definitions.',
    'completed',
    'low',
    CURDATE() - INTERVAL 4 DAY,
    NOW() - INTERVAL 6 DAY
)
ON DUPLICATE KEY UPDATE 
    title = VALUES(title),
    status = VALUES(status),
    priority = VALUES(priority);

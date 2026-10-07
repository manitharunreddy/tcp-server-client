# TCP Server Project - Copilot Instructions

## Project Structure

This repository contains two applications:

- `client/` → Frontend application
- `server/` → Backend application

Documentation is separated between frontend and backend.

---

# Frontend Documentation Rules

When creating or modifying code inside `client/`, check whether documentation needs to be updated.

Frontend documentation is located in:

`docs/frontend/`

Use these files:

### `docs/frontend/README.md`

Document:

- Frontend purpose
- How to install and run the frontend
- Important commands
- Environment/configuration requirements
- Important usage information

### `docs/frontend/ARCHITECTURE.md`

Document:

- Frontend architecture
- Application flow
- Data flow
- API communication
- Important modules
- Important design decisions

### `docs/frontend/COMPONENTS.md`

Document:

- Important components
- Component responsibilities
- Component relationships
- Important props
- Important component behavior

When frontend functionality changes, update the appropriate frontend documentation.

---

# Backend Documentation Rules

When creating or modifying code inside `server/`, check whether documentation needs to be updated.

Backend documentation is located in:

`docs/backend/`

Use these files:

### `docs/backend/README.md`

Document:

- Backend purpose
- How to install and run the backend
- Important commands
- Environment variables
- Configuration
- Important setup information

### `docs/backend/ARCHITECTURE.md`

Document:

- Backend architecture
- Server startup flow
- Request/data flow
- Important modules
- Services
- Database communication
- Important business logic

### `docs/backend/API.md`

Document:

- Available APIs/interfaces
- Request format
- Response format
- Parameters
- Validation
- Errors
- Authentication where applicable
- Examples

### `docs/backend/DATABASE.md`

Document:

- Database technology
- Collections/tables
- Schemas
- Fields
- Relationships
- Indexes
- Validation rules
- Important database queries

---

# Automatic Documentation Rules

Whenever code is created or modified:

1. Identify whether the change belongs to `client/` or `server/`.
2. Check the relevant documentation.
3. If the change affects functionality, architecture, API behavior, database structure, configuration, or important business logic, update the appropriate documentation.
4. Keep frontend documentation inside `docs/frontend/`.
5. Keep backend documentation inside `docs/backend/`.
6. Never mix frontend and backend documentation.
7. Documentation must describe the actual implementation.
8. Never invent functionality that does not exist in the code.
9. Do not create unnecessary documentation for trivial changes.
10. Keep documentation concise and developer-friendly.
11. Include examples when they improve understanding.
12. Before completing a coding task, verify that affected documentation is up to date.

---

# Code Change Documentation Mapping

## Frontend

Changes in:

`client/src/`

should normally be evaluated against:

- `docs/frontend/README.md`
- `docs/frontend/ARCHITECTURE.md`
- `docs/frontend/COMPONENTS.md`

## Backend

Changes in:

`server/src/`

should normally be evaluated against:

- `docs/backend/README.md`
- `docs/backend/ARCHITECTURE.md`
- `docs/backend/API.md`
- `docs/backend/DATABASE.md`

## Configuration Changes

If configuration changes, also check the relevant README.

For example:

- `client/package.json` → `docs/frontend/README.md`
- `client/src/config.ts` → `docs/frontend/README.md`
- `server/package.json` → `docs/backend/README.md`
- `server/src/config.ts` → `docs/backend/README.md`

## Database Changes

If database schemas, collections, validation, queries, or database behavior change:

`docs/backend/DATABASE.md`

must be reviewed and updated when necessary.

## API Changes

If an API or communication protocol changes:

`docs/backend/API.md`

must be reviewed and updated.

---

# Final Verification

Before finishing a coding task:

1. Verify the code works.
2. Verify the affected documentation was checked.
3. Update documentation if necessary.
4. Ensure documentation matches the current implementation.

# Mandatory Agent Documentation Workflow

Whenever the user asks you to:

- create a feature
- add functionality
- modify functionality
- fix a bug
- change an API
- change database behavior
- change application architecture
- change configuration
- refactor code
- remove functionality

you MUST perform documentation analysis as part of the same task.

## Required Workflow

Before completing the coding task:

1. Identify all files changed by the implementation.
2. Determine whether each changed file belongs to `client/` or `server/`.
3. Identify which documentation is affected.
4. Update the affected documentation files.
5. Ensure the documentation describes the new implementation.
6. Verify that the documentation does not contain outdated information.
7. Do not finish the task until the affected documentation has been reviewed.

## Frontend Changes

If the task changes `client/`, review and update the relevant files under:

`docs/frontend/`

Possible files:

- `docs/frontend/README.md`
- `docs/frontend/ARCHITECTURE.md`
- `docs/frontend/COMPONENTS.md`

## Backend Changes

If the task changes `server/`, review and update the relevant files under:

`docs/backend/`

Possible files:

- `docs/backend/README.md`
- `docs/backend/ARCHITECTURE.md`
- `docs/backend/API.md`
- `docs/backend/DATABASE.md`

## Important

Documentation updates are part of the implementation task.

Do not wait for the user to separately ask:

"Update the documentation."

When documentation is affected, update it automatically as part of the same Agent task.

Do not modify documentation when the code change is purely cosmetic or does not affect documented behavior.

Never invent information. Documentation must be based on the actual implementation.

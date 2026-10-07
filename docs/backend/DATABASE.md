# Backend Database

## Database technology

The backend uses MySQL through the `mysql2/promise` library.

The database connection configuration is defined in `server/src/config.ts`:

```ts
DB_HOST: "192.168.1.200",
DB_PORT: 3307,
DB_USER: "root",
DB_PASSWORD: "root",
DB_NAME: "tcp-server",
```

## Database initialization

The SQL script in `server/sqlQueries.sql` creates the database and the table used by the server.

```sql
CREATE DATABASE `tcp-server`;

USE `tcp-server`;

CREATE TABLE IF NOT EXISTS received_data (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(256) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Tables

### `received_data`

Stores string payloads received from the TCP client.

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| `id` | `INT` | `AUTO_INCREMENT PRIMARY KEY` | Unique row identifier |
| `value` | `VARCHAR(256)` | `NOT NULL` | String payload |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp when the record was inserted |

## Relationships and indexes

This database currently has no foreign keys or cross-table relationships. The table has its own auto-increment primary key.

## Database usage in application code

The server creates a MySQL pool in `server/src/db.ts` and uses `db.execute()` in `server/src/server.ts` to insert into the `received_data` table.

```ts
await db.execute(
  `
    INSERT INTO received_data (value)
    VALUES (?)
  `,
  [message]
);
```

Each insert stores the raw payload message.

## Query behavior

The current application behavior is intentionally simple and does not read any records back from the database. It only writes a single record per incoming TCP payload.

## Validation and constraints

The schema enforces:

- `value` cannot be null
- `id` is unique and auto-incremented

## Summary

The database layer stores each non-empty incoming payload in the `received_data` table.

# Backend Architecture

## Overview

The backend is a single-process Node.js service built around the `net` module and a MySQL connection pool. It does not expose an HTTP layer; it listens for raw TCP connections and persists the received payloads in a database.

## Main modules

### `server/src/config.ts`

Defines runtime configuration values:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `TCP_PORT`

These values are used by the database pool and the TCP listener.

### `server/src/db.ts`

Creates and exports a MySQL connection pool using `mysql2/promise`:

- host: `config.DB_HOST`
- port: `config.DB_PORT`
- user: `config.DB_USER`
- password: `config.DB_PASSWORD`
- database: `config.DB_NAME`
- connectionLimit: `10`

This pool is the shared database access object used by the server.

### `server/src/server.ts`

This is the application entry point. It:

1. Imports `db` and `config`
3. Defines `testDatabaseConnection()`
4. Creates a TCP server via `net.createServer()`
5. Calls `startServer()` at module load time

## Startup flow

The startup sequence is:

1. `startServer()` is called.
2. `testDatabaseConnection()` executes `db.getConnection()`.
3. If the connection succeeds, the server starts listening on `0.0.0.0` and `config.TCP_PORT`.
4. If the connection fails, the code logs the failure and calls `process.exit(1)`.

The startup logs include:

- `TCP SERVER STARTED`
- TCP port
- MySQL host and port

## TCP connection lifecycle

For every client connection, the server records the remote client information:

```ts
const clientIP = socket.remoteAddress ?? "unknown";
const clientPort = socket.remotePort ?? 0;
```

It then attaches three handlers:

- `socket.on("data", async (data: Buffer) => { ... })`
- `socket.on("close", () => { ... })`
- `socket.on("error", (error) => { ... })`

### Data handler

On incoming socket data, the server:

1. Converts the buffer to a UTF-8 string.
2. Logs the raw received payload.
3. Rejects empty/whitespace input.
4. Inserts the raw payload into `received_data`
5. Writes `OK: Data received\n` to the client.

If insertion fails, the catch block logs the error and writes `ERROR: Database error\n`.

### Close handler

When the client closes the socket, the server logs:

```text
Client disconnected: <clientIP>:<clientPort>
```

### Error handler

Socket-level failures are logged using the remote client IP and the socket error message.

## Data flow

The flow is intentionally simple:

```text
Client socket -> server receives Buffer -> string conversion -> log -> insert into table -> acknowledgment
```

The server inserts the payload into the `received_data` table.

## Database communication

Database access is done through `db.execute()`. The server inserts the message into the `received_data` table:

```sql
INSERT INTO received_data (value)
VALUES (?)
```

The bound value is:

- `message`

This makes the server a direct sink for raw data from TCP clients.

## Error handling

The backend has three primary failure modes:

- startup database connection failure
- query failure during data insertion
- socket-level runtime issues

These are logged to the console. The socket response is limited to either a success acknowledgment or an error message, without a richer protocol or status payload.

## Configuration and environment assumptions

This project uses hard-coded values in `server/src/config.ts`; there is no environment-variable-driven configuration or `.env` loader in the current implementation.

## Summary

The backend architecture is intentionally minimal:

- one TCP server
- one MySQL pool
- one insert operation per incoming message
- one simple acknowledgement string returned to the client

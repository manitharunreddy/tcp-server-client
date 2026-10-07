# Backend README

## Purpose

This backend is a minimal Node.js TCP server that accepts raw socket connections, logs each client connection, stores the received message in a MySQL database, and replies with a simple status message.

The implementation lives in `server/src/` and uses the Node.js `net` module plus `mysql2/promise`.

## Project layout

- `server/src/config.ts` — runtime configuration values for the database and TCP listener
- `server/src/db.ts` — MySQL pool factory
- `server/src/server.ts` — TCP server startup, payload classification, and socket handling
- `server/sqlQueries.sql` — database and table creation script

## Installation and startup

From the `server/` directory:

```bash
npm install
npm run build
npm run start
```

The `dev` script runs the build and then starts the server:

```bash
npm run dev
```

## Configuration

The server configuration is defined in `server/src/config.ts`:

```ts
export const config = {
  DB_HOST: "192.168.1.200",
  DB_PORT: 3307,
  DB_USER: "root",
  DB_PASSWORD: "root",
  DB_NAME: "tcp-server",
  TCP_PORT: 5005,
};
```

This configures:

- MySQL host and port
- MySQL user and password
- Database name
- TCP listener port

## Server startup flow

`server/src/server.ts` starts with `startServer()`. That function calls `testDatabaseConnection()`, then starts listening on `config.TCP_PORT` on `0.0.0.0`.

The server logs startup information including:

- TCP port
- MySQL host and port

If the database connection fails, the process exits with code 1.

## TCP behavior

The server creates a TCP listener with `net.createServer((socket) => { ... })`.

For each new client connection, it records:

- `socket.remoteAddress`
- `socket.remotePort`

When a client sends data, the server:

1. Converts the incoming buffer to UTF-8 text.
2. Logs the raw message.
3. Rejects blank or whitespace-only input.
4. Classifies the payload as either a JSON object or a plain string.
5. Stores JSON objects in `received_object_data` and plain strings in `received_string_data`.
6. Writes `OK: Data received\n` back to the socket.

If a database error occurs, it writes `ERROR: Database error\n` to the client.

## Database connection

The database is created through a MySQL connection pool in `server/src/db.ts`:

```ts
const db = mysql.createPool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  connectionLimit: 10,
});
```

The pool is exported as the default database connection object used by the server.

## SQL setup

The database schema is defined in `server/sqlQueries.sql`.

It creates the database `tcp-server` and the two storage tables used by the server:

- `received_string_data` — stores plain string payloads
- `received_object_data` — stores JSON-object payloads in the `payload` column

Both tables include:

- `id` as an auto-increment primary key
- `client_ip` as a `VARCHAR(45)`
- `client_port` as an `INT`
- `message` as `LONGTEXT`
- `received_at` as a `TIMESTAMP` defaulting to `CURRENT_TIMESTAMP`

The object table also includes a `payload` column of type `JSON`.

## Message handling and validation

The server checks whether the incoming payload is empty after trimming whitespace. It then classifies the message using `JSON.parse()` and stores it in the matching table:

- parsed JSON object -> `received_object_data`
- plain string or non-object JSON -> `received_string_data`

Only these two tables are written by the server. It does not enforce a strict schema on object properties beyond checking that the parsed JSON value is a non-array object.

## Error handling

The server handles these conditions:

- database connection failure during startup: exits the process
- empty incoming data: logs `Empty data received` and returns without inserting data
- database query failure: logs the error and returns an error response to the client
- socket-level errors: logs the error message from the socket

## Notes

This backend is a low-level TCP service, not an HTTP API. Clients communicate over a raw socket, and the server stores the message payload directly in MySQL without any higher-level request validation layer.

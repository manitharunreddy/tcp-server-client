# TCP Server

Node.js + TypeScript TCP server that receives data from TCP clients and stores it in MySQL.

## Responsibilities

- Listen for TCP connections on port `5000`
- Accept incoming clients
- Receive TCP data
- Capture client IP and port
- Store received data in MySQL
- Send acknowledgement to the client

## Stack

- Node.js
- TypeScript
- `node:net`
- `mysql2`
- esbuild

## Configuration

Create `.env`:

```env
TCP_PORT=5000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tcp-server
```

## Database

```sql
CREATE DATABASE IF NOT EXISTS `tcp-server`;

USE `tcp-server`;

CREATE TABLE IF NOT EXISTS received_data (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(256) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

The bundled server is generated at:

```text
dist/server.js
```

## Start

```bash
npm start
```

The server listens on:

```text
0.0.0.0:5000
```

Clients can connect using:

```text
SERVER_IP:5000
```

## Data Flow

```text
TCP Client
    │
    │ TCP :5000
    ▼
Node.js TCP Server
    │
    │ INSERT
    ▼
MySQL :3306
    └── tcp-server.received_data (strings)
```

## Checking Connections

Windows:

```cmd
netstat -ano | findstr :5000
```

## Checking Database Records

```sql
SELECT * FROM received_data ORDER BY id DESC;
```

## Security

Do not expose MySQL port `3306` directly to TCP clients.

Only the application TCP port should be exposed:

```text
Client → Server:5000 → MySQL:3306
```

For production usage, authentication, message validation, encryption, rate limiting, and proper TCP message framing should be implemented.

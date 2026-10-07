# TCP Server & Client

A simple TCP communication system built with **Node.js, TypeScript, and esbuild**.

The project contains two independent applications:

```text
tcp-server/
├── client/
└── server/
```

## Architecture

```text
┌──────────────────────┐
│       CLIENT         │
│                      │
│ Node.js + TypeScript │
└──────────┬───────────┘
           │
           │ TCP
           │ Port 5000
           ▼
┌──────────────────────┐
│       SERVER         │
│                      │
│ Node.js + TypeScript │
│ TCP Server           │
└──────────┬───────────┘
           │
           │ MySQL
           │ Port 3306
           ▼
┌──────────────────────┐
│        MySQL         │
│      tcp-server      │
└──────────────────────┘
```

## How It Works

1. The server starts a TCP server on port `5000`.
2. The client connects to the server using the server's IP address and port.
3. The client sends data through TCP.
4. The server receives the data.
5. The server stores the received data in MySQL.
6. The server sends an acknowledgement back to the client.

## Technologies

- Node.js
- TypeScript
- TCP
- MySQL
- mysql2
- esbuild

## Project Structure

### Client

```text
client/
├── src/
│   └── client.ts
├── dist/
├── package.json
└── tsconfig.json
```

The client is responsible only for establishing a TCP connection and sending data.

### Server

```text
server/
├── src/
│   ├── server.ts
│   ├── db.ts
│   └── config.ts
├── dist/
├── package.json
├── tsconfig.json
└── .env
```

The server is responsible for:

- Accepting TCP connections
- Receiving TCP data
- Identifying the client IP and port
- Storing received data in MySQL
- Sending an acknowledgement to the client

## Ports

| Service    |   Port |
| ---------- | -----: |
| TCP Server | `5000` |
| MySQL      | `3306` |

The client connects to:

```text
SERVER_IP:5000
```

The server connects internally to:

```text
localhost:3306
```

MySQL port `3306` does not need to be exposed to the client.

## Database

Database:

```text
tcp-server
```

Table:

```text
received_data
```

The server stores plain strings in `received_data`.
The schema is defined in `server/sqlQueries.sql`:

```sql
CREATE TABLE IF NOT EXISTS received_data (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    value VARCHAR(256) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Running the Server

Go to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Configure the `.env` file:

```env
TCP_PORT=5000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=tcp-server
```

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

Expected output:

```text
MySQL connected successfully
--------------------------------
TCP SERVER STARTED
--------------------------------
TCP Port : 5000
MySQL    : 127.0.0.1:3306
--------------------------------
```

## Running the Client

Go to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Update the server IP in the client:

```ts
const SERVER_IP = "192.168.1.100";
const SERVER_PORT = 5000;
```

Replace `192.168.1.100` with the actual IP address of the server machine.

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

Expected output:

```text
Connecting to TCP server...
--------------------------------
CONNECTED TO TCP SERVER
--------------------------------
Server: 192.168.1.100:5000

Data sent:
{"deviceId":"POS001","invoiceNo":"INV1001","amount":500,"status":"SUCCESS"}

Server response:
OK: Data received
```

## Checking Stored Data

Connect to MySQL and run:

```sql
USE `tcp-server`;

SELECT * FROM received_data ORDER BY id DESC;
```

## Network Requirements

If the client and server are on the same LAN:

```text
Client
192.168.1.190
     │
     │ TCP :5000
     ▼
Server
192.168.1.100
```

The server firewall must allow inbound TCP connections on port `5000`.

For different networks, additional network configuration such as port forwarding, VPN, or another secure networking solution may be required.

## Important TCP Concept

TCP is a **byte stream**.

One `socket.write()` from the client does not necessarily correspond to exactly one `socket.on("data")` event on the server.

For production communication, the application should define a message-framing strategy such as:

- Newline-delimited messages
- Length-prefixed messages
- Fixed-size messages
- A custom protocol

The current project is intended as a basic TCP communication and database-storage example.

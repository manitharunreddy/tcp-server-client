# TCP Client

Node.js + TypeScript TCP client used to connect to the TCP server and send data.

## Responsibilities

- Connect to the TCP server
- Send data through TCP
- Receive server acknowledgement
- Close the connection

## Stack

- Node.js
- TypeScript
- `node:net`
- esbuild

## Configuration

Update the server IP in:

```text
src/client.ts
```

Example:

```ts
const SERVER_IP = "192.168.1.100";
const SERVER_PORT = 5000;
```

`SERVER_IP` must be the IP address of the machine running the TCP server.

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

The bundled client is generated at:

```text
dist/client.js
```

## Start

```bash
npm start
```

## Example Data

The client can send JSON:

```json
{
  "deviceId": "POS001",
  "invoiceNo": "INV1001",
  "amount": 500,
  "status": "SUCCESS"
}
```

The data is sent using:

```ts
client.write(data);
```

## Communication Flow

```text
TCP Client
192.168.1.190
     │
     │ TCP
     │
     │ 192.168.1.100:5000
     ▼
TCP Server
     │
     ▼
MySQL
```

## Expected Response

After the server receives and stores the data:

```text
OK: Data received
```

The client prints:

```text
Server response:
OK: Data received
```

## Important

The client does **not** connect directly to MySQL.

It only communicates with the TCP server:

```text
Client
   ↓
TCP :5000
   ↓
Server
   ↓
MySQL :3306
```

This keeps database access on the server side.

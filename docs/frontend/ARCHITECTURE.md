# Frontend Architecture

## Overview

The frontend is a simple Node.js TCP client. It uses the built-in `node:net` module to establish a socket connection to the server and send a single JSON payload.

There is no front-end framework, no browser UI, and no application state management layer in the current implementation.

## Main modules

### `client/src/config.ts`

Stores the remote server endpoint:

```ts
export const config = {
  SERVER_IP: "192.168.1.79",
  SERVER_PORT: 5005,
};
```

This is the only configuration file used by the client.

### `client/src/client.ts`

This is the entry point for the client. It does the following:

1. Creates a `net.Socket`
2. Logs a connection message
3. Calls `client.connect(config.SERVER_PORT, config.SERVER_IP, ...)`
4. Constructs a JSON payload object
5. Serializes the payload with `JSON.stringify()`
6. Sends the result with `client.write(data)`
7. Listens for data from the server
8. Closes the connection after the first response

## Startup flow

The application starts at module load time:

```ts
const client = new net.Socket();
console.log("Connecting to TCP server...");
client.connect(config.SERVER_PORT, config.SERVER_IP, () => {
  // send payload
});
```

The connect callback is the point where the client sends its message.

## Data flow

The current flow is very direct:

```text
config -> socket connect -> JSON object -> stringify -> write to socket -> server response -> log + close
```

### Payload used by the client

```ts
const message = {
  deviceId: "POS001",
  invoiceNo: "INV1001",
  amount: 500,
  status: "SUCCESS",
};
```

This payload is sent as a single JSON string over the TCP connection.

## Server communication

The client communicates with a server at:

- IP: `192.168.1.79`
- Port: `5005`

The server response is read as a `Buffer` and converted to UTF-8 text:

```ts
client.on("data", (data: Buffer) => {
  console.log(data.toString("utf8"));
  client.destroy();
});
```

There is no parsing layer or protocol abstraction; the client simply prints whatever the server sends back.

## Event handling

The client uses the standard Node.js socket events:

- `connect` via the callback passed to `client.connect(...)`
- `data` to read the server response
- `close` to log the connection shutdown
- `error` to log connection failures

## Important behavior

- The client sends one payload and then exits.
- There is no retry mechanism.
- There is no UI or persistent state.
- There is no validation of the server response beyond logging it.

## Summary

The frontend architecture is intentionally minimal and purpose-built for testing a TCP server endpoint. It is a console client rather than an interactive application.

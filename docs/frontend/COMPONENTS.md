# Frontend Components

## Overview

The frontend currently consists of two source files and no UI component tree. This is a small console application rather than a component-based web app.

## `client/src/config.ts`

Purpose:

- holds the server IP and port
- centralizes the connection target

Current contents:

```ts
export const config = {
  SERVER_IP: "192.168.1.79",
  SERVER_PORT: 5005,
};
```

This module is imported by the client entry file.

## `client/src/client.ts`

Purpose:

- create the socket connection
- send one JSON payload
- log server responses
- close the connection after receiving data

### Main responsibilities

- instantiate `net.Socket`
- call `connect()` to the configured TCP server
- create and stringify the payload:

```ts
const message = {
  deviceId: "POS001",
  invoiceNo: "INV1001",
  amount: 500,
  status: "SUCCESS",
};
```

- write the payload to the server with `client.write(data)`
- listen for `data`, `close`, and `error` events

### Behavior

When the server responds, the code prints the raw UTF-8 response and then destroys the client connection.

```ts
client.on("data", (data: Buffer) => {
  console.log("Server response:");
  console.log(data.toString("utf8"));

  client.destroy();
});
```

### Error and shutdown handling

- `error`: logs a socket connection failure message
- `close`: logs that the TCP connection was closed

## Relationship between modules

`client.ts` depends on `config.ts` to determine the server IP and port. There are no additional modules, components, or state objects in the current frontend implementation.

## Important note

There are no React/Vue/Svelte components, no routing, and no UI layer in this repository. The frontend is a single-purpose TCP test client.

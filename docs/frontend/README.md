# Frontend README

## Purpose

This frontend is a minimal Node.js TCP client. It connects to a remote TCP server, sends a JSON message, and logs the server's response before closing the connection.

The implementation is located in `client/src/` and does not use a browser framework or a UI library.

## Project layout

- `client/src/config.ts` — connection settings for the remote TCP server
- `client/src/client.ts` — client startup and socket communication logic

## Installation and startup

From the `client/` directory:

```bash
npm install
npm run build
npm run start
```

The `dev` script runs the build and then starts the client:

```bash
npm run dev
```

## Configuration

The server address is defined in `client/src/config.ts`:

```ts
export const config = {
  SERVER_IP: "192.168.1.79",
  SERVER_PORT: 5005,
};
```

These values are used to connect to the target TCP server.

## Runtime behavior

When the application starts, it creates a `net.Socket` instance and immediately attempts to connect:

```ts
const client = new net.Socket();
client.connect(config.SERVER_PORT, config.SERVER_IP, () => {
  // send payload
});
```

Once connected, it creates a payload object:

```ts
const message = {
  deviceId: "POS001",
  invoiceNo: "INV1001",
  amount: 500,
  status: "SUCCESS",
};
```

The object is serialized to JSON and sent with `client.write(data)`.

## Communication flow

The frontend data flow is:

```text
connect -> send JSON string -> wait for server response -> log response -> close socket
```

When data is received from the server, the client logs it and destroys the socket:

```ts
client.on("data", (data: Buffer) => {
  console.log("Server response:");
  console.log(data.toString("utf8"));

  client.destroy();
});
```

## Error handling

The client listens for socket errors and logs them to the console:

```ts
client.on("error", (error) => {
  console.error("TCP connection error:", error.message);
});
```

It also logs when the connection closes:

```ts
client.on("close", () => {
  console.log("TCP connection closed");
});
```

## Notes

This frontend is intentionally lightweight. It does not include a user interface, request validation, retries, or persistent storage. Its role is to establish a TCP connection, send one JSON payload, and print the server acknowledgement.

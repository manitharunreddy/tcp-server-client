# Backend API

## Overview

This project does not implement an HTTP API. The backend exposes a raw TCP socket service instead of REST or RPC endpoints.

The TCP server listens on the port defined in `server/src/config.ts` and accepts client connections on `0.0.0.0`.

## Transport

- Protocol: TCP
- Listen address: `0.0.0.0`
- Port: `5005`
- Server configuration source: `server/src/config.ts`

## Connection behavior

When a client connects, the server logs:

- client IP address
- client port number

The socket remains open for data events until the client disconnects.

## Request format

The server does not implement a formal request schema or request validation layer. It accepts any non-empty string payload that arrives over the TCP stream.

The client example in `client/src/client.ts` sends a JSON payload shaped like this:

```json
{
  "deviceId": "POS001",
  "invoiceNo": "INV1001",
  "amount": 500,
  "status": "SUCCESS"
}
```

That object is serialized with `JSON.stringify()` and written to the socket:

```ts
const data = JSON.stringify(message);
client.write(data);
```

## Data handling

When the server receives data:

1. It converts the incoming buffer to UTF-8 text.
2. Logs the raw value.
3. Checks `if (!message.trim())` to detect blank input.
4. Classifies the message as a JSON object or a plain string.
5. Stores JSON objects in `received_object_data` and strings in `received_string_data`.

The selected table insert uses:

- `client_ip`
- `client_port`
- `message`
- `payload` additionally for JSON-object rows

## Validation

The current implementation performs only a basic emptiness check:

```ts
if (!message.trim()) {
  console.log("Empty data received");
  return;
}
```

After that, it attempts `JSON.parse()` in order to decide whether the payload belongs in `received_object_data` or `received_string_data`. There is no strict schema validation or field-level validation beyond this type-based routing.

## Response format

On successful insertion, the server sends:

```text
OK: Data received\n
```

On database failure, it sends:

```text
ERROR: Database error\n
```

The response is a plain string, not a JSON object.

## Errors

The server logs and handles the following errors:

- startup database connection failure
- database execution failure
- empty input data
- socket-level errors

No custom error payload is returned beyond the plain-text status strings above.

## Example interaction

A client sends:

```json
{"deviceId":"POS001","invoiceNo":"INV1001","amount":500,"status":"SUCCESS"}
```

The server writes back:

```text
OK: Data received
```

Because the payload is a JSON object, the server stores it in `received_object_data`. A plain string payload is stored in `received_string_data`. Each accepted payload is stored in only one of these two tables.

## Important limitation

This backend does not provide an explicit API contract beyond raw TCP message receipt and storage. There are no route handlers, request headers, HTTP verbs, or response codes defined in the code.

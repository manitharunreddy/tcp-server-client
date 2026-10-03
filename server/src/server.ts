import net from "node:net";
import db from "./db";
import { config } from "./config";

async function testDatabaseConnection(): Promise<void> {
  try {
    const connection = await db.getConnection();

    console.log("MySQL connected successfully");

    connection.release();
  } catch (error) {
    console.error("MySQL connection failed:", error);
    process.exit(1);
  }
}

const server = net.createServer((socket) => {
  const clientIP = socket.remoteAddress ?? "unknown";
  const clientPort = socket.remotePort ?? 0;

  console.log("--------------------------------");
  console.log("Client connected");
  console.log("IP:", clientIP);
  console.log("Port:", clientPort);
  console.log("--------------------------------");

  socket.on("data", async (data: Buffer) => {
    try {
      const message = data.toString("utf8");

      console.log("Received data:");
      console.log(message);

      if (!message.trim()) {
        console.log("Empty data received");
        return;
      }

      const [result] = await db.execute(
        `
          INSERT INTO received_data
          (
            client_ip,
            client_port,
            message
          )
          VALUES (?, ?, ?)
        `,
        [clientIP, clientPort, message]
      );

      console.log("Data saved to MySQL");
      console.log("Insert result:", result);

      socket.write("OK: Data received\n");
    } catch (error) {
      console.error("Database error:", error);

      socket.write("ERROR: Database error\n");
    }
  });

  socket.on("close", () => {
    console.log(`Client disconnected: ${clientIP}:${clientPort}`);
  });

  socket.on("error", (error) => {
    console.error(`Socket error from ${clientIP}:`, error.message);
  });
});

async function startServer(): Promise<void> {
  await testDatabaseConnection();

  server.listen(config.TCP_PORT, "0.0.0.0", () => {
    console.log("--------------------------------");
    console.log("TCP SERVER STARTED");
    console.log("--------------------------------");
    console.log(`TCP Port : ${config.TCP_PORT}`);
    console.log(`MySQL    : ${config.DB_HOST}:${config.DB_PORT}`);
    console.log("--------------------------------");
  });
}

startServer();

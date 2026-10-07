import net from "node:net";
import { config } from "./config";
import { testDatabaseConnection } from "./utils/lib";
import db from "./db";

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

      await db.execute(
        `
          INSERT INTO received_data (value)
          VALUES (?)
        `,
        [message],
      );
      console.log("Data saved to MySQL");

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

const startServer = async (): Promise<void> => {
  await testDatabaseConnection();

  server.listen(config.TCP_PORT, "0.0.0.0", () => {
    console.log("--------------------------------");
    console.log("TCP SERVER STARTED SUCCESSFULLY");
    console.log("--------------------------------");
    console.log(`TCP Port : ${config.TCP_PORT}`);
    console.log(`MySQL    : ${config.DB_HOST}:${config.DB_PORT}`);
    console.log("--------------------------------");
  });
};

startServer();

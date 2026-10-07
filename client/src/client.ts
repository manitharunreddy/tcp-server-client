import net from "node:net";
import { config } from "./config";

const client = new net.Socket();

console.log("Connecting to TCP server...");

client.connect(config.SERVER_PORT, config.SERVER_IP, () => {
  console.log("--------------------------------");
  console.log("CONNECTED TO TCP SERVER");
  console.log("--------------------------------");
  console.log(`Server: ${config.SERVER_IP}:${config.SERVER_PORT}`);

  const message = {
    deviceId: "POS001",
    invoiceNo: "INV1001",
    amount: 500,
    status: "SUCCESS",
  };

  const data = JSON.stringify(message);

  client.write(data);

  console.log(`Data sent: ${JSON.stringify(message, null, 2)}`);
});

client.on("data", (data: Buffer) => {
  console.log("Server response:");
  console.log(data.toString("utf8"));
  client.destroy();
});

client.on("close", () => {
  console.log("TCP connection closed");
});

client.on("error", (error) => {
  console.error("TCP connection error:", error.message);
});

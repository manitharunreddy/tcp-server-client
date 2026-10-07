"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/client.ts
var import_node_net = __toESM(require("node:net"));

// src/config.ts
var config = {
  SERVER_IP: "192.168.1.79",
  SERVER_PORT: 5005
};

// src/client.ts
var client = new import_node_net.default.Socket();
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
    status: "SUCCESS"
  };
  const data = JSON.stringify(message);
  client.write(data);
  console.log(`Data sent: ${JSON.stringify(message, null, 2)}`);
});
client.on("data", (data) => {
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

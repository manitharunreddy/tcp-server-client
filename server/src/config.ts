import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  DB_HOST: process.env.DB_HOST || "192.168.1.200",
  DB_PORT: parseInt(process.env.DB_PORT || "") || 3307,
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "root",
  DB_NAME: process.env.DB_NAME || "tcp-server",
  TCP_PORT: parseInt(process.env.TCP_PORT || "") || 5005,
};

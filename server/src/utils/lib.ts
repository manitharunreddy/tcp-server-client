import db from "../db";


export const testDatabaseConnection = async (): Promise<void> => {
  try {
    const connection = await db.getConnection();

    console.log("MySQL connected successfully");

    connection.release();
  } catch (error) {
    console.error("MySQL connection failed:", error);
    process.exit(1);
  }
};

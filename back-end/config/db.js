import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

// Test the connection
async function connectDB() {
  try {
    await prisma.$connect();
    console.log("Connected to the database with Prisma");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

connectDB();

export default prisma;

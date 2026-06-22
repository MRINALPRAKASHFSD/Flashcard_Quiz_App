import "dotenv/config";
import { PrismaClient } from "@prisma/client";

async function main() {
  try {
    const prisma = new PrismaClient({ adapter: null });
    console.log("Success with adapter: null");
  } catch (e: any) {
    console.log("Failed with adapter: null", e.message);
  }

  try {
    const prisma2 = new PrismaClient({});
    console.log("Success with empty object");
  } catch (e: any) {
    console.log("Failed with empty object", e.message);
  }
}

main();

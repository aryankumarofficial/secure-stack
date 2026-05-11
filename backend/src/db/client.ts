import { PrismaClient } from "../.generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL required for this operation");
}

const pool = new Pool({ connectionString });

const adapter = new PrismaPg(pool);

const client = new PrismaClient({
  adapter,
});

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? client;

if (process.env.NODE_ENV === "development") global.prisma = client;

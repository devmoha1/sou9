import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import os from "os";

function setupDatabase() {
  const isVercel = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME
  );

  const currentUrl = process.env.DATABASE_URL || "";

  console.log(`[Prisma] Setup - isVercel: ${isVercel}, currentUrl: ${currentUrl}`);

  // On Vercel serverless functions, SQLite must live in the writable tmp directory
  if (isVercel && (!currentUrl || currentUrl.startsWith("file:"))) {
    const tmpDbPath = path.join(os.tmpdir(), "dev.db");
    process.env.DATABASE_URL = `file:${tmpDbPath}`;
    console.log(`[Prisma] Using tmp DB path: ${tmpDbPath}`);

    if (!fs.existsSync(tmpDbPath)) {
      const templatePath = path.join(process.cwd(), "prisma", "template.db");
      console.log(`[Prisma] Template DB exists: ${fs.existsSync(templatePath)}`);
      if (fs.existsSync(templatePath)) {
        try {
          const dir = path.dirname(tmpDbPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.copyFileSync(templatePath, tmpDbPath);
          console.log(`[Prisma] Database copied to ${tmpDbPath}`);
        } catch (e) {
          console.error(`[Prisma] Error copying database:`, e);
        }
      }
    }
  }
}

setupDatabase();

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

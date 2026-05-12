import { prisma } from "../../src/db/client";
import { hash } from "../../src/utils/hash";
export const seedAdmin = async () => {
  try {
    console.log("Seeding Admin...");
    console.log("Clearing existing admin user...");
    await prisma.user.deleteMany({
      where: { email: "admin@example.com", role: "ADMIN" },
    });
    console.log("Seeding admin user...");
    const hashedPassword = await hash("Admin@123");
    const admin = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: { password: hashedPassword },
      create: {
        name: "Admin",
        email: "admin@example.com",
        password: hashedPassword,
        isVerified: true,
        isBlocked: false,
        role: "ADMIN",
      },
    });
    console.log(
      `Admin user seeded successfully with email: ${admin.email} and password: Admin@123`,
    );
  } catch (error) {
    console.error(error);
    console.log("Failed to Seed Admin");
  } finally {
    console.log("Seeding Admin completed.");
  }
};

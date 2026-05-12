import { prisma } from "../../src/db/client";
import { hash } from "../../src/utils/hash";
export const seedUsers = async () => {
  try {
    console.log("Seeding users...");
    console.log("Clearing existing users...");
    await prisma.user.deleteMany();
    console.log("Creating new users...");
    const hashedPassword = await hash("Secure@123");
    const result = await prisma.user.createMany({
      data: [
        {
          name: "Test User 1",
          email: "test1@example.com",
          password: hashedPassword,
          role: "USER",
          isVerified: false,
          isBlocked: false,
        },
        {
          name: "Test User 2",
          email: "test2@example.com",
          password: hashedPassword,
          role: "USER",
          isVerified: true,
          isBlocked: false,
        },
        {
          name: "Test User 3",
          email: "test3@example.com",
          password: hashedPassword,
          role: "USER",
          isVerified: false,
          isBlocked: false,
        },
        {
          name: "Test User 4",
          email: "test4@example.com",
          password: hashedPassword,
          role: "USER",
          isVerified: true,
          isBlocked: true,
        },
      ],
      skipDuplicates: true,
    });
    console.log(`Created ${result.count} users`);
    const users = await prisma.user.findMany();
    const Ids = users.map((user) => user.id);
    return Ids;
  } catch (error) {
    console.error(error);
    console.log("Failed to Seed Users");
    return null;
  } finally {
    console.log("Seeding Users completed.");
  }
};

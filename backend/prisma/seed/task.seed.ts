import { prisma } from "../../src/db/client";
export const seedTasks = async (userIds: string[]) => {
  try {
    console.log("Seeding tasks...");
    console.log("Clearing existing tasks...");
    await prisma.task.deleteMany();
    console.log("Creating new tasks...");
    let count = 0;
    for (const userId of userIds) {
      const result = await prisma.task.createMany({
        data: [
          {
            title: `Test Task 1`,
            Description: `Test Task 1`,
            priority: "HIGH",
            userId: userId,
          },
          {
            title: `Test Task 2`,
            Description: `Test Task 2`,
            priority: "MEDIUM",
            userId: userId,
          },
          {
            title: `Test Task 3`,
            Description: `Test Task 3`,
            priority: "LOW",
            userId: userId,
          },
          {
            title: `Test Task 4`,
            Description: `Test Task 4`,
            priority: "HIGH",
            userId: userId,
          },
        ],
        skipDuplicates: true,
      });
      console.log(`Created ${result.count} tasks for user ${userId}`);
      count += result.count;
    }
    console.log(`Created ${count} tasks for ${userIds.length} users`);
  } catch (error) {
    console.error(error);
    console.log("Failed to Seed Tasks");
  } finally {
    console.log("Seeding Tasks completed.");
  }
};

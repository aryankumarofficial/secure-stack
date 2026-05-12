import { prisma } from "../src/db/client.js";
import { seedUsers } from "./seed/user.seed.js";
import { seedTasks } from "./seed/task.seed.js";
import { seedAdmin } from "./seed/admin.seed.js";
async function main() {
  console.log("Starting seed...");

  try {
    console.log("Seeding...");
    const userIds = await seedUsers();
    if (userIds) {
      await seedTasks(userIds);
    }
    await seedAdmin();
    console.log("Seeding completed.");
  } catch (error) {
    console.error("Error seeding:", error);
  } finally {
    console.log("Seed completed.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

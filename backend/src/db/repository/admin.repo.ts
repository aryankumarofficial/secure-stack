import { prisma } from "../client.js";

export async function getDashboardAnalytics() {
  const [
    totalUsers,
    blockedUsers,
    verifiedUsers,

    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,

    totalAdmins,
    activeSessions,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        isBlocked: true,
      },
    }),

    prisma.user.count({
      where: {
        isVerified: true,
      },
    }),

    prisma.task.count(),

    prisma.task.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.task.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.task.count({
      where: {
        status: "IN_PROGRESS",
      },
    }),

    prisma.user.count({
      where: {
        role: "ADMIN",
      },
    }),

    prisma.session.count(),
  ]);

  return {
    users: {
      total: totalUsers,
      blocked: blockedUsers,
      verified: verifiedUsers,
      admins: totalAdmins,
    },

    tasks: {
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      inProgress: inProgressTasks,
    },

    sessions: {
      active: activeSessions,
    },
  };
}
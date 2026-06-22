"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getQuestions() {
  const questions = await prisma.question.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return questions.map(q => ({
    ...q,
    options: JSON.parse(q.options),
  }));
}

export async function getLeaderboard() {
  const leaderboard = await prisma.leaderboardEntry.findMany({
    orderBy: { score: "desc" },
    take: 10,
  });
  return leaderboard;
}

export async function submitScore(name: string, score: number) {
  const entry = await prisma.leaderboardEntry.create({
    data: { name, score },
  });
  return entry;
}

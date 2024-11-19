import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, quizScore, correctAnswers, wrongAnswers, counterInsert } = body;

  try {
    // Fetch the user along with their quizResults
    let existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { quizResults: true },
    });

    // If the user exists
    if (existingUser) {
      // Check if the user already has quiz results
      if (existingUser.quizResults && existingUser.quizResults.length > 0) {
        const userQuizResult = existingUser.quizResults[0];

        // Check if counterInsert is less than or equal to 3
        if (userQuizResult.counterInsert <= 3) {
          const updatedUserStats = await prisma.quizResult.update({
            where: { id: userQuizResult.id },
            data: {
              quizScore: quizScore,
              correctAnswers: correctAnswers,
              wrongAnswers: wrongAnswers,
              counterInsert: userQuizResult.counterInsert + counterInsert,
            },
          });
          return NextResponse.json({ updatedUserStats });
        } else {
          return NextResponse.json("Tidak bisa mengulang 3x");
        }
      } else {
        // If no quiz results exist for this user, create a new one
        const newUser = await prisma.user.update({
          where: { id: userId },
          data: {
            quizResults: {
              create: {
                quizScore: quizScore,
                correctAnswers: correctAnswers,
                wrongAnswers: wrongAnswers,
                counterInsert: 1, // Initialize counterInsert for the first time
                // Don't pass `id` or `createdAt` if they are auto-generated
              },
            },
          },
        });

        return NextResponse.json({ newUser });
      }
    } else {
      return NextResponse.json("User not found");
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json("An error occurred");
  }
}

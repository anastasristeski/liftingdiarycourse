import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { workouts } from "@/db/schema";

export async function createWorkout(
  userId: string,
  name: string,
  date: string
) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, name, date })
    .returning();
  return workout;
}

export async function getWorkoutsByDate(userId: string, date: string) {
  return db.query.workouts.findMany({
    where: and(eq(workouts.userId, userId), eq(workouts.date, date)),
    with: {
      workoutExercises: {
        orderBy: (we, { asc }) => [asc(we.order)],
        with: {
          exercise: true,
          sets: {
            orderBy: (s, { asc }) => [asc(s.order)],
          },
        },
      },
    },
  });
}

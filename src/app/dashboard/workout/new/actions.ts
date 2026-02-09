"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  date: z.string().min(1, "Date is required"),
});

export async function createWorkoutAction(name: string, date: string) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const validated = createWorkoutSchema.parse({ name, date });

  await createWorkout(userId, validated.name, validated.date);

  redirect(`/dashboard?date=${validated.date}`);
}

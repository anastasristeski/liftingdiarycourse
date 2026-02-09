import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { WorkoutForm } from "./workout-form";

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { date } = await searchParams;
  const defaultDate = date ?? format(new Date(), "yyyy-MM-dd");

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h2 className="text-2xl font-bold mb-8">New Workout</h2>
      <WorkoutForm defaultDate={defaultDate} />
    </main>
  );
}

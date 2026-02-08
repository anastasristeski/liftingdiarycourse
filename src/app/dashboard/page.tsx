import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Dumbbell } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getWorkoutsByDate } from "@/data/workouts";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { date } = await searchParams;
  const currentDate = date ?? format(new Date(), "yyyy-MM-dd");

  const workouts = await getWorkoutsByDate(userId, currentDate);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <DatePicker date={currentDate} />
      </div>

      {workouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Dumbbell className="mb-4 size-10 text-muted-foreground" />
          <p className="text-lg font-medium">No workouts logged</p>
          <p className="text-sm text-muted-foreground">
            Get started by logging your first workout for this day.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) =>
            workout.workoutExercises.map((we) => (
              <Card key={we.id}>
                <CardHeader>
                  <CardTitle>{we.exercise.name}</CardTitle>
                  <CardDescription>
                    {we.sets.length} {we.sets.length === 1 ? "set" : "sets"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 text-sm font-medium text-muted-foreground mb-2">
                    <span>Set</span>
                    <span>Weight (kg)</span>
                    <span>Reps</span>
                  </div>
                  {we.sets.map((set, index) => (
                    <div
                      key={set.id}
                      className="grid grid-cols-3 gap-2 text-sm py-1.5 border-t"
                    >
                      <span>{index + 1}</span>
                      <span>{set.weight}</span>
                      <span>{set.reps}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </main>
  );
}

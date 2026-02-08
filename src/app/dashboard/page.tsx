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

const MOCK_WORKOUTS = [
  {
    id: "1",
    name: "Bench Press",
    sets: [
      { reps: 10, weight: 60 },
      { reps: 8, weight: 70 },
      { reps: 6, weight: 80 },
    ],
  },
  {
    id: "2",
    name: "Squat",
    sets: [
      { reps: 8, weight: 100 },
      { reps: 6, weight: 110 },
      { reps: 5, weight: 120 },
    ],
  },
  {
    id: "3",
    name: "Deadlift",
    sets: [
      { reps: 5, weight: 140 },
      { reps: 5, weight: 140 },
      { reps: 3, weight: 160 },
    ],
  },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const currentDate = date ?? format(new Date(), "yyyy-MM-dd");

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <DatePicker date={currentDate} />
      </div>

      {MOCK_WORKOUTS.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Dumbbell className="mb-4 size-10 text-muted-foreground" />
          <p className="text-lg font-medium">No workouts logged</p>
          <p className="text-sm text-muted-foreground">
            Get started by logging your first workout for this day.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {MOCK_WORKOUTS.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle>{workout.name}</CardTitle>
                <CardDescription>
                  {workout.sets.length} {workout.sets.length === 1 ? "set" : "sets"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-sm font-medium text-muted-foreground mb-2">
                  <span>Set</span>
                  <span>Weight (kg)</span>
                  <span>Reps</span>
                </div>
                {workout.sets.map((set, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-2 text-sm py-1.5 border-t"
                  >
                    <span>{index + 1}</span>
                    <span>{set.weight}</span>
                    <span>{set.reps}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

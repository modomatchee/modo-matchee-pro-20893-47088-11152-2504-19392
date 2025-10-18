import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Clock, Flame, Dumbbell, Trophy } from "lucide-react";

const WorkoutSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workoutName, duration, exercisesCompleted, caloriesBurned } = location.state || {
    workoutName: "Your Workout",
    duration: 30,
    exercisesCompleted: 8,
    caloriesBurned: 250
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Workout Complete!</h1>
          <p className="text-xl text-muted-foreground">Great job! You crushed it! 💪</p>
        </div>

        {/* Stats Summary */}
        <Card className="rounded-[20px] p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">{workoutName}</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center p-6 rounded-lg bg-primary/5">
              <Clock className="w-8 h-8 text-primary mb-2" />
              <p className="text-3xl font-bold">{duration}</p>
              <p className="text-sm text-muted-foreground">Minutes</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg bg-orange-500/10">
              <Flame className="w-8 h-8 text-orange-500 mb-2" />
              <p className="text-3xl font-bold">{caloriesBurned}</p>
              <p className="text-sm text-muted-foreground">Calories Burned</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg bg-blue-500/10">
              <Dumbbell className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-3xl font-bold">{exercisesCompleted}</p>
              <p className="text-sm text-muted-foreground">Exercises</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg bg-purple-500/10">
              <Trophy className="w-8 h-8 text-purple-500 mb-2" />
              <p className="text-3xl font-bold">A+</p>
              <p className="text-sm text-muted-foreground">Performance</p>
            </div>
          </div>
        </Card>

        {/* Performance Insights */}
        <Card className="rounded-[20px] p-8 mb-6">
          <h3 className="text-xl font-bold mb-4">Performance Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-muted-foreground">Completed all exercises with proper form</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-muted-foreground">Maintained consistent intensity throughout</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-muted-foreground">Heart rate in optimal training zone</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <p className="text-muted-foreground">Consider increasing rest time between sets</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate("/workouts")}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Back to Workouts
          </Button>
          <Button 
            onClick={() => navigate("/dashboard")}
            size="lg"
            className="flex-1"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSummary;
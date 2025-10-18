import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Clock, Flame, Dumbbell, Trophy, RefreshCcw, Home } from "lucide-react";

const WorkoutSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workoutName, workoutId, duration, exercisesCompleted, caloriesBurned } = location.state || {
    workoutName: "Your Workout",
    workoutId: null,
    duration: 30,
    exercisesCompleted: 8,
    caloriesBurned: 250
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Success Message */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center animate-scale-in">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Workout Complete!</h1>
          <p className="text-xl text-muted-foreground">Great job! You crushed it! 💪</p>
        </div>

        {/* Stats Summary */}
        <Card className="rounded-[20px] p-8 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold mb-6">{workoutName}</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col items-center p-6 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <Clock className="w-8 h-8 text-primary mb-2" />
              <p className="text-3xl font-bold">{duration}</p>
              <p className="text-sm text-muted-foreground">Minutes</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg bg-orange-500/10 hover:bg-orange-500/15 transition-colors animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <Flame className="w-8 h-8 text-orange-500 mb-2" />
              <p className="text-3xl font-bold">{caloriesBurned}</p>
              <p className="text-sm text-muted-foreground">Calories Burned</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg bg-blue-500/10 hover:bg-blue-500/15 transition-colors animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <Dumbbell className="w-8 h-8 text-blue-500 mb-2" />
              <p className="text-3xl font-bold">{exercisesCompleted}</p>
              <p className="text-sm text-muted-foreground">Exercises</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-lg bg-purple-500/10 hover:bg-purple-500/15 transition-colors animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <Trophy className="w-8 h-8 text-purple-500 mb-2" />
              <p className="text-3xl font-bold">A+</p>
              <p className="text-sm text-muted-foreground">Performance</p>
            </div>
          </div>
        </Card>

        {/* Performance Insights */}
        <Card className="rounded-[20px] p-8 mb-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-xl font-bold mb-4">Performance Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-muted-foreground">Completed all exercises with proper form</p>
            </div>
            <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-muted-foreground">Maintained consistent intensity throughout</p>
            </div>
            <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-muted-foreground">Heart rate in optimal training zone</p>
            </div>
            <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '1.0s' }}>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <p className="text-muted-foreground">Consider increasing rest time between sets</p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '1.1s' }}>
          {workoutId && (
            <Button 
              onClick={() => navigate(`/workout-overview/${workoutId}`)}
              variant="outline"
              size="lg"
              className="flex-1 hover:scale-105 transition-transform"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Repeat Workout
            </Button>
          )}
          <Button 
            onClick={() => navigate("/workouts")}
            size="lg"
            className="flex-1 hover:scale-105 transition-transform"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Workout Hub
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSummary;
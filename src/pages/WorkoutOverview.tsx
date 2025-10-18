import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Play, Clock, Dumbbell } from "lucide-react";

interface Exercise {
  name: string;
  category: string;
  duration: string;
  reps?: string;
  sets?: string;
}

interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
}

const WorkoutOverview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, session } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loadingWorkout, setLoadingWorkout] = useState(true);

  useEffect(() => {
    if (session?.user && id) {
      fetchWorkout();
    }
  }, [session, id]);

  const fetchWorkout = async () => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setWorkout({
        id: data.id,
        name: data.name,
        description: data.description,
        exercises: Array.isArray(data.exercises) ? data.exercises as unknown as Exercise[] : []
      });
    } catch (error) {
      console.error('Error fetching workout:', error);
      toast.error('Failed to load workout');
      navigate('/workouts');
    } finally {
      setLoadingWorkout(false);
    }
  };

  const startWorkout = () => {
    navigate(`/workout-player/${id}`);
  };

  if (loading || loadingWorkout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading workout...</p>
      </div>
    );
  }

  if (!workout || workout.exercises.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Workout not found</p>
      </div>
    );
  }

  const totalDuration = workout.exercises.reduce((acc, ex) => {
    const match = ex.duration?.match(/\d+/);
    return acc + (match ? parseInt(match[0]) : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background p-8">
      <Button
        onClick={() => navigate("/workouts")}
        variant="outline"
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Workouts
      </Button>

      <div className="max-w-4xl mx-auto">
        {/* Workout Header */}
        <Card className="rounded-[20px] p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{workout.name}</h1>
              {workout.description && (
                <p className="text-lg text-muted-foreground">{workout.description}</p>
              )}
            </div>
            <Dumbbell className="w-12 h-12 text-primary" />
          </div>

          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="text-lg">~{totalDuration} min</span>
            </div>
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-muted-foreground" />
              <span className="text-lg">{workout.exercises.length} exercises</span>
            </div>
          </div>

          <Button 
            onClick={startWorkout}
            size="lg"
            className="w-full mt-6 text-lg h-14"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Workout
          </Button>
        </Card>

        {/* Exercise List */}
        <Card className="rounded-[20px] p-8">
          <h2 className="text-2xl font-bold mb-6">Exercise List</h2>
          <div className="space-y-4">
            {workout.exercises.map((exercise, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg border-2 border-border hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-lg">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{exercise.name}</h3>
                  <p className="text-sm text-muted-foreground">{exercise.category}</p>
                </div>

                <div className="text-right">
                  {exercise.reps && exercise.sets && (
                    <p className="text-sm font-medium">
                      {exercise.sets} × {exercise.reps}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">{exercise.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutOverview;
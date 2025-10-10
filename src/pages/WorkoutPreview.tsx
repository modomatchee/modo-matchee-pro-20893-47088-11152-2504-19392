import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Play, Clock, Flame, Dumbbell, ArrowLeft } from "lucide-react";

interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises: any[];
}

const WorkoutPreview = () => {
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
        description: data.description || undefined,
        exercises: Array.isArray(data.exercises) ? data.exercises : []
      });
    } catch (error) {
      console.error('Error fetching workout:', error);
      toast.error('Failed to load workout');
      navigate('/workouts');
    } finally {
      setLoadingWorkout(false);
    }
  };

  if (loading || loadingWorkout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading workout...</p>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Workout not found</p>
      </div>
    );
  }

  // Calculate workout metrics
  const totalDuration = workout.exercises.reduce((acc, ex) => {
    const duration = parseInt(ex.duration) || 0;
    return acc + duration;
  }, 0);
  
  const estimatedCalories = Math.round(totalDuration * 5); // Rough estimate: 5 cal/min
  
  // Extract unique equipment needed
  const equipmentSet = new Set<string>();
  workout.exercises.forEach(ex => {
    if (ex.equipment) {
      ex.equipment.split(',').forEach((item: string) => equipmentSet.add(item.trim()));
    }
  });
  const equipment = Array.from(equipmentSet);

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Button
          onClick={() => navigate("/workouts")}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Workouts
        </Button>

        {/* Workout Preview Card */}
        <Card className="rounded-lg p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">{workout.name}</h1>
            {workout.description && (
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {workout.description}
              </p>
            )}
          </div>

          {/* Workout Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 rounded-lg bg-muted">
              <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground mb-1">Duration</p>
              <p className="text-3xl font-bold">{totalDuration} min</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-muted">
              <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="text-sm text-muted-foreground mb-1">Est. Calories</p>
              <p className="text-3xl font-bold">{estimatedCalories}</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-muted">
              <Dumbbell className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-sm text-muted-foreground mb-1">Exercises</p>
              <p className="text-3xl font-bold">{workout.exercises.length}</p>
            </div>
          </div>

          {/* Equipment Needed */}
          {equipment.length > 0 && (
            <div className="mb-8 p-6 rounded-lg bg-accent/10 border border-accent/20">
              <h3 className="text-xl font-bold mb-3">Equipment Needed</h3>
              <div className="flex flex-wrap gap-2">
                {equipment.map((item, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 rounded-full bg-accent/20 text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Exercise List */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Exercises in this Workout</h3>
            <div className="space-y-3">
              {workout.exercises.map((exercise, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-lg font-semibold">{exercise.name}</h4>
                      <p className="text-sm text-muted-foreground">{exercise.category}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {exercise.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Start Workout Button */}
          <Button
            onClick={() => navigate(`/workout-player/${workout.id}`)}
            size="lg"
            className="w-full text-xl py-8 rounded-lg"
          >
            <Play className="w-6 h-6 mr-3" />
            Start Workout
          </Button>
        </Card>

        {/* Helpful Tips */}
        <Card className="rounded-lg p-6 bg-primary/5 border-primary/20">
          <h3 className="text-lg font-bold mb-3">Before You Start</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>✓ Warm up for 5-10 minutes before starting</li>
            <li>✓ Have water nearby to stay hydrated</li>
            <li>✓ Ensure you have enough space to move safely</li>
            <li>✓ Listen to your body and take breaks when needed</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutPreview;

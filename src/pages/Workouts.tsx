import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises: any[];
}

const Workouts = () => {
  const navigate = useNavigate();
  const { loading, session } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchWorkouts();
    }
  }, [session]);

  // Get 3 most recent workouts
  const recentWorkouts = workouts.slice(0, 3);

  const fetchWorkouts = async () => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkouts((data || []).map(w => ({
        id: w.id,
        name: w.name,
        description: w.description || undefined,
        exercises: Array.isArray(w.exercises) ? w.exercises : []
      })));
    } catch (error) {
      console.error('Error fetching workouts:', error);
      toast.error('Failed to load workouts');
    } finally {
      setLoadingWorkouts(false);
    }
  };

  if (loading || loadingWorkouts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold">Workout Hub</h1>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
          >
            ← Back to Dashboard
          </Button>
        </div>

        {/* Recent Workouts Section */}
        {workouts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Recent Workouts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentWorkouts.map((workout) => (
                <div 
                  key={workout.id}
                  onClick={() => navigate(`/workout-preview/${workout.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="rounded-lg bg-card p-6 border border-border hover:border-primary transition-all hover:shadow-lg h-full flex flex-col">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {workout.name}
                    </h3>
                    {workout.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {workout.description}
                      </p>
                    )}
                    <div className="mt-auto">
                      <p className="text-sm font-medium text-muted-foreground">
                        {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Workouts Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">All Workouts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workouts.length === 0 ? (
              <div className="col-span-full">
                <div className="rounded-lg bg-card p-12 border-2 border-dashed border-border text-center">
                  <p className="text-lg text-muted-foreground">
                    No workouts yet. Create your first workout to get started!
                  </p>
                </div>
              </div>
            ) : (
              workouts.map((workout) => (
                <div 
                  key={workout.id}
                  onClick={() => navigate(`/workout-preview/${workout.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="rounded-lg bg-card p-6 border border-border hover:border-primary transition-all hover:shadow-lg h-full flex flex-col">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {workout.name}
                    </h3>
                    {workout.description && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {workout.description}
                      </p>
                    )}
                    <div className="mt-auto">
                      <p className="text-sm font-medium text-muted-foreground">
                        {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Workout Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Workout Summary */}
          <div className="rounded-lg bg-card p-8 border border-border">
            <h2 className="text-3xl font-bold mb-4 text-center">Workout Summary</h2>
            <div className="border-t border-border my-4"></div>
            <div className="flex items-center justify-center min-h-[200px]">
              <p className="text-xl text-center text-muted-foreground max-w-md">
                {workouts.length > 0 
                  ? "Track your progress and view insights about your workout routine"
                  : "Create workouts to see your personalized summary and insights"}
              </p>
            </div>
          </div>

          {/* Create New Workout */}
          <div 
            onClick={() => navigate("/create-workout-library")}
            className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-8 border-2 border-primary/20 hover:border-primary cursor-pointer transition-all hover:shadow-lg group"
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 group-hover:bg-primary/30 flex items-center justify-center mb-4 transition-colors">
                <span className="text-3xl">+</span>
              </div>
              <h2 className="text-3xl font-bold group-hover:text-primary transition-colors">
                Create New Workout
              </h2>
              <p className="text-muted-foreground mt-2">
                Build a custom routine
              </p>
            </div>
          </div>

          {/* Exercise Library */}
          <div 
            onClick={() => navigate("/exercise-videos")}
            className="rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 p-8 border-2 border-accent/20 hover:border-accent cursor-pointer transition-all hover:shadow-lg group lg:col-span-2"
          >
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 group-hover:bg-accent/30 flex items-center justify-center mb-4 transition-colors">
                <span className="text-3xl">📚</span>
              </div>
              <h2 className="text-3xl font-bold group-hover:text-accent transition-colors">
                Exercise Library
              </h2>
              <p className="text-muted-foreground mt-2">
                Browse hundreds of exercises with video guides
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workouts;

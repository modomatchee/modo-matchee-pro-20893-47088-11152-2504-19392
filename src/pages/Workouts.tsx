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
    <div className="min-h-screen bg-[#8f8f8f] relative overflow-hidden">
      <Button
        onClick={() => navigate("/dashboard")}
        variant="outline"
        className="absolute top-4 left-4 z-10"
      >
        ← Back to Dashboard
      </Button>

      {/* Profile Image */}
      <div className="w-[65px] h-[65px] absolute right-0 top-0 bg-gray-300 rounded-full overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500"></div>
      </div>

      {/* My Workouts Section */}
      <div className="w-full max-w-[1480px] h-[252px] absolute left-4 top-[53px] rounded-[20px] bg-white">
        <p className="absolute left-10 top-8 text-base text-black">My Workouts</p>
        
        {/* Horizontal Scrolling Workout Cards */}
        <div className="absolute top-[73px] left-[13px] flex gap-[43px] overflow-x-auto pb-4">
          {workouts.length === 0 ? (
            <div className="flex-shrink-0">
              <div className="w-[150px] h-[150px] rounded-[20px] bg-white border border-black/[0.13] flex items-center justify-center">
                <p className="text-sm text-center text-black/50 px-2">
                  No workouts yet
                </p>
              </div>
            </div>
          ) : (
            workouts.map((workout) => (
              <div key={workout.id} className="flex-shrink-0">
                <div 
                  className="w-[150px] h-[150px] rounded-[20px] bg-white border border-black/[0.13] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => navigate(`/workout/${workout.id}`)}
                >
                  <p className="text-xl font-bold text-center text-black px-2">
                    {workout.name}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Workout Summary Section */}
      <div className="w-[675px] h-[592px] absolute left-6 top-[366px] rounded-[15px] bg-white">
        <p className="w-full h-[71px] flex items-center justify-center text-3xl font-bold text-black">
          Workout Summary
        </p>
        <div className="w-full h-[2px] bg-black"></div>
        <p className="absolute top-[260px] left-1/2 -translate-x-1/2 w-[503px] text-xl font-bold text-center text-black/[0.42]">
          AI Description of User's Workout Routine
        </p>
      </div>

      {/* Create New Workout */}
      <div 
        onClick={() => navigate("/create-workout")}
        className="w-[735px] h-[169px] absolute left-[740px] top-[408px] rounded-[15px] bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <p className="text-3xl font-bold text-center text-black">
          Create New Workout
        </p>
      </div>

      {/* Exercise Videos */}
      <div 
        onClick={() => navigate("/exercise-videos")}
        className="w-[735px] h-[169px] absolute left-[740px] top-[593px] rounded-[15px] bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <p className="text-3xl font-bold text-center text-black">
          Exercise Videos
        </p>
      </div>

      {/* Exercise Details */}
      <div 
        onClick={() => navigate("/exercise-videos")}
        className="w-[735px] h-[169px] absolute left-[740px] top-[778px] rounded-[15px] bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <p className="text-3xl font-bold text-center text-black">
          Exercise Details
        </p>
      </div>
    </div>
  );
};

export default Workouts;

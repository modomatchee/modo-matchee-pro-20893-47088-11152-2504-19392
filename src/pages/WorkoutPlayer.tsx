import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Play, Pause, ArrowLeft, SkipForward, Volume2, VolumeX } from "lucide-react";

interface Workout {
  id: string;
  name: string;
  exercises: any[];
}

const WorkoutPlayer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, session } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loadingWorkout, setLoadingWorkout] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (session?.user && id) {
      fetchWorkout();
    }
  }, [session, id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && workout) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNextExercise();
            return 0;
          }
          return prev + 1;
        });
      }, 300); // Update every 300ms for smooth progress
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentExerciseIndex, workout]);

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

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextExercise = () => {
    if (workout && currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setProgress(0);
      setIsPlaying(false);
    } else {
      // Workout complete
      toast.success('Workout completed! Great job!');
      navigate('/workouts');
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setProgress(0);
      setIsPlaying(false);
    } else {
      navigate(`/workout-preview/${id}`);
    }
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

  const currentExercise = workout.exercises[currentExerciseIndex];
  const nextExercise = workout.exercises[currentExerciseIndex + 1];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Video Area */}
      <div className="relative">
        <div className="w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          {/* Placeholder for video - would be replaced with actual video element */}
          <div className="text-center">
            <Play className="w-24 h-24 mx-auto mb-4 text-white/50" />
            <p className="text-2xl text-white/50">Exercise Video</p>
            <p className="text-sm text-white/30 mt-2">Video player would appear here</p>
          </div>
        </div>

        {/* Back Button Overlay */}
        <Button
          onClick={handlePreviousExercise}
          variant="secondary"
          className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentExerciseIndex === 0 ? 'Back to Preview' : 'Previous'}
        </Button>

        {/* Mute Button Overlay */}
        <Button
          onClick={() => setIsMuted(!isMuted)}
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>
      </div>

      {/* Controls Area */}
      <div className="max-w-6xl mx-auto p-8">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
            </span>
            <span className="text-sm text-gray-400">
              {currentExercise.duration}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Exercise Info */}
        <Card className="bg-gray-900 border-gray-800 p-6 mb-6">
          <h2 className="text-3xl font-bold mb-2">{currentExercise.name}</h2>
          <p className="text-lg text-gray-400 mb-4">{currentExercise.category}</p>
          {currentExercise.instructions && (
            <p className="text-muted-foreground">{currentExercise.instructions}</p>
          )}
        </Card>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <Button
            onClick={handlePreviousExercise}
            variant="outline"
            size="lg"
            disabled={currentExerciseIndex === 0}
            className="bg-gray-900 border-gray-700 hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <Button
            onClick={handlePlayPause}
            size="lg"
            className="w-20 h-20 rounded-full text-xl"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>

          <Button
            onClick={handleNextExercise}
            variant="outline"
            size="lg"
            disabled={currentExerciseIndex === workout.exercises.length - 1}
            className="bg-gray-900 border-gray-700 hover:bg-gray-800"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Next Exercise Preview */}
        {nextExercise && (
          <Card className="bg-gray-900 border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Up Next</p>
                <h3 className="text-xl font-bold">{nextExercise.name}</h3>
                <p className="text-sm text-gray-400">{nextExercise.duration}</p>
              </div>
              <div className="w-32 h-20 rounded-lg bg-gray-800 flex items-center justify-center">
                <Play className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </Card>
        )}

        {/* Workout Complete Message */}
        {currentExerciseIndex === workout.exercises.length - 1 && progress > 80 && (
          <div className="mt-6 text-center">
            <p className="text-lg text-primary font-semibold animate-pulse">
              Almost done! Finish strong! 💪
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlayer;

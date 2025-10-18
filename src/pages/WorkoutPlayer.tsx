import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Play, Pause, ArrowLeft, SkipForward, Volume2, VolumeX, Timer, Coffee } from "lucide-react";

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
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTime, setBreakTime] = useState(30); // 30 second break
  const [workoutStartTime] = useState(Date.now());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (session?.user && id) {
      fetchWorkout();
    }
  }, [session, id]);

  useEffect(() => {
    if (workout && currentExerciseIndex < workout.exercises.length) {
      const currentExercise = workout.exercises[currentExerciseIndex];
      const durationMatch = currentExercise.duration?.match(/\d+/);
      const duration = durationMatch ? parseInt(durationMatch[0]) * 60 : 180; // Default 3 min
      setTotalTime(duration);
      setTimeRemaining(duration);
      setProgress(0);
    }
  }, [currentExerciseIndex, workout]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && workout) {
      if (isOnBreak && breakTime > 0) {
        // Handle break countdown
        interval = setInterval(() => {
          setBreakTime((prev) => {
            const newTime = prev - 1;
            if (newTime <= 0) {
              setIsOnBreak(false);
              setBreakTime(30);
              return 0;
            }
            if ([10, 5, 3, 2, 1].includes(newTime) && !isMuted) {
              playTickSound();
            }
            return newTime;
          });
        }, 1000);
      } else if (!isOnBreak && timeRemaining > 0) {
        // Handle exercise countdown
        interval = setInterval(() => {
          setTimeRemaining((prev) => {
            const newTime = prev - 1;
            if (newTime <= 0) {
              playCompletionSound();
              // Check if this is the last exercise
              if (currentExerciseIndex === workout.exercises.length - 1) {
                handleWorkoutComplete();
              } else {
                // Start break before next exercise
                setIsOnBreak(true);
                setIsPlaying(false);
              }
              return 0;
            }
            
            // Warning sounds at 10, 5, 3, 2, 1 seconds
            if ([10, 5, 3, 2, 1].includes(newTime) && !isMuted) {
              playTickSound();
            }
            
            const newProgress = ((totalTime - newTime) / totalTime) * 100;
            setProgress(newProgress);
            return newTime;
          });
        }, 1000);
      }
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, breakTime, isOnBreak, currentExerciseIndex, workout, totalTime, isMuted]);

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

  const playTickSound = () => {
    if (!isMuted) {
      const tick = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZ');
      tick.volume = 0.3;
      tick.play().catch(() => {});
    }
  };

  const playCompletionSound = () => {
    if (!isMuted) {
      const completion = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZBjiS1/LMeSwFJHfH8N2QQAoUXrTp66hVFAtJouzwrGUZ');
      completion.volume = 0.5;
      completion.play().catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleWorkoutComplete = async () => {
    if (!workout || !session?.user) return;

    try {
      const totalDuration = Math.round((Date.now() - workoutStartTime) / 1000 / 60); // minutes
      const totalCalories = Math.round(workout.exercises.length * 35);

      // Save workout session to database
      const { error } = await supabase.from('workout_sessions').insert({
        user_id: session.user.id,
        workout_id: id,
        workout_name: workout.name,
        date: new Date().toISOString().split('T')[0],
        duration: totalDuration,
        calories_burned: totalCalories,
        sets_completed: workout.exercises.length,
        reps_completed: workout.exercises.length
      });

      if (error) throw error;

      // Navigate to summary
      navigate('/workout-summary', {
        state: {
          workoutName: workout.name,
          workoutId: id,
          duration: totalDuration,
          exercisesCompleted: workout.exercises.length,
          caloriesBurned: totalCalories
        }
      });
    } catch (error) {
      toast.error('Failed to save workout session');
      console.error('Error saving workout session:', error);
    }
  };

  const handleSkipBreak = () => {
    setIsOnBreak(false);
    setBreakTime(30);
    if (workout && currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setProgress(0);
    }
  };

  const handleNextExercise = () => {
    // Only allow skipping if timer has completed
    if (timeRemaining === 0 && !isOnBreak) {
      if (workout && currentExerciseIndex < workout.exercises.length - 1) {
        setIsOnBreak(true);
        setIsPlaying(false);
      } else {
        handleWorkoutComplete();
      }
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setProgress(0);
      setIsPlaying(false);
    } else {
      navigate(`/workout-overview/${id}`);
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

  // Show break screen
  if (isOnBreak) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-800 p-12 text-center max-w-2xl">
          <Coffee className="w-24 h-24 mx-auto mb-6 text-primary animate-pulse" />
          <h2 className="text-4xl font-bold mb-4">Take a Break!</h2>
          <p className="text-xl text-gray-400 mb-8">Rest before your next exercise</p>
          
          <div className="mb-8">
            <p className="text-6xl font-mono font-bold text-primary mb-2">
              {formatTime(breakTime)}
            </p>
            <p className="text-gray-400">Break time remaining</p>
          </div>

          {nextExercise && (
            <div className="mb-8 p-6 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Up Next</p>
              <h3 className="text-2xl font-bold">{nextExercise.name}</h3>
              <p className="text-gray-400 mt-2">{nextExercise.duration}</p>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Button
              onClick={handlePlayPause}
              size="lg"
              variant="outline"
              className="bg-gray-800 border-gray-700 hover:bg-gray-700"
            >
              {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
              {isPlaying ? 'Pause' : 'Resume'}
            </Button>
            <Button
              onClick={handleSkipBreak}
              size="lg"
              className="hover:scale-105 transition-transform"
            >
              Skip Break
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
        {/* Progress Bar & Timer */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
            </span>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary" />
              <span className={`text-2xl font-mono font-bold ${timeRemaining <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-3" />
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
            className="bg-gray-900 border-gray-700 hover:bg-gray-800 hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <Button
            onClick={handlePlayPause}
            size="lg"
            className="w-20 h-20 rounded-full text-xl hover:scale-110 transition-transform"
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
            disabled={timeRemaining > 0}
            className="bg-gray-900 border-gray-700 hover:bg-gray-800 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
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
        {timeRemaining <= 10 && timeRemaining > 0 && (
          <div className="mt-6 text-center animate-fade-in">
            <p className="text-lg text-primary font-semibold animate-pulse">
              {timeRemaining <= 3 ? '🔥 Finish strong! 🔥' : 'Almost done! Keep going! 💪'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlayer;

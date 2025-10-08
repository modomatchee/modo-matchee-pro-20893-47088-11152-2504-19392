import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Play, CheckCircle, Plus } from "lucide-react";
import { EXERCISE_LIST } from "@/lib/exercises";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const WorkoutExerciseDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, session } = useAuth();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [workoutName, setWorkoutName] = useState("");

  const handleAddToWorkout = async () => {
    if (!workoutName.trim()) {
      toast.error("Please enter a workout name");
      return;
    }

    try {
      const { error } = await supabase.from('workouts').insert([{
        name: workoutName,
        exercises: [exerciseData] as any,
        user_id: session?.user?.id,
      }]);

      if (error) throw error;

      toast.success("Workout created successfully!");
      setWorkoutName("");
      setShowSaveDialog(false);
      navigate("/workouts");
    } catch (error) {
      console.error("Error saving workout:", error);
      toast.error("Failed to save workout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const exerciseId = parseInt(id || "1");
  const exerciseData = EXERCISE_LIST.find(ex => ex.id === exerciseId);

  if (!exerciseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Exercise not found</p>
      </div>
    );
  }

  const exercise = {
    ...exerciseData,
    difficulty: "Beginner",
    description:
      "Push-ups are a classic upper body exercise that targets your chest, shoulders, and triceps. They're a fundamental movement pattern that builds strength and stability.",
    musclesWorked: ["Chest", "Shoulders", "Triceps", "Core"],
    equipment: "None (Bodyweight)",
    steps: [
      "Start in a plank position with your hands slightly wider than shoulder-width apart",
      "Keep your body in a straight line from head to heels",
      "Lower your body until your chest nearly touches the floor",
      "Push yourself back up to the starting position",
      "Repeat for the desired number of repetitions",
    ],
    tips: [
      "Keep your core engaged throughout the movement",
      "Don't let your hips sag or pike up",
      "Focus on controlled movements rather than speed",
      "Breathe in as you lower down, breathe out as you push up",
    ],
  };

  return (
    <div className="min-h-screen bg-[#8f8f8f] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">{exercise.name}</h1>
          <Button
            onClick={() => navigate("/create-workout-library")}
            variant="outline"
            className="bg-white"
          >
            ← Back
          </Button>
        </div>

        {/* Video Player */}
        <Card className="bg-white rounded-[20px] p-6 mb-6">
          <div className="w-full aspect-video bg-[#d9d9d9] rounded-[15px] relative overflow-hidden mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-white/90 flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                <Play className="w-12 h-12 text-black ml-2" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Category: {exercise.category}</p>
              <p className="text-sm text-gray-600">Difficulty: {exercise.difficulty}</p>
            </div>
            <p className="text-lg font-bold text-black">{exercise.duration}</p>
          </div>
        </Card>

        {/* Exercise Details */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="bg-white rounded-[20px] p-6">
              <h2 className="text-2xl font-bold text-black mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{exercise.description}</p>
            </Card>

            <Card className="bg-white rounded-[20px] p-6">
              <h2 className="text-2xl font-bold text-black mb-4">Muscles Worked</h2>
              <div className="flex flex-wrap gap-2">
                {exercise.musclesWorked.map((muscle, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-[10px] font-semibold"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="bg-white rounded-[20px] p-6">
              <h2 className="text-2xl font-bold text-black mb-4">Equipment</h2>
              <p className="text-gray-700 text-lg">{exercise.equipment}</p>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="bg-white rounded-[20px] p-6">
              <h2 className="text-2xl font-bold text-black mb-4">How to Perform</h2>
              <ol className="space-y-3">
                {exercise.steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="bg-white rounded-[20px] p-6">
              <h2 className="text-2xl font-bold text-black mb-4">Tips</h2>
              <ul className="space-y-2">
                {exercise.tips.map((tip, index) => (
                  <li key={index} className="flex gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button
            onClick={() => setShowSaveDialog(true)}
            className="py-6 text-xl rounded-[15px]"
          >
            <Plus className="w-6 h-6 mr-2" />
            Add to Workout
          </Button>
          <Button
            onClick={() => navigate("/create-workout-library")}
            variant="outline"
            className="bg-white py-6 text-xl rounded-[15px]"
          >
            Browse More Exercises
          </Button>
        </div>

        {/* Save Workout Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-white rounded-[20px] p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-black mb-4">Create Workout</h2>
              <p className="text-gray-600 mb-4">
                Adding <strong>{exercise.name}</strong> to a new workout
              </p>
              <Input
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="Enter workout name..."
                className="mb-4"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowSaveDialog(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddToWorkout}
                  className="flex-1"
                >
                  Create Workout
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutExerciseDetails;

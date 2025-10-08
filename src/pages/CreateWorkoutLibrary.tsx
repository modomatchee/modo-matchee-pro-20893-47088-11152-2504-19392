import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Search, Play, Plus } from "lucide-react";
import { getExercisesByCategory, ExerciseTemplate } from "@/lib/exercises";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CreateWorkoutLibrary = () => {
  const navigate = useNavigate();
  const { loading, session } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<ExerciseTemplate[]>([]);
  const [workoutName, setWorkoutName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const handleAddExercise = (exercise: ExerciseTemplate) => {
    if (!selectedExercises.find(e => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
      toast.success(`Added ${exercise.name} to workout`);
    } else {
      toast.info(`${exercise.name} is already in your workout`);
    }
  };

  const handleRemoveExercise = (exerciseId: number) => {
    setSelectedExercises(selectedExercises.filter(e => e.id !== exerciseId));
    toast.success("Removed exercise from workout");
  };

  const handleSaveWorkout = async () => {
    if (!workoutName.trim()) {
      toast.error("Please enter a workout name");
      return;
    }

    if (selectedExercises.length === 0) {
      toast.error("Please add at least one exercise");
      return;
    }

    try {
      const { error } = await supabase.from('workouts').insert([{
        name: workoutName,
        exercises: selectedExercises as any,
        user_id: session?.user?.id,
      }]);

      if (error) throw error;

      toast.success("Workout saved successfully!");
      setWorkoutName("");
      setSelectedExercises([]);
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

  const videoCategories = getExercisesByCategory();

  const filteredCategories = videoCategories.map((cat) => ({
    ...cat,
    exercises: cat.exercises.filter((ex) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.exercises.length > 0);

  return (
    <div className="min-h-screen bg-[#8f8f8f] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Create New Workout</h1>
          <div className="flex gap-4">
            {selectedExercises.length > 0 && (
              <Button
                onClick={() => setShowSaveDialog(true)}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Save Workout ({selectedExercises.length})
              </Button>
            )}
            <Button
              onClick={() => navigate("/workouts")}
              variant="outline"
              className="bg-white"
            >
              ← Back
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="bg-white rounded-[20px] p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises..."
              className="pl-12 text-lg rounded-[15px] border-black/20"
            />
          </div>
        </Card>

        {/* Video Categories */}
        <div className="space-y-8">
          {filteredCategories.length === 0 ? (
            <Card className="bg-white rounded-[20px] p-12">
              <p className="text-center text-gray-400 text-xl">
                No exercises found matching "{searchQuery}"
              </p>
            </Card>
          ) : (
            filteredCategories.map((category) => (
              <Card key={category.category} className="bg-white rounded-[20px] p-6">
                <h2 className="text-2xl font-bold text-black mb-6">
                  {category.category}
                </h2>
                <div className="grid grid-cols-4 gap-6">
                  {category.exercises.map((exercise) => (
                    <div key={exercise.id} className="group">
                      <div
                        onClick={() => navigate(`/workout-exercise-details/${exercise.id}`)}
                        className="cursor-pointer"
                      >
                        <div
                          className="w-full aspect-video rounded-[15px] border border-black/10 mb-3 relative overflow-hidden transition-transform group-hover:scale-105"
                          style={{ backgroundColor: "#d9d9d9" }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                              <Play className="w-8 h-8 text-black ml-1" />
                            </div>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-black mb-1">
                          {exercise.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{exercise.duration}</p>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddExercise(exercise);
                          }}
                          size="sm"
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add to Workout
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Save Workout Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-white rounded-[20px] p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-black mb-4">Save Workout</h2>
              <Input
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="Enter workout name..."
                className="mb-4"
              />
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Selected Exercises:</p>
                <div className="space-y-2">
                  {selectedExercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                      <span className="text-sm">{exercise.name}</span>
                      <Button
                        onClick={() => handleRemoveExercise(exercise.id)}
                        variant="ghost"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowSaveDialog(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveWorkout}
                  className="flex-1"
                >
                  Save
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateWorkoutLibrary;

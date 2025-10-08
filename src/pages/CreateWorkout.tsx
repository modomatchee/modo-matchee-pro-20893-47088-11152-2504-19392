import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EXERCISE_LIST } from "@/lib/exercises";

interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

const CreateWorkout = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const [workoutName, setWorkoutName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useState(() => {
    const saved = localStorage.getItem('selectedExercises');
    if (saved) {
      const selectedIds = JSON.parse(saved) as number[];
      const preselectedExercises = selectedIds.map(id => {
        const exercise = EXERCISE_LIST.find(ex => ex.id === id);
        return {
          id: Date.now().toString() + id,
          name: exercise?.name || "",
          sets: "3",
          reps: "12",
          weight: ""
        };
      });
      setExercises(preselectedExercises);
      localStorage.removeItem('selectedExercises');
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: "",
      sets: "",
      reps: "",
      weight: "",
    };
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string) => {
    setExercises(
      exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const handleSaveWorkout = async () => {
    if (!workoutName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workout name",
        variant: "destructive",
      });
      return;
    }

    if (exercises.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one exercise",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a workout",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('workouts')
        .insert([{
          name: workoutName,
          exercises: exercises as any,
          user_id: userData.user.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Workout created successfully!",
      });
      
      navigate("/workouts");
    } catch (error) {
      console.error('Error saving workout:', error);
      toast({
        title: "Error",
        description: "Failed to save workout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#8f8f8f] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Create New Workout</h1>
          <Button
            onClick={() => navigate("/workouts")}
            variant="outline"
            className="bg-white"
          >
            ← Back
          </Button>
        </div>

        <Card className="bg-white rounded-[20px] p-8">
          {/* Workout Name */}
          <div className="mb-8">
            <Label htmlFor="workoutName" className="text-xl font-bold mb-2">
              Workout Name
            </Label>
            <Input
              id="workoutName"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="Enter workout name..."
              className="mt-2 text-lg rounded-[15px] border-black/20"
            />
          </div>

          {/* Exercises List */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Exercises</h2>
              <Button
                onClick={addExercise}
                className="bg-blue-500 hover:bg-blue-600 rounded-[15px]"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Exercise
              </Button>
            </div>

            {exercises.length === 0 ? (
              <p className="text-center text-gray-400 py-12">
                No exercises added yet. Click "Add Exercise" to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {exercises.map((exercise, index) => (
                  <Card
                    key={exercise.id}
                    className="p-4 rounded-[15px] border border-black/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 grid grid-cols-4 gap-4">
                        <div>
                          <Label className="text-sm font-semibold">
                            Exercise #{index + 1}
                          </Label>
                          <Select
                            value={exercise.name}
                            onValueChange={(value) =>
                              updateExercise(exercise.id, "name", value)
                            }
                          >
                            <SelectTrigger className="mt-1 bg-white">
                              <SelectValue placeholder="Select exercise" />
                            </SelectTrigger>
                            <SelectContent className="bg-white z-50">
                              {EXERCISE_LIST.map((ex) => (
                                <SelectItem key={ex.id} value={ex.name}>
                                  {ex.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Sets</Label>
                          <Input
                            value={exercise.sets}
                            onChange={(e) =>
                              updateExercise(exercise.id, "sets", e.target.value)
                            }
                            placeholder="3"
                            type="number"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Reps</Label>
                          <Input
                            value={exercise.reps}
                            onChange={(e) =>
                              updateExercise(exercise.id, "reps", e.target.value)
                            }
                            placeholder="12"
                            type="number"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">
                            Weight (lbs)
                          </Label>
                          <Input
                            value={exercise.weight}
                            onChange={(e) =>
                              updateExercise(
                                exercise.id,
                                "weight",
                                e.target.value
                              )
                            }
                            placeholder="50"
                            type="number"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => removeExercise(exercise.id)}
                        variant="destructive"
                        size="icon"
                        className="mt-6"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSaveWorkout}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-xl rounded-[15px]"
            >
              Save Workout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateWorkout;

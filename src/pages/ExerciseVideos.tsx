import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Search, Play, Plus } from "lucide-react";
import { getExercisesByCategory, ExerciseTemplate } from "@/lib/exercises";
import { toast } from "sonner";

const ExerciseVideos = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<Set<number>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('selectedExercises');
    if (saved) {
      setSelectedExercises(new Set(JSON.parse(saved)));
    }
  }, []);

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

  const handleAddToWorkout = (exercise: ExerciseTemplate) => {
    const newSelected = new Set(selectedExercises);
    if (newSelected.has(exercise.id)) {
      newSelected.delete(exercise.id);
      toast.success(`${exercise.name} removed from workout`);
    } else {
      newSelected.add(exercise.id);
      toast.success(`${exercise.name} added to workout`);
    }
    setSelectedExercises(newSelected);
    localStorage.setItem('selectedExercises', JSON.stringify(Array.from(newSelected)));
  };

  const goToCreateWorkout = () => {
    if (selectedExercises.size === 0) {
      toast.error("Please select at least one exercise");
      return;
    }
    navigate("/create-workout");
  };

  return (
    <div className="min-h-screen bg-[#8f8f8f] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Exercise Videos</h1>
          <div className="flex gap-4">
            {selectedExercises.size > 0 && (
              <Button
                onClick={goToCreateWorkout}
                className="bg-green-500 hover:bg-green-600"
              >
                Create Workout ({selectedExercises.size})
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
                        onClick={() => navigate(`/exercise-details/${exercise.id}`)}
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
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWorkout(exercise);
                        }}
                        variant={selectedExercises.has(exercise.id) ? "secondary" : "default"}
                        className="w-full"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {selectedExercises.has(exercise.id) ? "Added" : "Add to Workout"}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseVideos;

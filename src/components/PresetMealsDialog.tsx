import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface PresetMealsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMeal?: (meal: any) => void;
}

export function PresetMealsDialog({ open, onOpenChange, onSelectMeal }: PresetMealsDialogProps) {
  const { session } = useAuth();
  const [presetMeals, setPresetMeals] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newMeal, setNewMeal] = useState({
    meal_name: "",
    meal_type: "breakfast",
    total_calories: "",
    total_protein: "",
    total_carbs: "",
    total_fats: "",
  });

  useEffect(() => {
    if (open && session?.user) {
      fetchPresetMeals();
    }
  }, [open, session]);

  const fetchPresetMeals = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('preset_meals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPresetMeals(data || []);
    } catch (error) {
      console.error('Error fetching preset meals:', error);
      toast.error('Failed to load preset meals');
    }
  };

  const handleCreatePreset = async () => {
    if (!newMeal.meal_name || !newMeal.total_calories) {
      toast.error("Please enter at least meal name and calories");
      return;
    }

    try {
      const { error } = await (supabase as any).from('preset_meals').insert([{
        user_id: session?.user?.id,
        meal_name: newMeal.meal_name,
        meal_type: newMeal.meal_type,
        total_calories: parseInt(newMeal.total_calories) || 0,
        total_protein: parseInt(newMeal.total_protein) || 0,
        total_carbs: parseInt(newMeal.total_carbs) || 0,
        total_fats: parseInt(newMeal.total_fats) || 0,
      }]);

      if (error) throw error;

      toast.success("Preset meal created!");
      setIsCreating(false);
      setNewMeal({
        meal_name: "",
        meal_type: "breakfast",
        total_calories: "",
        total_protein: "",
        total_carbs: "",
        total_fats: "",
      });
      fetchPresetMeals();
    } catch (error) {
      console.error('Error creating preset meal:', error);
      toast.error("Failed to create preset meal");
    }
  };

  const handleDeletePreset = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('preset_meals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Preset meal deleted");
      fetchPresetMeals();
    } catch (error) {
      console.error('Error deleting preset meal:', error);
      toast.error("Failed to delete preset meal");
    }
  };

  const handleSelectMeal = async (meal: any) => {
    try {
      const { error } = await (supabase as any).from('meals').insert([{
        user_id: session?.user?.id,
        meal_name: meal.meal_name,
        meal_type: meal.meal_type,
        total_calories: meal.total_calories,
        total_protein: meal.total_protein,
        total_carbs: meal.total_carbs,
        total_fats: meal.total_fats,
        meal_time: new Date().toISOString(),
      }]);

      if (error) throw error;

      toast.success("Meal logged successfully!");
      onOpenChange(false);
      if (onSelectMeal) onSelectMeal(meal);
    } catch (error) {
      console.error('Error logging meal:', error);
      toast.error("Failed to log meal");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl">Preset Meals</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!isCreating ? (
            <>
              <Button
                onClick={() => setIsCreating(true)}
                className="w-full bg-[#ffd602] hover:bg-[#e6c102] text-black rounded-[15px]"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Preset
              </Button>

              <div className="space-y-4">
                {presetMeals.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No preset meals yet. Create your first one!</p>
                  </div>
                ) : (
                  presetMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-[15px] hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{meal.meal_name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{meal.meal_type}</p>
                        <div className="flex gap-4 mt-2">
                          <span className="text-sm">{meal.total_calories} cal</span>
                          <span className="text-sm">P: {meal.total_protein}g</span>
                          <span className="text-sm">C: {meal.total_carbs}g</span>
                          <span className="text-sm">F: {meal.total_fats}g</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSelectMeal(meal)}
                          className="bg-[#ffd602] hover:bg-[#e6c102] text-black rounded-[15px]"
                        >
                          Quick Log
                        </Button>
                        <Button
                          onClick={() => handleDeletePreset(meal.id)}
                          variant="outline"
                          size="icon"
                          className="rounded-[15px]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Meal Name *</label>
                <Input
                  value={newMeal.meal_name}
                  onChange={(e) => setNewMeal({ ...newMeal, meal_name: e.target.value })}
                  placeholder="e.g., My Protein Shake"
                  className="rounded-[15px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Meal Type *</label>
                <Select
                  value={newMeal.meal_type}
                  onValueChange={(value) => setNewMeal({ ...newMeal, meal_type: value })}
                >
                  <SelectTrigger className="rounded-[15px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Calories *</label>
                <Input
                  type="number"
                  value={newMeal.total_calories}
                  onChange={(e) => setNewMeal({ ...newMeal, total_calories: e.target.value })}
                  placeholder="e.g., 500"
                  className="rounded-[15px]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Carbs (g)</label>
                  <Input
                    type="number"
                    value={newMeal.total_carbs}
                    onChange={(e) => setNewMeal({ ...newMeal, total_carbs: e.target.value })}
                    placeholder="0"
                    className="rounded-[15px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Protein (g)</label>
                  <Input
                    type="number"
                    value={newMeal.total_protein}
                    onChange={(e) => setNewMeal({ ...newMeal, total_protein: e.target.value })}
                    placeholder="0"
                    className="rounded-[15px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fats (g)</label>
                  <Input
                    type="number"
                    value={newMeal.total_fats}
                    onChange={(e) => setNewMeal({ ...newMeal, total_fats: e.target.value })}
                    placeholder="0"
                    className="rounded-[15px]"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreatePreset}
                  className="flex-1 bg-[#ffd602] hover:bg-[#e6c102] text-black rounded-[15px]"
                >
                  Save Preset
                </Button>
                <Button
                  onClick={() => {
                    setIsCreating(false);
                    setNewMeal({
                      meal_name: "",
                      meal_type: "breakfast",
                      total_calories: "",
                      total_protein: "",
                      total_carbs: "",
                      total_fats: "",
                    });
                  }}
                  variant="outline"
                  className="flex-1 rounded-[15px]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

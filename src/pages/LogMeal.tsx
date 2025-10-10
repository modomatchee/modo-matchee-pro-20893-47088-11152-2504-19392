import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Scan, Plus } from "lucide-react";

const LogMeal = () => {
  const navigate = useNavigate();
  const { loading, session } = useAuth();
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fats, setFats] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mealName || !calories) {
      toast.error("Please enter at least meal name and calories");
      return;
    }

    setSaving(true);
    try {
      const { error } = await (supabase as any).from('meals').insert([{
        user_id: session?.user?.id,
        meal_name: mealName,
        meal_type: mealType,
        total_calories: parseInt(calories) || 0,
        total_protein: parseInt(protein) || 0,
        total_carbs: parseInt(carbs) || 0,
        total_fats: parseInt(fats) || 0,
        notes: notes || null,
        meal_time: new Date().toISOString(),
      }]);

      if (error) throw error;

      toast.success("Meal logged successfully!");
      navigate("/nutrition");
    } catch (error) {
      console.error('Error saving meal:', error);
      toast.error("Failed to save meal");
    } finally {
      setSaving(false);
    }
  };

  const handleBarcodeScanner = () => {
    toast.info("Barcode scanner feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-[#eaeaea] p-8">
      <Button
        onClick={() => navigate("/nutrition")}
        variant="outline"
        className="mb-6"
      >
        ← Back to Nutrition
      </Button>

      <Card className="max-w-2xl mx-auto rounded-[29px]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl">Log Meal</CardTitle>
            <Button
              type="button"
              onClick={handleBarcodeScanner}
              variant="outline"
              className="rounded-[15px]"
            >
              <Scan className="w-5 h-5 mr-2" />
              Scan Barcode
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Meal Name *</label>
              <Input
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="e.g., Grilled Chicken Salad"
                className="rounded-[15px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Meal Type *</label>
              <Select value={mealType} onValueChange={setMealType}>
                <SelectTrigger className="rounded-[15px]">
                  <SelectValue placeholder="Select meal type" />
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
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="e.g., 500"
                className="rounded-[15px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Carbs (g)</label>
                <Input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="0"
                  className="rounded-[15px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Protein (g)</label>
                <Input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="0"
                  className="rounded-[15px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Fats (g)</label>
                <Input
                  type="number"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  placeholder="0"
                  className="rounded-[15px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes about this meal..."
                rows={4}
                className="rounded-[15px]"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg rounded-[15px] bg-[#ffd602] hover:bg-[#e6c102] text-black"
              disabled={saving}
            >
              {saving ? "Saving..." : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Log Meal
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogMeal;

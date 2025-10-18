import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Plus, TrendingUp, Target } from "lucide-react";
import { toast } from "sonner";
import { PresetMealsDialog } from "@/components/PresetMealsDialog";

const Nutrition = () => {
  const navigate = useNavigate();
  const { loading, session } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showPresetMeals, setShowPresetMeals] = useState(false);
  const [nutritionGoals, setNutritionGoals] = useState({
    daily_calories: 2680,
    daily_protein: 150,
    daily_carbs: 300,
    daily_fats: 75,
  });
  const [todayMeals, setTodayMeals] = useState<any[]>([]);
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  useEffect(() => {
    if (session?.user) {
      fetchNutritionGoals();
      fetchTodayMeals();
    }
  }, [session]);

  const fetchNutritionGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('nutrition_goals')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setNutritionGoals({
          daily_calories: data.daily_calories || 2680,
          daily_protein: data.daily_protein || 150,
          daily_carbs: data.daily_carbs || 300,
          daily_fats: data.daily_fats || 75,
        });
      }
    } catch (error) {
      // Silently fail - use default goals
    }
  };

  const fetchTodayMeals = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .gte('meal_time', today.toISOString())
        .order('meal_time', { ascending: false });

      if (error) throw error;
      
      setTodayMeals(data || []);
      
      // Calculate daily totals
      const totals = (data || []).reduce((acc: any, meal: any) => ({
        calories: acc.calories + (meal.total_calories || 0),
        protein: acc.protein + (meal.total_protein || 0),
        carbs: acc.carbs + (meal.total_carbs || 0),
        fats: acc.fats + (meal.total_fats || 0),
      }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
      
      setDailyTotals(totals);
    } catch (error) {
      toast.error('Failed to load meals');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const remaining = nutritionGoals.daily_calories - dailyTotals.calories;
  const caloriePercentage = Math.min((dailyTotals.calories / nutritionGoals.daily_calories) * 100, 100);
  const proteinPercentage = Math.min((dailyTotals.protein / nutritionGoals.daily_protein) * 100, 100);
  const carbsPercentage = Math.min((dailyTotals.carbs / nutritionGoals.daily_carbs) * 100, 100);
  const fatsPercentage = Math.min((dailyTotals.fats / nutritionGoals.daily_fats) * 100, 100);

  return (
    <div className="min-h-screen bg-[#eaeaea] p-5 pb-20">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-black">Nutrition Hub</h1>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
          >
            ← Dashboard
          </Button>
        </div>
      </header>

      {/* Top Section: Calories and Macros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Calories Card */}
        <Card className="rounded-[44px] bg-white p-8">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-black mb-4">Calories</h2>
            <p className="text-xs text-center text-black mb-6">
              Remaining = Goal - Food + Exercise
            </p>
            
            {/* Calories Circle */}
            <div className="relative w-44 h-44 mb-4">
              <svg width="176" height="176" viewBox="0 0 176 176" className="transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="84"
                  stroke="#EBEBF0"
                  strokeWidth="6.5"
                  fill="none"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="84"
                  stroke="#4CAF50"
                  strokeWidth="6.5"
                  fill="none"
                  strokeDasharray={`${(caloriePercentage / 100) * 527.79} 527.79`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <p className="text-4xl font-bold text-black">{remaining.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Remaining</p>
              </div>
            </div>

            {/* Base Goal Indicator */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-600">Goal</p>
                <p className="text-lg font-bold text-black">{nutritionGoals.daily_calories}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Food</p>
                <p className="text-lg font-bold text-black">{dailyTotals.calories}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Remaining</p>
                <p className="text-lg font-bold text-black">{remaining}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Macros Card */}
        <Card className="rounded-[44px] bg-white p-8">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-black mb-8">Macros</h2>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Carbohydrates */}
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-2">
                  <svg width="128" height="128" viewBox="0 0 128 128" className="transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="#EBEBF0"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="#FFA500"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(carbsPercentage / 100) * 377} 377`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <p className="text-xl font-bold text-black">{dailyTotals.carbs}g</p>
                    <p className="text-[10px] text-gray-500">{nutritionGoals.daily_carbs}g</p>
                  </div>
                </div>
                <p className="text-xs text-center text-black">Carbs</p>
              </div>

              {/* Protein */}
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-2">
                  <svg width="128" height="128" viewBox="0 0 128 128" className="transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="#EBEBF0"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="#FF0000"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(proteinPercentage / 100) * 377} 377`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <p className="text-xl font-bold text-black">{dailyTotals.protein}g</p>
                    <p className="text-[10px] text-gray-500">{nutritionGoals.daily_protein}g</p>
                  </div>
                </div>
                <p className="text-xs text-center text-black">Protein</p>
              </div>

              {/* Fats */}
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-2">
                  <svg width="128" height="128" viewBox="0 0 128 128" className="transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="#EBEBF0"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="#FFFF00"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(fatsPercentage / 100) * 377} 377`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <p className="text-xl font-bold text-black">{dailyTotals.fats}g</p>
                    <p className="text-[10px] text-gray-500">{nutritionGoals.daily_fats}g</p>
                  </div>
                </div>
                <p className="text-xs text-center text-black">Fats</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button
          onClick={() => navigate("/log-meal")}
          className="h-24 text-xl rounded-[20px] bg-[#ffd602] hover:bg-[#e6c102] text-black"
        >
          <Plus className="w-6 h-6 mr-2" />
          Log Meal
        </Button>
        <Button
          onClick={() => setShowPresetMeals(true)}
          variant="outline"
          className="h-24 text-xl rounded-[20px]"
        >
          <Plus className="w-6 h-6 mr-2" />
          Quick Add
        </Button>
        <Button
          onClick={() => navigate("/nutrition-details")}
          variant="outline"
          className="h-24 text-xl rounded-[20px]"
        >
          <TrendingUp className="w-6 h-6 mr-2" />
          View Progress
        </Button>
      </div>

      {/* Today's Meals */}
      <Card className="rounded-[29px] bg-white p-8">
        <h2 className="text-3xl font-bold text-black mb-6">Today's Meals</h2>
        
        {todayMeals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No meals logged today</p>
            <Button
              onClick={() => navigate("/log-meal")}
              className="bg-[#ffd602] hover:bg-[#e6c102] text-black"
            >
              Log Your First Meal
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {todayMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-[20px] hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="text-xl font-bold text-black">{meal.meal_name}</h3>
                  <p className="text-sm text-gray-600">{meal.meal_type}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(meal.meal_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-black">{meal.total_calories}</p>
                    <p className="text-xs text-gray-600">cal</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-600">{meal.total_protein}g</p>
                    <p className="text-xs text-gray-600">protein</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-orange-600">{meal.total_carbs}g</p>
                    <p className="text-xs text-gray-600">carbs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-yellow-600">{meal.total_fats}g</p>
                    <p className="text-xs text-gray-600">fats</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <PresetMealsDialog 
        open={showPresetMeals} 
        onOpenChange={setShowPresetMeals}
        onSelectMeal={() => fetchTodayMeals()}
      />
    </div>
  );
};

export default Nutrition;

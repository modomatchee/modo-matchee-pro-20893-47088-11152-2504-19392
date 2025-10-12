import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UtensilsCrossed, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NutritionDetails = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const meals = [
    {
      id: "breakfast",
      name: "Breakfast",
      time: "8:00 AM",
      calories: 450,
      protein: 25,
      carbs: 55,
      fats: 12,
      items: [
        { name: "Oatmeal with berries", calories: 250, protein: 8, carbs: 45, fats: 5 },
        { name: "Greek yogurt", calories: 150, protein: 15, carbs: 8, fats: 5 },
        { name: "Orange juice", calories: 50, protein: 2, carbs: 2, fats: 2 },
      ]
    },
    {
      id: "lunch",
      name: "Lunch",
      time: "1:00 PM",
      calories: 650,
      protein: 40,
      carbs: 65,
      fats: 18,
      items: [
        { name: "Grilled chicken breast", calories: 300, protein: 35, carbs: 0, fats: 8 },
        { name: "Brown rice", calories: 200, protein: 4, carbs: 45, fats: 2 },
        { name: "Mixed vegetables", calories: 100, protein: 3, carbs: 15, fats: 3 },
        { name: "Avocado slices", calories: 50, protein: 1, carbs: 5, fats: 5 },
      ]
    },
    {
      id: "dinner",
      name: "Dinner",
      time: "7:00 PM",
      calories: 700,
      protein: 45,
      carbs: 70,
      fats: 20,
      items: [
        { name: "Salmon fillet", calories: 350, protein: 30, carbs: 0, fats: 15 },
        { name: "Sweet potato", calories: 180, protein: 3, carbs: 40, fats: 0 },
        { name: "Broccoli", calories: 50, protein: 4, carbs: 10, fats: 0 },
        { name: "Quinoa salad", calories: 120, protein: 8, carbs: 20, fats: 5 },
      ]
    },
    {
      id: "snacks",
      name: "Snacks",
      time: "Throughout day",
      calories: 280,
      protein: 10,
      carbs: 30,
      fats: 10,
      items: [
        { name: "Protein shake", calories: 150, protein: 20, carbs: 10, fats: 3 },
        { name: "Apple with almond butter", calories: 130, protein: 3, carbs: 20, fats: 7 },
      ]
    }
  ];

  const weeklyTrends = [
    { day: "Mon", calories: 2100, protein: 120 },
    { day: "Tue", calories: 2050, protein: 115 },
    { day: "Wed", calories: 2200, protein: 130 },
    { day: "Thu", calories: 2080, protein: 118 },
    { day: "Fri", calories: 2150, protein: 125 },
    { day: "Sat", calories: 2300, protein: 135 },
    { day: "Sun", calories: 2080, protein: 120 },
  ];

  const toggleMeal = (mealId: string) => {
    setExpandedMeal(expandedMeal === mealId ? null : mealId);
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <Button
        onClick={() => navigate("/nutrition")}
        variant="outline"
        className="mb-6"
      >
        ← Back to Nutrition Hub
      </Button>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <UtensilsCrossed className="w-12 h-12 text-green-600" />
          <h1 className="text-5xl font-bold">Nutrition Details</h1>
        </div>

        {/* Daily Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="rounded-[20px] p-6 bg-gradient-to-br from-orange-50 to-orange-100">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Total Calories</h3>
            <p className="text-5xl font-bold text-orange-900">2,080</p>
            <p className="text-sm text-orange-700 mt-2">Goal: 2,680</p>
          </Card>

          <Card className="rounded-[20px] p-6 bg-gradient-to-br from-red-50 to-red-100">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Protein</h3>
            <p className="text-5xl font-bold text-red-900">120g</p>
            <p className="text-sm text-red-700 mt-2">Goal: 150g</p>
          </Card>

          <Card className="rounded-[20px] p-6 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Carbs</h3>
            <p className="text-5xl font-bold text-yellow-900">220g</p>
            <p className="text-sm text-yellow-700 mt-2">Goal: 300g</p>
          </Card>

          <Card className="rounded-[20px] p-6 bg-gradient-to-br from-blue-50 to-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Fats</h3>
            <p className="text-5xl font-bold text-blue-900">60g</p>
            <p className="text-sm text-blue-700 mt-2">Goal: 75g</p>
          </Card>
        </div>

        {/* Meal Breakdown */}
        <Card className="rounded-[20px] p-8">
          <h2 className="text-3xl font-bold mb-6">Today's Meals</h2>
          <div className="space-y-4">
            {meals.map((meal) => (
              <div key={meal.id} className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="p-6 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleMeal(meal.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">{meal.name}</h3>
                      <p className="text-sm text-muted-foreground">{meal.time}</p>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-3xl font-bold">{meal.calories}</p>
                        <p className="text-sm text-muted-foreground">calories</p>
                      </div>
                      <div className="flex gap-6">
                        <div className="text-center">
                          <p className="text-xl font-bold text-red-600">{meal.protein}g</p>
                          <p className="text-xs text-muted-foreground">Protein</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-orange-600">{meal.carbs}g</p>
                          <p className="text-xs text-muted-foreground">Carbs</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-yellow-600">{meal.fats}g</p>
                          <p className="text-xs text-muted-foreground">Fats</p>
                        </div>
                      </div>
                      {expandedMeal === meal.id ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </div>
                </div>

                {expandedMeal === meal.id && (
                  <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
                    <h4 className="text-lg font-semibold mb-4">Food Items:</h4>
                    <div className="space-y-3">
                      {meal.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-lg">
                          <span className="font-medium">{item.name}</span>
                          <div className="flex gap-6">
                            <span className="text-sm">{item.calories} cal</span>
                            <span className="text-sm text-red-600">P: {item.protein}g</span>
                            <span className="text-sm text-orange-600">C: {item.carbs}g</span>
                            <span className="text-sm text-yellow-600">F: {item.fats}g</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Trends */}
        <Card className="rounded-[20px] p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-8 h-8" />
            Weekly Nutrition Trends
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-600">Daily Calorie Intake</h3>
              <div className="flex items-end justify-between h-48 gap-4">
                {weeklyTrends.map((data, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <div className="w-full bg-orange-500 rounded-t-lg transition-all hover:bg-orange-600" 
                         style={{ height: `${(data.calories / 2500) * 100}%` }}>
                    </div>
                    <p className="text-sm font-semibold mt-2">{data.day}</p>
                    <p className="text-xs text-muted-foreground">{data.calories}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-600">Daily Protein Intake</h3>
              <div className="flex items-end justify-between h-48 gap-4">
                {weeklyTrends.map((data, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <div className="w-full bg-red-500 rounded-t-lg transition-all hover:bg-red-600" 
                         style={{ height: `${(data.protein / 150) * 100}%` }}>
                    </div>
                    <p className="text-sm font-semibold mt-2">{data.day}</p>
                    <p className="text-xs text-muted-foreground">{data.protein}g</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Nutrition Insights */}
        <Card className="rounded-[20px] p-8 bg-gradient-to-br from-green-50 to-blue-50">
          <h2 className="text-3xl font-bold mb-6">AI Nutrition Insights</h2>
          <div className="space-y-4">
            <p className="text-lg">You're maintaining a consistent calorie intake throughout the week - great job!</p>
            <p className="text-lg">Your protein intake is excellent for muscle recovery and growth.</p>
            <p className="text-lg">Consider adding more healthy fats from sources like nuts, avocados, and fish.</p>
            <p className="text-lg">Your meal timing is well-distributed throughout the day, supporting stable energy levels.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NutritionDetails;

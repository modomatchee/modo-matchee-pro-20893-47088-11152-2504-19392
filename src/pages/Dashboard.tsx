import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const { loading, session } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const handleExportAllData = async () => {
    try {
      const userId = session?.user?.id;
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      // Fetch all data from different tables
      const [mealsData, weightData, workoutData, medicationsData] = await Promise.all([
        supabase.from('meals').select('*').eq('user_id', userId),
        supabase.from('weight_logs').select('*').eq('user_id', userId),
        supabase.from('workout_sessions').select('*').eq('user_id', userId),
        supabase.from('medications').select('*').eq('user_id', userId)
      ]);

      // Export meals data
      if (mealsData.data && mealsData.data.length > 0) {
        exportToCSV(
          mealsData.data,
          ['meal_name', 'meal_type', 'meal_time', 'total_calories', 'total_protein', 'total_carbs', 'total_fats'],
          'meals_data.csv'
        );
      }

      // Export weight logs
      if (weightData.data && weightData.data.length > 0) {
        exportToCSV(
          weightData.data,
          ['logged_at', 'weight', 'weight_unit', 'notes'],
          'weight_logs.csv'
        );
      }

      // Export workout sessions
      if (workoutData.data && workoutData.data.length > 0) {
        exportToCSV(
          workoutData.data,
          ['date', 'workout_name', 'duration', 'calories_burned', 'sets_completed', 'reps_completed'],
          'workout_sessions.csv'
        );
      }

      // Export medications
      if (medicationsData.data && medicationsData.data.length > 0) {
        exportToCSV(
          medicationsData.data,
          ['name', 'dosage', 'frequency', 'start_date', 'end_date', 'is_active'],
          'medications.csv'
        );
      }

      toast.success("All health and nutrition data exported successfully!");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  const featureCards = [
    { title: "AI Coach", gradient: "from-[hsl(262,83%,58%)] to-[hsl(220,89%,61%)]", path: "/ai-coach" },
    { title: "Health Hub", gradient: "from-[hsl(0,84%,60%)] to-[hsl(340,82%,52%)]", path: "/health" },
    { title: "Nutrition Hub", gradient: "from-[hsl(142,76%,36%)] to-[hsl(122,39%,49%)]", path: "/nutrition" },
    { title: "Workout Hub", gradient: "from-[hsl(38,92%,50%)] to-[hsl(24,91%,48%)]", path: "/workouts" },
  ];

  const aiInsights = [
    { 
      gradient: "from-[hsl(0,84%,60%)] to-[hsl(340,82%,52%)]", 
      text: "Health Hub: Your heart rate recovery improved 15% this week",
      hub: "Health"
    },
    { 
      gradient: "from-[hsl(142,76%,36%)] to-[hsl(122,39%,49%)]", 
      text: "Nutrition Hub: Great protein intake - on track for muscle recovery",
      hub: "Nutrition"
    },
    { 
      gradient: "from-[hsl(38,92%,50%)] to-[hsl(24,91%,48%)]", 
      text: "Workout Hub: Recommended - Focus on serve power training today",
      hub: "Workout"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary via-secondary to-muted">
      {/* Header */}
      <div className="bg-gradient-to-b from-background via-background to-muted py-8">
        <h1 className="text-9xl font-bold text-center text-primary">ModoMatchee</h1>
      </div>
      <div className="h-4 bg-primary" />

      <div className="p-14 space-y-6">
        {/* Feature Cards Grid */}
        <div className="grid grid-cols-4 gap-6">
          {featureCards.map((card) => (
            <Card
              key={card.title}
              onClick={() => navigate(card.path)}
              className={`bg-gradient-to-br ${card.gradient} h-48 rounded-[20px] cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center border-0 shadow-lg`}
            >
              <h2 className="text-4xl font-bold text-white drop-shadow-lg">{card.title}</h2>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* AI Coach Insights */}
          <Card className="col-span-2 rounded-[20px] p-8 bg-white">
            <h2 className="text-4xl font-semibold mb-6">AI Coach Insights</h2>
            <div className="space-y-4">
              {aiInsights.map((insight, i) => (
                <div 
                  key={i} 
                  className={`bg-gradient-to-r ${insight.gradient} rounded-[20px] p-6 text-white text-xl font-semibold shadow-lg`}
                >
                  {insight.text}
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="rounded-[20px] p-8 bg-white">
            <h2 className="text-4xl mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Button 
                onClick={() => navigate("/ai-coach")}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-xl rounded-[20px]"
              >
                Ask AI Coach
              </Button>
              <Button 
                onClick={() => navigate("/log-meal")}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-xl rounded-[20px]"
              >
                Log Meal
              </Button>
              <Button 
                onClick={() => navigate("/calendar")}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-xl rounded-[20px]"
              >
                Match Calendar
              </Button>
              <Button 
                onClick={handleExportAllData}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-xl rounded-[20px]"
              >
                <Download className="w-5 h-5 mr-2" />
                Export Data
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="rounded-[20px] p-8 bg-white">
          <h2 className="text-4xl font-semibold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="bg-muted rounded-[20px] p-6 text-foreground text-xl">
              Morning workout completed - 45 minutes
            </div>
            <div className="bg-muted rounded-[20px] p-6 text-foreground text-xl">
              Logged breakfast - 650 calories
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

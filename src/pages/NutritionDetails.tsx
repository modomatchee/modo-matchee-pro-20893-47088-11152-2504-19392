import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UtensilsCrossed, TrendingDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const NutritionDetails = () => {
  const navigate = useNavigate();
  const { loading, session } = useAuth();
  const [timeRange, setTimeRange] = useState("week");
  const [nutritionData, setNutritionData] = useState<any[]>([]);
  const [weightData, setWeightData] = useState<any[]>([]);

  useEffect(() => {
    if (session?.user) {
      fetchNutritionData();
      fetchWeightData();
    }
  }, [session, timeRange]);

  const fetchNutritionData = async () => {
    try {
      const daysToFetch = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 365;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysToFetch);

      const { data, error } = await (supabase as any)
        .from('meals')
        .select('*')
        .gte('meal_time', startDate.toISOString())
        .order('meal_time');

      if (error) throw error;

      // Aggregate data by date
      const aggregated: any = {};
      data?.forEach((meal: any) => {
        const date = new Date(meal.meal_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!aggregated[date]) {
          aggregated[date] = { date, calories: 0, protein: 0, carbs: 0, fats: 0 };
        }
        aggregated[date].calories += meal.total_calories;
        aggregated[date].protein += meal.total_protein;
        aggregated[date].carbs += meal.total_carbs;
        aggregated[date].fats += meal.total_fats;
      });

      setNutritionData(Object.values(aggregated));
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
    }
  };

  const fetchWeightData = async () => {
    try {
      const daysToFetch = timeRange === "week" ? 7 : timeRange === "month" ? 30 : 365;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysToFetch);

      const { data, error } = await (supabase as any)
        .from('weight_logs')
        .select('*')
        .gte('logged_at', startDate.toISOString())
        .order('logged_at');

      if (error) throw error;

      const formattedData = data?.map((log: any) => ({
        date: new Date(log.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: parseFloat(log.weight),
      })) || [];

      setWeightData(formattedData);
    } catch (error) {
      console.error('Error fetching weight data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <UtensilsCrossed className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold">Nutrition Details</h1>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Nutrition Trends Charts */}
        <Card className="rounded-[20px] p-8">
          <h2 className="text-3xl font-bold mb-6">Nutrition Trends</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">Calorie Intake</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={nutritionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calories" fill="hsl(var(--primary))" name="Calories" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-primary">Macronutrients</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={nutritionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="protein" stroke="#ef4444" name="Protein (g)" strokeWidth={2} />
                  <Line type="monotone" dataKey="carbs" stroke="#f97316" name="Carbs (g)" strokeWidth={2} />
                  <Line type="monotone" dataKey="fats" stroke="#eab308" name="Fats (g)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Weight Loss Progression */}
        <Card className="rounded-[20px] p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <TrendingDown className="w-8 h-8 text-primary" />
            Weight Loss Progression
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3} 
                name="Weight (kg)"
                dot={{ fill: "hsl(var(--primary))", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          {weightData.length > 1 && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <p className="text-lg font-semibold">
                Progress: {(weightData[0]?.weight - weightData[weightData.length - 1]?.weight).toFixed(1)} kg lost
              </p>
            </div>
          )}
        </Card>

        {/* Nutrition Insights */}
        <Card className="rounded-[20px] p-8 bg-gradient-to-br from-primary/10 to-primary/5">
          <h2 className="text-3xl font-bold mb-6">AI Nutrition Insights</h2>
          <div className="space-y-4">
            <p className="text-lg">📊 Track your progress over different time periods to identify patterns and trends.</p>
            <p className="text-lg">💪 Consistent nutrition tracking helps you stay on target with your goals.</p>
            <p className="text-lg">🎯 Use the timeline dropdown to view your data from different perspectives.</p>
            <p className="text-lg">⚖️ Monitor your weight trends alongside nutrition to see the full picture of your health journey.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NutritionDetails;

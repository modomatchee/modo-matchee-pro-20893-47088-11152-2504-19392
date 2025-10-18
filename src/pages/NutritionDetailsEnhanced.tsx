import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UtensilsCrossed, TrendingUp, Droplets, Scale, Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { TimeRangeDropdown } from "@/components/TimeRangeDropdown";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";

const NutritionDetailsEnhanced = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const [weightRange, setWeightRange] = useState("weekly");
  const [caloriesRange, setCaloriesRange] = useState("weekly");
  const [macrosRange, setMacrosRange] = useState("daily");
  const [hydrationRange, setHydrationRange] = useState("daily");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const generateWeightData = (range: string) => {
    if (range === "daily") {
      return Array.from({ length: 7 }, (_, i) => ({
        name: `Day ${i + 1}`,
        weight: 75 + Math.random() * 2 - 1
      }));
    } else if (range === "weekly") {
      return Array.from({ length: 8 }, (_, i) => ({
        name: `Week ${i + 1}`,
        weight: 76 - i * 0.5
      }));
    } else if (range === "monthly") {
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => ({
        name: month,
        weight: 78 - i * 0.8
      }));
    } else {
      return ["2020", "2021", "2022", "2023", "2024"].map((year, i) => ({
        name: year,
        weight: 82 - i * 1.5
      }));
    }
  };

  const generateCaloriesData = (range: string) => {
    if (range === "daily") {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
        name: day,
        intake: 2000 + Math.random() * 400,
        burned: 2200 + Math.random() * 300
      }));
    } else if (range === "weekly") {
      return Array.from({ length: 4 }, (_, i) => ({
        name: `Week ${i + 1}`,
        intake: 14000 + Math.random() * 2000,
        burned: 15000 + Math.random() * 1500
      }));
    } else if (range === "monthly") {
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(month => ({
        name: month,
        intake: 60000 + Math.random() * 5000,
        burned: 65000 + Math.random() * 4000
      }));
    } else {
      return ["2020", "2021", "2022", "2023", "2024"].map(year => ({
        name: year,
        intake: 730000 + Math.random() * 50000,
        burned: 760000 + Math.random() * 40000
      }));
    }
  };

  const macroData = [
    { name: "Protein", value: 30, color: "#ef4444" },
    { name: "Carbs", value: 45, color: "#f59e0b" },
    { name: "Fats", value: 25, color: "#3b82f6" }
  ];

  const generateHydrationData = (range: string) => {
    if (range === "daily") {
      return Array.from({ length: 24 }, (_, i) => ({
        name: `${i}:00`,
        liters: Math.random() * 0.5
      }));
    } else if (range === "weekly") {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({
        name: day,
        liters: 2 + Math.random() * 1.5
      }));
    } else if (range === "monthly") {
      return Array.from({ length: 30 }, (_, i) => ({
        name: `${i + 1}`,
        liters: 2.5 + Math.random()
      }));
    } else {
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(month => ({
        name: month,
        liters: 70 + Math.random() * 15
      }));
    }
  };

  const handleExport = () => {
    try {
      // Export weight data
      const weightData = generateWeightData(weightRange);
      exportToCSV(weightData, ['name', 'weight'], `weight_data_${weightRange}.csv`);
      
      // Export calories data
      const caloriesData = generateCaloriesData(caloriesRange);
      exportToCSV(caloriesData, ['name', 'intake', 'burned'], `calories_data_${caloriesRange}.csv`);
      
      // Export macros data
      exportToCSV(macroData, ['name', 'value'], `macros_data.csv`);
      
      // Export hydration data
      const hydrationData = generateHydrationData(hydrationRange);
      exportToCSV(hydrationData, ['name', 'liters'], `hydration_data_${hydrationRange}.csv`);
      
      toast.success("Nutrition data exported successfully!");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => navigate("/nutrition")}
          variant="outline"
        >
          ← Back to Nutrition Hub
        </Button>
        
        <Button
          onClick={handleExport}
          className="hover:scale-105 transition-transform"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <UtensilsCrossed className="w-12 h-12 text-primary" />
          <h1 className="text-5xl font-bold">Nutrition Details</h1>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-[20px] p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <Scale className="w-8 h-8 text-primary mb-2" />
            <h3 className="text-lg font-semibold mb-2">Current Weight</h3>
            <p className="text-4xl font-bold">75.2 kg</p>
            <p className="text-sm text-muted-foreground mt-2">-2.3 kg this month</p>
          </Card>

          <Card className="rounded-[20px] p-6 bg-gradient-to-br from-orange-500/10 to-orange-500/5">
            <TrendingUp className="w-8 h-8 text-orange-500 mb-2" />
            <h3 className="text-lg font-semibold mb-2">Avg Calories</h3>
            <p className="text-4xl font-bold">2,080</p>
            <p className="text-sm text-muted-foreground mt-2">Daily average</p>
          </Card>

          <Card className="rounded-[20px] p-6 bg-gradient-to-br from-red-500/10 to-red-500/5">
            <UtensilsCrossed className="w-8 h-8 text-red-500 mb-2" />
            <h3 className="text-lg font-semibold mb-2">Protein %</h3>
            <p className="text-4xl font-bold">30%</p>
            <p className="text-sm text-muted-foreground mt-2">Of total calories</p>
          </Card>

          <Card className="rounded-[20px] p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <Droplets className="w-8 h-8 text-blue-500 mb-2" />
            <h3 className="text-lg font-semibold mb-2">Hydration</h3>
            <p className="text-4xl font-bold">2.5 L</p>
            <p className="text-sm text-muted-foreground mt-2">Daily average</p>
          </Card>
        </div>

        {/* Weight Progression Chart */}
        <Card className="rounded-[20px] p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Weight Progression</h2>
            <TimeRangeDropdown value={weightRange} onChange={setWeightRange} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generateWeightData(weightRange)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[70, 80]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={3} name="Weight (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Calories Chart */}
        <Card className="rounded-[20px] p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Calories: Intake vs Burned</h2>
            <TimeRangeDropdown value={caloriesRange} onChange={setCaloriesRange} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generateCaloriesData(caloriesRange)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="intake" fill="#f59e0b" name="Intake" />
              <Bar dataKey="burned" fill="#ef4444" name="Burned" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Macronutrient Breakdown */}
        <Card className="rounded-[20px] p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Macronutrient Breakdown</h2>
            <TimeRangeDropdown value={macrosRange} onChange={setMacrosRange} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={macroData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Hydration Tracking */}
        <Card className="rounded-[20px] p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Hydration Tracking</h2>
            <TimeRangeDropdown value={hydrationRange} onChange={setHydrationRange} />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={generateHydrationData(hydrationRange)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="liters" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Water (L)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default NutritionDetailsEnhanced;
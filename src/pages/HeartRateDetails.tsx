import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Heart, Activity, TrendingDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const HeartRateDetails = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const [timeframe, setTimeframe] = useState("weekly");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const generateChartData = (timeframe: string) => {
    const labels = {
      daily: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      weekly: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      monthly: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      yearly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    };

    const label = labels[timeframe as keyof typeof labels];
    
    return label.map((name) => ({
      name,
      resting: Math.floor(Math.random() * 10 + 60),
      active: Math.floor(Math.random() * 20 + 140),
    }));
  };

  const chartData = generateChartData(timeframe);

  return (
    <div className="min-h-screen bg-secondary p-8">
      <Button
        onClick={() => navigate("/health")}
        variant="outline"
        className="mb-6"
      >
        ← Back to Health Hub
      </Button>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Heart className="w-12 h-12" style={{ color: 'hsl(var(--health-heart))' }} />
          <h1 className="text-5xl font-bold">Heart Rate Details</h1>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="rounded-lg p-6 bg-[hsl(var(--health-heart-light))] border-[hsl(var(--health-heart))]">
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'hsl(var(--health-heart))' }}>Resting HR</h3>
            <p className="text-5xl font-bold" style={{ color: 'hsl(var(--health-heart))' }}>65 bpm</p>
            <p className="text-sm text-muted-foreground mt-2">Normal range</p>
          </Card>

          <Card className="rounded-lg p-6 bg-muted">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Average HR</h3>
            <p className="text-5xl font-bold text-foreground">78 bpm</p>
            <p className="text-sm text-muted-foreground mt-2">During activity</p>
          </Card>

          <Card className="rounded-lg p-6 bg-muted">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Max HR Today</h3>
            <p className="text-5xl font-bold text-foreground">152 bpm</p>
            <p className="text-sm text-muted-foreground mt-2">During workout</p>
          </Card>
        </div>

        {/* Heart Rate Trend Chart */}
        <Card className="rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="w-8 h-8" />
              Heart Rate Trend
            </h2>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="resting" 
                stroke="hsl(var(--health-heart))" 
                strokeWidth={3}
                name="Resting HR"
                dot={{ fill: "hsl(var(--health-heart))", r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="active" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                name="Active HR"
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Heart Rate Zones */}
        <Card className="rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Time in Heart Rate Zones (Today)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Rest</h3>
              <p className="text-3xl font-bold">18h 30m</p>
              <p className="text-sm text-muted-foreground">&lt;60 bpm</p>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Light</h3>
              <p className="text-3xl font-bold">4h 20m</p>
              <p className="text-sm text-muted-foreground">60-100 bpm</p>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Moderate</h3>
              <p className="text-3xl font-bold">45m</p>
              <p className="text-sm text-muted-foreground">100-130 bpm</p>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Hard</h3>
              <p className="text-3xl font-bold">15m</p>
              <p className="text-sm text-muted-foreground">130-150 bpm</p>
            </div>
            <div className="p-6 bg-[hsl(var(--health-heart-light))] rounded-lg">
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'hsl(var(--health-heart))' }}>Peak</h3>
              <p className="text-3xl font-bold" style={{ color: 'hsl(var(--health-heart))' }}>5m</p>
              <p className="text-sm text-muted-foreground">&gt;150 bpm</p>
            </div>
          </div>
        </Card>

        {/* Insights */}
        <Card className="rounded-lg p-8 bg-[hsl(var(--health-heart-light))]">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <TrendingDown className="w-8 h-8" style={{ color: 'hsl(var(--health-heart))' }} />
            AI Insights
          </h2>
          <div className="space-y-4">
            <p className="text-lg">Your resting heart rate has decreased by 3 bpm over the past month - a sign of improved cardiovascular fitness!</p>
            <p className="text-lg">You're spending good time in moderate to hard intensity zones during workouts.</p>
            <p className="text-lg">Consider incorporating more interval training to improve heart rate recovery.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HeartRateDetails;

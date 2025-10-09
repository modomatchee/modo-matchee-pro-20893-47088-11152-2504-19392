import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Moon, TrendingUp, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const SleepDetails = () => {
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
      hours: Number((Math.random() * 3 + 6).toFixed(1)),
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
          <Moon className="w-12 h-12" style={{ color: 'hsl(var(--health-sleep))' }} />
          <h1 className="text-5xl font-bold">Sleep Details</h1>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="rounded-lg p-6 bg-[hsl(var(--health-sleep-light))] border-[hsl(var(--health-sleep))]">
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'hsl(var(--health-sleep))' }}>Last Night</h3>
            <p className="text-5xl font-bold" style={{ color: 'hsl(var(--health-sleep))' }}>7.5 hrs</p>
            <p className="text-sm text-muted-foreground mt-2">+0.5 hrs from average</p>
          </Card>

          <Card className="rounded-lg p-6 bg-muted">
            <h3 className="text-lg font-semibold mb-2 text-foreground">7-Day Average</h3>
            <p className="text-5xl font-bold text-foreground">7.7 hrs</p>
            <p className="text-sm text-muted-foreground mt-2">Optimal range</p>
          </Card>

          <Card className="rounded-lg p-6 bg-muted">
            <h3 className="text-lg font-semibold mb-2 text-foreground">Sleep Quality</h3>
            <p className="text-5xl font-bold text-foreground">85%</p>
            <p className="text-sm text-muted-foreground mt-2">Excellent</p>
          </Card>
        </div>

        {/* Sleep Trend Chart */}
        <Card className="rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="w-8 h-8" />
              Sleep Trend
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
          
          <ResponsiveContainer width="100%" height={300}>
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
                dataKey="hours" 
                stroke="hsl(var(--health-sleep))" 
                strokeWidth={3}
                name="Sleep Hours"
                dot={{ fill: "hsl(var(--health-sleep))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Sleep Stages */}
        <Card className="rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Sleep Stages Breakdown</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Awake</h3>
              <p className="text-3xl font-bold">0.5 hrs</p>
              <p className="text-sm text-muted-foreground">7%</p>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Light Sleep</h3>
              <p className="text-3xl font-bold">4.2 hrs</p>
              <p className="text-sm text-muted-foreground">56%</p>
            </div>
            <div className="p-6 bg-[hsl(var(--health-sleep-light))] rounded-lg">
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'hsl(var(--health-sleep))' }}>Deep Sleep</h3>
              <p className="text-3xl font-bold" style={{ color: 'hsl(var(--health-sleep))' }}>1.8 hrs</p>
              <p className="text-sm text-muted-foreground">24%</p>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">REM Sleep</h3>
              <p className="text-3xl font-bold">1.0 hrs</p>
              <p className="text-sm text-muted-foreground">13%</p>
            </div>
          </div>
        </Card>

        {/* Insights */}
        <Card className="rounded-lg p-8 bg-[hsl(var(--health-sleep-light))]">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-8 h-8" style={{ color: 'hsl(var(--health-sleep))' }} />
            AI Insights
          </h2>
          <div className="space-y-4">
            <p className="text-lg">Your sleep quality has improved by 12% this week compared to last week.</p>
            <p className="text-lg">You're getting consistent deep sleep, which is excellent for recovery and performance.</p>
            <p className="text-lg">Consider maintaining your current bedtime routine for optimal results.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SleepDetails;

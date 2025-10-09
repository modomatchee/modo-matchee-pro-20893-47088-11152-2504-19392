import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Activity, Wind, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const RespiratoryDetails = () => {
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
      rate: Math.floor(Math.random() * 5 + 14),
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
          <Wind className="w-12 h-12" style={{ color: 'hsl(var(--health-respiratory))' }} />
          <h1 className="text-5xl font-bold">Respiratory Rate Details</h1>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="rounded-lg p-6 bg-[hsl(var(--health-respiratory-light))] border-[hsl(var(--health-respiratory))]">
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'hsl(var(--health-respiratory))' }}>Current Rate</h3>
            <p className="text-5xl font-bold" style={{ color: 'hsl(var(--health-respiratory))' }}>16 /min</p>
            <p className="text-sm text-muted-foreground mt-2">Optimal</p>
          </Card>

          <Card className="rounded-lg p-6 bg-muted">
            <h3 className="text-lg font-semibold mb-2 text-foreground">7-Day Average</h3>
            <p className="text-5xl font-bold text-foreground">15.4 /min</p>
            <p className="text-sm text-muted-foreground mt-2">Normal range</p>
          </Card>

          <Card className="rounded-lg p-6 bg-muted">
            <h3 className="text-lg font-semibold mb-2 text-foreground">During Exercise</h3>
            <p className="text-5xl font-bold text-foreground">28 /min</p>
            <p className="text-sm text-muted-foreground mt-2">Healthy response</p>
          </Card>
        </div>

        {/* Respiratory Rate Trend Chart */}
        <Card className="rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="w-8 h-8" />
              Respiratory Rate Trend
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
                dataKey="rate" 
                stroke="hsl(var(--health-respiratory))" 
                strokeWidth={3}
                name="Respiratory Rate"
                dot={{ fill: "hsl(var(--health-respiratory))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Respiratory Metrics */}
        <Card className="rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Detailed Metrics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Resting Rate</h3>
                <p className="text-3xl font-bold">14 breaths/min</p>
                <p className="text-sm text-muted-foreground mt-2">During sleep and rest</p>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Active Rate</h3>
                <p className="text-3xl font-bold">16 breaths/min</p>
                <p className="text-sm text-muted-foreground mt-2">During daily activities</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Exercise Rate</h3>
                <p className="text-3xl font-bold">28 breaths/min</p>
                <p className="text-sm text-muted-foreground mt-2">During intense exercise</p>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Recovery Time</h3>
                <p className="text-3xl font-bold">3 minutes</p>
                <p className="text-sm text-muted-foreground mt-2">Return to resting rate</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Breathing Quality */}
        <Card className="rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6">Breathing Quality Analysis</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="text-lg font-semibold">Pattern Consistency</h3>
                <p className="text-sm text-muted-foreground">Regular and steady breathing pattern</p>
              </div>
              <div className="text-3xl font-bold text-foreground">Excellent</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="text-lg font-semibold">Depth of Breathing</h3>
                <p className="text-sm text-muted-foreground">Good oxygen intake per breath</p>
              </div>
              <div className="text-3xl font-bold text-foreground">Good</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-[hsl(var(--health-respiratory-light))] rounded-lg">
              <div>
                <h3 className="text-lg font-semibold">Exercise Response</h3>
                <p className="text-sm text-muted-foreground">Appropriate rate increase during activity</p>
              </div>
              <div className="text-3xl font-bold" style={{ color: 'hsl(var(--health-respiratory))' }}>Optimal</div>
            </div>
          </div>
        </Card>

        {/* Insights */}
        <Card className="rounded-lg p-8 bg-[hsl(var(--health-respiratory-light))]">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-8 h-8" style={{ color: 'hsl(var(--health-respiratory))' }} />
            AI Insights
          </h2>
          <div className="space-y-4">
            <p className="text-lg">Your respiratory rate is consistently within the healthy range of 12-20 breaths per minute.</p>
            <p className="text-lg">Quick recovery time indicates good cardiovascular fitness and lung capacity.</p>
            <p className="text-lg">Consider breathing exercises like box breathing to further enhance your respiratory efficiency.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RespiratoryDetails;

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Activity, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const Health = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const [sleepTimeframe, setSleepTimeframe] = useState("weekly");
  const [heartTimeframe, setHeartTimeframe] = useState("weekly");
  const [respiratoryTimeframe, setRespiratoryTimeframe] = useState("weekly");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const generateChartData = (timeframe: string, type: "sleep" | "heart" | "respiratory") => {
    const baseValues = {
      sleep: { min: 6, max: 9 },
      heart: { min: 60, max: 75 },
      respiratory: { min: 14, max: 18 },
    };

    const labels = {
      daily: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      weekly: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      monthly: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      yearly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    };

    const label = labels[timeframe as keyof typeof labels];
    const { min, max } = baseValues[type];

    return label.map((day) => ({
      name: day,
      value: Number((Math.random() * (max - min) + min).toFixed(1)),
    }));
  };

  const sleepData = generateChartData(sleepTimeframe, "sleep");
  const heartData = generateChartData(heartTimeframe, "heart");
  const respiratoryData = generateChartData(respiratoryTimeframe, "respiratory");

  return (
    <div className="min-h-screen bg-secondary p-8">
      <Button
        onClick={() => navigate("/dashboard")}
        variant="outline"
        className="mb-6"
      >
        ← Back to Dashboard
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card 
          className="rounded-lg cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-[hsl(var(--health-sleep))] bg-[hsl(var(--health-sleep-light))]"
          onClick={() => navigate("/sleep-details")}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="w-6 h-6" style={{ color: 'hsl(var(--health-sleep))' }} />
              <CardTitle style={{ color: 'hsl(var(--health-sleep))' }}>Sleep</CardTitle>
            </div>
            <CardDescription>Last night</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold" style={{ color: 'hsl(var(--health-sleep))' }}>7.5 hrs</p>
            <p className="text-sm mt-2 text-muted-foreground">+0.5 hrs from average</p>
          </CardContent>
        </Card>

        <Card 
          className="rounded-lg cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-[hsl(var(--health-heart))] bg-[hsl(var(--health-heart-light))]"
          onClick={() => navigate("/heart-rate-details")}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6" style={{ color: 'hsl(var(--health-heart))' }} />
              <CardTitle style={{ color: 'hsl(var(--health-heart))' }}>Heart Rate</CardTitle>
            </div>
            <CardDescription>Resting</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold" style={{ color: 'hsl(var(--health-heart))' }}>65 bpm</p>
            <p className="text-sm mt-2 text-muted-foreground">Normal range</p>
          </CardContent>
        </Card>

        <Card 
          className="rounded-lg cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-[hsl(var(--health-respiratory))] bg-[hsl(var(--health-respiratory-light))]"
          onClick={() => navigate("/respiratory-details")}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6" style={{ color: 'hsl(var(--health-respiratory))' }} />
              <CardTitle style={{ color: 'hsl(var(--health-respiratory))' }}>Respiratory Rate</CardTitle>
            </div>
            <CardDescription>Current</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold" style={{ color: 'hsl(var(--health-respiratory))' }}>16/min</p>
            <p className="text-sm mt-2 text-muted-foreground">Optimal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Sleep Trends</h3>
            <Select value={sleepTimeframe} onValueChange={setSleepTimeframe}>
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
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sleepData}>
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
                dataKey="value" 
                stroke="hsl(var(--health-sleep))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--health-sleep))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Heart Rate Trends</h3>
            <Select value={heartTimeframe} onValueChange={setHeartTimeframe}>
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
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={heartData}>
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
                dataKey="value" 
                stroke="hsl(var(--health-heart))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--health-heart))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Respiratory Rate Trends</h3>
          <Select value={respiratoryTimeframe} onValueChange={setRespiratoryTimeframe}>
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
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={respiratoryData}>
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
              dataKey="value" 
              stroke="hsl(var(--health-respiratory))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--health-respiratory))", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-lg p-6 bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-all hover:scale-[1.02]" onClick={() => navigate("/medical-history")}>
          <h3 className="text-2xl font-bold mb-2">Update Your Medical History</h3>
          <p>Keep your health records up to date</p>
        </Card>

        <Card className="rounded-lg p-6 bg-accent text-accent-foreground hover:bg-accent/90 transition-all hover:scale-[1.02] cursor-pointer" onClick={() => navigate("/medications")}>
          <h3 className="text-2xl font-bold mb-2">Your Medications</h3>
          <p>Manage and track your medications</p>
        </Card>

        <Card className="rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]" style={{ background: 'var(--gradient-nutrition)' }} onClick={() => navigate("/health-report")}>
          <h3 className="text-2xl font-bold mb-2">Share Health Report</h3>
          <p>Print or export your complete health report</p>
        </Card>
      </div>
    </div>
  );
};

export default Health;

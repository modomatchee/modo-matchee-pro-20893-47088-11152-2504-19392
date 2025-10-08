import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Health = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const healthMetrics = [
    {
      title: "Sleep",
      subtitle: "Sleep Trend",
      gradient: "bg-gradient-to-l from-[#0e969d] to-[#056d80]",
      value: "7.5 hrs",
    },
    {
      title: "Heart Rate",
      subtitle: "Heart Rate Trends",
      gradient: "bg-gradient-to-r from-[#ff0037] to-[#ff589a]",
      value: "72 bpm",
    },
    {
      title: "Respiratory Rate",
      subtitle: "Respiratory Rate",
      gradient: "bg-gradient-to-r from-[#2d37ff] to-[#317dff]",
      value: "16 /min",
    },
  ];

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
          <h3 className="text-2xl font-bold mb-4">Sleep Trends</h3>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Chart placeholder</p>
          </div>
        </Card>

        <Card className="rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Heart Rate Trends</h3>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Chart placeholder</p>
          </div>
        </Card>
      </div>

      <Card className="rounded-lg p-6 mb-8">
        <h3 className="text-2xl font-bold mb-4">Respiratory Rate Trends</h3>
        <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Chart placeholder</p>
        </div>
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

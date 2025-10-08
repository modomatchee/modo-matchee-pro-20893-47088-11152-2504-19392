import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Activity, Wind, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const RespiratoryDetails = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const weekData = [
    { day: "Mon", rate: 15 },
    { day: "Tue", rate: 16 },
    { day: "Wed", rate: 14 },
    { day: "Thu", rate: 16 },
    { day: "Fri", rate: 15 },
    { day: "Sat", rate: 16 },
    { day: "Sun", rate: 15 },
  ];

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

        {/* Weekly Trend Chart */}
        <Card className="rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-8 h-8" />
            Weekly Respiratory Rate Trend
          </h2>
          
          <div className="flex items-end justify-between h-64 gap-4">
            {weekData.map((data, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className="w-full rounded-t-lg transition-all" 
                     style={{ 
                       height: `${(data.rate / 20) * 100}%`,
                       backgroundColor: 'hsl(var(--health-respiratory))'
                     }}>
                </div>
                <p className="text-sm font-semibold mt-2">{data.day}</p>
                <p className="text-xs text-muted-foreground">{data.rate}/min</p>
              </div>
            ))}
          </div>
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

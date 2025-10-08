import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Heart, Activity, TrendingDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const HeartRateDetails = () => {
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
    { day: "Mon", resting: 65, active: 145 },
    { day: "Tue", resting: 64, active: 152 },
    { day: "Wed", resting: 66, active: 148 },
    { day: "Thu", resting: 65, active: 150 },
    { day: "Fri", resting: 63, active: 146 },
    { day: "Sat", resting: 64, active: 149 },
    { day: "Sun", resting: 65, active: 147 },
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

        {/* Weekly Trend Chart */}
        <Card className="rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-8 h-8" />
            Weekly Heart Rate Trend
          </h2>
          
          <div className="space-y-6">
            {/* Resting HR */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'hsl(var(--health-heart))' }}>Resting Heart Rate</h3>
              <div className="flex items-end justify-between h-32 gap-4">
                {weekData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <div className="w-full rounded-t-lg transition-all" 
                         style={{ 
                           height: `${(data.resting / 100) * 100}%`,
                           backgroundColor: 'hsl(var(--health-heart))'
                         }}>
                    </div>
                    <p className="text-sm font-semibold mt-2">{data.day}</p>
                    <p className="text-xs text-muted-foreground">{data.resting}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Active HR */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Active Heart Rate</h3>
              <div className="flex items-end justify-between h-32 gap-4">
                {weekData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <div className="w-full bg-primary rounded-t-lg transition-all" 
                         style={{ height: `${(data.active / 180) * 100}%` }}>
                    </div>
                    <p className="text-sm font-semibold mt-2">{data.day}</p>
                    <p className="text-xs text-muted-foreground">{data.active}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
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

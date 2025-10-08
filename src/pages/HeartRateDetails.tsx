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
          <Heart className="w-12 h-12 text-red-600" />
          <h1 className="text-5xl font-bold">Heart Rate Details</h1>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="rounded-[20px] p-6 bg-gradient-to-br from-red-50 to-red-100">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Resting HR</h3>
            <p className="text-5xl font-bold text-red-900">65 bpm</p>
            <p className="text-sm text-red-700 mt-2">Normal range</p>
          </Card>

          <Card className="rounded-[20px] p-6 bg-gradient-to-br from-orange-50 to-orange-100">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Average HR</h3>
            <p className="text-5xl font-bold text-orange-900">78 bpm</p>
            <p className="text-sm text-orange-700 mt-2">During activity</p>
          </Card>

          <Card className="rounded-[20px] p-6 bg-gradient-to-br from-pink-50 to-pink-100">
            <h3 className="text-lg font-semibold text-pink-900 mb-2">Max HR Today</h3>
            <p className="text-5xl font-bold text-pink-900">152 bpm</p>
            <p className="text-sm text-pink-700 mt-2">During workout</p>
          </Card>
        </div>

        {/* Weekly Trend Chart */}
        <Card className="rounded-[20px] p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-8 h-8" />
            Weekly Heart Rate Trend
          </h2>
          
          <div className="space-y-6">
            {/* Resting HR */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-600">Resting Heart Rate</h3>
              <div className="flex items-end justify-between h-32 gap-4">
                {weekData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <div className="w-full bg-red-500 rounded-t-lg transition-all hover:bg-red-600" 
                         style={{ height: `${(data.resting / 100) * 100}%` }}>
                    </div>
                    <p className="text-sm font-semibold mt-2">{data.day}</p>
                    <p className="text-xs text-muted-foreground">{data.resting}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Active HR */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-600">Active Heart Rate</h3>
              <div className="flex items-end justify-between h-32 gap-4">
                {weekData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                    <div className="w-full bg-orange-500 rounded-t-lg transition-all hover:bg-orange-600" 
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
        <Card className="rounded-[20px] p-8">
          <h2 className="text-3xl font-bold mb-6">Time in Heart Rate Zones (Today)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="p-6 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Rest</h3>
              <p className="text-3xl font-bold">18h 30m</p>
              <p className="text-sm text-muted-foreground">&lt;60 bpm</p>
            </div>
            <div className="p-6 bg-blue-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Light</h3>
              <p className="text-3xl font-bold">4h 20m</p>
              <p className="text-sm text-muted-foreground">60-100 bpm</p>
            </div>
            <div className="p-6 bg-green-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Moderate</h3>
              <p className="text-3xl font-bold">45m</p>
              <p className="text-sm text-muted-foreground">100-130 bpm</p>
            </div>
            <div className="p-6 bg-orange-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Hard</h3>
              <p className="text-3xl font-bold">15m</p>
              <p className="text-sm text-muted-foreground">130-150 bpm</p>
            </div>
            <div className="p-6 bg-red-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Peak</h3>
              <p className="text-3xl font-bold">5m</p>
              <p className="text-sm text-muted-foreground">&gt;150 bpm</p>
            </div>
          </div>
        </Card>

        {/* Insights */}
        <Card className="rounded-[20px] p-8 bg-gradient-to-br from-red-50 to-orange-50">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <TrendingDown className="w-8 h-8 text-green-600" />
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

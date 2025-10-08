import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Moon, TrendingUp, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const SleepDetails = () => {
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
    { day: "Mon", hours: 7.2 },
    { day: "Tue", hours: 8.1 },
    { day: "Wed", hours: 6.8 },
    { day: "Thu", hours: 7.5 },
    { day: "Fri", hours: 7.9 },
    { day: "Sat", hours: 8.5 },
    { day: "Sun", hours: 7.8 },
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
          <Moon className="w-12 h-12 text-purple-600" />
          <h1 className="text-5xl font-bold">Sleep Details</h1>
        </div>

        {/* Current Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="rounded-[20px] p-6 bg-gradient-to-br from-purple-50 to-purple-100">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">Last Night</h3>
            <p className="text-5xl font-bold text-purple-900">7.5 hrs</p>
            <p className="text-sm text-purple-700 mt-2">+0.5 hrs from average</p>
          </Card>

          <Card className="rounded-[20px] p-6 bg-gradient-to-br from-blue-50 to-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">7-Day Average</h3>
            <p className="text-5xl font-bold text-blue-900">7.7 hrs</p>
            <p className="text-sm text-blue-700 mt-2">Optimal range</p>
          </Card>

          <Card className="rounded-[20px] p-6 bg-gradient-to-br from-indigo-50 to-indigo-100">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">Sleep Quality</h3>
            <p className="text-5xl font-bold text-indigo-900">85%</p>
            <p className="text-sm text-indigo-700 mt-2">Excellent</p>
          </Card>
        </div>

        {/* Weekly Trend Chart */}
        <Card className="rounded-[20px] p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="w-8 h-8" />
              Weekly Sleep Trend
            </h2>
          </div>
          
          <div className="flex items-end justify-between h-64 gap-4">
            {weekData.map((data, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className="w-full bg-purple-500 rounded-t-lg transition-all hover:bg-purple-600" 
                     style={{ height: `${(data.hours / 10) * 100}%` }}>
                </div>
                <p className="text-sm font-semibold mt-2">{data.day}</p>
                <p className="text-xs text-muted-foreground">{data.hours}h</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Sleep Stages */}
        <Card className="rounded-[20px] p-8">
          <h2 className="text-3xl font-bold mb-6">Sleep Stages Breakdown</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-purple-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Awake</h3>
              <p className="text-3xl font-bold">0.5 hrs</p>
              <p className="text-sm text-muted-foreground">7%</p>
            </div>
            <div className="p-6 bg-blue-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Light Sleep</h3>
              <p className="text-3xl font-bold">4.2 hrs</p>
              <p className="text-sm text-muted-foreground">56%</p>
            </div>
            <div className="p-6 bg-indigo-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Deep Sleep</h3>
              <p className="text-3xl font-bold">1.8 hrs</p>
              <p className="text-sm text-muted-foreground">24%</p>
            </div>
            <div className="p-6 bg-violet-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">REM Sleep</h3>
              <p className="text-3xl font-bold">1.0 hrs</p>
              <p className="text-sm text-muted-foreground">13%</p>
            </div>
          </div>
        </Card>

        {/* Insights */}
        <Card className="rounded-[20px] p-8 bg-gradient-to-br from-purple-50 to-blue-50">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-8 h-8" />
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

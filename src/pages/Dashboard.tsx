import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const featureCards = [
    { title: "AI Coach", gradient: "from-[hsl(262,83%,58%)] to-[hsl(220,89%,61%)]", path: "/ai-coach" },
    { title: "Health Hub", gradient: "from-[hsl(0,84%,60%)] to-[hsl(340,82%,52%)]", path: "/health" },
    { title: "Nutrition Hub", gradient: "from-[hsl(142,76%,36%)] to-[hsl(122,39%,49%)]", path: "/nutrition" },
    { title: "Workout Hub", gradient: "from-[hsl(38,92%,50%)] to-[hsl(24,91%,48%)]", path: "/workouts" },
  ];

  const aiInsights = [
    { 
      gradient: "from-[hsl(0,84%,60%)] to-[hsl(340,82%,52%)]", 
      text: "Health Hub: Your heart rate recovery improved 15% this week",
      hub: "Health"
    },
    { 
      gradient: "from-[hsl(142,76%,36%)] to-[hsl(122,39%,49%)]", 
      text: "Nutrition Hub: Great protein intake - on track for muscle recovery",
      hub: "Nutrition"
    },
    { 
      gradient: "from-[hsl(38,92%,50%)] to-[hsl(24,91%,48%)]", 
      text: "Workout Hub: Recommended - Focus on serve power training today",
      hub: "Workout"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary via-secondary to-muted">
      {/* Header */}
      <div className="bg-gradient-to-b from-background via-background to-muted py-8">
        <h1 className="text-9xl font-bold text-center text-primary">ModoMatchee</h1>
      </div>
      <div className="h-4 bg-primary" />

      <div className="p-14 space-y-6">
        {/* Feature Cards Grid */}
        <div className="grid grid-cols-4 gap-6">
          {featureCards.map((card) => (
            <Card
              key={card.title}
              onClick={() => navigate(card.path)}
              className={`bg-gradient-to-br ${card.gradient} h-48 rounded-[20px] cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center border-0 shadow-lg`}
            >
              <h2 className="text-4xl font-bold text-white drop-shadow-lg">{card.title}</h2>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* AI Coach Insights */}
          <Card className="col-span-2 rounded-[20px] p-8 bg-white">
            <h2 className="text-4xl font-semibold mb-6">AI Coach Insights</h2>
            <div className="space-y-4">
              {aiInsights.map((insight, i) => (
                <div 
                  key={i} 
                  className={`bg-gradient-to-r ${insight.gradient} rounded-[20px] p-6 text-white text-xl font-semibold shadow-lg`}
                >
                  {insight.text}
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="rounded-[20px] p-8 bg-white">
            <h2 className="text-4xl mb-6">Quick Actions</h2>
            <div className="space-y-4">
              <Button 
                onClick={() => navigate("/ai-coach")}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-xl rounded-[20px]"
              >
                Ask AI Coach
              </Button>
              <Button 
                onClick={() => navigate("/log-meal")}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-xl rounded-[20px]"
              >
                Log Meal
              </Button>
              <Button 
                onClick={() => navigate("/calendar")}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-xl rounded-[20px]"
              >
                Match Calendar
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="rounded-[20px] p-8 bg-white">
          <h2 className="text-4xl font-semibold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="bg-muted rounded-[20px] p-6 text-foreground text-xl">
              Morning workout completed - 45 minutes
            </div>
            <div className="bg-muted rounded-[20px] p-6 text-foreground text-xl">
              Logged breakfast - 650 calories
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

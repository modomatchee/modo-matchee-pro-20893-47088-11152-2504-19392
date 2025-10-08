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
        <Card className="rounded-[20px] border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="w-6 h-6 text-purple-600" />
              <CardTitle className="text-purple-900">Sleep</CardTitle>
            </div>
            <CardDescription>Last night</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-purple-900">7.5 hrs</p>
            <p className="text-sm text-purple-700 mt-2">+0.5 hrs from average</p>
          </CardContent>
        </Card>

        <Card className="rounded-[20px] border-red-200 bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-600" />
              <CardTitle className="text-red-900">Heart Rate</CardTitle>
            </div>
            <CardDescription>Resting</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-900">65 bpm</p>
            <p className="text-sm text-red-700 mt-2">Normal range</p>
          </CardContent>
        </Card>

        <Card className="rounded-[20px] border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-blue-900">Respiratory Rate</CardTitle>
            </div>
            <CardDescription>Current</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-900">16/min</p>
            <p className="text-sm text-blue-700 mt-2">Optimal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="rounded-[20px] p-6">
          <h3 className="text-2xl font-bold mb-4">Sleep Trends</h3>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Chart placeholder</p>
          </div>
        </Card>

        <Card className="rounded-[20px] p-6">
          <h3 className="text-2xl font-bold mb-4">Heart Rate Trends</h3>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Chart placeholder</p>
          </div>
        </Card>
      </div>

      <Card className="rounded-[20px] p-6 mb-8">
        <h3 className="text-2xl font-bold mb-4">Respiratory Rate Trends</h3>
        <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Chart placeholder</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[20px] p-6 bg-primary text-white cursor-pointer hover:bg-primary/90 transition-colors" onClick={() => navigate("/medical-history")}>
          <h3 className="text-2xl font-bold mb-2">Update Your Medical History</h3>
          <p>Keep your health records up to date</p>
        </Card>

        <Card className="rounded-[20px] p-6 bg-accent hover:bg-accent/90 transition-colors cursor-pointer" onClick={() => navigate("/medications")}>
          <h3 className="text-2xl font-bold mb-2">Your Medications</h3>
          <p>Manage and track your medications</p>
        </Card>
      </div>
    </div>
  );
};

export default Health;

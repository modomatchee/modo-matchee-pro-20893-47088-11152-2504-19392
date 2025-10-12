import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NutritionGoals = () => {
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const goals = [
    { id: "lose-weight", label: "Lose Weight" },
    { id: "maintain-weight", label: "Maintain Weight" },
    { id: "gain-weight", label: "Gain Weight" },
    { id: "gain-muscle", label: "Gain Muscle" },
  ];

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(id => id !== goalId));
    } else if (selectedGoals.length < 3) {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-8xl font-bold text-primary mb-4">Profile Setup</h1>
          <p className="text-3xl font-bold text-primary">Your Nutrition Profile</p>
        </div>

        <p className="text-3xl font-bold text-center mb-12">
          Select up to 3 that are important to you, including one weight goal.
        </p>

        <div className="space-y-6 mb-12 max-w-md mx-auto">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`w-full h-20 rounded-[15px] text-3xl font-bold transition-all ${
                selectedGoals.includes(goal.id)
                  ? "bg-[#87d665] text-black"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {goal.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate("/onboarding/barriers")}
            className="bg-primary hover:bg-primary/90 text-white rounded-[20px] px-12 py-6 text-3xl font-bold h-auto"
          >
            Continue
          </Button>
          <Button
            onClick={() => navigate("/onboarding/general-info")}
            variant="outline"
            className="bg-primary hover:bg-primary/90 text-white rounded-[20px] px-12 py-6 text-3xl font-bold h-auto"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NutritionGoals;

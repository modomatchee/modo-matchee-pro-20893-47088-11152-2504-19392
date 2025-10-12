import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Barriers = () => {
  const navigate = useNavigate();
  const [selectedBarriers, setSelectedBarriers] = useState<string[]>([]);

  const barriers = [
    "Lack of Time",
    "Overly Strict Plan",
    "Stress",
    "Holidays/Social Events",
    "Lack of progress",
    "Pricey Healthy Food",
    "Cooking is inconvenient",
    "No Barriers",
  ];

  const toggleBarrier = (barrier: string) => {
    if (selectedBarriers.includes(barrier)) {
      setSelectedBarriers(selectedBarriers.filter(b => b !== barrier));
    } else {
      setSelectedBarriers([...selectedBarriers, barrier]);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-8xl font-bold text-primary mb-4">Profile Setup</h1>
          <p className="text-3xl font-bold text-primary">Your Nutrition Profile</p>
        </div>

        <p className="text-3xl text-center mb-12">
          In the past, what have been your barriers to your goal?<br/><br/>
          Select all that Apply
        </p>

        <div className="grid grid-cols-2 gap-6 mb-12">
          {barriers.map((barrier) => (
            <button
              key={barrier}
              onClick={() => toggleBarrier(barrier)}
              className={`h-20 rounded-[15px] text-3xl font-bold transition-all ${
                selectedBarriers.includes(barrier)
                  ? "bg-[#87d665] text-black"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {barrier}
            </button>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-primary hover:bg-primary/90 text-white rounded-[20px] px-12 py-6 text-3xl font-bold h-auto"
          >
            Continue
          </Button>
          <Button
            onClick={() => navigate("/onboarding/nutrition-goals")}
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

export default Barriers;

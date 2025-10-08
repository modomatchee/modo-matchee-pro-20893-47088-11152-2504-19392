import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Nutrition = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="min-h-screen bg-[#eaeaea] p-5 pb-20">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-black">Nutrition Hub</h1>
          <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
        </div>
      </header>

      {/* Top Section: Calories and Macros */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        {/* Calories Card */}
        <Card className="rounded-[44px] bg-white p-8">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-black mb-4">Calories</h2>
            <p className="text-xs text-center text-black mb-6">
              Remaining = Goal-Food + Exercise
            </p>
            
            {/* Calories Circle */}
            <div className="relative w-44 h-44 mb-4">
              <svg width="176" height="176" viewBox="0 0 176 176" className="transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="84"
                  stroke="#EBEBF0"
                  strokeWidth="6.5"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <p className="text-4xl font-bold text-black">1,200</p>
                <p className="text-xs text-gray-500">Remaining</p>
              </div>
            </div>

            {/* Base Goal Indicator */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-4 bg-black"></div>
                <svg width="6" height="9" viewBox="0 0 6 9" className="fill-white">
                  <path d="M0.714355 4.5L5.42864 0.602886L5.42864 8.39711L0.714355 4.5Z" fill="black" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-xs text-black">Base Goal</p>
                <p className="text-[15px] font-bold text-black">2680</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Macros Card */}
        <Card className="rounded-[44px] bg-white p-8">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-black mb-8">Macros</h2>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Carbohydrates */}
              <div className="flex flex-col items-center">
                <div className="relative w-44 h-44 mb-2">
                  <svg width="176" height="176" viewBox="0 0 176 176" className="transform -rotate-90">
                    <circle
                      cx="88"
                      cy="88"
                      r="84"
                      stroke="#FFA500"
                      strokeWidth="6.5"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-2xl font-bold text-black">120g</p>
                  </div>
                </div>
                <p className="text-xs text-center text-black">Carbohydrates</p>
              </div>

              {/* Fats */}
              <div className="flex flex-col items-center">
                <div className="relative w-44 h-44 mb-2">
                  <svg width="176" height="176" viewBox="0 0 176 176" className="transform -rotate-90">
                    <circle
                      cx="88"
                      cy="88"
                      r="84"
                      stroke="#FFFF00"
                      strokeWidth="6.5"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-2xl font-bold text-black">45g</p>
                  </div>
                </div>
                <p className="text-xs text-center text-black">Fats</p>
              </div>

              {/* Protein */}
              <div className="flex flex-col items-center">
                <div className="relative w-44 h-44 mb-2">
                  <svg width="176" height="176" viewBox="0 0 176 176" className="transform -rotate-90">
                    <circle
                      cx="88"
                      cy="88"
                      r="84"
                      stroke="#FF0000"
                      strokeWidth="6.5"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-2xl font-bold text-black">80g</p>
                  </div>
                </div>
                <p className="text-xs text-center text-black">Protein</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Meal Plan Section */}
      <Card className="rounded-[29px] bg-white p-8 relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-black">Meal Plan</h2>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate("/nutrition-details")}
              variant="outline"
              className="rounded-[20px] text-[24px] px-6 py-5 h-auto"
            >
              View Details
            </Button>
            <Button 
              onClick={() => navigate("/log-meal")}
              className="rounded-[20px] bg-[#ffd602] hover:bg-[#e6c102] text-black border border-black/10 text-[40px] px-8 py-6 h-auto"
            >
              Log Meal
            </Button>
          </div>
        </div>

        {/* Weekly Meal Grid */}
        <div className="grid grid-cols-7 gap-4 mt-12">
          {days.map((day) => (
            <div key={day} className="flex flex-col items-center">
              <p className="text-[15px] text-center text-black mb-4">{day}</p>
              <div 
                className={`w-[178px] h-[178px] bg-[#d9d9d9] cursor-pointer transition-all hover:bg-[#c9c9c9] ${
                  selectedDay === day ? 'ring-2 ring-black' : ''
                }`}
                onClick={() => setSelectedDay(day)}
              ></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Nutrition;

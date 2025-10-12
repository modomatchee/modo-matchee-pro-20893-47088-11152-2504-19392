import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const GeneralInfo = () => {
  const navigate = useNavigate();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [dietType, setDietType] = useState("");

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-8xl font-bold text-primary mb-4">Profile Setup</h1>
          <p className="text-3xl font-bold text-primary">General User Information</p>
        </div>

        <div className="space-y-8 mb-12">
          <div>
            <label className="text-lg font-medium text-[#36454f] mb-2 block">Height</label>
            <Input
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter your height"
              className="h-12 rounded-[20px] bg-[#d3d3d3]"
            />
          </div>

          <div>
            <label className="text-lg font-medium text-[#36454f] mb-2 block">Weight</label>
            <Input
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
              className="h-12 rounded-[20px] bg-[#d3d3d3]"
            />
          </div>

          <div>
            <label className="text-lg font-medium text-[#36454f] mb-2 block">Diet type</label>
            <Select value={dietType} onValueChange={setDietType}>
              <SelectTrigger className="h-12 rounded-[20px] bg-[#d3d3d3]">
                <SelectValue placeholder="Select your diet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="paleo">Paleo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate("/onboarding/nutrition-goals")}
            className="bg-primary hover:bg-primary/90 text-white rounded-[20px] px-12 py-6 text-3xl font-bold h-auto"
          >
            Continue
          </Button>
          <Button
            onClick={() => navigate("/onboarding/health-info")}
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

export default GeneralInfo;

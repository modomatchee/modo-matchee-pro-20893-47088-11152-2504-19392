import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

const HealthInfo = () => {
  const navigate = useNavigate();
  const [healthInfo, setHealthInfo] = useState("");

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-8xl font-bold text-primary mb-4">Profile Setup</h1>
          <p className="text-3xl font-bold text-primary">User Health Information</p>
        </div>

        <div className="mb-8">
          <p className="text-lg font-medium text-[#36454f] mb-4">
            Medical health history/conditions
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-[10px] bg-[#d9d9d9] p-12 text-center min-h-[114px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
            <Upload className="w-12 h-12 text-black/30 mb-2" />
            <p className="text-xl font-semibold text-black/30">
              Upload File Here<br />or<br />Type in any medical conditions
            </p>
          </div>
          <Textarea
            value={healthInfo}
            onChange={(e) => setHealthInfo(e.target.value)}
            placeholder="Type any medical conditions or health information..."
            className="mt-4 min-h-[100px]"
          />
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate("/onboarding/general-info")}
            className="bg-primary hover:bg-primary/90 text-white rounded-[20px] px-12 py-6 text-3xl font-bold h-auto"
          >
            Continue
          </Button>
          <Button
            onClick={() => navigate("/onboarding/welcome")}
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

export default HealthInfo;

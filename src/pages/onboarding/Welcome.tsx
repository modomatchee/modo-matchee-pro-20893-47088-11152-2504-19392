import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-[rgba(0,0,0,0.78)] to-[rgba(118,118,118,0.78)] relative">
      <div className="absolute top-2 left-2">
        <div className="w-16 h-16 bg-white/20 rounded-full" />
      </div>
      <div className="absolute top-2 right-20">
        <div className="w-26 h-16 bg-white/20 rounded" />
      </div>
      <div className="absolute top-6 right-6 space-y-2">
        <div className="w-12 h-1 bg-white rounded" />
        <div className="w-12 h-1 bg-white rounded" />
        <div className="w-12 h-1 bg-white rounded" />
      </div>

      <div className="text-center max-w-4xl px-8">
        <h1 className="text-8xl font-bold text-primary mb-12">
          CONGRATULATIONS!!!
        </h1>
        <p className="text-4xl font-bold text-white mb-24">
          Your account is setup, you may edit your information anytime
        </p>
        <p className="text-6xl font-bold text-primary mb-12">
          Welcome to Tennis Edge
        </p>
        <Button
          onClick={() => navigate("/onboarding/health-info")}
          className="bg-primary hover:bg-primary/90 text-white rounded-[20px] px-12 py-6 text-3xl font-bold h-auto"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Welcome;

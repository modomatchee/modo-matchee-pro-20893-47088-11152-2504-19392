import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { loginSchema } from "@/lib/validation";
import { z } from "zod";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validated = loginSchema.parse({
        email: email.trim(),
        password,
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: validated.email,
        password: validated.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--foreground))] flex">
      {/* Left Side - Hero Content */}
      <div className="flex-1 flex flex-col justify-between p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-full" />
          <h1 className="text-6xl font-bold text-primary">
            Modo<br />Matchee
          </h1>
        </div>
        
        <div className="max-w-2xl space-y-8">
          <h2 className="text-5xl font-bold leading-tight">
            Welcome to your AI-Powered Tennis Edge
          </h2>
          <p className="text-4xl font-bold">"A smart hub built by athletes, for athletes."</p>
          
          <div className="space-y-6 text-4xl font-bold">
            <p>Combines custom training, nutrition guidance, and science-based tools</p>
            <p>Accessible platform for student-athletes</p>
            <p>Personalized Training & Nutrition Plans (via AI)</p>
            <p>Interviews & Real Stories</p>
          </div>
        </div>

        <div className="w-12 h-8 space-y-2">
          <div className="h-1 bg-white rounded" />
          <div className="h-1 bg-white rounded" />
          <div className="h-1 bg-white rounded" />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-[530px] bg-white rounded-tl-3xl rounded-tr-3xl flex flex-col p-10">
        <div className="mb-8">
          <p className="text-xs text-muted-foreground mb-2">WELCOME BACK</p>
          <h2 className="text-2xl font-semibold">Log In to your Account</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 flex-1">
          <div className="space-y-4">
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-2 text-xs text-muted-foreground">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johnsondoe@nomail.com"
                className="h-14 rounded-lg"
              />
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-2 text-xs text-muted-foreground">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="***************"
                className="h-14 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Checkbox checked={rememberMe} onCheckedChange={(checked) => setRememberMe(!!checked)} />
              <label>Remember me</label>
            </div>
            <button type="button" className="font-medium text-foreground hover:underline">
              Forgot Password?
            </button>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 bg-primary text-white hover:bg-primary/90 text-xs font-bold"
            disabled={isLoading}
          >
            {isLoading ? "LOGGING IN..." : "CONTINUE"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs font-bold">Or</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-xl font-bold"
            >
              Log In with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-xl font-bold"
            >
              Log In with Facebook
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-xl font-bold"
            >
              Log In with Apple
            </Button>
          </div>
        </form>

        <p className="text-center text-xs mt-6">
          New User?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="font-bold hover:underline text-primary"
          >
            SIGN UP HERE
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

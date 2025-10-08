import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Health from "./pages/Health";
import Nutrition from "./pages/Nutrition";
import Calendar from "./pages/Calendar";
import AICoach from "./pages/AICoach";
import Workouts from "./pages/Workouts";
import CreateWorkout from "./pages/CreateWorkout";
import LogMeal from "./pages/LogMeal";
import ExerciseVideos from "./pages/ExerciseVideos";
import ExerciseDetails from "./pages/ExerciseDetails";
import Medications from "./pages/Medications";
import MedicalHistory from "./pages/MedicalHistory";
import ImportMedical from "./pages/ImportMedical";
import MedicationTracker from "./pages/MedicationTracker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/health" element={<Health />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/ai-coach" element={<AICoach />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/create-workout" element={<CreateWorkout />} />
          <Route path="/log-meal" element={<LogMeal />} />
          <Route path="/exercise-videos" element={<ExerciseVideos />} />
          <Route path="/exercise-details/:id" element={<ExerciseDetails />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/medical-history" element={<MedicalHistory />} />
          <Route path="/import-medical" element={<ImportMedical />} />
          <Route path="/medication-tracker" element={<MedicationTracker />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

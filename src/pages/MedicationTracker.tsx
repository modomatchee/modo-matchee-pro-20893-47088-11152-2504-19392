import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const MedicationTracker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }
  const [medications, setMedications] = useState([
    { id: "1", name: "Lisinopril", dosage: "10mg", frequency: "Once daily", time: "08:00", times: undefined, taken: true, takenAt: "9/30/2025, 8:15:23 AM" },
    { id: "2", name: "Metformin", dosage: "500mg", frequency: "Twice daily", time: undefined, times: ["08:00", "20:00"], taken: false, takenAt: undefined },
  ]);

  const handleMarkTaken = (id: string) => {
    setMedications(medications.map(m => 
      m.id === id ? { ...m, taken: true, takenAt: new Date().toLocaleString() } : m
    ));
    toast({ title: "Medication marked as taken" });
  };

  const takenCount = medications.filter(m => m.taken).length;
  const pendingCount = medications.filter(m => !m.taken).length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500" />
            <h1 className="text-2xl font-bold text-blue-500">MediTrack</h1>
          </div>
          <nav className="flex items-center gap-6">
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <div className="w-5 h-5 rounded bg-gray-600" />
              Dashboard
            </button>
            <button onClick={() => navigate("/health")} className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <div className="w-5 h-5 rounded bg-gray-600" />
              Health Dashboard
            </button>
            <button onClick={() => navigate("/medications")} className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <div className="w-5 h-5 rounded bg-gray-600" />
              Medications
            </button>
            <button onClick={() => navigate("/medical-history")} className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <div className="w-5 h-5 rounded bg-gray-600" />
              History
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-9 py-8">
        {/* Hero Card */}
        <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg p-8 mb-8">
          <h2 className="text-[28px] font-bold text-white mb-2">Today's Medications</h2>
          <p className="text-base text-blue-200">Tuesday, September 30, 2025</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card className="rounded-xl shadow-sm p-5 border-l-4 border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-2">Taken Today</p>
                <p className="text-[32px] font-bold text-emerald-500">{takenCount}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="rounded-xl shadow-sm p-5 border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-2">Pending</p>
                <p className="text-[32px] font-bold text-amber-500">{pendingCount}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-amber-500 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-2">Active Meds</p>
                <p className="text-[32px] font-bold text-blue-500">{medications.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500" />
            </div>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card className="rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-6 rounded bg-blue-500" />
            <h3 className="text-xl font-bold text-gray-900">Today's Schedule</h3>
          </div>

          <div className="space-y-4">
            {medications.map((med) => (
              <div
                key={med.id}
                className={`rounded-xl border-2 p-5 ${
                  med.taken
                    ? 'bg-emerald-50 border-emerald-100'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{med.name}</h4>
                    <p className="text-sm text-gray-500">{med.dosage} - {med.frequency}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <p className="text-sm text-gray-500">
                        {med.times ? med.times.join(", ") : med.time}
                      </p>
                    </div>
                    {med.taken && med.takenAt && (
                      <p className="text-sm text-gray-500 mt-1">Last taken: {med.takenAt}</p>
                    )}
                  </div>
                  
                  {med.taken ? (
                    <Button disabled className="rounded-3xl bg-emerald-500">
                      <Check className="w-5 h-5" />
                      Taken
                    </Button>
                  ) : (
                    <Button onClick={() => handleMarkTaken(med.id)} className="rounded-3xl bg-blue-500 hover:bg-blue-600">
                      Mark as Taken
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default MedicationTracker;

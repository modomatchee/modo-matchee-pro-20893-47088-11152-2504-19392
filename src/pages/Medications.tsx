import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Medications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading } = useAuth();
  const [medications, setMedications] = useState([
    {
      id: "1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      schedule: ["08:00"],
      startDate: "2025-01-15",
      isActive: true,
    },
    {
      id: "2",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      schedule: ["08:00", "20:00"],
      startDate: "2025-02-01",
      isActive: true,
    },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newMed, setNewMed] = useState({
    name: "",
    dosage: "",
    frequency: "",
    schedule: "",
    startDate: "",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const handleAddMedication = async () => {
    if (!newMed.name || !newMed.dosage) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const scheduleArray = newMed.schedule.split(",").map(s => s.trim());
    
    setMedications([...medications, {
      id: Date.now().toString(),
      name: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency,
      schedule: scheduleArray,
      startDate: newMed.startDate,
      isActive: true,
    }]);

    setShowAddDialog(false);
    setNewMed({ name: "", dosage: "", frequency: "", schedule: "", startDate: "" });
    toast({ title: "Medication added successfully" });
  };

  const handleDelete = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
    toast({ title: "Medication removed" });
  };

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
            <button className="flex items-center gap-2 text-sm font-medium text-gray-600">
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

      <main className="max-w-7xl mx-auto px-20 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[28px] font-bold text-gray-900">My Medications</h2>
          <div className="flex gap-3">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="rounded-3xl bg-blue-500 hover:bg-blue-600">
                  <Plus className="w-5 h-5" />
                  Add Medication
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Medication</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Medication Name</Label>
                    <Input value={newMed.name} onChange={(e) => setNewMed({...newMed, name: e.target.value})} />
                  </div>
                  <div>
                    <Label>Dosage</Label>
                    <Input value={newMed.dosage} onChange={(e) => setNewMed({...newMed, dosage: e.target.value})} placeholder="e.g., 10mg" />
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <Input value={newMed.frequency} onChange={(e) => setNewMed({...newMed, frequency: e.target.value})} placeholder="e.g., Once daily" />
                  </div>
                  <div>
                    <Label>Schedule (comma-separated times)</Label>
                    <Input value={newMed.schedule} onChange={(e) => setNewMed({...newMed, schedule: e.target.value})} placeholder="e.g., 08:00, 20:00" />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input type="date" value={newMed.startDate} onChange={(e) => setNewMed({...newMed, startDate: e.target.value})} />
                  </div>
                  <Button onClick={handleAddMedication} className="w-full bg-blue-500 hover:bg-blue-600">Add Medication</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={() => navigate("/import-medical")} className="rounded-3xl bg-blue-500 hover:bg-blue-600">
              <Upload className="w-5 h-5" />
              Import Document
            </Button>
          </div>
        </div>

        {/* Active Medications */}
        <Card className="rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-emerald-500 mb-4">Active Medications</h3>
          <div className="space-y-4">
            {medications.filter(m => m.isActive).map((med) => (
              <div key={med.id} className="rounded-xl border border-gray-200 p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{med.name}</h4>
                  <p className="text-sm text-gray-500">{med.dosage} - {med.frequency}</p>
                  <p className="text-sm text-gray-500">Schedule: {med.schedule.join(", ")}</p>
                  <p className="text-sm text-gray-500">Started: {med.startDate}</p>
                </div>
                <Button onClick={() => handleDelete(med.id)} variant="destructive" size="lg" className="bg-red-50 hover:bg-red-100 text-red-500">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Inactive Medications */}
        <Card className="rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-500 mb-4">Inactive Medications</h3>
          <p className="text-center text-gray-500 py-16">No inactive medications</p>
        </Card>
      </main>
    </div>
  );
};

export default Medications;

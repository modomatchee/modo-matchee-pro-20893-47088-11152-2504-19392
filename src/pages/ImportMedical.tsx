import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Plus, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const ImportMedical = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedMeds, setExtractedMeds] = useState([
    { name: "Amlodipine", dosage: "5mg", frequency: "Once daily", suggestedTime: "09:00" },
    { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily at bedtime", suggestedTime: "22:00" },
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      toast({ title: "Document uploaded successfully" });
    }
  };

  const handleAddMedication = (medName: string) => {
    toast({ title: `${medName} added to your medications` });
    setExtractedMeds(extractedMeds.filter(m => m.name !== medName));
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

      <main className="max-w-4xl mx-auto px-20 py-12">
        {/* Upload Section */}
        <Card className="rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-[28px] font-bold text-gray-900 mb-6">Import Medical Document</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-16 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-lg bg-gray-400 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Doctor Summary or Medical Document
              </h3>
              <p className="text-base text-gray-500 mb-4">
                PDF, DOC, DOCX, TXT files supported
              </p>
              <label htmlFor="file-upload">
                <Button className="rounded-3xl bg-blue-500 hover:bg-blue-600" asChild>
                  <span>
                    Choose File
                  </span>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
              </label>
              {selectedFile && (
                <p className="mt-3 text-sm text-gray-600">{selectedFile.name}</p>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-blue-50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              <h4 className="text-base font-semibold text-gray-900">What happens after upload?</h4>
            </div>
            <ul className="ml-7 space-y-2 text-sm text-gray-700">
              <li>Document will be added to your medical history</li>
              <li>Medications will be automatically extracted</li>
              <li>You can review and add medications to your list</li>
            </ul>
          </div>
        </Card>

        {/* Extracted Medications */}
        {extractedMeds.length > 0 && (
          <Card className="rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Extracted Medications</h3>
            </div>
            <p className="text-base text-gray-500 mb-6">
              We found these medications in your document. Click to add them to your medication list.
            </p>
            
            <div className="space-y-4">
              {extractedMeds.map((med, idx) => (
                <div key={idx} className="rounded-xl bg-blue-50 border border-blue-200 p-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-gray-900">{med.name}</h4>
                    <p className="text-sm text-gray-500">{med.dosage} - {med.frequency}</p>
                    <p className="text-sm text-gray-500">Suggested time: {med.suggestedTime}</p>
                  </div>
                  <Button onClick={() => handleAddMedication(med.name)} className="rounded-3xl bg-blue-500 hover:bg-blue-600">
                    <Plus className="w-5 h-5" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ImportMedical;

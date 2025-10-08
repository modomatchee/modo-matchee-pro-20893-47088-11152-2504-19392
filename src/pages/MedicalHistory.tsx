import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const MedicalHistory = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const [expandedId, setExpandedId] = useState<string | null>("1");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const records = [
    {
      id: "1",
      title: "Doctor Visit",
      type: "Consultation",
      date: "2025-09-15",
      provider: "Dr. Sarah Smith",
      summary: "Annual checkup - Blood pressure elevated. Recommended continuing Lisinopril 10mg daily. Patient reports good adherence to medication schedule.",
      medications: ["Lisinopril 10mg"],
    },
    {
      id: "2",
      title: "Lab Results",
      type: "Laboratory",
      date: "2025-08-20",
      provider: "Dr. Michael Johnson",
      summary: "Complete blood count and metabolic panel performed. All values within normal range.",
      medications: [],
    },
  ];

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
            <button className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <div className="w-5 h-5 rounded bg-gray-600" />
              History
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-[129px] py-12">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[28px] font-bold text-gray-900">Medical History</h2>
          <Button onClick={() => navigate("/import-medical")} className="rounded-3xl bg-blue-500 hover:bg-blue-600">
            <Upload className="w-5 h-5" />
            Import Document
          </Button>
        </div>

        {/* Records */}
        <Card className="rounded-xl shadow-sm">
          <div className="divide-y divide-gray-200">
            {records.map((record) => (
              <div key={record.id}>
                {/* Record Header */}
                <div className="bg-gray-50 p-5 flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}>
                  <div className="flex items-center gap-[18px]">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-500 rounded" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{record.title}</h3>
                      <p className="text-sm text-gray-500">{record.date} - {record.provider}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform ${expandedId === record.id ? 'rotate-180' : ''}`} />
                </div>

                {/* Expanded Content */}
                {expandedId === record.id && (
                  <div className="p-5 border-t border-gray-200">
                    <p className="font-semibold text-gray-900 mb-2">Summary:</p>
                    <p className="text-sm text-gray-700 mb-6">{record.summary}</p>
                    
                    {record.medications.length > 0 && (
                      <div className="rounded-lg bg-blue-50 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-[18px] h-[18px] rounded bg-blue-500" />
                          <p className="text-sm font-semibold text-gray-900">Medications Mentioned:</p>
                        </div>
                        <ul className="ml-10 space-y-1">
                          {record.medications.map((med, idx) => (
                            <li key={idx} className="text-sm text-gray-700">{med}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default MedicalHistory;

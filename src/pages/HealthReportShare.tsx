import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Printer, Mail, Share2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const HealthReportShare = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
    toast.success("Opening print dialog...");
  };

  const handleExport = async (format: 'pdf' | 'csv') => {
    setIsGenerating(true);
    // Simulate export generation
    setTimeout(() => {
      setIsGenerating(false);
      toast.success(`Health report exported as ${format.toUpperCase()}`);
    }, 2000);
  };

  const handleEmail = () => {
    toast.success("Email sharing feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-secondary p-8">
      <Button
        onClick={() => navigate("/health")}
        variant="outline"
        className="mb-6 print:hidden"
      >
        ← Back to Health Hub
      </Button>

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <div className="flex items-center gap-4">
            <FileText className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold">Health Report</h1>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handlePrint} variant="outline" size="lg">
              <Printer className="mr-2" />
              Print
            </Button>
            <Button onClick={() => handleExport('pdf')} variant="outline" size="lg" disabled={isGenerating}>
              <Download className="mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => handleExport('csv')} variant="outline" size="lg" disabled={isGenerating}>
              <Download className="mr-2" />
              Export CSV
            </Button>
            <Button onClick={handleEmail} size="lg">
              <Share2 className="mr-2" />
              Share via Email
            </Button>
          </div>
        </div>

        {/* Report Preview */}
        <Card className="rounded-[20px] p-12 bg-white print:shadow-none">
          {/* Header */}
          <div className="border-b-2 border-gray-300 pb-6 mb-8">
            <h2 className="text-4xl font-bold mb-2">Personal Health Report</h2>
            <p className="text-lg text-muted-foreground">Generated on {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>

          {/* Summary Stats */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Health Summary</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Average Sleep</p>
                <p className="text-3xl font-bold">7.7 hrs/night</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Resting Heart Rate</p>
                <p className="text-3xl font-bold">65 bpm</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Respiratory Rate</p>
                <p className="text-3xl font-bold">15.4 /min</p>
              </div>
            </div>
          </div>

          {/* Sleep Analysis */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Sleep Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-semibold">Average Sleep Duration</span>
                <span>7.7 hours</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-semibold">Sleep Quality Score</span>
                <span>85% (Excellent)</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-semibold">Deep Sleep Average</span>
                <span>1.8 hours (24%)</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-semibold">REM Sleep Average</span>
                <span>1.0 hours (13%)</span>
              </div>
            </div>
          </div>

          {/* Heart Rate Analysis */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Cardiovascular Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-semibold">Resting Heart Rate</span>
                <span>65 bpm (Normal)</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-semibold">Average Active Heart Rate</span>
                <span>78 bpm</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-semibold">Maximum Heart Rate</span>
                <span>152 bpm</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-semibold">Heart Rate Variability</span>
                <span>Good</span>
              </div>
            </div>
          </div>

          {/* Respiratory Analysis */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Respiratory Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-semibold">Average Respiratory Rate</span>
                <span>15.4 breaths/min (Optimal)</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-semibold">Exercise Response</span>
                <span>28 breaths/min (Healthy)</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-semibold">Recovery Time</span>
                <span>3 minutes (Good)</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded">
                <span className="font-semibold">Breathing Pattern</span>
                <span>Excellent Consistency</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t-2 border-gray-300">
            <p className="text-sm text-muted-foreground text-center">
              This report is generated based on your health data tracked through ModoMatchee Health Hub.
              For medical advice, please consult with a healthcare professional.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HealthReportShare;

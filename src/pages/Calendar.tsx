import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Calendar = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = Array.from({ length: 35 }, (_, i) => i + 1);

  const upcomingEvents = [
    { title: "Team Meeting", time: "Today, 2:00 PM" },
    { title: "Training Session", time: "Tomorrow, 10:00 AM" },
    { title: "Match Day", time: "Friday, 3:00 PM" },
  ];

  return (
    <div className="min-h-screen bg-secondary p-8">
      <Button
        onClick={() => navigate("/dashboard")}
        variant="outline"
        className="mb-6"
      >
        ← Back to Dashboard
      </Button>
      
      <Card className="rounded-[20px] p-8 bg-white">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold">Calendar</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-[20px]">
                <ChevronLeft />
              </Button>
              <span className="text-xl font-bold">Previous</span>
              <span className="text-xl font-bold">Next</span>
              <Button variant="ghost" size="icon" className="rounded-[20px]">
                <ChevronRight />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Input
              placeholder="Search events..."
              className="w-80 rounded-[20px]"
            />
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-[20px] h-12 px-6">
              <Plus className="mr-2" /> New Event
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3 space-y-6">
            <Card className="rounded-[20px] p-6 bg-muted">
              <h3 className="text-2xl font-bold mb-4">View Options</h3>
              <div className="space-y-4">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-[20px] justify-start text-lg font-bold">
                  Monthly View
                </Button>
                <Button variant="ghost" className="w-full justify-start text-lg font-bold">
                  Weekly View
                </Button>
                <Button variant="ghost" className="w-full justify-start text-lg font-bold">
                  Daily View
                </Button>
              </div>
            </Card>

            <Card className="rounded-[20px] p-6 bg-muted">
              <h3 className="text-2xl font-bold mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {upcomingEvents.map((event, i) => (
                  <div key={i} className="bg-primary/20 rounded-[20px] p-4">
                    <p className="text-lg font-bold">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Calendar Grid */}
          <div className="col-span-9">
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-xs font-bold p-2">
                  {day}
                </div>
              ))}
              {calendarDays.map((day) => (
                <Card
                  key={day}
                  className="aspect-square bg-white hover:bg-muted cursor-pointer transition-colors rounded flex items-start justify-start p-2"
                >
                  <span className="text-lg font-bold">{day}</span>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Calendar;

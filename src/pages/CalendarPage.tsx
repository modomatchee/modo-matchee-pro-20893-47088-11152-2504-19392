import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  start_time: string;
  end_time: string;
  location?: string;
  color?: string;
}

const CalendarPage = () => {
  const navigate = useNavigate();
  const { loading, session } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "other",
    start_time: "",
    end_time: "",
    location: "",
  });

  useEffect(() => {
    if (session?.user) {
      fetchEvents();
    }
  }, [session, currentDate]);

  const fetchEvents = async () => {
    try {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);

      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('start_time', start.toISOString())
        .lte('start_time', end.toISOString())
        .order('start_time');

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    }
  };

  const handleCreateEvent = async () => {
    if (!formData.title || !formData.start_time || !formData.end_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('calendar_events')
        .insert([{
          user_id: session?.user.id,
          ...formData,
        }]);

      if (error) throw error;
      
      toast.success('Event created successfully');
      setIsDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        event_type: "other",
        start_time: "",
        end_time: "",
        location: "",
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'workout': return 'bg-orange-500';
      case 'meal': return 'bg-green-500';
      case 'match': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start_time), day)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

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
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-[20px]"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <ChevronLeft />
              </Button>
              <span className="text-xl font-bold min-w-[200px] text-center">
                {format(currentDate, 'MMMM yyyy')}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-[20px]"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-[20px] h-12 px-6">
                <Plus className="mr-2" /> New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Event title"
                  />
                </div>
                <div>
                  <Label>Event Type *</Label>
                  <Select value={formData.event_type} onValueChange={(value) => setFormData({ ...formData, event_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workout">Workout</SelectItem>
                      <SelectItem value="meal">Meal</SelectItem>
                      <SelectItem value="match">Match</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Time *</Label>
                    <Input
                      type="datetime-local"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>End Time *</Label>
                    <Input
                      type="datetime-local"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Event location"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Event description"
                    rows={3}
                  />
                </div>
                <Button onClick={handleCreateEvent} className="w-full">
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center text-sm font-bold p-2 bg-muted rounded">
              {day}
            </div>
          ))}
          {calendarDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            return (
              <Card
                key={day.toString()}
                className={`min-h-[120px] bg-white hover:bg-muted cursor-pointer transition-colors rounded p-2 ${
                  !isSameMonth(day, currentDate) ? 'opacity-50' : ''
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-bold">{format(day, 'd')}</span>
                </div>
                <div className="space-y-1">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded ${getEventColor(event.event_type)} text-white truncate group relative`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate flex-1">{event.title}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Event Legend */}
        <div className="mt-6 flex gap-6 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm">Workout</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">Meal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm">Match</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm">Other</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CalendarPage;

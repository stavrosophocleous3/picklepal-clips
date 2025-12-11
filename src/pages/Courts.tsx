import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/MobileNav";
import { ProfileSheet } from "@/components/ProfileSheet";
import { MapPin, Clock, Calendar as CalendarIcon, CloudRain, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// Mock reservation data with player names for demo
const mockReservations: Record<number, Record<string, { players: string[]; bookedBy: string }>> = {
  1: { 
    "8:00 AM-9:30 AM": { players: ["Mike Chen", "Sarah Lee", "Tom Wilson", "Amy Park"], bookedBy: "Mike Chen" },
    "2:00 PM-3:30 PM": { players: ["John Smith", "Lisa Brown", "David Kim", "Emma White"], bookedBy: "John Smith" },
  },
  2: { 
    "9:30 AM-11:00 AM": { players: ["Carlos Rivera", "Nina Patel", "Jake Moore", "Mia Thompson"], bookedBy: "Carlos Rivera" },
    "5:00 PM-6:30 PM": { players: ["Alex Johnson", "Rachel Green", "Chris Martin", "Kate Wilson"], bookedBy: "Alex Johnson" },
  },
  3: { 
    "11:00 AM-12:30 PM": { players: ["Brian Lee", "Sophia Chen", "Mark Davis", "Julia Roberts"], bookedBy: "Brian Lee" },
  },
  5: { 
    "8:00 AM-9:30 AM": { players: ["Tony Stark", "Bruce Wayne", "Clark Kent", "Diana Prince"], bookedBy: "Tony Stark" },
    "12:30 PM-2:00 PM": { players: ["Peter Parker", "Mary Jane", "Gwen Stacy", "Miles Morales"], bookedBy: "Peter Parker" },
    "6:30 PM-8:00 PM": { players: ["Steve Rogers", "Natasha Romanoff", "Sam Wilson", "Bucky Barnes"], bookedBy: "Steve Rogers" },
  },
};

const Courts = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{ start: string; end: string }[]>([]);
  const [finalTimeSlot, setFinalTimeSlot] = useState<{ start: string; end: string } | null>(null);
  const [selectedCourt, setSelectedCourt] = useState<{ id: number; name: string } | null>(null);
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [timeSlotDialogOpen, setTimeSlotDialogOpen] = useState(false);
  const [courtDialogOpen, setCourtDialogOpen] = useState(false);
  const [finalSlotDialogOpen, setFinalSlotDialogOpen] = useState(false);
  const [namesDialogOpen, setNamesDialogOpen] = useState(false);
  const [playerNames, setPlayerNames] = useState<string[]>(["", "", "", ""]);
  const [bookedSlots, setBookedSlots] = useState<Map<number, Set<string>>>(new Map());
  const [showCourts, setShowCourts] = useState(false);
  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [joinedSocial, setJoinedSocial] = useState(false);
  const [socialAttendees, setSocialAttendees] = useState(12);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [previewCourt, setPreviewCourt] = useState<{ id: number; name: string } | null>(null);
  const [showClosureAlert, setShowClosureAlert] = useState(true);

  const handleJoinSocial = () => {
    if (!joinedSocial) {
      setJoinedSocial(true);
      setSocialAttendees(prev => prev + 1);
      toast({
        title: "You're in! 🎾",
        description: "See you at the PB Social on Friday at 6 PM!",
      });
    } else {
      setJoinedSocial(false);
      setSocialAttendees(prev => prev - 1);
      toast({
        title: "RSVP Cancelled",
        description: "You've been removed from the PB Social",
      });
    }
    setSocialDialogOpen(false);
  };

  const handleCourtPreview = (court: { id: number; name: string }) => {
    setPreviewCourt(court);
    setScheduleDialogOpen(true);
  };

  const handleConfirmCourtFromSchedule = () => {
    if (previewCourt) {
      setSelectedCourt(previewCourt);
      setScheduleDialogOpen(false);
      setFinalSlotDialogOpen(true);
    }
  };

  const courts = [
    // A Courts (A1-A8)
    { id: 1, name: "A1", available: true },
    { id: 2, name: "A2", available: true },
    { id: 3, name: "A3", available: true },
    { id: 4, name: "A4", available: true },
    { id: 5, name: "A5", available: true },
    { id: 6, name: "A6", available: true },
    { id: 7, name: "A7", available: true },
    { id: 8, name: "A8", available: true },
    // B Courts (B1-B8)
    { id: 9, name: "B1", available: true },
    { id: 10, name: "B2", available: true },
    { id: 11, name: "B3", available: true },
    { id: 12, name: "B4", available: true },
    { id: 13, name: "B5", available: true },
    { id: 14, name: "B6", available: true },
    { id: 15, name: "B7", available: true },
    { id: 16, name: "B8", available: true },
    // C Courts (C1-C6)
    { id: 17, name: "C1", available: true },
    { id: 18, name: "C2", available: true },
    { id: 19, name: "C3", available: true },
    { id: 20, name: "C4", available: true },
    { id: 21, name: "C5", available: true },
    { id: 22, name: "C6", available: true },
    // D Courts (D1-D4)
    { id: 23, name: "D1", available: true },
    { id: 24, name: "D2", available: true },
    { id: 25, name: "D3", available: true },
    { id: 26, name: "D4", available: true },
  ];

  const timeSlots = [
    { start: "8:00 AM", end: "9:30 AM" },
    { start: "9:30 AM", end: "11:00 AM" },
    { start: "11:00 AM", end: "12:30 PM" },
    { start: "12:30 PM", end: "2:00 PM" },
    { start: "2:00 PM", end: "3:30 PM" },
    { start: "3:30 PM", end: "5:00 PM" },
    { start: "5:00 PM", end: "6:30 PM" },
    { start: "6:30 PM", end: "8:00 PM" },
    { start: "7:30 PM", end: "9:00 PM" },
  ];

  const handleStartReservation = () => {
    setDateDialogOpen(true);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setDateDialogOpen(false);
      setTimeSlotDialogOpen(true);
    }
  };

  const handleTimeSlotToggle = (slot: { start: string; end: string }) => {
    const slotKey = `${slot.start}-${slot.end}`;
    const isSelected = selectedTimeSlots.some(s => `${s.start}-${s.end}` === slotKey);
    
    if (isSelected) {
      setSelectedTimeSlots(selectedTimeSlots.filter(s => `${s.start}-${s.end}` !== slotKey));
    } else {
      if (selectedTimeSlots.length < 2) {
        setSelectedTimeSlots([...selectedTimeSlots, slot]);
      } else {
        toast({
          title: "Maximum 2 time slots",
          description: "You can only select up to 2 preferred time slots",
          variant: "destructive",
        });
      }
    }
  };

  const handleTimeSlotsConfirm = () => {
    if (selectedTimeSlots.length === 0) {
      toast({
        title: "No time slots selected",
        description: "Please select at least 1 time slot",
        variant: "destructive",
      });
      return;
    }
    setTimeSlotDialogOpen(false);
    setShowCourts(true);
  };

  const handleCourtClick = (court: { id: number; name: string; available: boolean }) => {
    if (court.available && selectedDate && selectedTimeSlots.length > 0) {
      setSelectedCourt({ id: court.id, name: court.name });
      setCourtDialogOpen(false);
      setFinalSlotDialogOpen(true);
    }
  };

  const handleFinalSlotSelect = (slot: { start: string; end: string }) => {
    setFinalTimeSlot(slot);
    setFinalSlotDialogOpen(false);
    setNamesDialogOpen(true);
  };

  const handlePlayerNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleReservationSubmit = () => {
    const allNamesFilled = playerNames.every(name => name.trim() !== "");
    
    if (!allNamesFilled) {
      toast({
        title: "Missing Player Names",
        description: "Please enter all 4 player names",
        variant: "destructive",
      });
      return;
    }

    if (selectedCourt && finalTimeSlot) {
      // Mark only the final selected time slot as booked for this court
      setBookedSlots(prev => {
        const newMap = new Map(prev);
        const courtSlots = newMap.get(selectedCourt.id) || new Set();
        courtSlots.add(`${finalTimeSlot.start}-${finalTimeSlot.end}`);
        newMap.set(selectedCourt.id, courtSlots);
        return newMap;
      });
      
      toast({
        title: "Court Reserved!",
        description: `${selectedCourt.name} reserved on ${selectedDate ? format(selectedDate, 'PPP') : ''} for ${finalTimeSlot.start} to ${finalTimeSlot.end} - Players: ${playerNames.join(", ")}`,
      });
      setNamesDialogOpen(false);
      setSelectedCourt(null);
      setSelectedTimeSlots([]);
      setFinalTimeSlot(null);
      setSelectedDate(undefined);
      setShowCourts(false);
      setPlayerNames(["", "", "", ""]);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Courts</h1>
              <p className="text-sm text-muted-foreground">Reserve a court for 1.5 hours</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {bookedSlots.size > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setBookedSlots(new Map());
                  setShowCourts(false);
                  setSelectedDate(undefined);
                  setSelectedTimeSlots([]);
                  toast({
                    title: "All Reservations Cleared",
                    description: "All courts are now available",
                  });
                }}
              >
                Clear All Reservations
              </Button>
            )}
            <ProfileSheet />
          </div>
        </div>

        {/* Weather Closure Alert */}
        {showClosureAlert && (
          <Alert className="mb-6 border-amber-500/50 bg-amber-500/10 relative">
            <CloudRain className="h-5 w-5 text-amber-500" />
            <AlertTitle className="text-amber-600 font-semibold">Courts Closed Due to Rain</AlertTitle>
            <AlertDescription className="text-amber-600/80">
              All outdoor courts are temporarily closed today due to weather conditions. We expect to reopen tomorrow at 8 AM. Stay dry! ☔
            </AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 text-amber-500 hover:text-amber-600 hover:bg-amber-500/20"
              onClick={() => setShowClosureAlert(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        )}

        {/* Weekly Calendar Overview */}
        <Card className="p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" />
            Weekly Overview
          </h2>
          <div className="grid grid-cols-7 gap-3">
            {(() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const days = [];
              
              for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() + i);
                const dayName = format(date, 'EEE');
                const dayNumber = format(date, 'd');
                const monthName = format(date, 'MMM');
                const isSaturday = dayName === 'Sat';
                
                days.push(
                  <div
                    key={i}
                    className={cn(
                      "flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-all hover:border-primary",
                      selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card"
                    )}
                    onClick={() => {
                      setSelectedDate(date);
                      setDateDialogOpen(false);
                      setTimeSlotDialogOpen(true);
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2 justify-center">
                      <span className="text-base font-bold leading-none">{dayName}</span>
                      <span className="text-base font-bold leading-none">{dayNumber}</span>
                      <span className="text-base font-bold leading-none">{monthName}</span>
                    </div>
                    {dayName === 'Fri' && (
                      <div 
                        className="mt-2 pt-2 border-t border-border/40 w-full flex-1 flex flex-col justify-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSocialDialogOpen(true);
                        }}
                      >
                        <div className="bg-primary/20 rounded-lg p-2 hover:bg-primary/30 transition-colors cursor-pointer">
                          <p className="text-xs text-center leading-tight font-bold text-primary">🎾 PB Social</p>
                          <p className="text-sm font-bold text-center">6-9 PM</p>
                          <p className="text-xs text-center text-muted-foreground">{socialAttendees} going</p>
                          {joinedSocial && (
                            <p className="text-xs text-center text-green-600 font-medium mt-1">✓ You're in!</p>
                          )}
                        </div>
                      </div>
                    )}
                    {isSaturday && (
                      <div className="mt-2 pt-2 border-t border-border/40 w-full flex-1 flex flex-col justify-center gap-2">
                        <div>
                          <p className="text-sm font-bold text-center">2.5-3.0</p>
                          <p className="text-xs text-center leading-tight font-medium">Anthony Tennis Clinic</p>
                          <p className="text-sm font-bold text-center">7:30-8</p>
                        </div>
                        <div>
                          <p className="text-xs text-center leading-tight font-medium">Anthony Tennis Clinic</p>
                          <p className="text-sm font-bold text-center">9-10:30</p>
                        </div>
                        <div>
                          <p className="text-xs text-center leading-tight font-medium">Tennis Academy</p>
                          <p className="text-sm font-bold text-center">10-11:30</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              
              return days;
            })()}
          </div>
        </Card>

        {!showCourts ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="text-center space-y-2">
              <CalendarIcon className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-semibold">Reserve a Court</h2>
              <p className="text-muted-foreground">Start by selecting your preferred date and time</p>
            </div>
            {selectedDate && selectedTimeSlots.length > 0 && (
              <Card className="p-4 max-w-md">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <span className="font-medium">Date:</span>
                    <span>{format(selectedDate, 'PPP')}</span>
                  </div>
                  {selectedTimeSlots.map((slot, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-medium">Time {idx + 1}:</span>
                      <span>{slot.start} - {slot.end}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            <Button size="lg" onClick={handleStartReservation}>
              {selectedDate && selectedTimeSlots.length > 0 ? 'Change Date & Time' : 'Start Reservation'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <span className="font-medium">{selectedDate ? format(selectedDate, 'PPP') : ''}</span>
                  </div>
                  {selectedTimeSlots.map((slot, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-medium">Time {idx + 1}: {slot.start} - {slot.end}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={handleStartReservation}>
                  Change
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {courts.map((court) => {
                const courtSlots = bookedSlots.get(court.id);
                const allSlotsAvailable = selectedTimeSlots.every(slot => {
                  const slotKey = `${slot.start}-${slot.end}`;
                  return !courtSlots?.has(slotKey);
                });
                
                return (
                  <Card
                    key={court.id}
                    className={`p-6 transition-all hover:border-primary`}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold">{court.name}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            allSlotsAvailable
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {allSlotsAvailable ? "Available" : "Reserved"}
                        </span>
                      </div>

                      <button
                        className="flex items-center gap-2 text-primary hover:underline text-sm cursor-pointer"
                        onClick={() => handleCourtPreview(court)}
                      >
                        <Clock className="w-4 h-4" />
                        <span>View Schedule</span>
                      </button>

                      <Button
                        className="w-full"
                        onClick={() => handleCourtClick(court)}
                        disabled={!allSlotsAvailable}
                      >
                        Book
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Date Selection Dialog */}
      <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Select Date
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const maxDate = new Date(today);
                maxDate.setDate(maxDate.getDate() + 7);
                return date < today || date > maxDate;
              }}
              initialFocus
              className={cn("pointer-events-auto")}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Time Slot Selection Dialog */}
      <Dialog open={timeSlotDialogOpen} onOpenChange={setTimeSlotDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Select Time Slots (up to 2)
            </DialogTitle>
            {selectedDate && (
              <p className="text-sm text-muted-foreground mt-2">
                {format(selectedDate, 'PPP')} - {selectedTimeSlots.length} of 2 selected
              </p>
            )}
          </DialogHeader>
          <div className="grid gap-2 mt-4">
            {timeSlots.map((slot, index) => {
              const slotKey = `${slot.start}-${slot.end}`;
              const isSelected = selectedTimeSlots.some(s => `${s.start}-${s.end}` === slotKey);
              
              return (
                <Button
                  key={index}
                  variant={isSelected ? "default" : "outline"}
                  className="w-full justify-between py-6"
                  onClick={() => handleTimeSlotToggle(slot)}
                >
                  <span className="font-medium">{slot.start}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-medium">{slot.end}</span>
                  {isSelected && <span className="ml-2">✓</span>}
                </Button>
              );
            })}
            <Button 
              size="lg" 
              onClick={handleTimeSlotsConfirm}
              disabled={selectedTimeSlots.length === 0}
              className="mt-2"
            >
              Continue with {selectedTimeSlots.length} time slot{selectedTimeSlots.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Final Time Slot Selection Dialog */}
      <Dialog open={finalSlotDialogOpen} onOpenChange={setFinalSlotDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Select Your Time Slot - {selectedCourt?.name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Choose one of your preferred time slots to reserve
            </p>
          </DialogHeader>
          <div className="grid gap-3 mt-4">
            {selectedTimeSlots.map((slot, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="w-full justify-between py-6 hover:border-primary"
                onClick={() => handleFinalSlotSelect(slot)}
              >
                <span className="font-medium">{slot.start}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium">{slot.end}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Player Names Dialog */}
      <Dialog open={namesDialogOpen} onOpenChange={setNamesDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Enter Player Names - {selectedCourt?.name}
            </DialogTitle>
            <div className="text-sm text-muted-foreground mt-2 space-y-1">
              <p>{selectedDate ? format(selectedDate, 'PPP') : ''}</p>
              {finalTimeSlot && (
                <p>{finalTimeSlot.start} - {finalTimeSlot.end}</p>
              )}
            </div>
          </DialogHeader>
          <div className="grid gap-4 mt-4">
            {[1, 2, 3, 4].map((num, index) => (
              <div key={num} className="grid gap-2">
                <Label htmlFor={`player-${num}`}>Player {num}</Label>
                <Input
                  id={`player-${num}`}
                  placeholder={`Enter player ${num} name`}
                  value={playerNames[index]}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                />
              </div>
            ))}
            <Button 
              className="w-full mt-2" 
              onClick={handleReservationSubmit}
            >
              Confirm Reservation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* PB Social Dialog */}
      <Dialog open={socialDialogOpen} onOpenChange={setSocialDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              🎾 Friday PB Social
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <span className="font-medium">This Friday</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>6:00 PM - 9:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>All Courts Open Play</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Join us for our weekly Pickleball Social! Open play, music, and good vibes. All skill levels welcome.
            </p>
            
            <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
              <span className="text-sm text-muted-foreground">Current attendees</span>
              <span className="font-bold text-lg">{socialAttendees} going</span>
            </div>
            
            <Button 
              className="w-full" 
              variant={joinedSocial ? "outline" : "default"}
              onClick={handleJoinSocial}
            >
              {joinedSocial ? "Cancel RSVP" : "I'm Going! 🎉"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Court Schedule Preview Dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Court {previewCourt?.name} - Daily Schedule
            </DialogTitle>
            {selectedDate && (
              <p className="text-sm text-muted-foreground">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
            )}
          </DialogHeader>
          
          <div className="mt-4 space-y-1">
            {/* Timeline header */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 px-2">
              <div className="w-20">Time</div>
              <div className="flex-1">Status</div>
            </div>
            
            {/* Time slots */}
            {timeSlots.map((slot, index) => {
              const slotKey = `${slot.start}-${slot.end}`;
              const courtReservations = previewCourt ? mockReservations[previewCourt.id] : {};
              const reservation = courtReservations?.[slotKey];
              const userBookedSlots = previewCourt ? bookedSlots.get(previewCourt.id) : null;
              const isUserBooked = userBookedSlots?.has(slotKey);
              const isBooked = reservation || isUserBooked;
              const isSelectedSlot = selectedTimeSlots.some(s => `${s.start}-${s.end}` === slotKey);
              
              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-stretch rounded-lg border transition-all",
                    isBooked 
                      ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" 
                      : isSelectedSlot
                        ? "bg-primary/10 border-primary"
                        : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                  )}
                >
                  {/* Time column */}
                  <div className={cn(
                    "w-24 flex-shrink-0 p-3 border-r flex flex-col justify-center",
                    isBooked 
                      ? "border-red-200 dark:border-red-800" 
                      : isSelectedSlot
                        ? "border-primary"
                        : "border-green-200 dark:border-green-800"
                  )}>
                    <span className="text-xs font-medium">{slot.start}</span>
                    <span className="text-xs text-muted-foreground">to {slot.end}</span>
                  </div>
                  
                  {/* Content column */}
                  <div className="flex-1 p-3 flex items-center justify-between">
                    {isBooked ? (
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                            Reserved
                          </span>
                          {isUserBooked && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                              Your booking
                            </span>
                          )}
                        </div>
                        {reservation && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Booked by: <span className="font-medium">{reservation.bookedBy}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Players: {reservation.players.join(", ")}
                            </p>
                          </div>
                        )}
                        {isUserBooked && !reservation && (
                          <p className="text-xs text-muted-foreground">
                            Players: {playerNames.filter(n => n).join(", ") || "Your reservation"}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                          Available
                        </span>
                        {isSelectedSlot && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                            Your preferred time
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setScheduleDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirmCourtFromSchedule}
              disabled={selectedTimeSlots.every(slot => {
                const slotKey = `${slot.start}-${slot.end}`;
                const courtReservations = previewCourt ? mockReservations[previewCourt.id] : {};
                const userBookedSlots = previewCourt ? bookedSlots.get(previewCourt.id) : null;
                return courtReservations?.[slotKey] || userBookedSlots?.has(slotKey);
              })}
            >
              Reserve This Court
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <MobileNav />
    </div>
  );
};

export default Courts;

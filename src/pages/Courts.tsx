import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/MobileNav";
import { MapPin, Clock, Calendar as CalendarIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
        </div>

        {/* Monthly Calendar Overview */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Monthly Overview
          </h2>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              className={cn("pointer-events-auto")}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const maxDate = new Date(today);
                maxDate.setDate(maxDate.getDate() + 7);
                return date < today || date > maxDate;
              }}
            />
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
                    className={`p-6 transition-all ${
                      allSlotsAvailable
                        ? "hover:border-primary cursor-pointer"
                        : "opacity-60"
                    }`}
                    onClick={() => allSlotsAvailable && handleCourtClick(court)}
                  >
                    <div className="flex flex-col gap-4">
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

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">1.5 hour block</span>
                      </div>

                      <Button
                        className="w-full"
                        disabled={!allSlotsAvailable}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCourtClick(court);
                        }}
                      >
                        {allSlotsAvailable ? "Reserve Court" : "Not Available"}
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

      <MobileNav />
    </div>
  );
};

export default Courts;

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/MobileNav";
import { MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Courts = () => {
  const { toast } = useToast();
  const [selectedCourt, setSelectedCourt] = useState<{ id: number; name: string } | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: string; end: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [namesDialogOpen, setNamesDialogOpen] = useState(false);
  const [playerNames, setPlayerNames] = useState<string[]>(["", "", "", ""]);
  const [bookedCourts, setBookedCourts] = useState<Set<number>>(new Set());

  const courts = [
    // A Courts (A1-A8)
    { id: 1, name: "A1", available: true },
    { id: 2, name: "A2", available: true },
    { id: 3, name: "A3", available: false },
    { id: 4, name: "A4", available: true },
    { id: 5, name: "A5", available: true },
    { id: 6, name: "A6", available: false },
    { id: 7, name: "A7", available: true },
    { id: 8, name: "A8", available: true },
    // B Courts (B1-B8)
    { id: 9, name: "B1", available: true },
    { id: 10, name: "B2", available: false },
    { id: 11, name: "B3", available: true },
    { id: 12, name: "B4", available: true },
    { id: 13, name: "B5", available: false },
    { id: 14, name: "B6", available: true },
    { id: 15, name: "B7", available: true },
    { id: 16, name: "B8", available: true },
    // C Courts (C1-C6)
    { id: 17, name: "C1", available: true },
    { id: 18, name: "C2", available: false },
    { id: 19, name: "C3", available: true },
    { id: 20, name: "C4", available: true },
    { id: 21, name: "C5", available: true },
    { id: 22, name: "C6", available: false },
    // D Courts (D1-D4)
    { id: 23, name: "D1", available: true },
    { id: 24, name: "D2", available: true },
    { id: 25, name: "D3", available: false },
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

  const handleCourtClick = (court: { id: number; name: string; available: boolean }) => {
    if (court.available) {
      setSelectedCourt({ id: court.id, name: court.name });
      setDialogOpen(true);
    }
  };

  const handleTimeSlotSelect = (slot: { start: string; end: string }) => {
    setSelectedTimeSlot(slot);
    setDialogOpen(false);
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

    if (selectedCourt && selectedTimeSlot) {
      // Mark court as booked
      setBookedCourts(prev => new Set([...prev, selectedCourt.id]));
      
      toast({
        title: "Court Reserved!",
        description: `${selectedCourt.name} reserved from ${selectedTimeSlot.start} to ${selectedTimeSlot.end} for ${playerNames.join(", ")}`,
      });
      setNamesDialogOpen(false);
      setSelectedCourt(null);
      setSelectedTimeSlot(null);
      setPlayerNames(["", "", "", ""]);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Courts</h1>
            <p className="text-sm text-muted-foreground">Reserve a court for 1.5 hours</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courts.map((court) => {
            const isBooked = bookedCourts.has(court.id);
            const isAvailable = court.available && !isBooked;
            
            return (
              <Card
                key={court.id}
                className={`p-6 transition-all ${
                  isAvailable
                    ? "hover:border-primary cursor-pointer"
                    : "opacity-60"
                }`}
                onClick={() => handleCourtClick({ ...court, available: isAvailable })}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xl font-semibold ${!isAvailable ? "line-through" : ""}`}>
                      {court.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isAvailable
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }`}
                    >
                      {isAvailable ? "Available" : "Reserved"}
                    </span>
                  </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">1.5 hour block</span>
                </div>

                <Button
                  className="w-full"
                  disabled={!isAvailable}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCourtClick({ ...court, available: isAvailable });
                  }}
                >
                  {isAvailable ? "Reserve Court" : "Not Available"}
                </Button>
              </div>
            </Card>
          );
          })}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Select Time Slot - {selectedCourt?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-2 mt-4">
            {timeSlots.map((slot, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-between py-6 hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleTimeSlotSelect(slot)}
              >
                <span className="font-medium">{slot.start}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium">{slot.end}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={namesDialogOpen} onOpenChange={setNamesDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Enter Player Names - {selectedCourt?.name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              {selectedTimeSlot?.start} - {selectedTimeSlot?.end}
            </p>
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

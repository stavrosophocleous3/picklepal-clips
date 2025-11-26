import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/MobileNav";
import { MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Courts = () => {
  const { toast } = useToast();
  const [selectedCourt, setSelectedCourt] = useState<{ id: number; name: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const courts = [
    { id: 1, name: "Court 1", available: true },
    { id: 2, name: "Court 2", available: true },
    { id: 3, name: "Court 3", available: false },
    { id: 4, name: "Court 4", available: true },
    { id: 5, name: "Court 5", available: true },
    { id: 6, name: "Court 6", available: false },
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
    if (selectedCourt) {
      toast({
        title: "Court Reserved!",
        description: `${selectedCourt.name} reserved from ${slot.start} to ${slot.end}`,
      });
      setDialogOpen(false);
      setSelectedCourt(null);
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
          {courts.map((court) => (
            <Card
              key={court.id}
              className={`p-6 transition-all ${
                court.available
                  ? "hover:border-primary cursor-pointer"
                  : "opacity-60"
              }`}
              onClick={() => handleCourtClick(court)}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{court.name}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      court.available
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {court.available ? "Available" : "Reserved"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">1.5 hour block</span>
                </div>

                <Button
                  className="w-full"
                  disabled={!court.available}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCourtClick(court);
                  }}
                >
                  {court.available ? "Reserve Court" : "Not Available"}
                </Button>
              </div>
            </Card>
          ))}
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

      <MobileNav />
    </div>
  );
};

export default Courts;

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/MobileNav";
import { MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Courts = () => {
  const { toast } = useToast();
  const [selectedCourt, setSelectedCourt] = useState<number | null>(null);

  const courts = [
    { id: 1, name: "Court 1", available: true },
    { id: 2, name: "Court 2", available: true },
    { id: 3, name: "Court 3", available: false },
    { id: 4, name: "Court 4", available: true },
    { id: 5, name: "Court 5", available: true },
    { id: 6, name: "Court 6", available: false },
  ];

  const handleReserve = (courtId: number, courtName: string) => {
    toast({
      title: "Court Reserved!",
      description: `${courtName} has been reserved for 1.5 hours.`,
    });
    setSelectedCourt(null);
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
              } ${selectedCourt === court.id ? "border-primary ring-2 ring-primary" : ""}`}
              onClick={() => court.available && setSelectedCourt(court.id)}
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
                    handleReserve(court.id, court.name);
                  }}
                >
                  {court.available ? "Reserve Court" : "Not Available"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <MobileNav />
    </div>
  );
};

export default Courts;

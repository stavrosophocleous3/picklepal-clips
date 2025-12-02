import { Card } from "@/components/ui/card";
import { MobileNav } from "@/components/MobileNav";
import { Clock } from "lucide-react";

const GameTime = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Game Time</h1>
            <p className="text-sm text-muted-foreground">Schedule and join games</p>
          </div>
        </div>

        <Card className="p-6">
          <p className="text-muted-foreground text-center">Your upcoming games will appear here</p>
        </Card>
      </div>
      <MobileNav />
    </div>
  );
};

export default GameTime;

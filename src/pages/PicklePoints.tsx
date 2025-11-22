import { Card } from "@/components/ui/card";
import { MobileNav } from "@/components/MobileNav";
import { Medal } from "lucide-react";

const PicklePoints = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Medal className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Pickle Points</h1>
            <p className="text-sm text-muted-foreground">Track your achievements</p>
          </div>
        </div>

        <Card className="p-6">
          <p className="text-muted-foreground">Your points and rewards will appear here.</p>
        </Card>
      </div>
      <MobileNav />
    </div>
  );
};

export default PicklePoints;

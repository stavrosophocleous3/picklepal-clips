import { MobileNav } from "@/components/MobileNav";
import { Users } from "lucide-react";

const Coaches = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-bold">Coaches</h1>
        </div>
      </header>

      <main className="container max-w-lg mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Find Your Coach</h2>
          <p className="text-muted-foreground max-w-sm">
            Connect with expert pickleball coaches to improve your game
          </p>
        </div>
      </main>

      <MobileNav />
    </div>
  );
};

export default Coaches;

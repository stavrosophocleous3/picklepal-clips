import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/MobileNav";
import { Clock, Users } from "lucide-react";

const GameTime = () => {
  const [attendance, setAttendance] = useState({
    tuesdayOpen: 0,
    thursdayOpen: 0,
    mondayChallenge: 0,
    wednesdayChallenge: 0,
  });

  const [userGoing, setUserGoing] = useState({
    tuesdayOpen: false,
    thursdayOpen: false,
    mondayChallenge: false,
    wednesdayChallenge: false,
  });

  const handleAttendance = (session: keyof typeof attendance) => {
    if (userGoing[session]) {
      setAttendance((prev) => ({ ...prev, [session]: prev[session] - 1 }));
    } else {
      setAttendance((prev) => ({ ...prev, [session]: prev[session] + 1 }));
    }
    setUserGoing((prev) => ({ ...prev, [session]: !prev[session] }));
  };

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

        <div className="space-y-6">
          {/* Open Play Section */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Open Play</h2>
            <div className="space-y-3">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">Tuesday</h3>
                    <p className="text-sm text-muted-foreground">6:00 PM - 9:00 PM</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">{attendance.tuesdayOpen}</span>
                    </div>
                    <Button
                      variant={userGoing.tuesdayOpen ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAttendance("tuesdayOpen")}
                    >
                      I'm Going
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">Thursday</h3>
                    <p className="text-sm text-muted-foreground">6:00 PM - 9:00 PM</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">{attendance.thursdayOpen}</span>
                    </div>
                    <Button
                      variant={userGoing.thursdayOpen ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAttendance("thursdayOpen")}
                    >
                      I'm Going
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Challenge Courts Section */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Challenge Courts</h2>
            <div className="space-y-3">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">Monday</h3>
                    <p className="text-sm text-muted-foreground">6:00 PM - 9:00 PM</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">{attendance.mondayChallenge}</span>
                    </div>
                    <Button
                      variant={userGoing.mondayChallenge ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAttendance("mondayChallenge")}
                    >
                      I'm Going
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">Wednesday</h3>
                    <p className="text-sm text-muted-foreground">6:00 PM - 9:00 PM</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">{attendance.wednesdayChallenge}</span>
                    </div>
                    <Button
                      variant={userGoing.wednesdayChallenge ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAttendance("wednesdayChallenge")}
                    >
                      I'm Going
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
};

export default GameTime;

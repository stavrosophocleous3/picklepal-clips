import { Card } from "@/components/ui/card";
import { MobileNav } from "@/components/MobileNav";
import { Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import socialReward from "@/assets/rewards/social-reward.png";
import taphouseReward from "@/assets/rewards/taphouse-reward.png";
import lessonReward from "@/assets/rewards/lesson-reward.png";
import equipmentReward from "@/assets/rewards/equipment-reward.png";

const PicklePoints = () => {
  const userPoints = 45; // This would come from user data in real implementation

  const rewards = [
    {
      id: 1,
      title: "$5 Off Social",
      description: "Get $5 off your next social event",
      points: 5,
      image: socialReward,
    },
    {
      id: 2,
      title: "$5 Off Tap House",
      description: "Enjoy $5 off at the tap house",
      points: 10,
      image: taphouseReward,
    },
    {
      id: 3,
      title: "$10 Off Lesson",
      description: "Save $10 on your next lesson",
      points: 15,
      image: lessonReward,
    },
    {
      id: 4,
      title: "$10 Off Equipment",
      description: "Get $10 off pickleball equipment",
      points: 20,
      image: equipmentReward,
    },
    {
      id: 5,
      title: "25% Off Affiliated Brands",
      description: "Selkirk, Dunlop, Wilson, Franklin",
      points: 100,
      image: equipmentReward,
    },
    {
      id: 6,
      title: "2 Day Guest Pass",
      description: "Bring a friend for 2 days",
      points: 200,
      image: socialReward,
    },
    {
      id: 7,
      title: "Date with Traci",
      description: "One exclusive date with Traci",
      points: 1000000,
      image: socialReward,
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Medal className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Pickle Points</h1>
            <p className="text-sm text-muted-foreground">Earn points, unlock rewards</p>
          </div>
        </div>

        {/* Points Balance */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your Balance</p>
              <p className="text-4xl font-bold text-primary">{userPoints} Points</p>
            </div>
            <Medal className="w-16 h-16 text-primary opacity-20" />
          </div>
        </Card>

        {/* Rewards Section */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">Available Rewards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rewards.map((reward) => {
              const canRedeem = userPoints >= reward.points;
              
              return (
                <Card key={reward.id} className={`p-6 ${!canRedeem ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img 
                        src={reward.image} 
                        alt={reward.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{reward.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary">{reward.points} Points</span>
                        <Button 
                          size="sm" 
                          disabled={!canRedeem}
                          className="ml-auto"
                        >
                          {canRedeem ? 'Redeem' : 'Locked'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
};

export default PicklePoints;

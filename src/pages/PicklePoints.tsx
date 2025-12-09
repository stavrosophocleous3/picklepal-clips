import { Card } from "@/components/ui/card";
import { MobileNav } from "@/components/MobileNav";
import { Medal, Crown, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import socialReward from "@/assets/rewards/social-reward.png";
import taphouseReward from "@/assets/rewards/taphouse-reward.png";
import lessonReward from "@/assets/rewards/lesson-reward.png";
import equipmentReward from "@/assets/rewards/equipment-reward.png";

const PicklePoints = () => {
  const userPoints = 45;

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
    },
    {
      id: 8,
      title: "Phone Call with Robert & Luis",
      description: "A personal phone call with Robert and Luis",
      points: 4000000,
      image: socialReward,
    }
  ];

  const leaderboardData = [
    { rank: 1, name: "Mike Johnson", username: "@mikej", points: 2450, avatar: "https://i.pravatar.cc/150?img=11" },
    { rank: 2, name: "Sarah Williams", username: "@sarahw", points: 2180, avatar: "https://i.pravatar.cc/150?img=5" },
    { rank: 3, name: "David Chen", username: "@davidc", points: 1920, avatar: "https://i.pravatar.cc/150?img=12" },
    { rank: 4, name: "Emily Rodriguez", username: "@emilyr", points: 1755, avatar: "https://i.pravatar.cc/150?img=9" },
    { rank: 5, name: "James Thompson", username: "@jamest", points: 1680, avatar: "https://i.pravatar.cc/150?img=13" },
    { rank: 6, name: "Lisa Park", username: "@lisap", points: 1520, avatar: "https://i.pravatar.cc/150?img=16" },
    { rank: 7, name: "Robert Smith", username: "@roberts", points: 1340, avatar: "https://i.pravatar.cc/150?img=14" },
    { rank: 8, name: "Amanda Lee", username: "@amandal", points: 1180, avatar: "https://i.pravatar.cc/150?img=20" },
    { rank: 9, name: "Chris Martinez", username: "@chrism", points: 1050, avatar: "https://i.pravatar.cc/150?img=15" },
    { rank: 10, name: "Jessica Brown", username: "@jessicab", points: 890, avatar: "https://i.pravatar.cc/150?img=25" },
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
  };

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

        <Tabs defaultValue="points" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="points">My Points</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="points">
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
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="p-4 mb-4 bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-semibold">Top Earners This Month</p>
                  <p className="text-sm text-muted-foreground">Compete to climb the rankings!</p>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              {leaderboardData.map((user) => (
                <Card 
                  key={user.rank} 
                  className={`p-4 ${user.rank <= 3 ? 'border-primary/30 bg-primary/5' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 flex justify-center">
                      {getRankBadge(user.rank)}
                    </div>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.username}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{user.points.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <MobileNav />
    </div>
  );
};

export default PicklePoints;

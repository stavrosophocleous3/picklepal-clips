import { useState } from "react";
import { Card } from "@/components/ui/card";
import { MobileNav } from "@/components/MobileNav";
import { Medal, Crown, Trophy, Flame, Star, Zap, Users, Video, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PickleCards } from "@/components/PickleCards";
import socialReward from "@/assets/rewards/social-reward.png";
import taphouseReward from "@/assets/rewards/taphouse-reward.png";
import lessonReward from "@/assets/rewards/lesson-reward.png";
import equipmentReward from "@/assets/rewards/equipment-reward.png";

interface LeaderboardUser {
  rank: number;
  name: string;
  username: string;
  points: number;
  avatar: string;
  wins: number;
  losses: number;
  tournaments: { name: string; place: number; date: string }[];
  groupMemberships: number;
  videosPosted: number;
}

// Badge calculation helpers
const getUserBadges = (user: LeaderboardUser) => {
  const badges: { id: string; icon: React.ReactNode; color: string; name: string }[] = [];
  const tournamentWins = user.tournaments.filter(t => t.place === 1).length;
  const tournamentPodiums = user.tournaments.filter(t => t.place <= 3).length;
  const totalMatches = user.wins + user.losses;
  const winRate = totalMatches > 0 ? user.wins / totalMatches : 0;

  if (tournamentWins >= 1) {
    badges.push({ id: "champion", icon: <Trophy className="w-3.5 h-3.5" />, color: "text-yellow-500", name: "Tournament Champion" });
  }
  if (tournamentPodiums >= 1 && tournamentWins === 0) {
    badges.push({ id: "podium", icon: <Medal className="w-3.5 h-3.5" />, color: "text-slate-400", name: "Podium Finisher" });
  }
  if (totalMatches >= 5 && winRate > 0.6) {
    badges.push({ id: "streak", icon: <Flame className="w-3.5 h-3.5" />, color: "text-orange-500", name: "Hot Streak" });
  }
  if (user.points >= 100) {
    badges.push({ id: "leader", icon: <Crown className="w-3.5 h-3.5" />, color: "text-purple-500", name: "Points Leader" });
  }
  if (user.points >= 500) {
    badges.push({ id: "star", icon: <Star className="w-3.5 h-3.5" />, color: "text-blue-500", name: "Rising Star" });
  }
  if (totalMatches >= 20) {
    badges.push({ id: "regular", icon: <Zap className="w-3.5 h-3.5" />, color: "text-green-500", name: "Regular Player" });
  }
  if (user.groupMemberships >= 3) {
    badges.push({ id: "social", icon: <Users className="w-3.5 h-3.5" />, color: "text-pink-500", name: "Social Butterfly" });
  }
  if (user.videosPosted >= 5) {
    badges.push({ id: "creator", icon: <Video className="w-3.5 h-3.5" />, color: "text-red-500", name: "Content Creator" });
  }

  return badges;
};

const PicklePoints = () => {
  const userPoints = 45;
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);

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

  const leaderboardData: LeaderboardUser[] = [
    { rank: 1, name: "Mike Johnson", username: "@mikej", points: 2450, avatar: "https://i.pravatar.cc/150?img=11", wins: 47, losses: 12, tournaments: [{ name: "Summer Slam 2024", place: 1, date: "Aug 2024" }, { name: "Spring Classic", place: 1, date: "Apr 2024" }, { name: "Winter Open", place: 2, date: "Jan 2024" }], groupMemberships: 5, videosPosted: 8 },
    { rank: 2, name: "Sarah Williams", username: "@sarahw", points: 2180, avatar: "https://i.pravatar.cc/150?img=5", wins: 42, losses: 15, tournaments: [{ name: "Summer Slam 2024", place: 2, date: "Aug 2024" }, { name: "Ladies League Finals", place: 1, date: "Jun 2024" }], groupMemberships: 4, videosPosted: 12 },
    { rank: 3, name: "David Chen", username: "@davidc", points: 1920, avatar: "https://i.pravatar.cc/150?img=12", wins: 38, losses: 18, tournaments: [{ name: "Mixed Doubles Championship", place: 1, date: "Jul 2024" }, { name: "Spring Classic", place: 3, date: "Apr 2024" }], groupMemberships: 3, videosPosted: 5 },
    { rank: 4, name: "Emily Rodriguez", username: "@emilyr", points: 1755, avatar: "https://i.pravatar.cc/150?img=9", wins: 35, losses: 20, tournaments: [{ name: "Beginners Bash", place: 1, date: "May 2024" }], groupMemberships: 2, videosPosted: 3 },
    { rank: 5, name: "James Thompson", username: "@jamest", points: 1680, avatar: "https://i.pravatar.cc/150?img=13", wins: 33, losses: 22, tournaments: [{ name: "Summer Slam 2024", place: 3, date: "Aug 2024" }], groupMemberships: 4, videosPosted: 0 },
    { rank: 6, name: "Lisa Park", username: "@lisap", points: 1520, avatar: "https://i.pravatar.cc/150?img=16", wins: 29, losses: 19, tournaments: [], groupMemberships: 6, videosPosted: 7 },
    { rank: 7, name: "Robert Smith", username: "@roberts", points: 1340, avatar: "https://i.pravatar.cc/150?img=14", wins: 26, losses: 24, tournaments: [{ name: "Weekend Warriors", place: 2, date: "Mar 2024" }], groupMemberships: 1, videosPosted: 0 },
    { rank: 8, name: "Amanda Lee", username: "@amandal", points: 1180, avatar: "https://i.pravatar.cc/150?img=20", wins: 22, losses: 21, tournaments: [], groupMemberships: 3, videosPosted: 2 },
    { rank: 9, name: "Chris Martinez", username: "@chrism", points: 1050, avatar: "https://i.pravatar.cc/150?img=15", wins: 19, losses: 23, tournaments: [], groupMemberships: 2, videosPosted: 0 },
    { rank: 10, name: "Jessica Brown", username: "@jessicab", points: 890, avatar: "https://i.pravatar.cc/150?img=25", wins: 16, losses: 18, tournaments: [{ name: "Newbie Knockout", place: 1, date: "Feb 2024" }], groupMemberships: 1, videosPosted: 1 },
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
  };

  const getPlaceSuffix = (place: number) => {
    if (place === 1) return "1st";
    if (place === 2) return "2nd";
    if (place === 3) return "3rd";
    return `${place}th`;
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
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="points">My Points</TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              Cards
            </TabsTrigger>
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

          <TabsContent value="cards">
            <PickleCards />
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

            <TooltipProvider>
              <div className="space-y-3">
                {leaderboardData.map((user) => {
                  const badges = getUserBadges(user);
                  return (
                    <Card 
                      key={user.rank} 
                      className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${user.rank <= 3 ? 'border-primary/30 bg-primary/5' : ''}`}
                      onClick={() => setSelectedUser(user)}
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
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-sm text-muted-foreground">{user.username}</p>
                            {badges.length > 0 && (
                              <div className="flex items-center gap-0.5">
                                {badges.slice(0, 3).map((badge) => (
                                  <Tooltip key={badge.id}>
                                    <TooltipTrigger asChild>
                                      <span className={badge.color}>{badge.icon}</span>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="text-xs">
                                      {badge.name}
                                    </TooltipContent>
                                  </Tooltip>
                                ))}
                                {badges.length > 3 && (
                                  <span className="text-xs text-muted-foreground ml-0.5">+{badges.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{user.points.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TooltipProvider>
          </TabsContent>
        </Tabs>
      </div>

      {/* Player Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-14 w-14">
                <AvatarImage src={selectedUser?.avatar} alt={selectedUser?.name} />
                <AvatarFallback>{selectedUser?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl">{selectedUser?.name}</p>
                <p className="text-sm text-muted-foreground font-normal">{selectedUser?.username}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-primary/10 rounded-lg p-3">
                <p className="text-2xl font-bold text-primary">{selectedUser?.points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-3">
                <p className="text-2xl font-bold text-green-600">{selectedUser?.wins}</p>
                <p className="text-xs text-muted-foreground">Wins</p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-3">
                <p className="text-2xl font-bold text-red-500">{selectedUser?.losses}</p>
                <p className="text-xs text-muted-foreground">Losses</p>
              </div>
            </div>

            {/* Win Rate */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Win Rate</span>
                <span className="font-bold">
                  {selectedUser && Math.round((selectedUser.wins / (selectedUser.wins + selectedUser.losses)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ 
                    width: selectedUser 
                      ? `${(selectedUser.wins / (selectedUser.wins + selectedUser.losses)) * 100}%` 
                      : '0%' 
                  }}
                />
              </div>
            </div>

            {/* Achievement Badges */}
            {selectedUser && getUserBadges(selectedUser).length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Achievements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getUserBadges(selectedUser).map((badge) => (
                    <div
                      key={badge.id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 ${badge.color}`}
                    >
                      {badge.icon}
                      <span className="text-xs font-medium">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tournaments */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                Tournament History
              </h3>
              {selectedUser?.tournaments && selectedUser.tournaments.length > 0 ? (
                <div className="space-y-2">
                  {selectedUser.tournaments.map((tournament, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                      <div>
                        <p className="font-medium text-sm">{tournament.name}</p>
                        <p className="text-xs text-muted-foreground">{tournament.date}</p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-bold ${
                        tournament.place === 1 ? 'bg-yellow-500/20 text-yellow-600' :
                        tournament.place === 2 ? 'bg-gray-400/20 text-gray-600' :
                        tournament.place === 3 ? 'bg-amber-600/20 text-amber-600' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {getPlaceSuffix(tournament.place)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tournament wins yet
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MobileNav />
    </div>
  );
};

export default PicklePoints;

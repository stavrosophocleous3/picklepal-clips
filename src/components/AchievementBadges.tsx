import { Trophy, Medal, Flame, Crown, Star, Zap, Users, Video, Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BadgeDefinition {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  criteria: string;
  isUnlocked: (stats: UserStats) => boolean;
}

interface UserStats {
  wins: number;
  losses: number;
  points: number;
  tournamentWins: number;
  tournamentPodiums: number;
  groupMemberships: number;
  videosPosted: number;
  matchesPlayed: number;
}

interface AchievementBadgesProps {
  stats?: Partial<UserStats>;
  className?: string;
}

const defaultStats: UserStats = {
  wins: 0,
  losses: 0,
  points: 0,
  tournamentWins: 0,
  tournamentPodiums: 0,
  groupMemberships: 0,
  videosPosted: 0,
  matchesPlayed: 0,
};

const badges: BadgeDefinition[] = [
  {
    id: "tournament-champion",
    name: "Tournament Champion",
    icon: <Trophy className="w-5 h-5" />,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/20",
    criteria: "Win 1+ tournament",
    isUnlocked: (stats) => stats.tournamentWins >= 1,
  },
  {
    id: "podium-finisher",
    name: "Podium Finisher",
    icon: <Medal className="w-5 h-5" />,
    color: "text-slate-400",
    bgColor: "bg-slate-400/20",
    criteria: "Finish top 3 in any tournament",
    isUnlocked: (stats) => stats.tournamentPodiums >= 1,
  },
  {
    id: "winning-streak",
    name: "Hot Streak",
    icon: <Flame className="w-5 h-5" />,
    color: "text-orange-500",
    bgColor: "bg-orange-500/20",
    criteria: "Win rate above 60%",
    isUnlocked: (stats) => {
      const total = stats.wins + stats.losses;
      return total >= 5 && (stats.wins / total) > 0.6;
    },
  },
  {
    id: "points-leader",
    name: "Points Leader",
    icon: <Crown className="w-5 h-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
    criteria: "Reach top 10 on leaderboard",
    isUnlocked: (stats) => stats.points >= 100,
  },
  {
    id: "rising-star",
    name: "Rising Star",
    icon: <Star className="w-5 h-5" />,
    color: "text-blue-500",
    bgColor: "bg-blue-500/20",
    criteria: "Earn 500+ Pickle Points",
    isUnlocked: (stats) => stats.points >= 500,
  },
  {
    id: "regular-player",
    name: "Regular Player",
    icon: <Zap className="w-5 h-5" />,
    color: "text-green-500",
    bgColor: "bg-green-500/20",
    criteria: "Play 20+ matches",
    isUnlocked: (stats) => stats.matchesPlayed >= 20,
  },
  {
    id: "social-butterfly",
    name: "Social Butterfly",
    icon: <Users className="w-5 h-5" />,
    color: "text-pink-500",
    bgColor: "bg-pink-500/20",
    criteria: "Join 3+ groups",
    isUnlocked: (stats) => stats.groupMemberships >= 3,
  },
  {
    id: "content-creator",
    name: "Content Creator",
    icon: <Video className="w-5 h-5" />,
    color: "text-red-500",
    bgColor: "bg-red-500/20",
    criteria: "Post 5+ videos",
    isUnlocked: (stats) => stats.videosPosted >= 5,
  },
];

export const AchievementBadges = ({ stats, className = "" }: AchievementBadgesProps) => {
  const userStats: UserStats = { ...defaultStats, ...stats };
  
  const unlockedBadges = badges.filter((badge) => badge.isUnlocked(userStats));
  const lockedBadges = badges.filter((badge) => !badge.isUnlocked(userStats));

  return (
    <div className={`p-4 border-b border-border ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Achievements</h3>
      
      {unlockedBadges.length === 0 && (
        <p className="text-sm text-muted-foreground mb-3">
          Play matches and participate to earn badges!
        </p>
      )}

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <TooltipProvider>
          {/* Unlocked badges first */}
          {unlockedBadges.map((badge) => (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <div
                  className={`flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-xl ${badge.bgColor} cursor-pointer transition-transform hover:scale-105`}
                >
                  <div className={badge.color}>{badge.icon}</div>
                  <span className="text-xs font-medium text-center whitespace-nowrap">
                    {badge.name}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.criteria}</p>
              </TooltipContent>
            </Tooltip>
          ))}

          {/* Locked badges */}
          {lockedBadges.map((badge) => (
            <Tooltip key={badge.id}>
              <TooltipTrigger asChild>
                <div
                  className="flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/50 cursor-pointer opacity-50 grayscale"
                >
                  <div className="relative">
                    <div className="text-muted-foreground">{badge.icon}</div>
                    <Lock className="w-3 h-3 absolute -bottom-0.5 -right-0.5 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-medium text-center whitespace-nowrap text-muted-foreground">
                    {badge.name}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{badge.name}</p>
                <p className="text-xs text-muted-foreground">🔒 {badge.criteria}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};

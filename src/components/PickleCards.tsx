import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Trophy, Flame, Star, Zap, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PickleCard {
  id: string;
  name: string;
  username: string;
  avatar: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  stats: {
    power: number;
    speed: number;
    control: number;
    stamina: number;
  };
  specialty: string;
  wins: number;
  collected: boolean;
  collectedDate?: string;
}

const rarityConfig = {
  common: {
    label: "Common",
    gradient: "from-slate-400 to-slate-600",
    border: "border-slate-400",
    glow: "",
    bg: "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900",
  },
  rare: {
    label: "Rare",
    gradient: "from-blue-400 to-blue-600",
    border: "border-blue-400",
    glow: "shadow-blue-500/20",
    bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30",
  },
  epic: {
    label: "Epic",
    gradient: "from-purple-400 to-purple-600",
    border: "border-purple-400",
    glow: "shadow-purple-500/30",
    bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30",
  },
  legendary: {
    label: "Legendary",
    gradient: "from-yellow-400 via-orange-500 to-red-500",
    border: "border-yellow-400",
    glow: "shadow-yellow-500/40 shadow-lg",
    bg: "bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20",
  },
};

const mockCards: PickleCard[] = [
  {
    id: "1",
    name: "Mike Johnson",
    username: "@mikej",
    avatar: "https://i.pravatar.cc/150?img=11",
    rarity: "legendary",
    stats: { power: 95, speed: 88, control: 92, stamina: 85 },
    specialty: "Power Serve",
    wins: 47,
    collected: true,
    collectedDate: "Nov 2024",
  },
  {
    id: "2",
    name: "Sarah Williams",
    username: "@sarahw",
    avatar: "https://i.pravatar.cc/150?img=5",
    rarity: "epic",
    stats: { power: 78, speed: 94, control: 89, stamina: 91 },
    specialty: "Quick Reflexes",
    wins: 42,
    collected: true,
    collectedDate: "Dec 2024",
  },
  {
    id: "3",
    name: "David Chen",
    username: "@davidc",
    avatar: "https://i.pravatar.cc/150?img=12",
    rarity: "epic",
    stats: { power: 82, speed: 85, control: 95, stamina: 80 },
    specialty: "Precision Dinks",
    wins: 38,
    collected: true,
    collectedDate: "Dec 2024",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    username: "@emilyr",
    avatar: "https://i.pravatar.cc/150?img=9",
    rarity: "rare",
    stats: { power: 75, speed: 82, control: 88, stamina: 86 },
    specialty: "Third Shot Drop",
    wins: 35,
    collected: false,
  },
  {
    id: "5",
    name: "James Thompson",
    username: "@jamest",
    avatar: "https://i.pravatar.cc/150?img=13",
    rarity: "rare",
    stats: { power: 88, speed: 76, control: 79, stamina: 82 },
    specialty: "Smash Master",
    wins: 33,
    collected: true,
    collectedDate: "Oct 2024",
  },
  {
    id: "6",
    name: "Lisa Park",
    username: "@lisap",
    avatar: "https://i.pravatar.cc/150?img=16",
    rarity: "common",
    stats: { power: 70, speed: 78, control: 82, stamina: 88 },
    specialty: "Endurance",
    wins: 29,
    collected: false,
  },
  {
    id: "7",
    name: "Robert Smith",
    username: "@roberts",
    avatar: "https://i.pravatar.cc/150?img=14",
    rarity: "common",
    stats: { power: 72, speed: 74, control: 76, stamina: 78 },
    specialty: "Consistent Rally",
    wins: 26,
    collected: true,
    collectedDate: "Sep 2024",
  },
  {
    id: "8",
    name: "Amanda Lee",
    username: "@amandal",
    avatar: "https://i.pravatar.cc/150?img=20",
    rarity: "rare",
    stats: { power: 68, speed: 90, control: 84, stamina: 85 },
    specialty: "Court Coverage",
    wins: 22,
    collected: false,
  },
];

const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex items-center gap-2">
    <span className="text-[10px] font-medium w-14 text-muted-foreground">{label}</span>
    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
    <span className="text-[10px] font-bold w-6 text-right">{value}</span>
  </div>
);

export const PickleCards = () => {
  const [selectedCard, setSelectedCard] = useState<PickleCard | null>(null);
  
  const collectedCount = mockCards.filter((c) => c.collected).length;
  const totalCards = mockCards.length;

  return (
    <div>
      {/* Collection Progress */}
      <Card className="p-4 mb-6 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <span className="font-semibold">My Collection</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {collectedCount}/{totalCards} Cards
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(collectedCount / totalCards) * 100}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Play matches with players to collect their cards!
        </p>
      </Card>

      {/* Rarity Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(rarityConfig).map(([key, config]) => (
          <Badge
            key={key}
            variant="outline"
            className={`text-xs ${config.border}`}
          >
            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient} mr-1.5`} />
            {config.label}
          </Badge>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {mockCards.map((card) => {
          const config = rarityConfig[card.rarity];
          return (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => card.collected && setSelectedCard(card)}
              className={`cursor-pointer ${!card.collected ? 'opacity-60 grayscale' : ''}`}
            >
              <Card
                className={`relative overflow-hidden ${config.bg} ${config.border} border-2 ${config.glow} p-3`}
              >
                {/* Rarity Banner */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`}
                />

                {/* Lock Overlay for Uncollected */}
                {!card.collected && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-10">
                    <div className="text-center">
                      <Lock className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Not Collected</p>
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <div className="text-center mb-2">
                  <Avatar className="h-14 w-14 mx-auto border-2 border-background shadow-md">
                    <AvatarImage src={card.avatar} alt={card.name} />
                    <AvatarFallback>
                      {card.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <h3 className="font-bold text-sm text-center truncate">{card.name}</h3>
                <p className="text-[10px] text-muted-foreground text-center mb-2">
                  {card.specialty}
                </p>

                {/* Mini Stats */}
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span>{card.stats.power}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span>{card.stats.speed}</span>
                  </div>
                </div>

                {/* Wins Badge */}
                <div className="absolute top-2 right-2">
                  <div className="flex items-center gap-0.5 bg-background/80 rounded-full px-1.5 py-0.5">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    <span className="text-[10px] font-bold">{card.wins}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Card Detail Dialog */}
      <AnimatePresence>
        {selectedCard && (
          <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
            <DialogContent className="max-w-xs p-0 overflow-hidden">
              <motion.div
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {(() => {
                  const config = rarityConfig[selectedCard.rarity];
                  return (
                    <div className={`${config.bg} p-6`}>
                      {/* Rarity Banner */}
                      <div
                        className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${config.gradient}`}
                      />

                      {/* Card Header */}
                      <div className="text-center pt-2 mb-4">
                        <Badge
                          className={`mb-3 bg-gradient-to-r ${config.gradient} text-white border-0`}
                        >
                          {config.label}
                        </Badge>
                        <Avatar className="h-24 w-24 mx-auto border-4 border-background shadow-xl">
                          <AvatarImage src={selectedCard.avatar} alt={selectedCard.name} />
                          <AvatarFallback>
                            {selectedCard.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <h2 className="text-xl font-bold text-center">{selectedCard.name}</h2>
                      <p className="text-sm text-muted-foreground text-center mb-1">
                        {selectedCard.username}
                      </p>
                      <p className="text-sm text-primary text-center font-medium mb-4">
                        ✨ {selectedCard.specialty}
                      </p>

                      {/* Stats */}
                      <div className="space-y-2 mb-4">
                        <StatBar label="Power" value={selectedCard.stats.power} color="bg-red-500" />
                        <StatBar label="Speed" value={selectedCard.stats.speed} color="bg-blue-500" />
                        <StatBar label="Control" value={selectedCard.stats.control} color="bg-green-500" />
                        <StatBar label="Stamina" value={selectedCard.stats.stamina} color="bg-yellow-500" />
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-bold">{selectedCard.wins} Wins</span>
                        </div>
                        {selectedCard.collectedDate && (
                          <span className="text-xs text-muted-foreground">
                            Collected: {selectedCard.collectedDate}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

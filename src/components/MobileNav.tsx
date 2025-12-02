import { Home, TrendingUp, UserPlus, PlusSquare, UsersRound, Users, Medal, MapPin, Clock } from "lucide-react";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils";

export const MobileNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        <NavLink
          to="/"
          className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground"
          activeClassName="text-primary"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Home</span>
        </NavLink>

        <NavLink
          to="/pickle-points"
          className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground"
          activeClassName="text-primary"
        >
          <Medal className="w-6 h-6" />
          <span className="text-xs font-medium">Pickle Points</span>
        </NavLink>

        <NavLink
          to="/courts"
          className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground"
          activeClassName="text-primary"
        >
          <MapPin className="w-6 h-6" />
          <span className="text-xs font-medium">Courts</span>
        </NavLink>

        <NavLink
          to="/trending"
          className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground"
          activeClassName="text-primary"
        >
          <TrendingUp className="w-6 h-6" />
          <span className="text-xs font-medium">Trending</span>
        </NavLink>

        <NavLink
          to="/upload"
          className="flex flex-col items-center justify-center gap-1 text-primary"
        >
          <div className="bg-primary text-primary-foreground p-2 rounded-xl">
            <PlusSquare className="w-6 h-6" />
          </div>
        </NavLink>

        <NavLink
          to="/pickle-lab"
          className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground"
          activeClassName="text-primary"
        >
          <UsersRound className="w-6 h-6" />
          <span className="text-xs font-medium">My Groups</span>
        </NavLink>

        <NavLink
          to="/game-time"
          className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground"
          activeClassName="text-primary"
        >
          <Clock className="w-6 h-6" />
          <span className="text-xs font-medium">Game Time</span>
        </NavLink>

        <NavLink
          to="/coaches"
          className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground"
          activeClassName="text-primary"
        >
          <Users className="w-6 h-6" />
          <span className="text-xs font-medium">Coaches</span>
        </NavLink>

        <NavLink
          to="/following"
          className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground"
          activeClassName="text-primary"
        >
          <UserPlus className="w-6 h-6" />
          <span className="text-xs font-medium">Following</span>
        </NavLink>
      </div>
    </nav>
  );
};

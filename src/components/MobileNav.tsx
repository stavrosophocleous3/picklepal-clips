import { Home, TrendingUp, UserPlus, PlusSquare, Search, HelpCircle } from "lucide-react";
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
          to="/following"
          className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground"
          activeClassName="text-primary"
        >
          <UserPlus className="w-6 h-6" />
          <span className="text-xs font-medium">Following</span>
        </NavLink>

        <NavLink
          to="/search"
          className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground"
          activeClassName="text-primary"
        >
          <Search className="w-6 h-6" />
          <span className="text-xs font-medium">Search</span>
        </NavLink>

        <NavLink
          to="/pickle-lab"
          className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground"
          activeClassName="text-primary"
        >
          <HelpCircle className="w-6 h-6" />
          <span className="text-xs font-medium">Pickle Lab</span>
        </NavLink>
      </div>
    </nav>
  );
};

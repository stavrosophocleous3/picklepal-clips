import { User, Trophy, Star, Settings, LogOut, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  username: string;
  full_name: string | null;
  avatar_url: string | null;
}

export const ProfileSheet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("username, full_name, avatar_url")
            .eq("id", user.id)
            .single();
          if (data) {
            setProfile(data);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/auth");
  };

  // Mock pickle points - in real app this would come from database
  const picklePoints = 245;

  const menuItems = [
    {
      icon: User,
      label: "My Profile",
      href: "/my-profile",
      description: "View and edit your profile",
    },
    {
      icon: Trophy,
      label: "Pickle Points",
      href: "/pickle-points",
      description: `${picklePoints} points available`,
      highlight: true,
    },
    {
      icon: Star,
      label: "My Rewards",
      href: "/pickle-points",
      description: "View redeemable rewards",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/my-profile",
      description: "Account settings",
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[320px] sm:w-[380px]">
        <SheetHeader className="text-left">
          <SheetTitle>My Account</SheetTitle>
        </SheetHeader>

        {/* Profile Summary */}
        <div className="flex items-center gap-4 py-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="bg-primary/10">
              <User className="h-8 w-8 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">
              {loading ? "Loading..." : profile?.full_name || profile?.username || "Guest"}
            </h3>
            <p className="text-sm text-muted-foreground">
              @{profile?.username || "user"}
            </p>
          </div>
        </div>

        {/* Pickle Points Card */}
        <div className="bg-primary/10 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <Trophy className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pickle Points</p>
                <p className="text-2xl font-bold text-primary">{picklePoints}</p>
              </div>
            </div>
            <Link to="/pickle-points">
              <Button variant="secondary" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Menu Items */}
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${item.highlight ? 'bg-primary/10' : 'bg-muted'}`}>
                  <item.icon className={`h-5 w-5 ${item.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Logout Button */}
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Log Out
        </Button>
      </SheetContent>
    </Sheet>
  );
};

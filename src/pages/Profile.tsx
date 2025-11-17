import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { User, Settings } from "lucide-react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { userId } = useParams();

  // Mock user data
  const user = {
    id: userId || "1",
    username: "picklemaster",
    displayName: "Pickle Master",
    bio: "🎾 Pro pickleball player | 🏆 2x Champion | Sharing tips & tricks",
    followers: "12.3K",
    following: "234",
    likes: "45.2K",
    avatar: "",
  };

  // Mock user videos
  const userVideos = [
    { id: "1", thumbnail: "", views: "1.2K" },
    { id: "2", thumbnail: "", views: "890" },
    { id: "3", thumbnail: "", views: "2.1K" },
    { id: "4", thumbnail: "", views: "567" },
    { id: "5", thumbnail: "", views: "3.4K" },
    { id: "6", thumbnail: "", views: "1.8K" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h1 className="text-xl font-bold">@{user.username}</h1>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Info */}
        <div className="p-6 text-center border-b border-border">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-muted-foreground" />
          </div>
          
          <h2 className="text-2xl font-bold mb-1">{user.displayName}</h2>
          <p className="text-muted-foreground mb-4">@{user.username}</p>
          
          <p className="text-sm mb-6">{user.bio}</p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-6">
            <div>
              <p className="text-xl font-bold">{user.followers}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div>
              <p className="text-xl font-bold">{user.following}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
            <div>
              <p className="text-xl font-bold">{user.likes}</p>
              <p className="text-sm text-muted-foreground">Likes</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1">Follow</Button>
            <Button variant="outline" className="flex-1">
              Message
            </Button>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Videos</h3>
          <div className="grid grid-cols-3 gap-2">
            {userVideos.map((video) => (
              <div
                key={video.id}
                className="aspect-[9/16] bg-muted rounded-lg relative overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xs text-white bg-black/60 px-2 py-1 rounded">
                    {video.views} views
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default Profile;

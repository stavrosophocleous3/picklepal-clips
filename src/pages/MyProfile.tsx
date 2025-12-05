import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { User, Settings, Edit2, Camera } from "lucide-react";

const MyProfile = () => {
  // Mock current user data - will be replaced with real auth data later
  const currentUser = {
    username: "yourUsername",
    displayName: "Your Name",
    bio: "🎾 Pickleball enthusiast | Add your bio here",
    followers: "0",
    following: "0",
    likes: "0",
    avatar: "",
    memberSince: "December 2024",
    skillLevel: "Intermediate",
    preferredPlayTime: "Evenings",
  };

  // Mock user videos
  const userVideos = [
    { id: "1", thumbnail: "", views: "0" },
    { id: "2", thumbnail: "", views: "0" },
    { id: "3", thumbnail: "", views: "0" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h1 className="text-xl font-bold">My Profile</h1>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Info */}
        <div className="p-6 text-center border-b border-border">
          {/* Avatar with edit button */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">{currentUser.displayName}</h2>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-muted-foreground mb-4">@{currentUser.username}</p>
          
          <p className="text-sm mb-6">{currentUser.bio}</p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-6">
            <div>
              <p className="text-xl font-bold">{currentUser.followers}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div>
              <p className="text-xl font-bold">{currentUser.following}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
            <div>
              <p className="text-xl font-bold">{currentUser.likes}</p>
              <p className="text-sm text-muted-foreground">Likes</p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <Button className="w-full" variant="outline">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Profile Details */}
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold mb-4">About</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member Since</span>
              <span className="font-medium">{currentUser.memberSince}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Skill Level</span>
              <span className="font-medium">{currentUser.skillLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Preferred Play Time</span>
              <span className="font-medium">{currentUser.preferredPlayTime}</span>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">My Videos</h3>
          {userVideos.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {userVideos.map((video) => (
                <div
                  key={video.id}
                  className="aspect-[9/16] bg-muted rounded-lg relative overflow-hidden"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-xs text-foreground bg-background/60 px-2 py-1 rounded">
                      {video.views} views
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No videos yet</p>
              <p className="text-sm">Start sharing your pickleball moments!</p>
            </div>
          )}
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default MyProfile;

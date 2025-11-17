import { useState } from "react";
import { MobileNav } from "@/components/MobileNav";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search as SearchIcon, User, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const mockUsers = [
    { id: "1", username: "picklemaster", followers: "12.3K", avatar: "" },
    { id: "2", username: "courtqueen", followers: "8.9K", avatar: "" },
    { id: "3", username: "proballer", followers: "15.2K", avatar: "" },
  ];

  const mockHashtags = [
    { tag: "pickleball", videos: "234K" },
    { tag: "rally", videos: "89K" },
    { tag: "tournament", videos: "56K" },
    { tag: "tutorial", videos: "43K" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto">
        {/* Header with Search */}
        <div className="sticky top-0 bg-background border-b border-border p-4 z-10">
          <h1 className="text-2xl font-bold mb-4">Search</h1>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search users or hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="p-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-2 mt-4">
            {mockUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-card rounded-xl border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">@{user.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.followers} followers
                    </p>
                  </div>
                </div>
                <Button size="sm">Follow</Button>
              </div>
            ))}
          </TabsContent>

          {/* Hashtags Tab */}
          <TabsContent value="hashtags" className="space-y-2 mt-4">
            {mockHashtags.map((hashtag) => (
              <div
                key={hashtag.tag}
                className="flex items-center justify-between p-4 bg-card rounded-xl border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Hash className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">#{hashtag.tag}</p>
                    <p className="text-sm text-muted-foreground">
                      {hashtag.videos} videos
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <MobileNav />
    </div>
  );
};

export default Search;

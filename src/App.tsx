import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Trending from "./pages/Trending";
import Following from "./pages/Following";
import Upload from "./pages/Upload";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import PickleHelp from "./pages/PickleHelp";
import Coaches from "./pages/Coaches";
import GroupInvite from "./pages/GroupInvite";
import PicklePoints from "./pages/PicklePoints";
import Courts from "./pages/Courts";
import GameTime from "./pages/GameTime";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/following" element={<Following />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pickle-lab" element={<PickleHelp />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/invite/:groupId" element={<GroupInvite />} />
          <Route path="/pickle-points" element={<PicklePoints />} />
          <Route path="/courts" element={<Courts />} />
          <Route path="/game-time" element={<GameTime />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

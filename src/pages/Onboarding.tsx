import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Trophy, 
  Users, 
  Video, 
  MapPin, 
  ChevronRight, 
  Check,
  Camera,
  User,
  Building2,
  Mail,
  Phone
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  {
    icon: Video,
    title: "Watch & Share",
    description: "Discover amazing pickleball clips and share your best moments with the community",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Users,
    title: "Join Groups",
    description: "Connect with local players, form teams, and organize games together",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: MapPin,
    title: "Reserve Courts",
    description: "Book your favorite courts and see where the action is happening live",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Trophy,
    title: "Earn Rewards",
    description: "Collect Pickle Points and redeem them for exclusive perks and discounts",
    color: "from-amber-500 to-orange-500",
  },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [primaryClub, setPrimaryClub] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserId(session.user.id);
      }
    });
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !userId) return null;
    
    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `${userId}/avatar.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(filePath, avatarFile, { upsert: true });
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }
    
    const { data } = supabase.storage.from('videos').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const saveProfile = async () => {
    if (!userId) return;
    
    setSaving(true);
    try {
      let finalAvatarUrl = avatarUrl;
      
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          finalAvatarUrl = uploadedUrl;
        }
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          avatar_url: finalAvatarUrl,
          full_name: fullName.trim() || null,
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "Profile saved!",
        description: "You're all set to start playing",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (currentStep < features.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowProfileSetup(true);
    }
  };

  const handleSkip = () => {
    if (showProfileSetup) {
      saveProfile();
    } else {
      setShowProfileSetup(true);
    }
  };

  // Profile Setup Page
  if (showProfileSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex flex-col items-center p-6 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />

        {/* Skip button */}
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip & Finish
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center max-w-md w-full relative z-10">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2 mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <User className="w-4 h-4" />
              Set up your profile
            </div>
            <h1 className="text-3xl font-bold tracking-tight mt-4">Almost there!</h1>
            <p className="text-muted-foreground">Tell us a bit about yourself</p>
          </motion.div>

          {/* Profile Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full bg-card/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-border/50 space-y-6"
          >
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-3">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform overflow-hidden ring-4 ring-background"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-10 h-10 text-white" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-primary font-medium hover:underline"
              >
                {avatarUrl ? "Change photo" : "Add a photo"}
              </button>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                className="h-12 rounded-xl bg-background/50 border-border/50 focus:border-primary transition-all"
              />
            </div>

            {/* Primary Club */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Primary Club
              </Label>
              <Select value={primaryClub} onValueChange={setPrimaryClub}>
                <SelectTrigger className="h-12 rounded-xl bg-background/50 border-border/50 focus:border-primary transition-all">
                  <SelectValue placeholder="Select your primary club" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sierra-sport-racquet">Sierra Sport & Racquet Club</SelectItem>
                  <SelectItem value="downtown-pickleball">Downtown Pickleball Center</SelectItem>
                  <SelectItem value="lakeside-courts">Lakeside Courts</SelectItem>
                  <SelectItem value="community-rec">Community Recreation Center</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-12 rounded-xl bg-background/50 border-border/50 focus:border-primary transition-all"
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Mobile Number
              </Label>
              <Input
                id="mobile"
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="(555) 123-4567"
                className="h-12 rounded-xl bg-background/50 border-border/50 focus:border-primary transition-all"
              />
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full mt-6"
          >
            <Button
              onClick={saveProfile}
              className="w-full h-14 rounded-2xl text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all duration-300 group"
              size="lg"
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Complete Setup
                </span>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Feature Slides
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex flex-col items-center justify-between p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />

      {/* Skip button */}
      <div className="w-full flex justify-end">
        <button
          onClick={handleSkip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full space-y-8 relative z-10">
        {/* Welcome header on first step */}
        {currentStep === 0 && (
          <div className="text-center space-y-2 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Welcome to PickleTok!
            </div>
          </div>
        )}

        {/* Feature card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-border/50 text-center space-y-6">
              <div className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${features[currentStep].color} flex items-center justify-center shadow-lg`}>
                {(() => {
                  const Icon = features[currentStep].icon;
                  return <Icon className="w-12 h-12 text-white" />;
                })()}
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                {features[currentStep].title}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {features[currentStep].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-8 bg-primary"
                  : index < currentStep
                  ? "w-2.5 bg-primary/60"
                  : "w-2.5 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="w-full max-w-md space-y-4">
        <Button
          onClick={handleNext}
          className="w-full h-14 rounded-2xl text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all duration-300 group"
          size="lg"
        >
          <span className="flex items-center gap-2">
            Continue
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>

        {/* Step indicator text */}
        <p className="text-center text-sm text-muted-foreground">
          {currentStep + 1} of {features.length}
        </p>
      </div>
    </div>
  );
};

export default Onboarding;

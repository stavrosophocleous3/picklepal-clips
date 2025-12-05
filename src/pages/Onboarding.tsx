import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Sparkles, 
  Trophy, 
  Users, 
  Video, 
  MapPin, 
  ChevronRight, 
  Check 
} from "lucide-react";
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
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleNext = () => {
    if (currentStep < features.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/");
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  const currentFeature = features[currentStep];

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
              {/* Icon */}
              <div className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${currentFeature.color} flex items-center justify-center shadow-lg`}>
                <currentFeature.icon className="w-12 h-12 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold tracking-tight">
                {currentFeature.title}
              </h2>

              {/* Description */}
              <p className="text-muted-foreground text-lg leading-relaxed">
                {currentFeature.description}
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
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-8 bg-primary"
                  : index < currentStep
                  ? "bg-primary/60"
                  : "bg-muted"
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
          {currentStep === features.length - 1 ? (
            <span className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Get Started
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Continue
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
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

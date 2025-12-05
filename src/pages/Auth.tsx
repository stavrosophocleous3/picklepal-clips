import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Mail, Lock, User, ArrowRight } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (useMagicLink) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: !isLogin ? { username } : undefined,
          },
        });

        if (error) throw error;

        toast({
          title: "Check your email!",
          description: "We sent you a magic link to sign in",
        });
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "Successfully signed in to PickleTok",
        });
      } else {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              username,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: authData.user.id,
              username: username,
            });

          if (profileError) throw profileError;
        }

        toast({
          title: "Account created!",
          description: "Welcome to PickleTok",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      {/* Floating pickleballs */}
      <div className="absolute top-[15%] right-[20%] w-16 h-16 rounded-full bg-gradient-to-br from-lime-300 to-lime-500 opacity-60 animate-bounce shadow-lg" style={{ animationDelay: '0s', animationDuration: '3s' }} />
      <div className="absolute bottom-[25%] left-[15%] w-12 h-12 rounded-full bg-gradient-to-br from-lime-300 to-lime-500 opacity-40 animate-bounce shadow-lg" style={{ animationDelay: '1s', animationDuration: '4s' }} />
      <div className="absolute top-[40%] right-[10%] w-8 h-8 rounded-full bg-gradient-to-br from-lime-300 to-lime-500 opacity-30 animate-bounce shadow-lg" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Join the pickleball community</span>
          </div>
          
          <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text">
            PickleTok
          </h1>
          
          <p className="text-muted-foreground text-lg">
            {isLogin 
              ? "Welcome back, player!" 
              : "Start your pickleball journey today"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-card/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-border/50 relative overflow-hidden">
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          
          <form onSubmit={handleAuth} className="space-y-5 relative">
            {!isLogin && !useMagicLink && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={!isLogin && !useMagicLink}
                  placeholder="Choose your player name"
                  className="h-12 rounded-xl bg-background/50 border-border/50 focus:border-primary transition-all"
                />
              </div>
            )}

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
                required
                placeholder="your@email.com"
                className="h-12 rounded-xl bg-background/50 border-border/50 focus:border-primary transition-all"
              />
            </div>

            {!useMagicLink && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!useMagicLink}
                  placeholder="••••••••"
                  minLength={6}
                  className="h-12 rounded-xl bg-background/50 border-border/50 focus:border-primary transition-all"
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all duration-300 group" 
              size="lg" 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Loading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {useMagicLink ? "Send Magic Link" : isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Alternative actions */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setUseMagicLink(!useMagicLink)}
              className="w-full py-3 px-4 rounded-xl text-sm font-medium border border-border/50 bg-background/30 text-muted-foreground hover:text-foreground hover:bg-background/50 hover:border-primary/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {useMagicLink ? "Use password instead" : "Sign in with magic link"}
            </button>
            
            {!useMagicLink && (
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-colors py-2"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Auth;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    // Check if user is already logged in
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
        // Magic link authentication
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

        // Create profile after signup
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Welcome to PickleTok</h1>
          <p className="text-muted-foreground">
            {isLogin ? "Sign in to start sharing clips" : "Create an account to get started"}
          </p>
        </div>

        <div className="bg-card p-8 rounded-2xl shadow-sm">
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && !useMagicLink && (
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={!isLogin && !useMagicLink}
                  placeholder="Choose a username"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            {!useMagicLink && (
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!useMagicLink}
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading 
                ? "Loading..." 
                : useMagicLink 
                ? "Send Magic Link" 
                : isLogin 
                ? "Sign In" 
                : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => setUseMagicLink(!useMagicLink)}
              className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {useMagicLink ? "Use password instead" : "Or sign in with magic link"}
            </button>
            
            {!useMagicLink && (
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-sm text-primary hover:underline"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

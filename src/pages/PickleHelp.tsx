import { HelpCircle, MessageCircle, BookOpen, Mail } from "lucide-react";
import { MobileNav } from "@/components/MobileNav";

const PickleHelp = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 text-center border-b border-border">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4 animate-bounce">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Pickle Help</h1>
          <p className="text-muted-foreground">We're here to help you!</p>
        </div>

        {/* Help Categories */}
        <div className="p-6 space-y-4">
          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Getting Started</h3>
                <p className="text-sm text-muted-foreground">
                  Learn how to upload videos, follow creators, and engage with the PickleTok community.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">FAQs</h3>
                <p className="text-sm text-muted-foreground">
                  Find answers to common questions about trending, achievements, and video features.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Contact Support</h3>
                <p className="text-sm text-muted-foreground">
                  Can't find what you're looking for? Reach out to our support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default PickleHelp;

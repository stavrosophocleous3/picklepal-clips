import { Card } from "@/components/ui/card";
import { MobileNav } from "@/components/MobileNav";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const Billing = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Billing</h1>
            <p className="text-sm text-muted-foreground">Manage your payments</p>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
          <p className="text-muted-foreground mb-4">You are on the Free plan</p>
          <Button>Upgrade Plan</Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Payment History</h2>
          <p className="text-muted-foreground">No payment history yet</p>
        </Card>
      </div>
      <MobileNav />
    </div>
  );
};

export default Billing;

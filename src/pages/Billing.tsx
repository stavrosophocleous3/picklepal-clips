import { Card } from "@/components/ui/card";
import { MobileNav } from "@/components/MobileNav";
import { CreditCard, Check, Calendar, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const Billing = () => {
  const [currentPlan, setCurrentPlan] = useState<string | null>("pickleball");

  const plans = [
    {
      id: "tennis",
      name: "Tennis Membership",
      price: 75,
      period: "month",
      features: ["Unlimited court access", "Equipment rental", "Guest passes (2/mo)"],
      color: "bg-green-500",
    },
    {
      id: "pickleball",
      name: "Pickleball Membership",
      price: 50,
      period: "month",
      features: ["Unlimited court access", "Free paddle rental", "Open play sessions"],
      color: "bg-primary",
    },
    {
      id: "combo",
      name: "Tennis + Pickleball",
      price: 100,
      period: "month",
      features: ["All tennis benefits", "All pickleball benefits", "Priority booking", "10% pro shop discount"],
      color: "bg-purple-500",
    },
  ];

  const paymentHistory = [
    { id: 1, date: "Nov 1, 2025", description: "Pickleball Membership", amount: 50, status: "paid" },
    { id: 2, date: "Oct 1, 2025", description: "Pickleball Membership", amount: 50, status: "paid" },
    { id: 3, date: "Sep 15, 2025", description: "Court Reservation Fee", amount: 15, status: "paid" },
    { id: 4, date: "Sep 1, 2025", description: "Pickleball Membership", amount: 50, status: "paid" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Club Billing</h1>
            <p className="text-sm text-muted-foreground">Manage your membership</p>
          </div>
        </div>

        {/* Current Membership Status */}
        <Card className="p-4 mb-6 border-2 border-primary">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Current Membership</h2>
            <Badge className="bg-green-500">Active</Badge>
          </div>
          <p className="text-lg font-bold text-primary mb-1">Pickleball Membership</p>
          <p className="text-sm text-muted-foreground">Next billing: Dec 1, 2025 - $50.00</p>
        </Card>

        {/* Membership Plans */}
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Membership Plans
        </h2>
        <div className="space-y-3 mb-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`p-4 ${currentPlan === plan.id ? 'border-2 border-primary' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${plan.color}`} />
                    <h3 className="font-semibold">{plan.name}</h3>
                  </div>
                  <p className="text-2xl font-bold mt-1">
                    ${plan.price}<span className="text-sm text-muted-foreground font-normal">/{plan.period}</span>
                  </p>
                </div>
                {currentPlan === plan.id ? (
                  <Badge variant="secondary">Current</Badge>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setCurrentPlan(plan.id)}>
                    Select
                  </Button>
                )}
              </div>
              <ul className="space-y-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Payment History */}
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Payment History
        </h2>
        <Card className="divide-y divide-border">
          {paymentHistory.map((payment) => (
            <div key={payment.id} className="p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{payment.description}</p>
                <p className="text-xs text-muted-foreground">{payment.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${payment.amount}</p>
                <Badge variant="secondary" className="text-xs">Paid</Badge>
              </div>
            </div>
          ))}
        </Card>
      </div>
      <MobileNav />
    </div>
  );
};

export default Billing;

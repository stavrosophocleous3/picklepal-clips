import { Card } from "@/components/ui/card";
import { MobileNav } from "@/components/MobileNav";
import { CreditCard, Users, Calendar, DollarSign, Clock, CheckCircle, AlertCircle, Plus, Banknote, FileCheck, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Billing = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for members
  const members = [
    { id: 1, name: "John Smith", plan: "Tennis + Pickleball", status: "active", nextBilling: "Dec 1", amount: 100, balance: 0 },
    { id: 2, name: "Sarah Johnson", plan: "Pickleball Only", status: "active", nextBilling: "Dec 5", amount: 50, balance: 0 },
    { id: 3, name: "Mike Davis", plan: "Tennis Only", status: "overdue", nextBilling: "Nov 15", amount: 75, balance: 75 },
    { id: 4, name: "Emily Wilson", plan: "Pickleball Only", status: "active", nextBilling: "Dec 10", amount: 50, balance: 0 },
  ];

  // Mock data for lessons
  const lessons = [
    { id: 1, student: "John Smith", type: "Private Tennis", coach: "Coach Mike", date: "Nov 28", time: "10:00 AM", price: 80, paid: true },
    { id: 2, student: "Sarah Johnson", type: "Private Pickleball", coach: "Coach Lisa", date: "Nov 29", time: "2:00 PM", price: 60, paid: false },
    { id: 3, student: "Tom Brown", type: "Group Tennis", coach: "Coach Mike", date: "Nov 30", time: "9:00 AM", price: 40, paid: true },
    { id: 4, student: "Emily Wilson", type: "Private Pickleball", coach: "Coach Lisa", date: "Dec 1", time: "11:00 AM", price: 60, paid: false },
  ];

  // Mock data for classes
  const classes = [
    { id: 1, name: "Beginner Pickleball", instructor: "Coach Lisa", day: "Mon/Wed", time: "6:00 PM", enrolled: 12, capacity: 16, pricePerMonth: 80 },
    { id: 2, name: "Advanced Tennis", instructor: "Coach Mike", day: "Tue/Thu", time: "7:00 PM", enrolled: 8, capacity: 10, pricePerMonth: 100 },
    { id: 3, name: "Youth Tennis Camp", instructor: "Coach Sarah", day: "Sat", time: "9:00 AM", enrolled: 15, capacity: 20, pricePerMonth: 60 },
    { id: 4, name: "Senior Pickleball", instructor: "Coach Lisa", day: "Tue/Thu", time: "10:00 AM", enrolled: 10, capacity: 12, pricePerMonth: 70 },
  ];

  // Mock data for transactions
  const transactions = [
    { id: 1, type: "cash", direction: "in", member: "John Smith", description: "Monthly membership", amount: 100, date: "Nov 28", status: "received" },
    { id: 2, type: "check", direction: "in", member: "Sarah Johnson", description: "Lesson payment", amount: 60, date: "Nov 27", status: "deposited", checkNumber: "1542" },
    { id: 3, type: "check", direction: "in", member: "Mike Davis", description: "Class enrollment", amount: 80, date: "Nov 26", status: "pending", checkNumber: "3891" },
    { id: 4, type: "cash", direction: "in", member: "Emily Wilson", description: "Drop-in court fee", amount: 15, date: "Nov 26", status: "received" },
    { id: 5, type: "check", direction: "out", member: "Tom Brown", description: "Refund - cancelled class", amount: 40, date: "Nov 25", status: "sent", checkNumber: "0089" },
    { id: 6, type: "check", direction: "in", member: "Lisa Park", description: "Annual membership", amount: 500, date: "Nov 24", status: "bounced", checkNumber: "7722" },
    { id: 7, type: "cash", direction: "in", member: "James Lee", description: "Guest fee", amount: 20, date: "Nov 24", status: "received" },
    { id: 8, type: "check", direction: "out", member: "Coach Mike", description: "Coaching pay", amount: 320, date: "Nov 22", status: "cashed", checkNumber: "0088" },
  ];

  // Summary stats
  const stats = {
    totalMembers: 124,
    activeMembers: 118,
    monthlyRevenue: 8450,
    outstandingBalance: 650,
    cashReceived: 135,
    checksIn: 640,
    checksPending: 80,
    checksOut: 360,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "received":
      case "deposited":
      case "cashed":
        return <Badge className="bg-green-500 text-xs">{status}</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-amber-500 border-amber-500 text-xs">{status}</Badge>;
      case "sent":
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
      case "bounced":
        return <Badge variant="destructive" className="text-xs">{status}</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string, direction: string) => {
    if (type === "cash") {
      return <Banknote className="w-4 h-4 text-green-500" />;
    }
    if (direction === "in") {
      return <ArrowDownLeft className="w-4 h-4 text-blue-500" />;
    }
    return <ArrowUpRight className="w-4 h-4 text-orange-500" />;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Club Billing</h1>
              <p className="text-sm text-muted-foreground">Manage memberships, lessons & payments</p>
            </div>
          </div>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New Member
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Active Members</span>
            </div>
            <p className="text-2xl font-bold">{stats.activeMembers}</p>
            <p className="text-xs text-muted-foreground">of {stats.totalMembers} total</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Monthly Revenue</span>
            </div>
            <p className="text-2xl font-bold text-green-500">${stats.monthlyRevenue}</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Lessons This Week</span>
            </div>
            <p className="text-2xl font-bold">28</p>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Outstanding</span>
            </div>
            <p className="text-2xl font-bold text-destructive">${stats.outstandingBalance}</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="overview" className="flex-1 text-xs">Members</TabsTrigger>
            <TabsTrigger value="transactions" className="flex-1 text-xs">Transactions</TabsTrigger>
            <TabsTrigger value="lessons" className="flex-1 text-xs">Lessons</TabsTrigger>
            <TabsTrigger value="classes" className="flex-1 text-xs">Classes</TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="overview">
            <Card className="divide-y divide-border">
              {members.map((member) => (
                <div key={member.id} className="p-3 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      <Badge 
                        variant={member.status === "active" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {member.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{member.plan}</p>
                    <p className="text-xs text-muted-foreground">Next: {member.nextBilling}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${member.amount}/mo</p>
                    {member.balance > 0 && (
                      <p className="text-xs text-destructive">Owes: ${member.balance}</p>
                    )}
                    <Button size="sm" variant="outline" className="mt-1 h-7 text-xs">
                      Charge
                    </Button>
                  </div>
                </div>
              ))}
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            {/* Transaction Summary */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Card className="p-3 border-green-500/30 bg-green-500/5">
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-green-500" />
                  <span className="text-xs">Cash In</span>
                </div>
                <p className="text-lg font-bold text-green-500">${stats.cashReceived}</p>
              </Card>
              <Card className="p-3 border-blue-500/30 bg-blue-500/5">
                <div className="flex items-center gap-2">
                  <ArrowDownLeft className="w-4 h-4 text-blue-500" />
                  <span className="text-xs">Checks In</span>
                </div>
                <p className="text-lg font-bold text-blue-500">${stats.checksIn}</p>
              </Card>
              <Card className="p-3 border-amber-500/30 bg-amber-500/5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-xs">Checks Pending</span>
                </div>
                <p className="text-lg font-bold text-amber-500">${stats.checksPending}</p>
              </Card>
              <Card className="p-3 border-orange-500/30 bg-orange-500/5">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-orange-500" />
                  <span className="text-xs">Checks Out</span>
                </div>
                <p className="text-lg font-bold text-orange-500">${stats.checksOut}</p>
              </Card>
            </div>

            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Recent Transactions</h3>
              <Button size="sm" variant="outline">
                <Plus className="w-3 h-3 mr-1" />
                Record Payment
              </Button>
            </div>

            <Card className="divide-y divide-border">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {getTypeIcon(tx.type, tx.direction)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{tx.member}</p>
                      {getStatusBadge(tx.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{tx.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{tx.date}</span>
                      {tx.checkNumber && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <FileCheck className="w-3 h-3" />
                            #{tx.checkNumber}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.direction === "out" ? "text-orange-500" : "text-green-500"}`}>
                      {tx.direction === "out" ? "-" : "+"}${tx.amount}
                    </p>
                    <span className="text-xs text-muted-foreground capitalize">{tx.type}</span>
                  </div>
                </div>
              ))}
            </Card>
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Upcoming Lessons</h3>
              <Button size="sm" variant="outline">
                <Plus className="w-3 h-3 mr-1" />
                Book Lesson
              </Button>
            </div>
            <Card className="divide-y divide-border">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="p-3 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{lesson.student}</p>
                      {lesson.paid ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{lesson.type} - {lesson.coach}</p>
                    <p className="text-xs text-muted-foreground">{lesson.date} at {lesson.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${lesson.price}</p>
                    <Badge variant={lesson.paid ? "secondary" : "outline"} className="text-xs">
                      {lesson.paid ? "Paid" : "Pending"}
                    </Badge>
                  </div>
                </div>
              ))}
            </Card>

            {/* Lesson Pricing */}
            <h3 className="font-semibold mt-6 mb-3">Lesson Rates</h3>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3">
                <p className="font-medium text-sm">Private Tennis</p>
                <p className="text-xl font-bold">$80</p>
                <p className="text-xs text-muted-foreground">60 min session</p>
              </Card>
              <Card className="p-3">
                <p className="font-medium text-sm">Private Pickleball</p>
                <p className="text-xl font-bold">$60</p>
                <p className="text-xs text-muted-foreground">60 min session</p>
              </Card>
              <Card className="p-3">
                <p className="font-medium text-sm">Group Tennis</p>
                <p className="text-xl font-bold">$40</p>
                <p className="text-xs text-muted-foreground">per person</p>
              </Card>
              <Card className="p-3">
                <p className="font-medium text-sm">Group Pickleball</p>
                <p className="text-xl font-bold">$30</p>
                <p className="text-xs text-muted-foreground">per person</p>
              </Card>
            </div>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Active Classes</h3>
              <Button size="sm" variant="outline">
                <Plus className="w-3 h-3 mr-1" />
                New Class
              </Button>
            </div>
            <div className="space-y-3">
              {classes.map((cls) => (
                <Card key={cls.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{cls.name}</h4>
                      <p className="text-sm text-muted-foreground">{cls.instructor}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {cls.day} at {cls.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${cls.pricePerMonth}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                      <p className="text-xs text-muted-foreground">{cls.enrolled}/{cls.capacity} enrolled</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary h-full transition-all" 
                        style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{Math.round((cls.enrolled / cls.capacity) * 100)}%</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">View Roster</Button>
                    <Button size="sm" className="flex-1">Collect Payments</Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <MobileNav />
    </div>
  );
};

export default Billing;

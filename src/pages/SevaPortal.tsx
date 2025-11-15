import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Cloud, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AnnouncementsSection from "@/components/seva/AnnouncementsSection";
import NotificationBell from "@/components/shared/NotificationBell";

const SevaPortal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    assignedId: "",
    phone: ""
  });
  const [weatherReport, setWeatherReport] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      loadWeatherReport();
      
      const channel = supabase
        .channel('weather-updates')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'weather_reports'
          },
          () => {
            loadWeatherReport();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isLoggedIn]);

  const loadWeatherReport = async () => {
    const { data } = await supabase
      .from('weather_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (data) {
      setWeatherReport(data.report);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    toast({
      title: "OTP Sent",
      description: "Please check your phone for the OTP code",
    });
    setTimeout(() => {
      setIsLoggedIn(true);
      toast({
        title: "Login Successful",
        description: "Welcome to Seva Portal",
      });
    }, 2000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-2">
              Seva Portal Login
            </h1>
            <p className="text-muted-foreground">Enter your credentials to access the portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email ID</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedId">Assigned ID Number</Label>
              <Input
                id="assignedId"
                value={formData.assignedId}
                onChange={(e) => setFormData({ ...formData, assignedId: e.target.value })}
                placeholder="Enter your assigned ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-secondary to-primary">
              Send OTP
            </Button>

            <Button type="button" variant="outline" className="w-full" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Seva Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">Welcome, {formData.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell portalType="seva" />
              <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
                Logout
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Ticket Reservations Card */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-bold text-foreground">Ticket Reservations</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <p className="text-sm text-muted-foreground mb-1">Today's Bookings</p>
                  <p className="text-3xl font-bold text-secondary">145</p>
                </div>
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-muted-foreground mb-1">Pending</p>
                  <p className="text-3xl font-bold text-accent">23</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Confirmed</p>
                  <p className="text-3xl font-bold text-primary">122</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Cancelled</p>
                  <p className="text-3xl font-bold text-foreground">5</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Information */}
          <Card className="p-6 md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-foreground">Your Profile</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold">{formData.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{formData.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned ID</p>
                <p className="font-semibold">{formData.assignedId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{formData.phone}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SevaPortal;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Home, Users, Cloud, Ticket, CheckCircle, XCircle, IndianRupee, Bell, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import GalleryManagement from "@/components/management/GalleryManagement";

const ManagementPortal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [weatherReport, setWeatherReport] = useState("");
  const [pendingAccounts, setPendingAccounts] = useState([
    { id: 1, name: "Ramesh Kumar", email: "ramesh@example.com", assignedId: "SEVA001", status: "pending" },
    { id: 2, name: "Lakshmi Devi", email: "lakshmi@example.com", assignedId: "SEVA002", status: "pending" },
  ]);
  const [ticketPrices, setTicketPrices] = useState<any[]>([]);
  const [editingPrice, setEditingPrice] = useState<{ id: string; type: string; price: string } | null>(null);
  const [devoteeAnnouncement, setDevoteeAnnouncement] = useState({ title: "", content: "" });
  const [sevaAnnouncement, setSevaAnnouncement] = useState({ title: "", content: "" });
  const [routeMap, setRouteMap] = useState({ title: "", description: "", map_data: "" });

  useEffect(() => {
    loadTicketPrices();
  }, []);

  const loadTicketPrices = async () => {
    const { data, error } = await supabase
      .from('ticket_prices')
      .select('*')
      .order('ticket_type');
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load ticket prices",
        variant: "destructive",
      });
    } else {
      setTicketPrices(data || []);
    }
  };

  const handleWeatherUpdate = async () => {
    const { error } = await supabase
      .from('weather_reports')
      .insert({ report: weatherReport });
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update weather report",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Weather Report Updated",
        description: "The report is now visible to all portals",
      });
      setWeatherReport("");
    }
  };

  const handlePriceUpdate = async (id: string, newPrice: string) => {
    const { error } = await supabase
      .from('ticket_prices')
      .update({ price: parseFloat(newPrice) })
      .eq('id', id);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update price",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Price Updated",
        description: "Ticket price updated successfully",
      });
      setEditingPrice(null);
      loadTicketPrices();
    }
  };

  const handleAccountAction = (id: number, action: "approve" | "reject") => {
    setPendingAccounts(pendingAccounts.filter(acc => acc.id !== id));
    toast({
      title: action === "approve" ? "Account Approved" : "Account Rejected",
      description: `Seva account has been ${action}ed successfully`,
    });
  };

  const handleDevoteeAnnouncement = async () => {
    const { error } = await supabase
      .from('announcements')
      .insert({ 
        portal_type: 'devotee',
        title: devoteeAnnouncement.title,
        content: devoteeAnnouncement.content
      });
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to post announcement",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Announcement Posted",
        description: "Devotee portal announcement updated successfully",
      });
      setDevoteeAnnouncement({ title: "", content: "" });
    }
  };

  const handleSevaAnnouncement = async () => {
    const { error } = await supabase
      .from('announcements')
      .insert({ 
        portal_type: 'seva',
        title: sevaAnnouncement.title,
        content: sevaAnnouncement.content
      });
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to post announcement",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Announcement Posted",
        description: "Seva portal announcement updated successfully",
      });
      setSevaAnnouncement({ title: "", content: "" });
    }
  };

  const handleRouteMapUpdate = async () => {
    const { error } = await supabase
      .from('route_maps')
      .insert(routeMap);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to add route map",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Route Map Added",
        description: "Route map is now visible in devotee portal",
      });
      setRouteMap({ title: "", description: "", map_data: "" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Temple Management Portal
              </h1>
              <p className="text-sm text-muted-foreground">Administrative Dashboard</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weather Report Section */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Update Weather Report</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weather">Weather Report</Label>
                <Textarea
                  id="weather"
                  value={weatherReport}
                  onChange={(e) => setWeatherReport(e.target.value)}
                  placeholder="Enter weather conditions, temperature, and any relevant information..."
                  rows={4}
                />
              </div>
              <Button
                onClick={handleWeatherUpdate}
                className="w-full bg-gradient-to-r from-primary to-accent"
                disabled={!weatherReport.trim()}
              >
                Update Weather Report
              </Button>
              <p className="text-xs text-muted-foreground">
                This report will be visible on both Devotee and Seva portals
              </p>
            </div>
          </Card>

          {/* Ticket Statistics */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-bold text-foreground">Ticket Statistics</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Total Today</p>
                  <p className="text-3xl font-bold text-primary">245</p>
                </div>
                <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <p className="text-sm text-muted-foreground mb-1">This Week</p>
                  <p className="text-3xl font-bold text-secondary">1,450</p>
                </div>
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <p className="text-sm text-muted-foreground mb-1">This Month</p>
                  <p className="text-3xl font-bold text-accent">6,234</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Revenue</p>
                  <p className="text-3xl font-bold text-foreground">₹3.2L</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Price Management */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <IndianRupee className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold text-foreground">Ticket Price Management</h2>
            </div>
            
            <div className="space-y-4">
              {ticketPrices.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div>
                    <p className="font-semibold text-foreground">{ticket.ticket_type}</p>
                    <p className="text-sm text-muted-foreground">Current Price</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {editingPrice?.id === ticket.id ? (
                      <>
                        <Input
                          type="number"
                          value={editingPrice.price}
                          onChange={(e) => setEditingPrice({ ...editingPrice, price: e.target.value })}
                          className="w-32"
                        />
                        <Button
                          size="sm"
                          onClick={() => handlePriceUpdate(ticket.id, editingPrice.price)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingPrice(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-primary">₹{ticket.price}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingPrice({ id: ticket.id, type: ticket.ticket_type, price: ticket.price })}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Pending Seva Accounts */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold text-foreground">Pending Seva Account Approvals</h2>
              <Badge variant="secondary" className="ml-auto">{pendingAccounts.length} Pending</Badge>
            </div>
            
            {pendingAccounts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending account approvals</p>
            ) : (
              <div className="space-y-4">
                {pendingAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{account.name}</p>
                      <p className="text-sm text-muted-foreground">{account.email}</p>
                      <Badge variant="outline" className="mt-1">{account.assignedId}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-primary/30 hover:bg-primary/10 hover:border-primary"
                        onClick={() => handleAccountAction(account.id, "approve")}
                      >
                        <CheckCircle className="w-4 h-4 mr-1 text-primary" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive/30 hover:bg-destructive/10 hover:border-destructive"
                        onClick={() => handleAccountAction(account.id, "reject")}
                      >
                        <XCircle className="w-4 h-4 mr-1 text-destructive" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Devotee Announcements */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Devotee Portal Announcements</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="devotee-title">Announcement Title</Label>
                <Input
                  id="devotee-title"
                  value={devoteeAnnouncement.title}
                  onChange={(e) => setDevoteeAnnouncement({ ...devoteeAnnouncement, title: e.target.value })}
                  placeholder="Enter announcement title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="devotee-content">Announcement Content</Label>
                <Textarea
                  id="devotee-content"
                  value={devoteeAnnouncement.content}
                  onChange={(e) => setDevoteeAnnouncement({ ...devoteeAnnouncement, content: e.target.value })}
                  placeholder="Enter announcement details..."
                  rows={3}
                />
              </div>
              <Button
                onClick={handleDevoteeAnnouncement}
                className="w-full"
                disabled={!devoteeAnnouncement.title || !devoteeAnnouncement.content}
              >
                Post to Devotee Portal
              </Button>
            </div>
          </Card>

          {/* Seva Announcements */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-bold text-foreground">Seva Portal Announcements</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seva-title">Announcement Title</Label>
                <Input
                  id="seva-title"
                  value={sevaAnnouncement.title}
                  onChange={(e) => setSevaAnnouncement({ ...sevaAnnouncement, title: e.target.value })}
                  placeholder="Enter announcement title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seva-content">Announcement Content</Label>
                <Textarea
                  id="seva-content"
                  value={sevaAnnouncement.content}
                  onChange={(e) => setSevaAnnouncement({ ...sevaAnnouncement, content: e.target.value })}
                  placeholder="Enter announcement details..."
                  rows={3}
                />
              </div>
              <Button
                onClick={handleSevaAnnouncement}
                className="w-full"
                disabled={!sevaAnnouncement.title || !sevaAnnouncement.content}
              >
                Post to Seva Portal
              </Button>
            </div>
          </Card>

          {/* Route Maps Management */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Map className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold text-foreground">Route Maps Management</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="route-title">Route Title</Label>
                <Input
                  id="route-title"
                  value={routeMap.title}
                  onChange={(e) => setRouteMap({ ...routeMap, title: e.target.value })}
                  placeholder="E.g., Main Temple Route"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="route-description">Description</Label>
                <Input
                  id="route-description"
                  value={routeMap.description}
                  onChange={(e) => setRouteMap({ ...routeMap, description: e.target.value })}
                  placeholder="Brief description of the route"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="route-data">Route Details</Label>
                <Textarea
                  id="route-data"
                  value={routeMap.map_data}
                  onChange={(e) => setRouteMap({ ...routeMap, map_data: e.target.value })}
                  placeholder="Enter detailed route information, directions, landmarks..."
                  rows={4}
                />
              </div>
              <Button
                onClick={handleRouteMapUpdate}
                className="w-full bg-gradient-to-r from-primary to-accent"
                disabled={!routeMap.title || !routeMap.map_data}
              >
                Add Route Map
              </Button>
              <p className="text-xs text-muted-foreground">
                This route will be visible in both Devotee and Pilgrimage portals
              </p>
              <p className="text-xs text-muted-foreground">
                This route will be visible in both Devotee and Pilgrimage portals
              </p>
            </div>
          </Card>

          {/* Gallery Management */}
          <Card className="p-6 lg:col-span-2">
            <GalleryManagement />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManagementPortal;

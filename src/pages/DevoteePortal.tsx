import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, BookOpen, Map, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookingsSection from "@/components/devotee/BookingsSection";
import TemplesSection from "@/components/devotee/TemplesSection";
import HistorySection from "@/components/devotee/HistorySection";
import WeatherSection from "@/components/devotee/WeatherSection";
import AnnouncementsSection from "@/components/devotee/AnnouncementsSection";
import RouteMapsSection from "@/components/devotee/RouteMapsSection";
import NotificationBell from "@/components/shared/NotificationBell";

const DevoteePortal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("temples");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Devotee Portal
              </h1>
              <p className="text-sm text-muted-foreground">Plan Your Divine Journey</p>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell portalType="devotee" />
              <Button variant="outline" onClick={() => navigate("/")}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Weather and Announcements */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <WeatherSection />
          <AnnouncementsSection />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="bookings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="temples" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              Temples
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BookOpen className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="routes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Map className="w-4 h-4 mr-2" />
              Route Maps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="animate-fade-in">
            <BookingsSection />
          </TabsContent>

          <TabsContent value="temples" className="animate-fade-in">
            <TemplesSection />
          </TabsContent>

          <TabsContent value="history" className="animate-fade-in">
            <HistorySection />
          </TabsContent>

          <TabsContent value="routes" className="animate-fade-in">
            <RouteMapsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DevoteePortal;

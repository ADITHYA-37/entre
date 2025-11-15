import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Image, Ticket, Navigation, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RouteMapsSection from "@/components/devotee/RouteMapsSection";
import BookingsSection from "@/components/devotee/BookingsSection";
import { supabase } from "@/integrations/supabase/client";

const PilgrimagePortal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("routes");
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  useEffect(() => {
    loadGalleryImages();
    
    const channel = supabase
      .channel('gallery-pilgrimage')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gallery'
        },
        () => {
          loadGalleryImages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadGalleryImages = async () => {
    const { data } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setGalleryImages(data);
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
                Pilgrimage & Tourist Portal
              </h1>
              <p className="text-sm text-muted-foreground">Your Spiritual Journey Guide</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="routes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Map className="w-4 h-4 mr-2" />
              Route Maps
            </TabsTrigger>
            <TabsTrigger value="pictures" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Image className="w-4 h-4 mr-2" />
              Pictures
            </TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Ticket className="w-4 h-4 mr-2" />
              Tickets
            </TabsTrigger>
            <TabsTrigger value="reach" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Navigation className="w-4 h-4 mr-2" />
              How to Reach
            </TabsTrigger>
          </TabsList>

          <TabsContent value="routes" className="animate-fade-in">
            <RouteMapsSection />
          </TabsContent>

          <TabsContent value="pictures" className="animate-fade-in">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Temple Gallery</h2>
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="group relative overflow-hidden rounded-lg border border-border">
                      <img 
                        src={image.image_url} 
                        alt={image.title}
                        className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <h3 className="text-white font-semibold">{image.title}</h3>
                        {image.description && (
                          <p className="text-white/80 text-sm line-clamp-2">{image.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">Gallery images coming soon...</p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="tickets" className="animate-fade-in">
            <BookingsSection />
          </TabsContent>

          <TabsContent value="reach" className="animate-fade-in">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-foreground">How to Reach</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">By Air</h3>
                  <p className="text-muted-foreground">Nearest airport information and travel details...</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">By Train</h3>
                  <p className="text-muted-foreground">Railway station details and connectivity...</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">By Road</h3>
                  <p className="text-muted-foreground">Bus services and road connectivity information...</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PilgrimagePortal;

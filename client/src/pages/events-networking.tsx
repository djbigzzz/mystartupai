import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Search,
  Filter,
  Star,
  MessageCircle,
  UserPlus,
  Handshake,
  CheckCircle,
  XCircle,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Building2,
  Target,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function EventsNetworking() {
  const [activeTab, setActiveTab] = useState("events");
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilters, setEventFilters] = useState({
    type: "",
    category: "",
    location: ""
  });
  const [networkingFilters, setNetworkingFilters] = useState({
    stage: "",
    industries: [] as string[],
    lookingFor: [] as string[]
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Events queries
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["/api/events", eventFilters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (eventFilters.type) params.append('type', eventFilters.type);
      if (eventFilters.category) params.append('category', eventFilters.category);
      if (eventFilters.location) params.append('location', eventFilters.location);
      return apiRequest(`/api/events?${params.toString()}`);
    }
  });

  // Networking queries
  const { data: profiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ["/api/networking/profiles", networkingFilters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (networkingFilters.stage) params.append('stage', networkingFilters.stage);
      if (networkingFilters.industries.length) params.append('industries', networkingFilters.industries.join(','));
      if (networkingFilters.lookingFor.length) params.append('lookingFor', networkingFilters.lookingFor.join(','));
      return apiRequest(`/api/networking/profiles?${params.toString()}`);
    }
  });

  const { data: myProfile } = useQuery({
    queryKey: ["/api/networking/profile"]
  });

  const { data: myConnections = [] } = useQuery({
    queryKey: ["/api/networking/connections"]
  });

  // Event registration mutation
  const registerForEventMutation = useMutation({
    mutationFn: (eventId: number) => apiRequest(`/api/events/${eventId}/register`, { method: 'POST' }),
    onSuccess: () => {
      toast({
        title: "Registration successful!",
        description: "You've been registered for this event."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  });

  // Connection request mutation
  const sendConnectionMutation = useMutation({
    mutationFn: (data: { receiverId: number; message: string }) => 
      apiRequest("/api/networking/connections", { method: 'POST', body: data }),
    onSuccess: () => {
      toast({
        title: "Connection request sent!",
        description: "Your request has been sent successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/networking/connections"] });
    },
    onError: (error: any) => {
      toast({
        title: "Connection failed",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    }
  });

  // Mock events data for demo
  const mockEvents = [
    {
      id: 1,
      title: "Startup Pitch Competition 2024",
      description: "Present your startup idea to top investors and compete for $100K in funding",
      type: "startup",
      category: "pitch_competition",
      startDate: new Date('2024-08-15T18:00:00'),
      location: "San Francisco, CA",
      isVirtual: false,
      organizerName: "TechVenture Partners",
      price: "Free",
      maxAttendees: 200,
      currentAttendees: 156,
      tags: ["funding", "pitching", "competition"],
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=300&fit=crop",
      benefits: ["Network with VCs", "$100K funding prize", "Mentorship opportunities"]
    },
    {
      id: 2,
      title: "AI & Machine Learning Workshop",
      description: "Learn the latest AI technologies and how to integrate them into your startup",
      type: "tech",
      category: "workshop",
      startDate: new Date('2024-08-20T14:00:00'),
      location: "Virtual Event",
      isVirtual: true,
      organizerName: "AI Startup Academy",
      price: "$49.99",
      maxAttendees: 500,
      currentAttendees: 342,
      tags: ["ai", "ml", "technology"],
      imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop",
      benefits: ["Hands-on coding", "Expert instructors", "Certificate of completion"]
    },
    {
      id: 3,
      title: "Founder Networking Mixer",
      description: "Connect with fellow entrepreneurs and share experiences over drinks",
      type: "networking",
      category: "networking",
      startDate: new Date('2024-08-18T19:00:00'),
      location: "Austin, TX",
      isVirtual: false,
      organizerName: "Austin Startup Society",
      price: "$25.00",
      maxAttendees: 150,
      currentAttendees: 89,
      tags: ["networking", "founders", "social"],
      imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=300&fit=crop",
      benefits: ["Meet co-founders", "Investor introductions", "Complimentary drinks"]
    }
  ];

  // Mock networking profiles for demo
  const mockProfiles = [
    {
      id: 1,
      userId: 2,
      bio: "Serial entrepreneur with 3 successful exits. Looking to mentor early-stage founders in fintech.",
      interests: ["fintech", "blockchain", "mentoring"],
      skills: ["product", "fundraising", "scaling"],
      industries: ["fintech", "saas"],
      lookingFor: ["mentor"],
      stage: "growth",
      availableForMentoring: true,
      linkedinUrl: "https://linkedin.com/in/jane-investor",
      location: "New York, NY",
      user: { name: "Jane Smith", email: "jane@example.com", avatar: "https://images.unsplash.com/photo-1494790108755-2616b67c14e5?w=150&h=150&fit=crop&crop=face" }
    },
    {
      id: 2,
      userId: 3,
      bio: "Tech co-founder with expertise in AI and ML. Building the next generation of intelligent apps.",
      interests: ["ai", "machine-learning", "b2b-saas"],
      skills: ["engineering", "ai", "product-management"],
      industries: ["ai", "saas", "enterprise"],
      lookingFor: ["cofounder", "advisor"],
      stage: "mvp",
      openToCollaboration: true,
      githubUrl: "https://github.com/techfounder",
      location: "San Francisco, CA",
      user: { name: "Alex Chen", email: "alex@startup.com", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" }
    },
    {
      id: 3,
      userId: 4,
      bio: "Marketing expert who has scaled 5 startups to $10M+ ARR. Passionate about growth hacking.",
      interests: ["marketing", "growth-hacking", "saas"],
      skills: ["growth-marketing", "seo", "content-marketing"],
      industries: ["saas", "e-commerce", "marketing"],
      lookingFor: ["advisor", "customer"],
      stage: "scaling",
      availableForMentoring: true,
      linkedinUrl: "https://linkedin.com/in/growth-expert",
      twitterUrl: "https://twitter.com/growthexpert",
      location: "Austin, TX",
      user: { name: "Sarah Johnson", email: "sarah@growth.co", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" }
    }
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const filteredEvents = mockEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProfiles = mockProfiles.filter(profile =>
    profile.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Events & Networking</h1>
          <p className="text-muted-foreground">
            Discover startup events and connect with entrepreneurs, investors, and mentors in your area
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="events">
              <Calendar className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="networking">
              <Users className="w-4 h-4 mr-2" />
              Networking
            </TabsTrigger>
            <TabsTrigger value="connections">
              <Handshake className="w-4 h-4 mr-2" />
              My Connections
            </TabsTrigger>
          </TabsList>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={activeTab === "events" ? "Search events..." : "Search people..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === "events" && (
              <div className="flex gap-2">
                <Select value={eventFilters.type} onValueChange={(value) => setEventFilters(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={eventFilters.category} onValueChange={(value) => setEventFilters(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="pitch_competition">Pitch Competition</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <TabsContent value="events" className="space-y-6">
            <div className="grid gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <CardContent className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                          <p className="text-muted-foreground mb-4">{event.description}</p>
                        </div>
                        <Badge variant={event.price === "Free" ? "secondary" : "default"}>
                          {event.price}
                        </Badge>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(event.startDate)}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-2" />
                          {event.currentAttendees} / {event.maxAttendees} attendees
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Building2 className="w-4 h-4 mr-2" />
                          Organized by {event.organizerName}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Benefits:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {event.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        onClick={() => registerForEventMutation.mutate(event.id)}
                        disabled={registerForEventMutation.isPending}
                        className="w-full md:w-auto"
                      >
                        {registerForEventMutation.isPending ? "Registering..." : "Register for Event"}
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="networking" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <Card key={profile.id} className="h-fit">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={profile.user.avatar}
                        alt={profile.user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{profile.user.name}</h3>
                        <p className="text-sm text-muted-foreground">{profile.location}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{profile.bio}</p>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Stage:</h4>
                      <Badge variant="outline" className="capitalize">
                        {profile.stage}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Industries:</h4>
                      <div className="flex flex-wrap gap-1">
                        {profile.industries.map((industry) => (
                          <Badge key={industry} variant="secondary" className="text-xs capitalize">
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Looking for:</h4>
                      <div className="flex flex-wrap gap-1">
                        {profile.lookingFor.map((item) => (
                          <Badge key={item} variant="outline" className="text-xs capitalize">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {profile.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="default" className="text-xs capitalize">
                            {skill}
                          </Badge>
                        ))}
                        {profile.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{profile.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {profile.linkedinUrl && (
                        <Button size="sm" variant="outline" className="p-2">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      )}
                      {profile.twitterUrl && (
                        <Button size="sm" variant="outline" className="p-2">
                          <Twitter className="w-4 h-4" />
                        </Button>
                      )}
                      {profile.githubUrl && (
                        <Button size="sm" variant="outline" className="p-2">
                          <Github className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => sendConnectionMutation.mutate({ receiverId: profile.userId, message: "Hi! I'd like to connect with you." })}
                        disabled={sendConnectionMutation.isPending}
                        className="flex-1"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Connect
                      </Button>
                      <Button size="sm" variant="outline" className="px-3">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="connections" className="space-y-6">
            <div className="grid gap-4">
              {/* Mock connections for demo */}
              {[
                {
                  id: 1,
                  status: "accepted",
                  user: { name: "Jane Smith", email: "jane@example.com", avatar: "https://images.unsplash.com/photo-1494790108755-2616b67c14e5?w=150&h=150&fit=crop&crop=face" },
                  connectionDate: new Date('2024-07-15'),
                  message: "Great to connect! Love your work in fintech."
                },
                {
                  id: 2,
                  status: "pending",
                  user: { name: "Alex Chen", email: "alex@startup.com", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
                  message: "Hi! I'd like to discuss potential collaboration opportunities."
                }
              ].map((connection) => (
                <Card key={connection.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={connection.user.avatar}
                          alt={connection.user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">{connection.user.name}</h3>
                          <p className="text-sm text-muted-foreground">{connection.user.email}</p>
                          {connection.message && (
                            <p className="text-sm text-muted-foreground mt-1">"{connection.message}"</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={connection.status === "accepted" ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {connection.status === "accepted" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {connection.status}
                        </Badge>
                        {connection.status === "pending" && (
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
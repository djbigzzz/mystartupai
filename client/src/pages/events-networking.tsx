import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  DollarSign, 
  Video, 
  Search,
  Filter,
  Star,
  MessageCircle,
  UserPlus,
  Globe,
  Linkedin,
  Twitter,
  Github,
  ExternalLink,
  Heart,
  Share2
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Event {
  id: number;
  title: string;
  description: string;
  type: string;
  category: string;
  startDate: string;
  endDate?: string;
  location?: string;
  isVirtual: boolean;
  virtualLink?: string;
  organizerName: string;
  organizerEmail: string;
  maxAttendees?: number;
  currentAttendees: number;
  price: string;
  registrationUrl?: string;
  tags: string[];
  imageUrl?: string;
  requirements?: string;
  agenda?: any;
  speakers?: any;
  benefits: string[];
  status: string;
}

interface NetworkingProfile {
  id: number;
  userId: number;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  bio: string;
  interests: string[];
  skills: string[];
  industries: string[];
  lookingFor: string[];
  stage: string;
  availableForMentoring: boolean;
  seekingMentorship: boolean;
  openToCollaboration: boolean;
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  location?: string;
  timezone?: string;
  preferredContactMethod: string;
  visibility: string;
}

export default function EventsNetworking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [networkingFilter, setNetworkingFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  const queryClient = useQueryClient();

  // Mock events data for demonstration
  const mockEvents: Event[] = [
    {
      id: 1,
      title: "SF Startup Demo Day 2025",
      description: "Join us for an exciting evening where early-stage startups present their innovative solutions to investors, mentors, and the tech community.",
      type: "startup",
      category: "demo_day",
      startDate: "2025-01-15T18:00:00Z",
      endDate: "2025-01-15T21:00:00Z",
      location: "San Francisco, CA",
      isVirtual: false,
      organizerName: "SF Tech Hub",
      organizerEmail: "events@sftechhub.com",
      maxAttendees: 200,
      currentAttendees: 147,
      price: "25.00",
      tags: ["startups", "demo", "investors", "networking"],
      benefits: ["Network with investors", "Learn from successful founders", "Get feedback on your startup"],
      status: "upcoming"
    },
    {
      id: 2,
      title: "Virtual AI & Machine Learning Workshop",
      description: "Deep dive into the latest AI technologies and learn how to integrate machine learning into your startup's product roadmap.",
      type: "tech",
      category: "workshop",
      startDate: "2025-01-20T14:00:00Z",
      endDate: "2025-01-20T17:00:00Z",
      location: "Virtual",
      isVirtual: true,
      virtualLink: "https://zoom.us/j/123456789",
      organizerName: "AI Startup Collective",
      organizerEmail: "workshops@aistartupcollective.com",
      maxAttendees: 50,
      currentAttendees: 38,
      price: "0.00",
      tags: ["AI", "machine learning", "technology", "virtual"],
      benefits: ["Hands-on AI training", "Expert mentorship", "Code examples and resources"],
      status: "upcoming"
    },
    {
      id: 3,
      title: "Women in Tech Networking Mixer",
      description: "Connect with like-minded women entrepreneurs, share experiences, and build meaningful professional relationships in the tech industry.",
      type: "networking",
      category: "networking",
      startDate: "2025-01-25T19:00:00Z",
      endDate: "2025-01-25T22:00:00Z",
      location: "New York, NY",
      isVirtual: false,
      organizerName: "Women Tech Leaders",
      organizerEmail: "events@womentechleaders.org",
      maxAttendees: 100,
      currentAttendees: 73,
      price: "15.00",
      tags: ["women in tech", "networking", "diversity", "entrepreneurs"],
      benefits: ["Diverse networking", "Mentorship opportunities", "Career advancement insights"],
      status: "upcoming"
    }
  ];

  // Mock networking profiles data
  const mockProfiles: NetworkingProfile[] = [
    {
      id: 1,
      userId: 1,
      user: {
        name: "Sarah Chen",
        email: "sarah@techstartup.com",
        avatar: undefined
      },
      bio: "Serial entrepreneur with 8+ years in SaaS. Currently building an AI-powered customer service platform. Looking to connect with fellow founders and potential advisors.",
      interests: ["AI", "SaaS", "Customer Experience", "Product Management"],
      skills: ["Product Strategy", "Team Building", "Fundraising", "Go-to-Market"],
      industries: ["SaaS", "AI/ML", "Customer Service"],
      lookingFor: ["advisor", "investor", "cofounder"],
      stage: "growth",
      availableForMentoring: true,
      seekingMentorship: false,
      openToCollaboration: true,
      linkedinUrl: "https://linkedin.com/in/sarahchen",
      location: "San Francisco, CA",
      timezone: "PST",
      preferredContactMethod: "platform",
      visibility: "public"
    },
    {
      id: 2,
      userId: 2,
      user: {
        name: "Marcus Johnson",
        email: "marcus@fintech.com",
        avatar: undefined
      },
      bio: "FinTech founder passionate about democratizing financial services. Previously led product at two successful startups. Happy to mentor early-stage founders.",
      interests: ["FinTech", "Blockchain", "Financial Inclusion", "Mobile Payments"],
      skills: ["Product Development", "Regulatory Compliance", "Partnership Building", "User Research"],
      industries: ["FinTech", "Financial Services", "Blockchain"],
      lookingFor: ["mentor", "customer"],
      stage: "scaling",
      availableForMentoring: true,
      seekingMentorship: true,
      openToCollaboration: false,
      linkedinUrl: "https://linkedin.com/in/marcusjohnson",
      twitterUrl: "https://twitter.com/marcusfintech",
      location: "Austin, TX",
      timezone: "CST",
      preferredContactMethod: "linkedin",
      visibility: "public"
    },
    {
      id: 3,
      userId: 3,
      user: {
        name: "Emily Rodriguez",
        email: "emily@healthtech.com",
        avatar: undefined
      },
      bio: "Healthcare entrepreneur building solutions to improve patient outcomes. Background in biomedical engineering and digital health. Seeking technical co-founder.",
      interests: ["HealthTech", "Digital Health", "Medical Devices", "Data Analytics"],
      skills: ["Biomedical Engineering", "Clinical Research", "Product Design", "Healthcare Compliance"],
      industries: ["HealthTech", "Medical Devices", "Digital Health"],
      lookingFor: ["cofounder", "advisor", "investor"],
      stage: "mvp",
      availableForMentoring: false,
      seekingMentorship: true,
      openToCollaboration: true,
      githubUrl: "https://github.com/emilyrodriguez",
      websiteUrl: "https://healthtechsolutions.com",
      location: "Boston, MA",
      timezone: "EST",
      preferredContactMethod: "platform",
      visibility: "public"
    }
  ];

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = eventFilter === "all" || event.type === eventFilter;
    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter;
    const matchesLocation = locationFilter === "all" || 
                           (locationFilter === "virtual" && event.isVirtual) ||
                           (locationFilter === "in-person" && !event.isVirtual);
    
    return matchesSearch && matchesType && matchesCategory && matchesLocation;
  });

  const filteredProfiles = mockProfiles.filter(profile => {
    const matchesSearch = profile.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         profile.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === "all" || profile.stage === stageFilter;
    const matchesNetworking = networkingFilter === "all" ||
                             (networkingFilter === "mentoring" && profile.availableForMentoring) ||
                             (networkingFilter === "seeking" && profile.seekingMentorship) ||
                             (networkingFilter === "collaboration" && profile.openToCollaboration);
    
    return matchesSearch && matchesStage && matchesNetworking;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const EventCard = ({ event }: { event: Event }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
            <CardDescription className="text-sm mb-3">
              {event.description}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button size="sm" variant="outline">
              <Heart className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary">{event.type}</Badge>
          <Badge variant="outline">{event.category}</Badge>
          {event.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(event.startDate)}
            {event.endDate && ` - ${formatDate(event.endDate)}`}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            {event.isVirtual ? (
              <>
                <Video className="w-4 h-4 mr-2" />
                Virtual Event
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-2" />
                {event.location}
              </>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            {event.currentAttendees} / {event.maxAttendees || "∞"} attendees
          </div>

          {event.price !== "0.00" && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="w-4 h-4 mr-2" />
              ${event.price}
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">What you'll get:</p>
            <ul className="list-disc list-inside text-xs space-y-1">
              {event.benefits.slice(0, 3).map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-gray-500">
              Organized by {event.organizerName}
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Register Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProfileCard = ({ profile }: { profile: NetworkingProfile }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profile.user?.avatar} />
            <AvatarFallback>
              {profile.user?.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{profile.user?.name}</CardTitle>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Connect
                </Button>
                <Button size="sm" variant="outline">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary">{profile.stage}</Badge>
              {profile.availableForMentoring && (
                <Badge variant="outline" className="text-green-700 border-green-300">
                  Available for Mentoring
                </Badge>
              )}
              {profile.seekingMentorship && (
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  Seeking Mentorship
                </Badge>
              )}
              {profile.openToCollaboration && (
                <Badge variant="outline" className="text-purple-700 border-purple-300">
                  Open to Collaborate
                </Badge>
              )}
            </div>

            {profile.location && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {profile.location}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-700">{profile.bio}</p>

          <div>
            <p className="font-medium text-sm mb-2">Looking for:</p>
            <div className="flex flex-wrap gap-1">
              {profile.lookingFor.map(item => (
                <Badge key={item} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium text-sm mb-2">Industries:</p>
            <div className="flex flex-wrap gap-1">
              {profile.industries.slice(0, 3).map(industry => (
                <Badge key={industry} variant="secondary" className="text-xs">
                  {industry}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium text-sm mb-2">Skills:</p>
            <div className="flex flex-wrap gap-1">
              {profile.skills.slice(0, 4).map(skill => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2 border-t">
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost" className="p-2">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </a>
            )}
            {profile.twitterUrl && (
              <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost" className="p-2">
                  <Twitter className="w-4 h-4" />
                </Button>
              </a>
            )}
            {profile.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost" className="p-2">
                  <Github className="w-4 h-4" />
                </Button>
              </a>
            )}
            {profile.websiteUrl && (
              <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost" className="p-2">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Events & Networking</h1>
        <p className="text-gray-600 mt-2">
          Discover startup events and connect with like-minded entrepreneurs
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search events, people, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="startup">Startup</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="networking">Networking</SelectItem>
              <SelectItem value="demo_day">Demo Day</SelectItem>
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="virtual">Virtual</SelectItem>
              <SelectItem value="in-person">In Person</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">Upcoming Events</TabsTrigger>
          <TabsTrigger value="networking">Network</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          {/* Event Filters */}
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="demo_day">Demo Day</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="networking" className="space-y-6">
          {/* Networking Filters */}
          <div className="flex gap-2">
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="idea">Idea</SelectItem>
                <SelectItem value="mvp">MVP</SelectItem>
                <SelectItem value="growth">Growth</SelectItem>
                <SelectItem value="scaling">Scaling</SelectItem>
              </SelectContent>
            </Select>

            <Select value={networkingFilter} onValueChange={setNetworkingFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Looking for" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="mentoring">Available for Mentoring</SelectItem>
                <SelectItem value="seeking">Seeking Mentorship</SelectItem>
                <SelectItem value="collaboration">Open to Collaborate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Profiles Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProfiles.map(profile => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>

          {filteredProfiles.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
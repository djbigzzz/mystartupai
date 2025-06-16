import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  MapPin, 
  Clock,
  Star,
  MessageCircle,
  Video,
  Trophy,
  Search,
  Filter,
  UserPlus,
  Send,
  Award,
  Target,
  Handshake,
  Briefcase,
  Lightbulb
} from "lucide-react";

interface NetworkingEvent {
  id: string;
  title: string;
  type: "pitch" | "networking" | "workshop" | "demo";
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  attendees: number;
  maxAttendees: number;
  description: string;
  speakers: string[];
  industries: string[];
  stages: string[];
}

interface StartupProfile {
  id: string;
  name: string;
  founder: string;
  industry: string;
  stage: string;
  location: string;
  description: string;
  seeking: string[];
  offering: string[];
  avatar: string;
  matchScore: number;
}

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  expertise: string[];
  experience: string;
  location: string;
  rating: number;
  sessions: number;
  avatar: string;
  bio: string;
}

interface NetworkingPlatformProps {
  companyData: any;
}

export default function NetworkingPlatform({ companyData }: NetworkingPlatformProps) {
  const [activeTab, setActiveTab] = useState("events");
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");

  const [events] = useState<NetworkingEvent[]>([
    {
      id: "1",
      title: "CleanTech Startup Pitch Night",
      type: "pitch",
      date: "2024-01-15",
      time: "18:00",
      location: "San Francisco, CA",
      isVirtual: false,
      attendees: 47,
      maxAttendees: 100,
      description: "Present your climate tech startup to leading VCs and industry experts",
      speakers: ["Sarah Chen - Sequoia Capital", "Mike Johnson - Tesla"],
      industries: ["CleanTech", "Energy", "Sustainability"],
      stages: ["Seed", "Series A"]
    },
    {
      id: "2", 
      title: "AI Founders Virtual Meetup",
      type: "networking",
      date: "2024-01-18",
      time: "19:00",
      location: "Virtual",
      isVirtual: true,
      attendees: 124,
      maxAttendees: 200,
      description: "Connect with fellow AI startup founders and share experiences",
      speakers: ["Dr. Emily Watson - OpenAI", "Alex Kim - Google AI"],
      industries: ["AI/ML", "Technology", "SaaS"],
      stages: ["Pre-Seed", "Seed", "Series A"]
    },
    {
      id: "3",
      title: "Fundraising Masterclass",
      type: "workshop", 
      date: "2024-01-22",
      time: "14:00",
      location: "New York, NY",
      isVirtual: false,
      attendees: 32,
      maxAttendees: 50,
      description: "Learn proven strategies for raising capital from experienced founders",
      speakers: ["David Rodriguez - Stripe", "Anna Schmidt - Revolut"],
      industries: ["All Industries"],
      stages: ["Pre-Seed", "Seed"]
    }
  ]);

  const [startups] = useState<StartupProfile[]>([
    {
      id: "1",
      name: "AquaClean Systems",
      founder: "Maria Garcia", 
      industry: "CleanTech",
      stage: "Seed",
      location: "Austin, TX",
      description: "Advanced water filtration technology for industrial applications",
      seeking: ["Technical Co-founder", "Series A Funding", "Industry Partnerships"],
      offering: ["Water Tech Expertise", "Pilot Partnerships", "Mentorship"],
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      matchScore: 89
    },
    {
      id: "2",
      name: "GreenFlow Analytics",
      founder: "James Thompson",
      industry: "CleanTech", 
      stage: "MVP Development",
      location: "Portland, OR",
      description: "IoT sensors and AI analytics for smart environmental monitoring",
      seeking: ["Seed Funding", "Customer Development", "Technical Talent"],
      offering: ["Environmental Data", "IoT Expertise", "Beta Testing"],
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      matchScore: 92
    },
    {
      id: "3",
      name: "SolarEdge Innovation",
      founder: "Lisa Chen",
      industry: "CleanTech",
      stage: "Series A",
      location: "San Diego, CA", 
      description: "Next-generation solar panel efficiency optimization software",
      seeking: ["Growth Capital", "Strategic Partnerships", "International Expansion"],
      offering: ["Solar Expertise", "Customer Introductions", "Regulatory Knowledge"],
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      matchScore: 84
    }
  ]);

  const mentors: Mentor[] = [
    {
      id: "1",
      name: "Robert Kim",
      title: "Former VP of Engineering",
      company: "Tesla",
      expertise: ["Clean Technology", "Manufacturing", "Scale Operations"],
      experience: "15+ years in clean energy and automotive technology",
      location: "Palo Alto, CA",
      rating: 4.9,
      sessions: 127,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "Led engineering teams at Tesla during Model S and Model 3 launches. Expert in clean technology scaling and manufacturing processes."
    },
    {
      id: "2",
      name: "Sarah Martinez",
      title: "Startup Advisor & Former CEO",
      company: "AquaTech Solutions (Acquired)",
      expertise: ["Water Technology", "Fundraising", "Go-to-Market"],
      experience: "Built and sold water tech startup for $45M",
      location: "Denver, CO",
      rating: 4.8,
      sessions: 89,
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      bio: "Founded AquaTech Solutions, raised $12M in funding, and successfully exited to major industrial company. Now advising water tech startups."
    },
    {
      id: "3",
      name: "Michael Brown",
      title: "Investment Director",
      company: "CleanTech Ventures",
      expertise: ["Venture Capital", "Due Diligence", "Market Analysis"],
      experience: "10+ years investing in climate tech startups",
      location: "San Francisco, CA",
      rating: 4.7,
      sessions: 156,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      bio: "Led investments in 25+ climate tech companies including 3 unicorns. Deep expertise in clean technology market dynamics and fundraising."
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "pitch": return "bg-purple-100 text-purple-800";
      case "networking": return "bg-blue-100 text-blue-800";
      case "workshop": return "bg-green-100 text-green-800";
      case "demo": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "pitch": return <Trophy className="w-4 h-4" />;
      case "networking": return <Users className="w-4 h-4" />;
      case "workshop": return <Lightbulb className="w-4 h-4" />;
      case "demo": return <Target className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Startup Networking Hub
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Connect, learn, and grow with the startup community
            </p>
            <div className="flex items-center space-x-4">
              <Badge className="bg-indigo-100 text-indigo-800">
                <Users className="w-3 h-3 mr-1" />
                {companyData.industry} Network
              </Badge>
              <Badge variant="outline">{companyData.stage}</Badge>
              <Badge variant="outline">{companyData.location}</Badge>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">847</div>
            <p className="text-slate-600 font-medium">Network Members</p>
            <p className="text-sm text-slate-500">in your industry</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">12</div>
            <p className="text-sm text-slate-600">Upcoming Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">847</div>
            <p className="text-sm text-slate-600">Network Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">34</div>
            <p className="text-sm text-slate-600">Expert Mentors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Handshake className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-900">156</div>
            <p className="text-sm text-slate-600">Connections Made</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events" className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="startups" className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2" />
            Startups
          </TabsTrigger>
          <TabsTrigger value="mentors" className="flex items-center">
            <Award className="w-4 h-4 mr-2" />
            Mentors
          </TabsTrigger>
          <TabsTrigger value="showcase" className="flex items-center">
            <Trophy className="w-4 h-4 mr-2" />
            Showcase
          </TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Events
                </div>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Host Event
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge className={getEventTypeColor(event.type)}>
                            {getEventTypeIcon(event.type)}
                            <span className="ml-1 capitalize">{event.type}</span>
                          </Badge>
                          <h3 className="text-lg font-semibold text-slate-900 mt-2">{event.title}</h3>
                        </div>
                        {event.isVirtual && (
                          <Badge variant="outline">
                            <Video className="w-3 h-3 mr-1" />
                            Virtual
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-slate-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-slate-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-slate-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-slate-600">
                          <Users className="w-4 h-4 mr-2" />
                          {event.attendees}/{event.maxAttendees} attendees
                        </div>
                      </div>

                      <p className="text-slate-700 text-sm">{event.description}</p>

                      <div>
                        <h5 className="font-medium text-slate-900 mb-2">Speakers</h5>
                        <div className="space-y-1">
                          {event.speakers.map((speaker, index) => (
                            <p key={index} className="text-sm text-slate-600">{speaker}</p>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-slate-900 mb-2">Focus Areas</h5>
                        <div className="flex flex-wrap gap-1">
                          {event.industries.slice(0, 2).map((industry) => (
                            <Badge key={industry} variant="secondary" className="text-xs">
                              {industry}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full">
                        Register Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Startups Tab */}
        <TabsContent value="startups" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Startup Network
                </div>
                <div className="flex space-x-2">
                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      <SelectItem value="CleanTech">CleanTech</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {startups.map((startup) => (
                  <Card key={startup.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={startup.avatar} 
                            alt={startup.founder}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">{startup.name}</h3>
                            <p className="text-slate-600">by {startup.founder}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">{startup.industry}</Badge>
                              <Badge variant="outline" className="text-xs">{startup.stage}</Badge>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {startup.matchScore}% match
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center text-slate-600 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        {startup.location}
                      </div>

                      <p className="text-slate-700 text-sm">{startup.description}</p>

                      <div>
                        <h5 className="font-medium text-slate-900 mb-2">Seeking</h5>
                        <div className="flex flex-wrap gap-1">
                          {startup.seeking.slice(0, 2).map((item) => (
                            <Badge key={item} className="bg-blue-100 text-blue-800 text-xs">
                              {item}
                            </Badge>
                          ))}
                          {startup.seeking.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{startup.seeking.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-slate-900 mb-2">Offering</h5>
                        <div className="flex flex-wrap gap-1">
                          {startup.offering.slice(0, 2).map((item) => (
                            <Badge key={item} className="bg-green-100 text-green-800 text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Connect
                        </Button>
                        <Button variant="outline" size="sm">
                          <Star className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mentors Tab */}
        <TabsContent value="mentors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Expert Mentors
                </div>
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  Find Mentor
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
                  <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="text-center">
                        <img 
                          src={mentor.avatar} 
                          alt={mentor.name}
                          className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                        />
                        <h3 className="text-lg font-semibold text-slate-900">{mentor.name}</h3>
                        <p className="text-slate-600 font-medium">{mentor.title}</p>
                        <p className="text-slate-500 text-sm">{mentor.company}</p>
                        
                        <div className="flex items-center justify-center space-x-2 mt-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium ml-1">{mentor.rating}</span>
                          </div>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm text-slate-600">{mentor.sessions} sessions</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center text-slate-600 text-sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        {mentor.location}
                      </div>

                      <p className="text-slate-700 text-sm">{mentor.bio}</p>

                      <div>
                        <h5 className="font-medium text-slate-900 mb-2">Expertise</h5>
                        <div className="flex flex-wrap gap-1">
                          {mentor.expertise.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Book Session
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Showcase Tab */}
        <TabsContent value="showcase" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Startup Showcase
                </div>
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Your Startup
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-2xl border border-purple-100 text-center">
                <Trophy className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Monthly Startup Showcase
                </h3>
                <p className="text-lg text-slate-600 mb-6">
                  Present your startup to investors, potential customers, and the startup community
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl border border-purple-200">
                    <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-slate-900 mb-2">Pitch Competition</h4>
                    <p className="text-sm text-slate-600">5-minute pitches with expert feedback</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-purple-200">
                    <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-slate-900 mb-2">Networking</h4>
                    <p className="text-sm text-slate-600">Connect with investors and peers</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-purple-200">
                    <Award className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-slate-900 mb-2">Recognition</h4>
                    <p className="text-sm text-slate-600">Win prizes and gain visibility</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <h5 className="font-semibold text-slate-900 mb-2">Next Event: January 25, 2024</h5>
                    <p className="text-slate-600">Application deadline: January 20, 2024</p>
                  </div>
                  
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600">
                    <Send className="w-5 h-5 mr-2" />
                    Apply to Present
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
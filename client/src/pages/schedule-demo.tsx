import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Users,
  Video,
  MapPin,
  Plus,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  CalendarDays,
  Settings
} from "lucide-react";

export default function ScheduleDemo() {
  const upcomingMeetings = [
    {
      id: 1,
      title: "Investor Pitch Meeting",
      type: "Investment",
      date: "Today",
      time: "2:00 PM - 3:00 PM",
      attendees: ["Sarah Chen - A16z", "Mike Rodriguez - Sequoia"],
      location: "Zoom",
      status: "confirmed",
      priority: "high"
    },
    {
      id: 2,
      title: "Product Development Sync",
      type: "Internal",
      date: "Tomorrow",
      time: "10:00 AM - 11:00 AM",
      attendees: ["Development Team", "Product Manager"],
      location: "Conference Room A",
      status: "confirmed",
      priority: "medium"
    },
    {
      id: 3,
      title: "Customer Discovery Call",
      type: "Customer",
      date: "Jan 24",
      time: "3:30 PM - 4:00 PM",
      attendees: ["Alex Johnson - TechCorp"],
      location: "Google Meet",
      status: "pending",
      priority: "high"
    },
    {
      id: 4,
      title: "Legal Consultation",
      type: "Legal",
      date: "Jan 25",
      time: "11:00 AM - 12:00 PM",
      attendees: ["Jennifer Smith - Law Firm"],
      location: "Office",
      status: "confirmed",
      priority: "medium"
    }
  ];

  const availabilitySlots = [
    { day: "Monday", slots: ["9:00 AM", "10:30 AM", "2:00 PM", "4:00 PM"] },
    { day: "Tuesday", slots: ["9:00 AM", "11:00 AM", "3:00 PM"] },
    { day: "Wednesday", slots: ["10:00 AM", "1:00 PM", "3:30 PM", "5:00 PM"] },
    { day: "Thursday", slots: ["9:30 AM", "2:30 PM", "4:30 PM"] },
    { day: "Friday", slots: ["9:00 AM", "10:00 AM", "2:00 PM"] }
  ];

  const meetingTypes = [
    {
      name: "Investor Pitch",
      duration: "60 minutes",
      description: "Present your startup to potential investors",
      icon: Users,
      color: "bg-red-100 text-red-800"
    },
    {
      name: "Customer Discovery",
      duration: "30 minutes",
      description: "Interview potential customers about their needs",
      icon: Phone,
      color: "bg-blue-100 text-blue-800"
    },
    {
      name: "Product Demo",
      duration: "45 minutes",
      description: "Demonstrate your product to prospects",
      icon: Video,
      color: "bg-green-100 text-green-800"
    },
    {
      name: "Team Meeting",
      duration: "30 minutes",
      description: "Internal team synchronization",
      icon: Users,
      color: "bg-purple-100 text-purple-800"
    }
  ];

  const calendarIntegrations = [
    { name: "Google Calendar", status: "connected", lastSync: "2 minutes ago" },
    { name: "Outlook", status: "available", lastSync: "Not connected" },
    { name: "Apple Calendar", status: "available", lastSync: "Not connected" },
    { name: "Calendly", status: "connected", lastSync: "5 minutes ago" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-4 border-red-500";
      case "medium": return "border-l-4 border-yellow-500";
      case "low": return "border-l-4 border-green-500";
      default: return "border-l-4 border-gray-500";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Investment": return "bg-red-50 text-red-700";
      case "Customer": return "bg-blue-50 text-blue-700";
      case "Internal": return "bg-purple-50 text-purple-700";
      case "Legal": return "bg-yellow-50 text-yellow-700";
      default: return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Calendar className="w-8 h-8 mr-3 text-blue-600" />
                Schedule & Meetings
                <Badge className="ml-3 bg-orange-50 text-orange-600 border-orange-200">
                  Demo
                </Badge>
              </h1>
              <p className="text-gray-600 mt-2">Manage your startup meetings and availability</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <AlertCircle className="w-4 h-4 mr-2" />
                This is a demo
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Meetings</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <CalendarDays className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Investor Meetings</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Hours</p>
                  <p className="text-2xl font-bold text-gray-900">18</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Meetings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className={`p-4 bg-gray-50 rounded-lg ${getPriorityColor(meeting.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                        <Badge className={getTypeColor(meeting.type)}>
                          {meeting.type}
                        </Badge>
                        <Badge className={getStatusColor(meeting.status)}>
                          {meeting.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{meeting.date} • {meeting.time}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{meeting.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{meeting.attendees.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Video className="w-4 h-4 mr-1" />
                        Join
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Meeting Types and Availability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Meeting Types */}
          <Card>
            <CardHeader>
              <CardTitle>Meeting Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meetingTypes.map((type, index) => {
                  const IconComponent = type.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${type.color}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{type.name}</h4>
                          <p className="text-sm text-gray-600">{type.description}</p>
                          <p className="text-xs text-gray-500">{type.duration}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Configure
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availabilitySlots.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="w-20 text-sm font-medium text-gray-900">
                      {day.day}
                    </div>
                    <div className="flex-1 flex flex-wrap gap-2">
                      {day.slots.map((slot, slotIndex) => (
                        <Badge key={slotIndex} variant="outline" className="text-xs">
                          {slot}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Update Availability
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Integrations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Calendar Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {calendarIntegrations.map((integration, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{integration.name}</h4>
                    {integration.status === "connected" ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Button size="sm" variant="outline">
                        Connect
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Last sync: {integration.lastSync}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo Notice */}
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800">Demo Mode</h3>
                <p className="text-sm text-orange-700 mt-1">
                  This scheduling system shows sample meetings and availability. In the full version, you'll get 
                  real calendar synchronization, automated meeting scheduling, video conference integration, 
                  meeting recording, follow-up automation, and CRM integration for tracking all stakeholder interactions.
                </p>
                <div className="flex space-x-3 mt-3">
                  <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    View Calendar Integration
                  </Button>
                  <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                    See Automation Features
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
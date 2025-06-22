import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Network, ArrowRight, Clock, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function EventsNetworkingNav() {
  const upcomingEvents = [
    {
      id: 1,
      title: "SF Startup Demo Day 2025",
      date: "Jan 15, 6:00 PM",
      location: "San Francisco, CA",
      attendees: 147,
      type: "demo_day"
    },
    {
      id: 2,
      title: "AI & ML Workshop",
      date: "Jan 20, 2:00 PM",
      location: "Virtual",
      attendees: 38,
      type: "workshop"
    }
  ];

  const networkingStats = {
    connections: 23,
    pendingRequests: 5,
    profileViews: 142,
    eventsAttended: 8
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events & Networking</h2>
          <p className="text-gray-600 mt-1">Discover events and expand your network</p>
        </div>
        <Link href="/events-networking">
          <Button className="bg-blue-600 hover:bg-blue-700">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{networkingStats.connections}</p>
                <p className="text-xs text-gray-600">Connections</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Network className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{networkingStats.pendingRequests}</p>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{networkingStats.eventsAttended}</p>
                <p className="text-xs text-gray-600">Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{networkingStats.profileViews}</p>
                <p className="text-xs text-gray-600">Profile Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Upcoming Events
          </CardTitle>
          <CardDescription>Don't miss these networking opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {event.attendees} attending
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {event.type.replace('_', ' ')}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Register
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Network className="w-5 h-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Connected with <strong>Sarah Chen</strong></span>
              <span className="text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Registered for <strong>AI Workshop</strong></span>
              <span className="text-gray-500">1 day ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Profile viewed by <strong>Marcus Johnson</strong></span>
              <span className="text-gray-500">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
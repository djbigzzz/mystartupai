import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Globe, 
  Camera, 
  Save,
  Shield,
  Bell,
  Calendar,
  Linkedin,
  Twitter,
  Github
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  company: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileManagementProps {
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    company?: string;
    website?: string;
    bio?: string;
    avatar?: string;
    plan: string;
    joinedAt: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
    emailVerified: boolean;
    profileComplete: number;
  };
}

export default function ProfileManagement({ user }: ProfileManagementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      location: user.location || "",
      company: user.company || "",
      website: user.website || "",
      bio: user.bio || "",
      linkedin: user.linkedin || "",
      twitter: user.twitter || "",
      github: user.github || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return await apiRequest("/api/auth/profile", {
        method: "PATCH",
        body: data as any
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Upload avatar:", file);
    }
  };

  const profileCompletionItems = [
    { label: "Basic Information", completed: !!(user.name && user.email) },
    { label: "Contact Details", completed: !!(user.phone && user.location) },
    { label: "Professional Info", completed: !!(user.company && user.bio) },
    { label: "Social Links", completed: !!(user.linkedin || user.twitter) },
    { label: "Email Verification", completed: user.emailVerified },
  ];

  const completedItems = profileCompletionItems.filter(item => item.completed).length;
  const completionPercentage = (completedItems / profileCompletionItems.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-lg">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="outline">{user.plan} Plan</Badge>
                    <span className="text-sm text-gray-500">
                      Member since {new Date(user.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </div>
              
              {/* Profile Completion */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium">Profile Completion</span>
                  <span className="text-gray-600">{Math.round(completionPercentage)}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
                <div className="flex flex-wrap gap-2 mt-3">
                  {profileCompletionItems.map((item, index) => (
                    <Badge
                      key={index}
                      variant={item.completed ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {item.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and professional information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            Email Address
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            Location
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} placeholder="City, Country" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Building className="w-4 h-4 mr-2" />
                            Company
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            Website
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} placeholder="https://yourwebsite.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={!isEditing}
                            placeholder="Tell us about yourself and your entrepreneurial journey..."
                            rows={4}
                          />
                        </FormControl>
                        <FormDescription>
                          A brief description of your background and expertise (max 500 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Linkedin className="w-4 h-4 mr-2" />
                              LinkedIn
                            </FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} placeholder="https://linkedin.com/in/..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Twitter className="w-4 h-4 mr-2" />
                              Twitter
                            </FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} placeholder="https://twitter.com/..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="github"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Github className="w-4 h-4 mr-2" />
                              GitHub
                            </FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} placeholder="https://github.com/..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Email Verification</p>
                    <p className="text-sm text-gray-500">
                      {user.emailVerified ? "Your email is verified" : "Please verify your email address"}
                    </p>
                  </div>
                </div>
                {!user.emailVerified && (
                  <Button variant="outline" size="sm">
                    Send Verification
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your information and how it's used
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Public Profile</p>
                  <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Contact Information</p>
                  <p className="text-sm text-gray-500">Display email and phone in your public profile</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Analytics Tracking</p>
                  <p className="text-sm text-gray-500">Help us improve by sharing usage analytics</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Communications</p>
                  <p className="text-sm text-gray-500">Receive updates about new features and opportunities</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about important updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Email Notifications</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Analysis Complete</p>
                    <p className="text-sm text-gray-500">When your startup analysis is ready</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Investor Matches</p>
                    <p className="text-sm text-gray-500">When new investors match your profile</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Progress</p>
                    <p className="text-sm text-gray-500">Weekly summary of your startup progress</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <h4 className="font-medium">Push Notifications</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Real-time Updates</p>
                    <p className="text-sm text-gray-500">Immediate notifications for important events</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Reminders</p>
                    <p className="text-sm text-gray-500">Reminders for pending tasks and deadlines</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
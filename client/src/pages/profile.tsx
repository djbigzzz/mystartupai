import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, Edit3, Save, X, Mail, Key, Wallet, Shield, Camera, ArrowLeft, Coins, CreditCard, TrendingUp, AlertTriangle, Heart, Sparkles, Edit } from "lucide-react";
import { CREDIT_PACKAGES } from "@shared/constants";
import TwoFactorAuth from "@/components/profile/two-factor-auth";
import SidebarNavigation from "@/components/dashboard/sidebar-navigation";
import MobileNavigation from "@/components/mobile-navigation";
import { Link } from "wouter";

interface UserProfile {
  id: number;
  email: string | null;
  name: string | null;
  username: string | null;
  walletAddressEthereum: string | null;
  walletAddressSolana: string | null;
  authMethod: string | null;
  avatar: string | null;
  emailVerified: boolean;
  credits: number;
  currentPlan: string;
  createdAt: string;
  updatedAt: string;
  twoFactorEnabled?: boolean;
  subscriptionStatus?: string | null;
  subscriptionStartDate?: string | null;
  nextBillingDate?: string | null;
  creditsResetDate?: string | null;
  usageAlert?: number | null;
  monthlyCreditsUsed?: number | null;
}

interface UpdateProfileData {
  name?: string;
  username?: string;
  email?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Profile() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UpdateProfileData>({});
  const [passwordForm, setPasswordForm] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [show2FADialog, setShow2FADialog] = useState(false);

  // Fetch user profile
  const { data: user, isLoading } = useQuery<UserProfile>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Fetch credit balance and transactions
  const { data: creditData } = useQuery<{ credits: number; transactions: any[] }>({
    queryKey: ["/api/credits/balance"],
    enabled: !!user,
  });

  // Fetch user's ideas
  const { data: userIdeas } = useQuery<any[]>({
    queryKey: ["/api/ideas"],
    enabled: !!user,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      return apiRequest("/api/auth/profile", {
        method: "PATCH",
        body: data as any
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setIsEditing(false);
      setEditForm({});
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      return apiRequest("/api/auth/change-password", {
        method: "POST",
        body: data as any
      });
    },
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Password change failed",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    }
  });

  // Cancel confirmation dialog state
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/subscriptions/cancel", {
        method: "POST",
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Subscription Cancelled",
        description: data.message || "Your subscription will be cancelled at the end of the billing period.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setShowCancelDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  });

  // Reactivate subscription mutation
  const reactivateSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/subscriptions/reactivate", {
        method: "POST",
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Subscription Reactivated! 🎉",
        description: data.message || "Your subscription has been reactivated and will continue as normal.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error: any) => {
      toast({
        title: "Reactivation Failed",
        description: error.message || "Failed to reactivate subscription",
        variant: "destructive",
      });
    }
  });

  // Update usage alert mutation
  const [usageAlertAmount, setUsageAlertAmount] = useState<number>(0);
  
  // Hydrate usage alert from user data when it loads
  useEffect(() => {
    if (user?.usageAlert !== undefined && user?.usageAlert !== null) {
      setUsageAlertAmount(user.usageAlert);
    }
  }, [user?.usageAlert]);

  const updateUsageAlertMutation = useMutation({
    mutationFn: async (alertAmount: number) => {
      return apiRequest("/api/subscriptions/update-alert", {
        method: "POST",
        body: { alertAmount } as any
      });
    },
    onSuccess: () => {
      toast({
        title: "Usage Alert Updated",
        description: "Your usage alert has been set successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update usage alert",
        variant: "destructive",
      });
    }
  });

  // Solana wallet connection functionality
  const handleWalletConnect = async () => {
    try {
      // Check if Solana wallet is available (Phantom, Solflare, etc.)
      const { solana } = window as any;
      
      if (!solana) {
        toast({
          title: "No Solana Wallet Found",
          description: "Please install Phantom, Solflare, or another Solana wallet extension.",
          variant: "destructive",
        });
        return;
      }

      // Connect to wallet
      const response = await solana.connect();
      const walletAddress = response.publicKey.toString();

      // Step 1: Get challenge from server
      const challengeResponse = await fetch("/api/auth/challenge", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!challengeResponse.ok) {
        throw new Error("Failed to get authentication challenge");
      }

      const challenge = await challengeResponse.json();

      // Step 2: Create message to sign
      const messageToSign = `MyStartup.ai wants you to sign in with your Solana account:\n${walletAddress}\n\nNonce: ${challenge.nonce}\nIssued At: ${new Date().toISOString()}`;
      const encodedMessage = new TextEncoder().encode(messageToSign);

      // Step 3: Sign message with wallet
      const signedMessage = await solana.signMessage(encodedMessage, "utf8");
      const signature = btoa(String.fromCharCode(...signedMessage.signature));

      // Step 4: Link wallet to profile
      const linkResponse = await apiRequest("/api/auth/wallet-signin", {
        method: "POST",
        body: {
          signature: signature,
          message: messageToSign,
          nonce: challenge.nonce,
          walletAddress: walletAddress,
          authMethod: "phantom",
          linkToExisting: true
        } as any
      });

      if (!linkResponse) {
        throw new Error("Wallet linking failed");
      }

      toast({
        title: "Wallet Connected!",
        description: "Your Solana wallet has been successfully linked to your account.",
      });

      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });

    } catch (error: any) {
      console.error('Solana wallet connection failed:', error);
      toast({
        title: "Wallet Connection Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleEditStart = () => {
    setIsEditing(true);
    setEditForm({
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || ""
    });
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleEditSave = () => {
    updateProfileMutation.mutate(editForm);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation don't match",
        variant: "destructive",
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate(passwordForm);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getAccountType = () => {
    const hasWallet = user?.walletAddressEthereum || user?.walletAddressSolana;
    if (hasWallet && user?.email) return "Hybrid Account";
    if (hasWallet) return "Wallet Account";
    return "Email Account";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground">Please log in to view your profile.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <MobileNavigation />
      </div>
      
      {/* Sidebar Navigation - Desktop Only */}
      <div className="hidden lg:block">
        <SidebarNavigation />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{user.name || "Unnamed User"}</h1>
                  <p className="text-muted-foreground">@{user.username || `user${user.id}`}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{getAccountType()}</Badge>
                    <Badge variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600">
                      <CreditCard className="w-3 h-3 mr-1" />
                      {user.currentPlan === 'FREEMIUM' && 'Free Plan'}
                      {user.currentPlan === 'BASIC' && 'Basic Plan'}
                      {user.currentPlan === 'PRO' && 'Pro Plan'}
                    </Badge>
                    {user.emailVerified && (
                      <Badge variant="outline" className="text-green-600">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => {
                  // Create file input element
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      // For now, show a toast - file upload functionality can be added later
                      toast({
                        title: "Photo Upload",
                        description: "Photo upload functionality will be available soon.",
                      });
                    }
                  };
                  input.click();
                }}
              >
                <Camera className="w-4 h-4" />
                Change Photo
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Management Tabs */}
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* General Information */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Manage your account details and public profile information.
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={handleEditStart}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editForm.name || ""}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={editForm.username || ""}
                          onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                          placeholder="Choose a username"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleEditSave}
                        disabled={updateProfileMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button variant="outline" onClick={handleEditCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                      <p className="text-sm">{user.name || "Not provided"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Username</Label>
                      <p className="text-sm">@{user.username || `user${user.id}`}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                      <p className="text-sm">{user.email || "Not provided"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                      <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Authentication & Linked Data */}
            <Card>
              <CardHeader>
                <CardTitle>Authentication & Linked Data</CardTitle>
                <CardDescription>
                  Your connected wallets, email, and startup ideas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Wallet Addresses */}
                {(user.walletAddressSolana || user.walletAddressEthereum) && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-blue-600" />
                      Connected Wallets
                    </h3>
                    <div className="space-y-3">
                      {user.walletAddressSolana && (
                        <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-xs font-medium text-purple-700 dark:text-purple-300">Solana Wallet</Label>
                              <p className="text-xs font-mono mt-1 text-gray-700 dark:text-gray-300 break-all">
                                {user.walletAddressSolana}
                              </p>
                            </div>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              {user.authMethod === 'phantom' ? 'Phantom' : 'Solana'}
                            </Badge>
                          </div>
                        </div>
                      )}
                      {user.walletAddressEthereum && (
                        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-xs font-medium text-blue-700 dark:text-blue-300">Ethereum Wallet</Label>
                              <p className="text-xs font-mono mt-1 text-gray-700 dark:text-gray-300 break-all">
                                {user.walletAddressEthereum}
                              </p>
                            </div>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              MetaMask
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Email Authentication */}
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                    <Mail className="w-4 h-4 text-green-600" />
                    Email Authentication
                  </h3>
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-xs font-medium text-green-700 dark:text-green-300">Email Address</Label>
                        <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                          {user.email || 'Not connected'}
                        </p>
                      </div>
                      {user.emailVerified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Linked Startup Ideas */}
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-yellow-600" />
                    Your Startup Idea
                  </h3>
                  {userIdeas && userIdeas.length > 0 ? (
                    <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {userIdeas[0].ideaTitle}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {userIdeas[0].description}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="outline">{userIdeas[0].industry}</Badge>
                            <Badge variant="outline">{userIdeas[0].stage}</Badge>
                          </div>
                        </div>
                        <Link href="/submit-idea">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        No startup idea submitted yet
                      </p>
                      <Link href="/submit-idea">
                        <Button size="sm" variant="outline">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Submit Your First Idea
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and password settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {user.email && (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          placeholder="Enter current password"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          placeholder="Enter new password"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                          required
                        />
                      </div>
                      <Button 
                        type="submit"
                        disabled={changePasswordMutation.isPending}
                      >
                        <Key className="w-4 h-4 mr-2" />
                        {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                      </Button>
                    </div>
                  </form>
                )}

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Security</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4" />
                        <span className="font-medium">Email Verification</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {user.emailVerified ? "Your email is verified" : "Your email is not verified"}
                      </p>
                      {!user.emailVerified && user.email && (
                        <Button variant="outline" size="sm">
                          Send Verification Email
                        </Button>
                      )}
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4" />
                        <span className="font-medium">Two-Factor Auth</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {user.twoFactorEnabled ? "2FA is enabled" : "Add an extra layer of security"}
                      </p>
                      <Button 
                        variant={user.twoFactorEnabled ? "destructive" : "outline"} 
                        size="sm"
                        onClick={() => setShow2FADialog(true)}
                        data-testid="button-manage-2fa"
                      >
                        {user.twoFactorEnabled ? "Disable 2FA" : "Setup 2FA"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Information */}
          <TabsContent value="wallet">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Connection</CardTitle>
                <CardDescription>
                  Connect and manage your Solana wallet for blockchain features.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {(user.walletAddressEthereum || user.walletAddressSolana) ? (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Wallet className="w-5 h-5" />
                          <div>
                            <p className="font-medium">
                              {user.walletAddressSolana ? "Solana Wallet" : "Ethereum Wallet"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {(user.walletAddressEthereum || user.walletAddressSolana)?.slice(0, 6)}...{(user.walletAddressEthereum || user.walletAddressSolana)?.slice(-4)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          Connected
                        </Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Chain ID:</span>
                          <span className="ml-2">{user.walletAddressEthereum ? "1" : "101"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Network:</span>
                          <span className="ml-2">
                            {user.walletAddressEthereum ? "Ethereum Mainnet" : "Solana Mainnet"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleWalletConnect}
                      data-testid="button-connect-additional-wallet"
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Another Solana Wallet
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Solana Wallet Connected</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect your Solana wallet (Phantom, Solflare, etc.) to access blockchain features
                    </p>
                    <Button 
                      onClick={handleWalletConnect}
                      data-testid="button-connect-wallet"
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Tab - Manus Style */}
          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle>Usage & Credits</CardTitle>
                <CardDescription>
                  Track your credit usage and view transaction history
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Plan Section */}
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {user.currentPlan === 'FREEMIUM' && 'Free'}
                        {user.currentPlan === 'BASIC' && 'Basic'}
                        {user.currentPlan === 'PRO' && 'Pro'}
                      </h3>
                      <Badge variant="secondary" className="text-xs">Current Plan</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user.currentPlan === 'FREEMIUM' && '200 credits/month'}
                      {user.currentPlan === 'BASIC' && '2,000 credits/month'}
                      {user.currentPlan === 'PRO' && '7,000 credits/month'}
                    </p>
                  </div>
                  {user.currentPlan !== 'PRO' && (
                    <Button 
                      size="sm"
                      onClick={() => window.location.href = '/purchase-credits'}
                      data-testid="button-upgrade"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Upgrade
                    </Button>
                  )}
                </div>

                {/* Credits Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    Credits
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Coins className="w-4 h-4" />
                        Available Credits
                      </div>
                      <div className="text-2xl font-bold">
                        {creditData?.credits?.toLocaleString() || user.credits?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Daily Refresh Credits</div>
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground mt-1">Monthly refresh on 1st</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Transaction History */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Transaction History</h3>
                  {creditData?.transactions && creditData.transactions.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left p-3 font-medium">Description</th>
                              <th className="text-left p-3 font-medium">Date</th>
                              <th className="text-right p-3 font-medium">Credits</th>
                            </tr>
                          </thead>
                          <tbody>
                            {creditData.transactions.slice(0, 10).map((transaction: any, idx: number) => (
                              <tr key={idx} className="border-t hover:bg-muted/50">
                                <td className="p-3">{transaction.description || transaction.featureType}</td>
                                <td className="p-3 text-muted-foreground">
                                  {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </td>
                                <td className={`p-3 text-right font-medium ${
                                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 border rounded-lg bg-muted/30">
                      <Coins className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                      <p className="text-muted-foreground">No transaction history yet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your credit usage will appear here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Management */}
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription Management
                </CardTitle>
                <CardDescription>
                  Manage your subscription plan, billing, and usage alerts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Plan Status */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Plan</p>
                      <p className="text-2xl font-bold">{user?.currentPlan || 'FREEMIUM'}</p>
                    </div>
                    <Badge variant={user?.currentPlan === 'PRO' ? 'default' : 'secondary'}>
                      {user?.currentPlan === 'FREEMIUM' ? 'Free' : 
                       user?.currentPlan === 'CORE' ? 'Starter' : 'Pro'}
                    </Badge>
                  </div>

                  {/* Subscription Status */}
                  {user?.subscriptionStatus && user.subscriptionStatus !== 'expired' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge variant={
                          user.subscriptionStatus === 'active' ? 'default' : 
                          user.subscriptionStatus === 'cancel_at_period_end' ? 'destructive' : 
                          'secondary'
                        }>
                          {user.subscriptionStatus === 'active' ? 'Active' :
                           user.subscriptionStatus === 'cancel_at_period_end' ? 'Cancelling' :
                           user.subscriptionStatus}
                        </Badge>
                      </div>

                      {user.nextBillingDate && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <span className="text-sm text-muted-foreground">
                            {user.subscriptionStatus === 'cancel_at_period_end' ? 'Access Until' : 'Next Billing'}
                          </span>
                          <span className="text-sm font-medium">
                            {new Date(user.nextBillingDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      )}

                      {user.monthlyCreditsUsed && user.monthlyCreditsUsed > 0 && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                          <div>
                            <span className="text-sm font-medium text-orange-700 dark:text-orange-400">Monthly Overage Usage</span>
                            <p className="text-xs text-muted-foreground mt-0.5">Credits used beyond monthly allocation</p>
                          </div>
                          <span className="text-lg font-bold text-orange-700 dark:text-orange-400">
                            {user.monthlyCreditsUsed?.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Usage Alert Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Usage Alert</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your monthly overage usage reaches a specific threshold.
                  </p>
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      placeholder="Alert threshold (credits)"
                      value={usageAlertAmount || user?.usageAlert || 0}
                      onChange={(e) => setUsageAlertAmount(parseInt(e.target.value) || 0)}
                      className="max-w-xs"
                    />
                    <Button 
                      onClick={() => updateUsageAlertMutation.mutate(usageAlertAmount)}
                      disabled={updateUsageAlertMutation.isPending}
                    >
                      {updateUsageAlertMutation.isPending ? 'Saving...' : 'Set Alert'}
                    </Button>
                  </div>
                  {user?.usageAlert && (
                    <p className="text-sm text-muted-foreground">
                      Current alert: {user.usageAlert.toLocaleString()} credits
                    </p>
                  )}
                </div>

                {/* Cancel Subscription */}
                {user?.subscriptionStatus === 'active' && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-destructive">Cancel Subscription</h3>
                      <p className="text-sm text-muted-foreground">
                        Your subscription will remain active until the end of the current billing period.
                        You'll keep your credits and can continue using overage billing.
                      </p>
                      <Button 
                        variant="destructive"
                        onClick={() => setShowCancelDialog(true)}
                        disabled={cancelSubscriptionMutation.isPending}
                      >
                        Cancel Subscription
                      </Button>
                    </div>
                  </>
                )}

                {/* Reactivate Subscription */}
                {user?.subscriptionStatus === 'cancel_at_period_end' && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-green-600 dark:text-green-500">Reactivate Subscription</h3>
                      <p className="text-sm text-muted-foreground">
                        Your subscription is scheduled to cancel at the end of the billing period. 
                        You can reactivate it anytime before then to continue enjoying all features.
                      </p>
                      <Button 
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => reactivateSubscriptionMutation.mutate()}
                        disabled={reactivateSubscriptionMutation.isPending}
                      >
                        {reactivateSubscriptionMutation.isPending ? 'Reactivating...' : 'Reactivate Subscription'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your experience and notification settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Emails</p>
                        <p className="text-sm text-muted-foreground">Receive product updates and tips</p>
                      </div>
                      <Button variant="outline" size="sm">Disable</Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Display</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Theme</p>
                        <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                      </div>
                      <Button variant="outline" size="sm">Dark</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Language</p>
                        <p className="text-sm text-muted-foreground">Select your language</p>
                      </div>
                      <Button variant="outline" size="sm">English</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 2FA Dialog */}
        {show2FADialog && (
          <TwoFactorAuth 
            isEnabled={user.twoFactorEnabled || false}
            onClose={() => setShow2FADialog(false)}
          />
        )}

        {/* Cancel Subscription Confirmation Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" />
                </div>
                <DialogTitle className="text-xl">Wait! Before you go...</DialogTitle>
              </div>
              <DialogDescription className="text-base space-y-3 pt-2">
                <p className="font-medium text-foreground">
                  We'd hate to see you leave! Here's what you'll miss:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>AI-powered business plans and pitch decks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Advanced market research and financial modeling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Priority support and early access to new features</span>
                  </li>
                </ul>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
                  <p className="text-sm text-blue-900 dark:text-blue-300 flex items-start gap-2">
                    <Heart className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>Your subscription will remain active until {user?.nextBillingDate ? new Date(user.nextBillingDate).toLocaleDateString() : 'the end of your billing period'}. You can reactivate anytime before then!</span>
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Keep My Subscription
              </Button>
              <Button
                variant="destructive"
                onClick={() => cancelSubscriptionMutation.mutate()}
                disabled={cancelSubscriptionMutation.isPending}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {cancelSubscriptionMutation.isPending ? 'Cancelling...' : 'Yes, Cancel Subscription'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
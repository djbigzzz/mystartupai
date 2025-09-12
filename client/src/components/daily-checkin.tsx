import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  Calendar,
  Flame,
  Star,
  Trophy,
  Sparkles,
  Heart,
  Zap,
  Coffee,
  Target,
  Brain,
  Smile,
  Meh,
  Frown,
  PartyPopper,
  TrendingUp,
  Award,
  Gift,
  Clock,
  BarChart3,
  Rocket,
  Crown,
  Plus
} from "lucide-react";
import { format, formatDistanceToNow, isToday, parseISO } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface CheckinStatus {
  hasCheckedInToday: boolean;
}

interface CheckinResult {
  message: string;
  xp: number;
  bonusXp: number;
  streakDay: number;
  leveledUp: boolean;
  newLevel?: number;
}

interface CheckinHistory {
  id: number;
  checkinDate: string;
  xpAwarded: number;
  bonusXp: number;
  streakDay: number;
  mood?: string;
  note?: string;
}

interface CheckinStats {
  totalCheckins: number;
  currentStreak: number;
  longestStreak: number;
  totalXpFromCheckins: number;
}

const moodOptions = [
  { value: "excited", label: "Excited", icon: PartyPopper, color: "text-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-900/20" },
  { value: "motivated", label: "Motivated", icon: Rocket, color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/20" },
  { value: "focused", label: "Focused", icon: Target, color: "text-purple-500", bgColor: "bg-purple-100 dark:bg-purple-900/20" },
  { value: "happy", label: "Happy", icon: Smile, color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-900/20" },
  { value: "energetic", label: "Energetic", icon: Zap, color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-900/20" },
  { value: "calm", label: "Calm", icon: Coffee, color: "text-teal-500", bgColor: "bg-teal-100 dark:bg-teal-900/20" },
  { value: "determined", label: "Determined", icon: Brain, color: "text-indigo-500", bgColor: "bg-indigo-100 dark:bg-indigo-900/20" },
  { value: "neutral", label: "Neutral", icon: Meh, color: "text-gray-500", bgColor: "bg-gray-100 dark:bg-gray-900/20" }
];

interface DailyCheckinProps {
  className?: string;
  onLevelUp?: (newLevel: number) => void;
  onCheckinComplete?: (result: CheckinResult) => void;
}

export default function DailyCheckin({ className, onLevelUp, onCheckinComplete }: DailyCheckinProps) {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [showRewards, setShowRewards] = useState(false);
  const [lastCheckinResult, setLastCheckinResult] = useState<CheckinResult | null>(null);
  const [activeTab, setActiveTab] = useState("checkin");

  // Fetch check-in status
  const { data: checkinStatus, isLoading: statusLoading, refetch: refetchStatus } = useQuery<CheckinStatus>({
    queryKey: ["/api/checkin/status"],
    staleTime: 10000, // Cache for 10 seconds
  });

  // Fetch check-in statistics
  const { data: checkinStats, isLoading: statsLoading, refetch: refetchStats } = useQuery<CheckinStats>({
    queryKey: ["/api/checkin/stats"],
    staleTime: 30000, // Cache for 30 seconds
  });

  // Fetch check-in history
  const { data: checkinHistory, isLoading: historyLoading, refetch: refetchHistory } = useQuery<CheckinHistory[]>({
    queryKey: ["/api/checkin/history"],
    staleTime: 30000, // Cache for 30 seconds
  });

  // Check-in mutation
  const checkinMutation = useMutation({
    mutationFn: async ({ mood, note }: { mood?: string; note?: string }) => {
      const body: any = {};
      if (mood) body.mood = mood;
      if (note) body.note = note;

      return apiRequest("/api/checkin", {
        method: "POST",
        body: JSON.stringify(body)
      } as RequestInit & { body?: any });
    },
    onSuccess: (result: CheckinResult) => {
      setLastCheckinResult(result);
      setShowRewards(true);
      
      // Refetch all data
      refetchStatus();
      refetchStats();
      refetchHistory();
      
      // Invalidate gamification data to update dashboard
      queryClient.invalidateQueries({ queryKey: ["/api/gamification/me"] });
      
      // Reset form
      setSelectedMood("");
      setNote("");
      
      // Call callbacks
      if (result.leveledUp && result.newLevel && onLevelUp) {
        onLevelUp(result.newLevel);
      }
      if (onCheckinComplete) {
        onCheckinComplete(result);
      }
      
      // Auto-hide rewards after 5 seconds
      setTimeout(() => setShowRewards(false), 5000);
    },
    onError: (error: any) => {
      console.error("Check-in failed:", error);
    }
  });

  const handleCheckin = () => {
    checkinMutation.mutate({ mood: selectedMood || undefined, note: note || undefined });
  };

  const getMoodIcon = (mood: string | undefined) => {
    if (!mood) return null;
    const moodOption = moodOptions.find(m => m.value === mood);
    return moodOption ? { Icon: moodOption.icon, color: moodOption.color } : null;
  };

  const getStreakBonusMessage = (streakDay: number) => {
    if (streakDay % 30 === 0) return `🎉 30-Day Milestone! Epic bonus!`;
    if (streakDay % 7 === 0) return `🔥 Weekly Streak! Great bonus!`;
    if (streakDay === 10) return `⚡ 10-Day Achievement! Nice bonus!`;
    if (streakDay === 3) return `🌟 3-Day Streak! First bonus!`;
    return null;
  };

  return (
    <div className={cn("w-full max-w-4xl mx-auto space-y-6", className)}>
      {/* Rewards Toast */}
      {showRewards && lastCheckinResult && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-500">
          <Card className="w-80 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                <Gift className="w-5 h-5" />
                <span>Check-in Complete!</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Base XP</span>
                <Badge variant="secondary" className="animate-pulse">+{lastCheckinResult.xp} XP</Badge>
              </div>
              
              {lastCheckinResult.bonusXp > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bonus XP</span>
                  <Badge className="bg-orange-500 hover:bg-orange-600 animate-bounce">+{lastCheckinResult.bonusXp} XP</Badge>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Streak</span>
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-bold">{lastCheckinResult.streakDay}</span>
                </div>
              </div>
              
              {lastCheckinResult.leveledUp && lastCheckinResult.newLevel && (
                <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-lg p-3 animate-pulse">
                  <div className="flex items-center space-x-2 text-yellow-700 dark:text-yellow-300">
                    <Crown className="w-5 h-5" />
                    <span className="font-bold">LEVEL UP!</span>
                  </div>
                  <p className="text-sm mt-1">You're now Level {lastCheckinResult.newLevel}!</p>
                </div>
              )}
              
              {getStreakBonusMessage(lastCheckinResult.streakDay) && (
                <div className="bg-purple-100 dark:bg-purple-900/20 rounded-lg p-2">
                  <p className="text-sm text-purple-700 dark:text-purple-300 text-center">
                    {getStreakBonusMessage(lastCheckinResult.streakDay)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Check-in Card */}
      <Card data-testid="card-daily-checkin">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span>Daily Check-in</span>
          </CardTitle>
          <CardDescription>
            Stay consistent and earn rewards for your daily engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="checkin" data-testid="tab-checkin">Check-in</TabsTrigger>
              <TabsTrigger value="history" data-testid="tab-history">History</TabsTrigger>
              <TabsTrigger value="stats" data-testid="tab-stats">Statistics</TabsTrigger>
            </TabsList>

            {/* Check-in Tab */}
            <TabsContent value="checkin" className="space-y-6">
              {statusLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : checkinStatus?.hasCheckedInToday ? (
                <div className="text-center py-8 space-y-4" data-testid="checkin-completed-state">
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
                      Check-in Complete!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      You've already checked in today. Come back tomorrow!
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">
                        {checkinStats?.currentStreak || 0} day streak
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Mood Selector */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">How are you feeling today? (Optional)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {moodOptions.map((mood) => {
                        const Icon = mood.icon;
                        const isSelected = selectedMood === mood.value;
                        return (
                          <button
                            key={mood.value}
                            onClick={() => setSelectedMood(isSelected ? "" : mood.value)}
                            className={cn(
                              "flex flex-col items-center p-3 rounded-lg border transition-all duration-200 hover:scale-105",
                              isSelected 
                                ? `${mood.bgColor} border-current ${mood.color} shadow-md` 
                                : "bg-muted hover:bg-muted/80 border-border"
                            )}
                            data-testid={`mood-${mood.value}`}
                          >
                            <Icon className={cn("w-6 h-6 mb-1", isSelected ? mood.color : "text-muted-foreground")} />
                            <span className={cn("text-xs", isSelected ? mood.color : "text-muted-foreground")}>
                              {mood.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Note Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Add a note (Optional)</label>
                    <Textarea
                      placeholder="How's your entrepreneurial journey going today?"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="min-h-[80px] resize-none"
                      maxLength={500}
                      data-testid="input-checkin-note"
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {note.length}/500 characters
                    </div>
                  </div>

                  {/* Check-in Button */}
                  <Button
                    onClick={handleCheckin}
                    disabled={checkinMutation.isPending}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    data-testid="button-checkin"
                  >
                    {checkinMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Checking in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-5 h-5" />
                        <span>Check In & Earn Rewards</span>
                      </div>
                    )}
                  </Button>

                  {/* Streak Preview */}
                  {checkinStats && (
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Flame className="w-5 h-5 text-orange-500" />
                          <span className="font-medium">Current Streak</span>
                        </div>
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {checkinStats.currentStreak}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Check in daily to maintain your streak and earn bonus XP!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Check-ins</h3>
                <Badge variant="outline" data-testid="history-count">
                  {checkinHistory?.length || 0} total
                </Badge>
              </div>
              
              {historyLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : !checkinHistory?.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No check-ins yet. Start your streak today!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {checkinHistory.map((checkin, index) => {
                    const checkinDate = parseISO(checkin.checkinDate);
                    const moodInfo = getMoodIcon(checkin.mood);
                    return (
                      <div
                        key={checkin.id}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-lg border",
                          isToday(checkinDate) 
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            : "bg-card"
                        )}
                        data-testid={`history-item-${index}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {format(checkinDate, "MMM dd, yyyy")}
                            </span>
                            {isToday(checkinDate) && (
                              <Badge variant="outline" className="text-xs">Today</Badge>
                            )}
                          </div>
                          
                          {moodInfo && (
                            <div className="flex items-center space-x-1">
                              <moodInfo.Icon className={cn("w-4 h-4", moodInfo.color)} />
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-1">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-muted-foreground">
                              Day {checkin.streakDay}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">
                            +{checkin.xpAwarded} XP
                          </Badge>
                          {checkin.bonusXp > 0 && (
                            <Badge className="bg-orange-500 hover:bg-orange-600">
                              +{checkin.bonusXp} bonus
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats" className="space-y-6">
              {statsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card data-testid="stat-total-checkins">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Check-ins</p>
                          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {checkinStats?.totalCheckins || 0}
                          </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-blue-500 opacity-60" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card data-testid="stat-current-streak">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Current Streak</p>
                          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                            {checkinStats?.currentStreak || 0}
                          </p>
                        </div>
                        <Flame className="w-8 h-8 text-orange-500 opacity-60" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card data-testid="stat-longest-streak">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Longest Streak</p>
                          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            {checkinStats?.longestStreak || 0}
                          </p>
                        </div>
                        <Trophy className="w-8 h-8 text-purple-500 opacity-60" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card data-testid="stat-total-xp">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total XP Earned</p>
                          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {checkinStats?.totalXpFromCheckins || 0}
                          </p>
                        </div>
                        <Star className="w-8 h-8 text-green-500 opacity-60" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Streak Progress Visualization */}
              {checkinStats && (
                <Card data-testid="streak-progress">
                  <CardHeader>
                    <CardTitle className="text-lg">Streak Progress</CardTitle>
                    <CardDescription>Your journey towards the next milestone</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[3, 7, 10, 30].map((milestone) => {
                        const isCompleted = (checkinStats.currentStreak >= milestone);
                        const isNext = !isCompleted && (checkinStats.currentStreak < milestone);
                        const progress = Math.min(100, (checkinStats.currentStreak / milestone) * 100);
                        
                        return (
                          <div key={milestone} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className={cn(
                                "text-sm font-medium",
                                isCompleted ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                              )}>
                                {milestone} Day Milestone
                                {isCompleted && <span className="ml-2">✓</span>}
                                {isNext && <span className="ml-2 text-blue-500">(Next)</span>}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {checkinStats.currentStreak}/{milestone}
                              </span>
                            </div>
                            <Progress
                              value={progress}
                              className={cn(
                                "h-2",
                                isCompleted ? "bg-green-200 dark:bg-green-900" : ""
                              )}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Error Display */}
      {checkinMutation.isError && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertDescription className="text-red-700 dark:text-red-300">
            {(checkinMutation.error as any)?.message || "Failed to complete check-in. Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
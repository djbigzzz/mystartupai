import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Shield, Smartphone, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TwoFactorAuthProps {
  isEnabled: boolean;
  onClose: () => void;
}

export default function TwoFactorAuth({ isEnabled, onClose }: TwoFactorAuthProps) {
  const [setupStep, setSetupStep] = useState<'initial' | 'setup' | 'verify' | 'disable'>('initial');
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [qrCodeData, setQrCodeData] = useState<{ secret: string; qrCode: string } | null>(null);
  const { toast } = useToast();

  // Setup 2FA mutation
  const setupMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/auth/2fa/setup", {
        method: "POST",
        body: {} as any
      });
    },
    onSuccess: (data: any) => {
      setQrCodeData(data);
      setSetupStep('verify');
    },
    onError: (error: any) => {
      toast({
        title: "Setup failed",
        description: error.message || "Failed to setup 2FA",
        variant: "destructive",
      });
    }
  });

  // Verify and enable 2FA mutation
  const verifyMutation = useMutation({
    mutationFn: async (token: string) => {
      return apiRequest("/api/auth/2fa/verify", {
        method: "POST",
        body: { token } as any
      });
    },
    onSuccess: () => {
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been enabled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid code. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Disable 2FA mutation
  const disableMutation = useMutation({
    mutationFn: async ({ password, token }: { password: string; token: string }) => {
      return apiRequest("/api/auth/2fa/disable", {
        method: "POST",
        body: { password, token } as any
      });
    },
    onSuccess: () => {
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Disable failed",
        description: error.message || "Failed to disable 2FA",
        variant: "destructive",
      });
    }
  });

  const handleSetupStart = () => {
    setSetupStep('setup');
    setupMutation.mutate();
  };

  const handleVerify = () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }
    verifyMutation.mutate(verificationCode);
  };

  const handleDisable = () => {
    if (!password || !verificationCode) {
      toast({
        title: "Missing information",
        description: "Please enter your password and 2FA code",
        variant: "destructive",
      });
      return;
    }
    disableMutation.mutate({ password, token: verificationCode });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            {isEnabled 
              ? "Add an extra layer of security to your account" 
              : "Secure your account with 2FA"}
          </DialogDescription>
        </DialogHeader>

        {/* Initial State */}
        {setupStep === 'initial' && !isEnabled && (
          <div className="space-y-4 py-4">
            <Alert>
              <Smartphone className="w-4 h-4" />
              <AlertDescription>
                Two-factor authentication adds an extra layer of security. You'll need an authenticator app like Google Authenticator or Authy.
              </AlertDescription>
            </Alert>
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <Shield className="w-8 h-8 text-blue-600" />
              <div className="flex-1">
                <h4 className="font-medium">Enhanced Security</h4>
                <p className="text-sm text-muted-foreground">
                  Protect your account with time-based codes
                </p>
              </div>
            </div>
            <Button onClick={handleSetupStart} className="w-full" data-testid="button-setup-2fa">
              Enable 2FA
            </Button>
          </div>
        )}

        {/* Setup Step - Show QR Code */}
        {setupStep === 'setup' && setupMutation.isPending && (
          <div className="py-8 text-center">
            <p>Generating QR code...</p>
          </div>
        )}

        {setupStep === 'verify' && qrCodeData && (
          <div className="space-y-4 py-4">
            <Alert>
              <Smartphone className="w-4 h-4" />
              <AlertDescription>
                Scan this QR code with your authenticator app, then enter the 6-digit code below.
              </AlertDescription>
            </Alert>
            <div className="flex justify-center p-4 border rounded-lg bg-white">
              <img src={qrCodeData.qrCode} alt="2FA QR Code" className="w-48 h-48" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manual-code">Or enter this code manually:</Label>
              <Input
                id="manual-code"
                value={qrCodeData.secret}
                readOnly
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                data-testid="input-2fa-code"
              />
            </div>
            <Button 
              onClick={handleVerify} 
              className="w-full"
              disabled={verifyMutation.isPending || verificationCode.length !== 6}
              data-testid="button-verify-2fa"
            >
              {verifyMutation.isPending ? "Verifying..." : "Verify and Enable"}
            </Button>
          </div>
        )}

        {/* Disable 2FA */}
        {setupStep === 'initial' && isEnabled && (
          <div className="space-y-4 py-4">
            <Alert>
              <Lock className="w-4 h-4" />
              <AlertDescription>
                To disable 2FA, please enter your password and current 2FA code.
              </AlertDescription>
            </Alert>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-password-disable-2fa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">2FA Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  data-testid="input-2fa-code-disable"
                />
              </div>
              <Button 
                onClick={handleDisable} 
                variant="destructive"
                className="w-full"
                disabled={disableMutation.isPending}
                data-testid="button-disable-2fa"
              >
                {disableMutation.isPending ? "Disabling..." : "Disable 2FA"}
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-2fa">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

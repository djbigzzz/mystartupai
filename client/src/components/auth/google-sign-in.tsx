import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

interface GoogleSignInProps {
  className?: string;
  disabled?: boolean;
}

export default function GoogleSignIn({ className, disabled }: GoogleSignInProps) {
  const handleGoogleSignIn = () => {
    // Use manual OAuth flow to bypass Passport.js redirect_uri_mismatch issue
    window.location.href = "/api/auth/google/manual";
  };

  // Check if Google OAuth is configured
  const isGoogleEnabled = true; // We'll make this configurable later

  if (!isGoogleEnabled) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={`w-full ${className}`}
      onClick={handleGoogleSignIn}
      disabled={disabled}
    >
      <Chrome className="w-4 h-4 mr-2" />
      Continue with Google
    </Button>
  );
}
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import SignupForm from "@/components/auth/signup-form";
import { useEffect } from "react";

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, user, setLocation]);

  const handleSuccess = () => {
    setTimeout(() => setLocation("/dashboard"), 100);
  };

  const handleSwitchToLogin = () => {
    setLocation("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <SignupForm 
        onSuccess={handleSuccess} 
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
}

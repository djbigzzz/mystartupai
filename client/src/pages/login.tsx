import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import LoginForm from "@/components/auth/login-form";
import { useEffect } from "react";

export default function LoginPage() {
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

  const handleSwitchToSignup = () => {
    setLocation("/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <LoginForm 
        onSuccess={handleSuccess} 
        onSwitchToSignup={handleSwitchToSignup}
      />
    </div>
  );
}

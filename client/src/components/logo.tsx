import { Sparkles } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl"
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Icon - Inspired by pitch deck gradient aesthetic */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform duration-300`}>
        <Sparkles className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-5 h-5' : 'w-7 h-7'} text-white`} />
      </div>
      
      {showText && (
        <div className="ml-3">
          <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent tracking-tight`}>
            MYSTARTUP.
          </span>
          <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent ml-0.5`}>
            AI
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;
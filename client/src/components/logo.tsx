import logoImage from "@assets/3d logo_1_1757074300349.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14", 
    lg: "w-20 h-20"
  };

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl"
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo Image */}
      <img 
        src={logoImage} 
        alt="MyStartup.AI - AI-Powered Startup Accelerator Logo" 
        className={`${sizeClasses[size]} object-contain hover:scale-105 transition-transform duration-300`}
      />
      
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
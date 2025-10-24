export function LayeredBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base Gradient - More Visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-purple-500/15 to-cyan-500/15 dark:from-blue-500/25 dark:via-purple-500/25 dark:to-cyan-500/25"></div>
      
      {/* Large Animated Orbs */}
      <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-blue-500/30 dark:bg-blue-500/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-purple-500/30 dark:bg-purple-500/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s", animationDuration: "3s" }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/20 dark:bg-cyan-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s", animationDuration: "4s" }}></div>
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      ></div>
    </div>
  );
}

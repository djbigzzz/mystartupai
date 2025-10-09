import { useTheme } from "@/contexts/theme-context";

export default function ThemeBackgroundEffects() {
  const { theme } = useTheme();

  if (theme === "web3") return null;

  return (
    <>
      {theme === "light" && (
        <>
          <div className="light-orb light-orb-1" />
          <div className="light-orb light-orb-2" />
        </>
      )}
      {theme === "dark" && (
        <>
          <div className="dark-orb dark-orb-1" />
          <div className="dark-orb dark-orb-2" />
          <div className="dark-orb dark-orb-3" />
        </>
      )}
    </>
  );
}

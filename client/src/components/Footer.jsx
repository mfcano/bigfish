import { useTheme } from "../contexts/ThemeContext";

const Footer = () => {
  const { currentTheme, getSubTextClass, getTextClass } = useTheme();

  const getFooterClass = () => {
    if (currentTheme === "light") return "bg-white border-slate-200";
    if (currentTheme === "dark") return "bg-guild-900 border-guild-800";
    if (currentTheme === "cute") return "bg-[#2a2438] border-pink-500/20";
    if (currentTheme === "mesi")
      return "bg-[#0000FF] border-t-4 border-[#FFFF00]";
    return "bg-[#E5E5E5] border-none py-4 mt-4";
  };

  const getLinkClass = () => {
    if (currentTheme === "light" || currentTheme === "dark")
      return "hover:text-guild-accent transition-colors";
    if (currentTheme === "cute") return "hover:text-pink-400 transition-colors";
    if (currentTheme === "mesi")
      return "text-[#FFFF00] hover:text-[#FF00FF] bg-black px-1 transition-colors";
    return "";
  };

  return (
    <footer className={`border-t py-6 mt-12 ${getFooterClass()}`}>
      <div
        className={`container mx-auto px-4 text-center text-sm ${getSubTextClass()}`}
      >
        <p>
          {currentTheme === "rms"
            ? "Powered by BigFish v1.0.0 © 2005"
            : "© 2025 Big Fish Guild. All Shenanigans Reserved."}
        </p>
        {currentTheme !== "rms" && (
          <div className="mt-2 space-x-4">
            <a href="#" className={getLinkClass()}>
              <i className="fa-brands fa-discord"></i> Discord
            </a>
          </div>
        )}
        {currentTheme === "rms" && (
          <div className="mt-2 text-[10px]">
            [{" "}
            <a href="#" className="text-[#006699] underline">
              Admin CP
            </a>{" "}
            ] [
            <a href="#" className="text-[#006699] underline">
              {" "}
              Mod CP
            </a>{" "}
            ]
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;

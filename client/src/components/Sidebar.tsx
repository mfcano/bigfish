import { useTheme } from "../contexts/ThemeContext";

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentTab, setTab }) => {
  const { currentTheme, getNavClass, getTextClass } = useTheme();

  const tabs = [
    { id: "home", label: "Home", icon: "fa-home" },
    { id: "members", label: "Members", icon: "fa-users" },
    { id: "gear", label: "Gear Storage", icon: "fa-box-open" },
    { id: "mvp", label: "MVP Tracker", icon: "fa-skull" },
    { id: "events", label: "Events", icon: "fa-calendar-alt" },
    { id: "monsters", label: "Monster DB", icon: "fa-book-dead" },
  ];

  const getSidebarClass = () => {
    if (currentTheme === "light") return "bg-white border-slate-200";
    if (currentTheme === "dark") return "bg-guild-800 border-guild-700";
    if (currentTheme === "cute") return "bg-[#2a2438] border-pink-500/20";
    if (currentTheme === "mesi") return "bg-[#0000FF] border-[#FFFF00]"; // Removed border-r-4 logic here
    return "bg-[#006699] border-black";
  };

  return (
    <aside
      className={`flex shrink-0 w-full h-16 md:w-64 md:h-full overflow-y-auto 
        border-t md:border-t-0 md:border-r 
        ${currentTheme === "mesi" ? "border-t-4 md:border-r-4" : ""}
        ${getSidebarClass()}`}
    >
      <div className="flex flex-row md:flex-col w-full h-full justify-around md:justify-start items-center md:items-stretch p-0 md:p-4 space-x-0 md:space-y-2">
        <div
          className={`hidden md:block text-xs font-bold uppercase opacity-50 mb-2 ${getTextClass()}`}
        >
          Menu
        </div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`text-center md:text-left px-4 py-2 md:px-4 md:py-3 rounded-md flex flex-col md:flex-row items-center gap-1 md:gap-3 transition-all duration-200 ${getNavClass(
              tab.id,
              currentTab
            )}`}
          >
            <i
              className={`fa-solid ${tab.icon} text-lg md:text-base w-5 text-center`}
            ></i>
            <span className="text-[10px] md:text-base font-medium">
              {currentTheme === "rms" ? `[ ${tab.label} ]` : tab.label}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;

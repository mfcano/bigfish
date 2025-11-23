import { useTheme } from "../contexts/ThemeContext";

const Sidebar = ({ currentTab, setTab }) => {
  const { currentTheme, getNavClass, getTextClass } = useTheme();

  const tabs = [
    { id: "home", label: "Home", icon: "fa-home" },
    { id: "gear", label: "Gear Storage", icon: "fa-box-open" },
    { id: "mvp", label: "MVP Tracker", icon: "fa-skull" },
    { id: "events", label: "Events", icon: "fa-calendar-alt" },
  ];

  const getSidebarClass = () => {
    if (currentTheme === "light") return "bg-white border-slate-200";
    if (currentTheme === "dark") return "bg-guild-800 border-guild-700";
    if (currentTheme === "cute") return "bg-[#2a2438] border-pink-500/20";
    if (currentTheme === "mesi")
      return "bg-[#0000FF] border-r-4 border-[#FFFF00]";
    return "bg-[#006699] border-black";
  };

  return (
    <aside
      className={`hidden md:flex flex-col w-64 h-full overflow-y-auto border-r ${getSidebarClass()}`}
    >
      <div className="p-4 space-y-2">
        <div
          className={`text-xs font-bold uppercase opacity-50 mb-2 ${getTextClass()}`}
        >
          Menu
        </div>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`w-full text-left px-4 py-3 rounded-md flex items-center gap-3 transition-all duration-200 ${getNavClass(
              tab.id,
              currentTab
            )}`}
          >
            <i className={`fa-solid ${tab.icon} w-5 text-center`}></i>
            <span className="font-medium">
              {currentTheme === "rms" ? `[ ${tab.label} ]` : tab.label}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;

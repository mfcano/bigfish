import { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

// Reuse the API_BASE logic
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.PROD
    ? "https://api-dyd6pxy55a-uc.a.run.app"
    : "http://localhost:8000");

const Members = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const {
    currentTheme,
    getCardClass,
    getTextClass,
    getSubTextClass,
  } = useTheme();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/users`);
        if (!response.ok) throw new Error("Failed to fetch members");
        const data = await response.json();
        setMembers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const getTitleClass = () => {
    if (currentTheme === "light") return "text-slate-900 border-blue-500";
    if (currentTheme === "dark") return "text-white border-blue-500";
    if (currentTheme === "cute")
      return "text-pink-100 border-pink-600 drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]";
    if (currentTheme === "mesi")
      return "text-[#FFFF00] border-[#FF0000] bg-[#0000FF] inline-block pr-4";
    return "text-[#006699] border-none pl-0 text-sm";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      <div className={`flex justify-between items-center mb-6`}>
         <h2 className={`text-3xl font-bold border-l-4 pl-4 ${getTitleClass()}`}>
            Members
         </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {members.map((member) => (
          <div
            key={member.uid}
            className={`p-6 rounded-lg shadow-lg flex flex-col items-center transition-all duration-300 ${
              getCardClass ? getCardClass() : "bg-white dark:bg-gray-800"
            }`}
          >
            <div
              className={`w-24 h-24 rounded-full overflow-hidden border-4 mb-4 ${
                currentTheme === "light"
                  ? "border-slate-200"
                  : currentTheme === "cute"
                  ? "border-pink-400"
                  : "border-gray-700"
              }`}
            >
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.display_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${
                   currentTheme === "light" ? "bg-gray-100" : "bg-gray-700"
                }`}>
                    <i className={`fa-solid fa-user text-4xl ${getSubTextClass()}`}></i>
                </div>
              )}
            </div>
            
            <h3 className={`text-xl font-bold text-center mb-1 ${getTextClass()}`}>
              {member.display_name || "Unknown Member"}
            </h3>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Members;


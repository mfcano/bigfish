import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useTheme } from "../contexts/ThemeContext";

// Define API Base like in useMvps
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.PROD
    ? "https://api-dyd6pxy55a-uc.a.run.app"
    : "http://localhost:8000");

const Account = ({ user }) => {
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const {
    currentTheme,
    setTheme,
    getCardClass,
    getButtonClass,
    getTextClass,
    getSubTextClass,
  } = useTheme();

  // Themes list
  const themes = [
    { id: "light", label: "Light Mode", icon: "fa-sun" },
    { id: "dark", label: "Dark Mode", icon: "fa-moon" },
    { id: "cute", label: "Cute Mode", icon: "fa-heart" },
    { id: "mesi", label: "Mesi Mode", icon: "fa-eye" },
    { id: "rms", label: "Ragnarok 2005", icon: "fa-scroll" },
  ];

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(`${API_BASE}/users/${user.uid}/avatar`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload avatar");
      }

      const data = await response.json();
      setMessage({ type: "success", text: "Avatar updated successfully!" });

      // Force auth token refresh to get new photo URL immediately
      await auth.currentUser.reload();
      // Trigger a re-render of the user state in App if possible, or we rely on auth listener
      // Note: The user prop might not update immediately without a reload/refresh in some architectures
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Call Cloud Function backend
      const response = await fetch(`${API_BASE}/users/${user.uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Note: In a real app, you'd send an Auth Token here for verification
          // 'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          displayName,
          theme: currentTheme,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update settings");
      }

      setMessage({ type: "success", text: "Settings updated successfully!" });

      // Force auth token refresh to get new display name immediately if it changed
      await auth.currentUser.reload();
    } catch (error) {
      console.error("Error updating settings:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update settings.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = () => {
    if (currentTheme === "light")
      return "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500";
    if (currentTheme === "dark")
      return "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500";
    if (currentTheme === "cute")
      return "bg-[#1e1b2e] border-pink-500/30 text-pink-100 focus:ring-pink-500 focus:border-pink-500 placeholder-pink-300/30";
    if (currentTheme === "mesi")
      return "bg-blue-800 border-yellow-400 text-yellow-400 font-mono";
    return "bg-gray-50 border-gray-300 text-gray-900";
  };

  const getMessageClass = (type) => {
    if (type === "success") {
      if (currentTheme === "cute")
        return "bg-emerald-900/30 text-emerald-200 border border-emerald-500/30";
      if (currentTheme === "mesi")
        return "bg-[#00FF00] text-[#0000FF] border-4 border-[#FF00FF] font-bold";
      return "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300 dark:border dark:border-green-800";
    } else {
      if (currentTheme === "cute")
        return "bg-rose-900/30 text-rose-200 border border-rose-500/30";
      if (currentTheme === "mesi")
        return "bg-[#FF0000] text-[#FFFF00] border-4 border-[#000000] font-bold";
      return "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300 dark:border dark:border-red-800";
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`p-6 rounded-lg shadow-lg transition-colors duration-300 ${
          getCardClass ? getCardClass() : "bg-white dark:bg-gray-800"
        }`}
      >
        <h2 className={`text-2xl font-bold mb-6 ${getTextClass()}`}>
          Account Settings
        </h2>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Avatar Upload */}
          <div>
            <label
              className={`block mb-2 text-sm font-medium ${getTextClass()}`}
            >
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center border ${
                  currentTheme === "light"
                    ? "bg-gray-200 border-gray-300"
                    : currentTheme === "cute"
                    ? "bg-pink-900/20 border-pink-500/30"
                    : "bg-gray-700 border-gray-600"
                }`}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i
                    className={`fa-solid fa-user text-2xl ${getSubTextClass()}`}
                  ></i>
                )}
              </div>

              <label className="cursor-pointer">
                <span
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border inline-block ${
                    currentTheme === "light"
                      ? "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                      : currentTheme === "cute"
                      ? "bg-pink-500/20 text-pink-200 border-pink-500/30 hover:bg-pink-500/30"
                      : currentTheme === "mesi"
                      ? "bg-[#FFFF00] text-[#0000FF] border-[#0000FF] font-bold"
                      : "bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600"
                  }`}
                >
                  {avatarLoading ? "Uploading..." : "Change Photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={avatarLoading}
                />
              </label>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label
              htmlFor="displayName"
              className={`block mb-2 text-sm font-medium ${getTextClass()}`}
            >
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={`block w-full p-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${getInputClass()}`}
              placeholder="Enter your display name"
            />
            <p className={`mt-1 text-sm ${getSubTextClass()}`}>
              This name will be visible to other guild members.
            </p>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label
              className={`block mb-2 text-sm font-medium ${getTextClass()}`}
            >
              Email Address
            </label>
            <input
              type="text"
              disabled
              value={user?.email || ""}
              className="block w-full p-2.5 border rounded-lg text-sm bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
            />
          </div>

          {/* Theme Selection */}
          <div>
            <label
              className={`block mb-2 text-sm font-medium ${getTextClass()}`}
            >
              Theme Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setTheme(theme.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                    currentTheme === theme.id
                      ? "ring-2 ring-offset-2 ring-blue-500 border-transparent"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  } ${
                    currentTheme === "mesi" && theme.id === "mesi"
                      ? "bg-[#FFFF00] text-[#0000FF] ring-[#FF00FF]"
                      : ""
                  } ${
                    getInputClass() // reuse input styles for bg/text
                  }`}
                >
                  <i className={`fa-solid ${theme.icon} w-5 text-center`}></i>
                  <span className="font-medium">{theme.label}</span>
                  {currentTheme === theme.id && (
                    <i className="fa-solid fa-check ml-auto text-blue-500"></i>
                  )}
                </button>
              ))}
            </div>
          </div>

          {message.text && (
            <div
              className={`p-4 mb-4 text-sm rounded-lg ${getMessageClass(
                message.type
              )}`}
              role="alert"
            >
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-5 py-2.5 text-center font-medium rounded-lg text-sm transition-colors ${
              getButtonClass
                ? getButtonClass()
                : "bg-blue-700 text-white hover:bg-blue-800"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Account;

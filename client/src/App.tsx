import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { useTime } from "./hooks/useTime";
import Navigation from "./components/Navigation";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import GearStorage from "./components/GearStorage/GearStorage";
import MvpTracker from "./components/MvpTracker/MvpTracker";
import Events from "./components/Events/Events";
import Account from "./components/Account";
import Login from "./components/Login";
import { auth } from "./firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

const AppContent = () => {
  const [currentTab, setCurrentTab] = useState("home");
  const [user, setUser] = useState(null as User | null);
  const [loading, setLoading] = useState(true);
  const { getBodyClass } = useTheme();
  const { serverTime, localTime } = useTime();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const savedTab = localStorage.getItem("currentTab");
    if (savedTab) {
      setCurrentTab(savedTab);
    }
  }, []);

  const handleSetTab = (tabId: string) => {
    setCurrentTab(tabId);
    localStorage.setItem("currentTab", tabId);
  };

  const bodyClasses = `min-h-screen flex flex-col transition-colors duration-300 ${getBodyClass()}`;

  if (loading) {
    return (
      <div className={bodyClasses}>
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={bodyClasses}>
        <main className="flex-grow flex items-center justify-center container mx-auto px-4 py-8">
          <Login />
        </main>
      </div>
    );
  }

  return (
    <div className={bodyClasses}>
      <Navigation
        currentTab={currentTab}
        setTab={handleSetTab}
        serverTime={serverTime}
        localTime={localTime}
        user={user}
      />

      <div className="flex flex-col-reverse md:flex-row flex-grow relative h-[calc(100vh-4rem)]">
        <Sidebar currentTab={currentTab} setTab={handleSetTab} />

        <main className="flex-grow container mx-auto px-4 py-8 w-full overflow-x-hidden overflow-y-auto">
          {currentTab === "home" && <Home setTab={handleSetTab} />}
          {currentTab === "gear" && <GearStorage />}
          {currentTab === "mvp" && <MvpTracker />}
          {currentTab === "events" && <Events />}
          {currentTab === "account" && <Account user={user} />}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;

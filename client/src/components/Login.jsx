import { useEffect } from 'react';
import { auth } from '../firebase';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { useTheme } from '../contexts/ThemeContext';

const Login = () => {
  const { currentTheme } = useTheme();

  useEffect(() => {
    const uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
        EmailAuthProvider.PROVIDER_ID,
        GoogleAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: () => false,
      },
      signInFlow: 'popup',
    };

    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
    ui.start('#firebaseui-auth-container', uiConfig);

    return () => {
      // Cleanup if necessary
    };
  }, []);

  const getCardClass = () => {
    if (currentTheme === 'light') return 'bg-white/90 shadow-xl border border-white/50';
    if (currentTheme === 'dark') return 'bg-slate-800/90 shadow-2xl border border-slate-700';
    if (currentTheme === 'cute') return 'bg-pink-50/90 shadow-lg border border-pink-200';
    if (currentTheme === 'mesi') return 'bg-blue-600 border-4 border-yellow-400';
    return 'bg-slate-800/90 shadow-2xl border border-slate-700'; // Default to dark-ish
  };

  const getTitleClass = () => {
    if (currentTheme === 'light') return 'text-slate-800';
    if (currentTheme === 'dark') return 'text-white';
    if (currentTheme === 'cute') return 'text-pink-500';
    if (currentTheme === 'mesi') return 'text-yellow-400';
    return 'text-white';
  };

  return (
    <div className={`w-full max-w-md p-8 rounded-2xl backdrop-blur-sm transition-colors duration-300 ${getCardClass()}`}>
      <div className="text-center mb-8">
        <h1 className={`text-4xl font-extrabold mb-2 tracking-tight ${getTitleClass()}`}>
          Big Fish
        </h1>
        <p className={`text-sm opacity-75 ${getTitleClass()}`}>
          Guild Management System
        </p>
      </div>
      
      <div id="firebaseui-auth-container" className="w-full"></div>
      
      <div className={`mt-6 text-center text-xs opacity-50 ${getTitleClass()}`}>
        <p>Please sign in to access the guild resources.</p>
      </div>
    </div>
  );
};

export default Login;

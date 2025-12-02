import React, { useState } from 'react';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { useTheme } from '../contexts/ThemeContext';

const Login = () => {
  const { currentTheme, getInputClass, getPrimaryButtonClass, getSecondaryButtonClass } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getCardClass = () => {
    if (currentTheme === 'light') return 'bg-white/90 shadow-xl border border-white/50 rounded-2xl';
    if (currentTheme === 'dark') return 'bg-slate-800/90 shadow-2xl border border-slate-700 rounded-2xl';
    if (currentTheme === 'cute') return 'bg-pink-50/90 shadow-lg border border-pink-200 rounded-2xl';
    if (currentTheme === 'mesi') return 'bg-blue-600 border-4 border-yellow-400 rounded-2xl';
    if (currentTheme === 'rms') return 'bg-white border-2 border-black shadow-none rounded-none';
    return 'bg-slate-800/90 shadow-2xl border border-slate-700 rounded-2xl';
  };

  const getTitleClass = () => {
    if (currentTheme === 'light') return 'text-slate-800';
    if (currentTheme === 'dark') return 'text-white';
    if (currentTheme === 'cute') return 'text-pink-500';
    if (currentTheme === 'mesi') return 'text-yellow-400';
    if (currentTheme === 'rms') return 'text-[#006699] font-bold';
    return 'text-white';
  };

  const getLabelClass = () => {
    if (currentTheme === 'light') return 'text-slate-700';
    if (currentTheme === 'dark') return 'text-slate-300';
    if (currentTheme === 'cute') return 'text-pink-400';
    if (currentTheme === 'mesi') return 'text-yellow-400';
    if (currentTheme === 'rms') return 'text-black font-bold';
    return 'text-slate-300';
  };

  const getHeaderClass = () => {
    if (currentTheme === 'rms') {
      return 'bg-gradient-to-b from-[#006699] to-[#003366] text-white font-bold text-[11px] py-1.5 px-3 border-b border-black mb-4';
    }
    return '';
  };

  const getRMSInputClass = () => {
    if (currentTheme === 'rms') {
      return 'w-full px-2 py-1 border border-gray-400 bg-white text-black text-[11px] font-["Verdana",sans-serif] focus:outline-none focus:border-[#006699] rounded-none';
    }
    return `w-full px-3 py-2 rounded-lg border border-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all ${getInputClass()}`;
  };

  const getRMSButtonClass = (isPrimary = true) => {
    if (currentTheme === 'rms') {
      return isPrimary
        ? 'w-full py-1.5 px-3 bg-[#EFEFEF] border border-gray-400 text-black font-bold text-[10px] font-["Verdana",sans-serif] hover:bg-[#E0E0E0] active:border-inset rounded-none shadow-[1px_1px_0_#fff,2px_2px_0_#999]'
        : 'w-full py-1.5 px-3 bg-[#DEE3E7] border border-gray-400 text-black font-bold text-[10px] font-["Verdana",sans-serif] hover:bg-[#D0D5D9] active:border-inset rounded-none shadow-[1px_1px_0_#fff,2px_2px_0_#999]';
    }
    return '';
  };

  const getDividerClass = () => {
    if (currentTheme === 'rms') {
      return 'border-gray-400';
    }
    return currentTheme === 'light' ? 'border-gray-300' : 'border-gray-600';
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message;
      if (err.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      if (err.code === 'auth/email-already-in-use') msg = 'Email already in use. Please sign in.';
      if (err.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md ${currentTheme === 'rms' ? 'p-0' : 'p-8'} backdrop-blur-sm transition-colors duration-300 ${getCardClass()}`}>
      {currentTheme === 'rms' ? (
        <>
          <div className={getHeaderClass()}>
            BIG FISH - GUILD LOGIN
          </div>
          <div className="px-4 pb-4">
            <div className="text-center mb-4">
              <p className="text-[11px] text-black font-['Verdana',sans-serif]">
                Welcome to the Big Fish Guild Management System
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-extrabold mb-2 tracking-tight ${getTitleClass()}`}>
            Big Fish
          </h1>
          <p className={`text-sm opacity-75 ${getTitleClass()}`}>
            Guild Management System
          </p>
        </div>
      )}

      <form onSubmit={handleAuth} className={currentTheme === 'rms' ? 'space-y-3 px-4' : 'space-y-4'}>
        {error && (
          <div className={currentTheme === 'rms' 
            ? 'p-2 text-[11px] text-red-700 bg-[#FFCCCC] border border-red-700 font-["Verdana",sans-serif]'
            : 'p-3 text-sm text-red-500 bg-red-100/10 border border-red-500/20 rounded-lg'
          }>
            {error}
          </div>
        )}

        <div>
          <label className={`block ${currentTheme === 'rms' ? 'text-[11px]' : 'text-sm'} font-medium mb-1 ${getLabelClass()}`}>
            Email:
          </label>
          <input
            type="email"
            required
            className={getRMSInputClass()}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label className={`block ${currentTheme === 'rms' ? 'text-[11px]' : 'text-sm'} font-medium mb-1 ${getLabelClass()}`}>
            Password:
          </label>
          <input
            type="password"
            required
            className={getRMSInputClass()}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={currentTheme === 'rms' 
            ? getRMSButtonClass(true)
            : `w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${getPrimaryButtonClass()}`
          }
        >
          {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>
      </form>

      <div className={currentTheme === 'rms' ? 'mt-3 px-4' : 'mt-4'}>
        <div className="flex items-center w-full">
          <div className={`flex-grow border-t ${getDividerClass()}`}></div>
          <span className={`mx-3 ${currentTheme === 'rms' ? 'text-[11px]' : 'text-sm'} whitespace-nowrap ${getLabelClass()}`}>
            Or continue with
          </span>
          <div className={`flex-grow border-t ${getDividerClass()}`}></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className={currentTheme === 'rms'
            ? `${getRMSButtonClass(false)} mt-3 flex items-center justify-center gap-2`
            : `mt-4 w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 ${getSecondaryButtonClass()}`
          }
        >
          <svg className={currentTheme === 'rms' ? 'w-3 h-3' : 'w-5 h-5'} viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </button>
      </div>

      <div className={currentTheme === 'rms' ? 'mt-4 mb-2 text-center px-4' : `mt-6 text-center text-sm ${getTitleClass()}`}>
        <p className={currentTheme === 'rms' ? 'text-[11px] text-black font-["Verdana",sans-serif]' : 'opacity-75'}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className={currentTheme === 'rms' 
              ? 'text-[#006699] font-bold hover:underline focus:outline-none'
              : 'font-bold hover:underline focus:outline-none'
            }
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

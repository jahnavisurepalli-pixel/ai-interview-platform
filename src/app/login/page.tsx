'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Register modes
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage('⚠️ Please fill out all credentials fields.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        // --- NEW SIGN UP REGISTRATION ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: role } // Stores user role inside the token metadata metadata
          }
        });

        if (error) throw error;
        setMessage('🎉 Account registered successfully! You can now log into the portal.');
        setIsSignUp(false); // Switch back to sign-in mode automatically
      } else {
        // --- STANDARD SIGN IN ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage('🎉 Authentication verified! Launching dashboard panel...');
        setTimeout(() => {
          router.push(`/${role}`);
        }, 800);
      }
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ Action Failed: ${err.message || 'Server rejected request.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Branding Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 rounded-xl items-center justify-center text-2xl font-black">
            AI
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {isSignUp ? 'Create University Account' : 'AI Interview Readiness Hub'}
          </h1>
          <p className="text-xs text-slate-400">Institutional Identity Access Gateway</p>
        </div>

        {/* Auth form submission */}
        <form onSubmit={handleAuthAction} className="space-y-4">
          
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Select Designated Role Target</label>
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['student', 'faculty', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`rounded-lg py-2 text-xs font-bold capitalize transition-colors ${
                    role === r 
                      ? 'bg-indigo-600 text-white shadow' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Email input box */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">University Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Password input box */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Security Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Dynamic feedback messages banner */}
          {message && (
            <p className={`text-xs font-semibold p-3 rounded-xl border text-center transition-all ${
              message.includes('🎉')
                ? 'bg-emerald-950/50 border-emerald-800/40 text-emerald-400'
                : 'bg-rose-950/50 border-rose-800/40 text-rose-400'
            }`}>
              {message}
            </p>
          )}

          {/* Action Trigger Buttons */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors shadow-md"
          >
            {loading ? 'Processing Transaction Vector...' : isSignUp ? 'Register Account Profile' : 'Secure Sign In'}
          </button>
        </form>

        {/* Lower Toggle Layout */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage('');
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
          >
            {isSignUp ? 'Already have an institutional account? Sign In' : "Don't have an account? Sign up here"}
          </button>
        </div>

      </div>
    </div>
  );
}

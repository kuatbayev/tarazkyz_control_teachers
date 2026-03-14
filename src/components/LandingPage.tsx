import React, { useState } from 'react';
import { AlertCircle, BarChart3, Clock, Layers, Settings, UserMinus, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { getRememberMePreference, hasSupabaseConfig, isLocalAuthBypassEnabled, setRememberMePreference, setStoredLocalAuthSession, supabase } from '../lib/supabase';

export function LandingPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => getRememberMePreference());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRememberMePreference(rememberMe);

    if (!hasSupabaseConfig) {
      if (isLocalAuthBypassEnabled) {
        setStoredLocalAuthSession(rememberMe);
        onLogin();
        setLoading(false);
        return;
      }
      setError('Supabase баптаулары табылмады. Localhost үшін .env.local ішіне VITE_SUPABASE_URL және VITE_SUPABASE_ANON_KEY қосыңыз, немесе уақытша VITE_ENABLE_LOCAL_AUTH_BYPASS=true орнатыңыз.');
      setLoading(false);
      return;
    }

    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Supabase URL немесе anon key орнатылмаған. Environment Variables мәндерін тексеріңіз.');
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else onLogin();
    } catch (err: any) {
      setError(err.message || 'Қате пайда болды');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0F172A] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-10"><div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:40px_40px]"></div></div>
      <div className="absolute right-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-emerald-600/10 blur-[100px]"></div>
      <header className="relative z-10 container mx-auto flex items-center justify-between px-6 py-8">
        <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20"><Layers className="h-6 w-6 text-white" /></div><span className="text-xl font-bold tracking-tight">Turkistan girls BIL</span></div>
      </header>
      <main className="relative z-10 container mx-auto flex flex-1 flex-col items-center justify-center gap-16 px-6 py-12 lg:flex-row">
        <div className="max-w-2xl flex-1">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-5xl font-extrabold leading-tight text-transparent lg:text-6xl">Мектептегі тәртіпті толық бақылауға арналған жүйе</h1>
            <p className="mb-10 text-xl leading-relaxed text-slate-400">Оқу үдерісіндегі маңызды тәртіп көрсеткіштерін бақылап, кешігу, келмеу, ескерту, ауысым және басқа да оқиғаларды есепке алыңыз. Мұғалімдердің көрсеткішін бір жерден қарап, талдауға ыңғайлы панельді пайдаланыңыз.</p>
            <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                { icon: <Clock className="h-5 w-5 text-blue-500" />, text: 'Кешігу мен келмеуді есепке алу' },
                { icon: <BarChart3 className="h-5 w-5 text-emerald-500" />, text: 'Мұғалімдер бойынша талдау' },
                { icon: <UserMinus className="h-5 w-5 text-amber-500" />, text: 'Өтілмеген сабақтар мен ауысымдарды бақылау' },
              ].map((item, i) => <div key={i} className="flex items-center gap-3 text-slate-300"><div className="rounded-lg border border-white/10 bg-white/5 p-2">{item.icon}</div><span className="font-medium">{item.text}</span></div>)}
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <h2 className="mb-2 text-2xl font-bold">Жүйеге кіру</h2>
            <p className="mb-8 text-slate-400">Панельге кіру үшін деректеріңізді енгізіңіз</p>
            {error && <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"><AlertCircle className="h-5 w-5 shrink-0" /><p>{error}</p></div>}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                <div className="relative"><Users className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin@school.kz" required /></div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">Құпия сөз</label>
                <div className="relative"><Settings className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="********" required /></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500" /><span className="text-slate-400">Мені есте сақта</span></label>
                <a href="#" className="text-blue-400 transition-colors hover:text-blue-300">Құпия сөзді ұмыттыңыз ба?</a>
              </div>
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? <><div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div><span>Күте тұрыңыз...</span></> : <span>Жүйеге кіру</span>}
              </button>
            </form>
          </div>
        </motion.div>
      </main>
      <footer className="relative z-10 container mx-auto px-6 py-8 text-center text-sm text-slate-500">© 2026 Turkistan girls BIL. Барлық құқықтар қорғалған.</footer>
    </div>
  );
}

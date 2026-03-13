import React, { useState } from 'react';
import { AlertCircle, BarChart3, Clock, Layers, Settings, UserMinus, Users } from 'lucide-react';
import { motion } from 'motion/react';
import {
  hasSupabaseConfig,
  isLocalAuthBypassEnabled,
  localAuthStorageKey,
  supabase,
} from '../lib/supabase';

export function LandingPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!hasSupabaseConfig) {
      if (isLocalAuthBypassEnabled) {
        localStorage.setItem(localAuthStorageKey, 'true');
        onLogin();
        setLoading(false);
        return;
      }

      setError(
        'Supabase config not found. For localhost add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local, or set VITE_ENABLE_LOCAL_AUTH_BYPASS=true for local UI testing.',
      );
      setLoading(false);
      return;
    }

    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Supabase Р±Р°РїС‚Р°СѓР»Р°СЂС‹ (URL РЅРµРјРµСЃРµ KEY) С‚Р°Р±С‹Р»РјР°РґС‹. Vercel-РґРµ Environment Variables Т›РѕСЃС‹ТЈС‹Р·.');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || 'ТљР°С‚Рµ РїР°Р№РґР° Р±РѕР»РґС‹');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-600/10 blur-[100px] rounded-full"></div>

      <header className="container mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Turkistan girls BIL</span>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-16 relative z-10 py-12">
        <div className="flex-1 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              РњРµРєС‚РµРїС‚РµРіС– С‚У™СЂС‚С–РїС‚С–ТЈ С‚РѕР»С‹Т› РєУ©СЂС–РЅС–СЃС– Р±С–СЂ Р¶ТЇР№РµРґРµ
            </h1>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed">
              РћТ›Сѓ С–СЃС–РЅС–ТЈ РјРµТЈРіРµСЂСѓС€С–СЃС– РјРµРЅ РґРёСЂРµРєС‚РѕСЂ ТЇС€С–РЅ РєРµС€С–РіСѓР»РµСЂРґС–, РєРµР»РјРµСѓР»РµСЂРґС–, Р°СѓСЂСѓ РїР°СЂР°Т›С‚Р°СЂС‹РЅ, Р°СѓС‹СЃС‚С‹СЂСѓР»Р°СЂРґС‹ РµСЃРµРїРєРµ Р°Р»Сѓ Р¶У™РЅРµ Т›С‹Р·РјРµС‚РєРµСЂР»РµСЂ Р±РѕР№С‹РЅС€Р° С‚Р°Р»РґР°Сѓ. РўУ™СЂС‚С–РїС‚С– С‚РёС–РјРґС– Р±Р°СЃТ›Р°СЂС‹ТЈС‹Р·.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {[
                { icon: <Clock className="w-5 h-5 text-blue-500" />, text: 'РљРµС€С–РіСѓР»РµСЂ РјРµРЅ РєРµР»РјРµСѓР»РµСЂРґС– РµСЃРµРїРєРµ Р°Р»Сѓ' },
                { icon: <BarChart3 className="w-5 h-5 text-emerald-500" />, text: 'РњТ±Т“Р°Р»С–РјРґРµСЂ Р±РѕР№С‹РЅС€Р° С‚Р°Р»РґР°Сѓ' },
                { icon: <UserMinus className="w-5 h-5 text-amber-500" />, text: 'УЁС‚С–Р»РјРµРіРµРЅ СЃР°Р±Р°Т›С‚Р°СЂ РјРµРЅ Р°СѓС‹СЃС‚С‹СЂСѓР»Р°СЂ' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">{item.icon}</div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Р–ТЇР№РµРіРµ РєС–СЂСѓ</h2>
            <p className="text-slate-400 mb-8">РџР°РЅРµР»СЊРіРµ РєС–СЂСѓ ТЇС€С–РЅ РґРµСЂРµРєС‚РµСЂС–ТЈС–Р·РґС– РµРЅРіС–Р·С–ТЈС–Р·</p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="admin@school.kz"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">ТљТ±РїРёСЏ СЃУ©Р·</label>
                <div className="relative">
                  <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="вЂўвЂўвЂўвЂўвЂўвЂўвЂўвЂў"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500" />
                  <span className="text-slate-400">РњРµРЅС– РµСЃС‚Рµ СЃР°Т›С‚Р°</span>
                </label>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">ТљТ±РїРёСЏ СЃУ©Р·РґС– Т±РјС‹С‚С‚С‹ТЈС‹Р· Р±Р°?</a>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>РљТЇС‚Рµ С‚Т±СЂС‹ТЈС‹Р·...</span>
                  </>
                ) : (
                  <span>Р–ТЇР№РµРіРµ РєС–СЂСѓ</span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-center gap-4 text-slate-500 text-xs uppercase tracking-widest font-bold"></div>
          </div>
        </motion.div>
      </main>

      <footer className="container mx-auto px-6 py-8 text-slate-500 text-sm text-center relative z-10">
        В© 2026 Turkistan girls BIL. Р‘Р°СЂР»С‹Т› Т›Т±Т›С‹Т›С‚Р°СЂ Т›РѕСЂТ“Р°Р»Т“Р°РЅ.
      </footer>
    </div>
  );
}

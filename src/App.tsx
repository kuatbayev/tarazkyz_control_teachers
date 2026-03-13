/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Clock, 
  AlertTriangle, 
  UserMinus, 
  Stethoscope, 
  Download, 
  Search,
  Bell,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Menu,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  UserX,
  FileWarning,
  BellRing,
  Plane,
  AlertCircle,
  Star,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';

// --- Types ---
type Page = 'landing' | 'dashboard';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  status: 'Белсенді' | 'Ауырып қалды' | 'Демалыста';
  score: number;
  rank: number;
  totalEvents: number;
  absences: number;
  latenesses: number;
  sickDays: number;
  lostLessons: number;
  substitutions: number;
  hasDocuments: boolean;
}

interface KPI {
  title: string;
  value: string | number;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface Event {
  id: string;
  teacherId: string;
  teacherName: string;
  type: 'Сабаққа келмеу' | 'Сабаққа кешігу' | 'БТС емтиханы күні келмеуі' | 'Кеш ескерту' | 'Ескертпей сабаққа келмеуі' | 'Ауырып қалуы' | 'Семинар / командировкаға кетуі';
  date: string;
  lesson: number;
  reason: string;
  isCritical?: boolean;
}

// --- Mock Data ---
const teachers: Teacher[] = [];



const COLORS = ['#3B82F6', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6', '#EC4899', '#64748B'];

const initialEvents: Event[] = [];

// --- Components ---

const LandingPage = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Supabase баптаулары (URL немесе KEY) табылмады. Vercel-де Environment Variables қосыңыз.');
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
      setError(err.message || 'Қате пайда болды');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-600/10 blur-[100px] rounded-full"></div>

      {/* Header */}
      <header className="container mx-auto px-6 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LayoutDashboard className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">Turkistan girls BIL</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-16 relative z-10 py-12">
        <div className="flex-1 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Мектептегі тәртіптің толық көрінісі бір жүйеде
            </h1>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed">
              Оқу ісінің меңгерушісі мен директор үшін кешігулерді, келмеулерді, ауру парақтарын, ауыстыруларды есепке алу және қызметкерлер бойынша талдау. Тәртіпті тиімді басқарыңыз.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {[
                { icon: <Clock className="w-5 h-5 text-blue-500" />, text: 'Кешігулер мен келмеулерді есепке алу' },
                { icon: <BarChart3 className="w-5 h-5 text-emerald-500" />, text: 'Мұғалімдер бойынша талдау' },
                { icon: <UserMinus className="w-5 h-5 text-amber-500" />, text: 'Өтілмеген сабақтар мен ауыстырулар' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Жүйеге кіру</h2>
            <p className="text-slate-400 mb-8">Панельге кіру үшін деректеріңізді енгізіңіз</p>
            
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
                <label className="block text-sm font-medium text-slate-300 mb-2">Құпия сөз</label>
                <div className="relative">
                  <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500" />
                  <span className="text-slate-400">Мені есте сақта</span>
                </label>
                <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">Құпия сөзді ұмыттыңыз ба?</a>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Күте тұрыңыз...</span>
                  </>
                ) : (
                  <span>Жүйеге кіру</span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-center gap-4 text-slate-500 text-xs uppercase tracking-widest font-bold">
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-slate-500 text-sm text-center relative z-10">
        © 2026 Turkistan girls BIL. Барлық құқықтар қорғалған.
      </footer>
    </div>
  );
};

const AddTeacherModal = ({ 
  isOpen, 
  onClose, 
  onAdd 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAdd: (teacher: Partial<Teacher>) => void;
}) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Математика');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name, subject });
    setName('');
    setSubject('Математика');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Жаңа мұғалім қосу</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Мұғалімнің АЖТ</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Мысалы: Асхат Асхатұлы"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Пән</label>
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option>Математика</option>
                  <option>Физика</option>
                  <option>Тарих</option>
                  <option>Ағылшын тілі</option>
                  <option>Биология</option>
                  <option>Химия</option>
                  <option>География</option>
                  <option>Информатика</option>
                  <option>Көркем еңбек</option>
                  <option>Домбыра</option>
                  <option>Денешынықтыру</option>
                  <option>Дүниежүзі тарихы</option>
                  <option>НВП</option>
                  <option>Қазақ тілі</option>
                  <option>Орыс тілі</option>
                  <option>Түрік тілі</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  Болдырмау
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all"
                >
                  Қосу
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const AddEventModal = ({ 
  isOpen, 
  onClose, 
  onAdd,
  teachers
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAdd: (event: Partial<Event>) => void;
  teachers: Teacher[];
}) => {
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || '');
  const [type, setType] = useState<Event['type']>('Сабаққа келмеу');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [lesson, setLesson] = useState(1);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find(t => t.id === teacherId);
    onAdd({ 
      teacherId, 
      teacherName: teacher?.name || 'Белгісіз',
      type, 
      date: date.split('-').reverse().join('.'), 
      lesson, 
      reason 
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Жаңа оқиға</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Мұғалім</label>
                <select 
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Оқиға түрі</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="Сабаққа келмеу">Сабаққа келмеу</option>
                  <option value="Сабаққа кешігу">Сабаққа кешігу</option>
                  <option value="БТС емтиханы күні келмеуі">БТС емтиханы күні келмеуі</option>
                  <option value="Кеш ескерту">Кеш ескерту</option>
                  <option value="Ескертпей сабаққа келмеуі">Ескертпей сабаққа келмеуі</option>
                  <option value="Ауырып қалуы">Ауырып қалуы</option>
                  <option value="Семинар / командировкаға кетуі">Семинар / командировкаға кетуі</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Күні</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Сабақ</label>
                  <input 
                    type="number" 
                    min="1"
                    max="10"
                    value={lesson}
                    onChange={(e) => setLesson(parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Себебі / Түсініктеме</label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Мысалы: Кептеліс, Отбасылық жағдайлар..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  Болдырмау
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all"
                >
                  Қосу
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const DashboardPage = ({ onLogout }: { onLogout: () => void }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [teachersList, setTeachersList] = useState<Teacher[]>(teachers);
  const [eventsList, setEventsList] = useState<Event[]>(initialEvents);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'teachers' | 'events' | 'analytics' | 'ranking' | 'settings'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('Барлық пәндер');
  const [eventTypeFilter, setEventTypeFilter] = useState('Барлық түрлері');
  const [teacherSort, setTeacherSort] = useState<{ key: keyof Teacher; direction: 'asc' | 'desc' }>({ key: 'rank', direction: 'asc' });
  const [eventSort, setEventSort] = useState<{ key: keyof Event; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });

  // --- Settings State ---
  const [profile, setProfile] = useState({
    name: 'Асхат Б.',
    email: 'admin@bil.edu.kz',
    phone: '+7 (707) 123-45-67',
    schoolName: 'Turkistan girls BIL',
    academicYear: '2025-2026 Оқу жылы',
    currentTerm: '3 Тоқсан',
    position: 'Мектеп директоры',
    avatar: null as string | null
  });

  const [notificationSettings, setNotificationSettings] = useState([
    { id: 'events', label: 'Жаңа оқиғалар туралы хабарлау', checked: true },
    { id: 'ratings', label: 'Рейтинг өзгерістері', checked: true },
    { id: 'reports', label: 'Апталық есептер', checked: false },
    { id: 'updates', label: 'Жүйелік жаңартулар', checked: true },
  ]);

  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showCongratulateToast, setShowCongratulateToast] = useState(false);

  const handleSaveSettings = () => {
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const handleCongratulate = () => {
    setShowCongratulateToast(true);
    setTimeout(() => setShowCongratulateToast(false), 3000);
  };

  const toggleNotification = (id: string) => {
    setNotificationSettings(prev => prev.map(n => n.id === id ? { ...n, checked: !n.checked } : n));
  };

  const eventTypes = [
    'Сабаққа келмеу',
    'Сабаққа кешігу',
    'БТС емтиханы күні келмеуі',
    'Кеш ескерту',
    'Ескертпей сабаққа келмеуі',
    'Ауырып қалуы',
    'Семинар / командировкаға кетуі'
  ];

  const pieData = eventTypes.map(type => {
    const count = eventsList.filter(e => e.type === type).length;
    return { name: type, value: count };
  }).filter(item => item.value > 0);


  const derivedTeachers = teachersList.map(teacher => {
    const teacherEvents = eventsList.filter(e => e.teacherId === teacher.id);
    
    let score = 100;
    let absences = 0;
    let latenesses = 0;
    let sickDays = 0;
    let lostLessons = 0;

    teacherEvents.forEach(event => {
      switch (event.type) {
        case 'Сабаққа келмеу':
          score -= 5;
          absences += 1;
          lostLessons += 1;
          break;
        case 'Сабаққа кешігу':
          score -= 2;
          latenesses += 1;
          break;
        case 'БТС емтиханы күні келмеуі':
          score -= 15;
          absences += 1;
          lostLessons += 1;
          break;
        case 'Кеш ескерту':
          score -= 3;
          break;
        case 'Ескертпей сабаққа келмеуі':
          score -= 10;
          absences += 1;
          lostLessons += 1;
          break;
        case 'Ауырып қалуы':
          score -= 1;
          sickDays += 1;
          break;
        case 'Семинар / командировкаға кетуі':
          // No score penalty
          break;
      }
    });

    return {
      ...teacher,
      score: Math.max(0, score),
      totalEvents: teacherEvents.length,
      absences,
      latenesses,
      sickDays,
      lostLessons: teacher.lostLessons || lostLessons, // Keep original if exists, or use calculated
    };
  }).sort((a, b) => {
    // Re-calculate rank based on score
    return b.score - a.score;
  }).map((t, i) => ({ ...t, rank: i + 1 }));

  const monthNames = ['Қаң', 'Ақп', 'Нау', 'Сәу', 'Мам', 'Мау', 'Шіл', 'Там', 'Қыр', 'Қаз', 'Қар', 'Жел'];
  const displayMonths = ['Қыр', 'Қаз', 'Қар', 'Жел', 'Қаң', 'Ақп', 'Нау'];
  
  const dynamicLineData = displayMonths.map(m => {
    const monthIndex = monthNames.indexOf(m);
    const count = eventsList.filter(e => {
      const parts = e.date.split('.');
      if (parts.length === 3) {
        const month = parseInt(parts[1], 10) - 1;
        return month === monthIndex;
      }
      return false;
    }).length;
    return { name: m, events: count };
  });

  const barData = derivedTeachers
    .map(t => {
      const nameParts = t.name.split(' ');
      const shortName = nameParts.length > 1 
        ? `${nameParts[0]} ${nameParts[1][0]}.` 
        : t.name;
      return { name: shortName, events: t.totalEvents };
    })
    .sort((a, b) => b.events - a.events)
    .slice(0, 5);

  const schoolKPIs: KPI[] = [
    { title: 'Барлық оқиғалар', value: eventsList.length, trend: eventsList.length > 0 ? '+12%' : '0%', trendType: 'up', icon: <Calendar className="w-5 h-5" />, color: 'bg-blue-500' },
    { title: 'Кешігулер', value: eventsList.filter(e => e.type === 'Сабаққа кешігу').length, trend: eventsList.length > 0 ? '-5%' : '0%', trendType: 'down', icon: <Clock className="w-5 h-5" />, color: 'bg-amber-500' },
    { title: 'Өтілмеген сабақтар', value: derivedTeachers.reduce((acc, t) => acc + t.lostLessons, 0), trend: eventsList.length > 0 ? '+2%' : '0%', trendType: 'up', icon: <UserMinus className="w-5 h-5" />, color: 'bg-red-500' },
    { title: 'Ауырған күндер', value: derivedTeachers.reduce((acc, t) => acc + t.sickDays, 0), trend: eventsList.length > 0 ? '+8%' : '0%', trendType: 'up', icon: <Stethoscope className="w-5 h-5" />, color: 'bg-emerald-500' },
    { title: 'Орташа рейтинг', value: derivedTeachers.length > 0 ? `${Math.round(derivedTeachers.reduce((acc, t) => acc + t.score, 0) / derivedTeachers.length)}%` : '0%', trend: 'Жалпы', trendType: 'neutral', icon: <Star className="w-5 h-5" />, color: 'bg-indigo-500' },
    { title: 'Қауіпті аймақтағы мұғалімдер', value: derivedTeachers.filter(t => t.score < 75).length, trend: 'Тұрақты', trendType: 'neutral', icon: <AlertTriangle className="w-5 h-5" />, color: 'bg-rose-600' },
  ];

  const selectedTeacher = derivedTeachers.find(t => t.id === selectedTeacherId);
  const filteredEvents = selectedTeacherId 
    ? eventsList.filter(e => e.teacherId === selectedTeacherId)
    : eventsList;

  const handleAddTeacher = (newTeacher: Partial<Teacher>) => {
    const teacher: Teacher = {
      id: `t${Date.now()}`,
      name: newTeacher.name || 'Жаңа мұғалім',
      subject: newTeacher.subject || 'Пән',
      status: 'Белсенді',
      score: 100,
      rank: teachersList.length + 1,
      totalEvents: 0,
      absences: 0,
      latenesses: 0,
      sickDays: 0,
      lostLessons: 0,
      substitutions: 0,
      hasDocuments: true,
      ...newTeacher
    };
    setTeachersList([...teachersList, teacher]);
    setIsAddModalOpen(false);
  };

  const handleDeleteTeacher = (id: string) => {
    if (window.confirm('Бұл мұғалімді өшіргіңіз келетініне сенімдісіз бе?')) {
      setTeachersList(teachersList.filter(t => t.id !== id));
      setEventsList(eventsList.filter(e => e.teacherId !== id));
      if (selectedTeacherId === id) {
        setSelectedTeacherId(null);
      }
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Бұл оқиғаны өшіргіңіз келетініне сенімдісіз бе?')) {
      setEventsList(eventsList.filter(e => e.id !== id));
    }
  };

  const handleAddEvent = (newEvent: Partial<Event>) => {
    const event: Event = {
      id: `e${Date.now()}`,
      teacherId: newEvent.teacherId || '',
      teacherName: newEvent.teacherName || '',
      type: newEvent.type || 'Сабаққа келмеу',
      date: newEvent.date || new Date().toLocaleDateString(),
      lesson: newEvent.lesson || 1,
      reason: newEvent.reason || '',
      ...newEvent
    };
    setEventsList([event, ...eventsList]);
    setIsAddEventModalOpen(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 75) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500';
    if (score >= 75) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900">
      <AnimatePresence>
        {showSaveToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl z-[9999] flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm">Өзгерістер сәтті сақталды!</span>
          </motion.div>
        )}
        {showCongratulateToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-xl z-[9999] flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm">Құттықтау хаты жіберілді!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`bg-[#0F172A] text-white transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex-shrink-0 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight whitespace-nowrap">{profile.schoolName}</span>}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Бақылау панелі' },
            { id: 'ranking', icon: <BarChart3 className="w-5 h-5" />, label: 'Рейтинг' },
            { id: 'teachers', icon: <Users className="w-5 h-5" />, label: 'Мұғалімдер' },
            { id: 'events', icon: <Calendar className="w-5 h-5" />, label: 'Оқиғалар' },
            { id: 'analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'Аналитика' },
            { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Баптаулар' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                if (item.id === 'teachers') setSelectedTeacherId(null);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="font-medium">Шығу</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-slate-500" />
            </button>
            <h1 className="text-xl font-bold text-slate-800">
              {selectedTeacher ? `Мұғалімді шолу: ${selectedTeacher.name}` : 'Мектепті шолу'}
            </h1>
          </div>

          <div className="flex items-center gap-6">


            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{profile.name}</p>
                <p className="text-xs text-slate-500">{profile.position}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-500 overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {activeTab === 'dashboard' && (
            <>
              {/* Filters & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <select 
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedTeacherId || ''}
                onChange={(e) => setSelectedTeacherId(e.target.value || null)}
              >
                <option value="">Барлық мұғалімдер (Мектепті шолу)</option>
                {derivedTeachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none">
                <option>2025-2026 Оқу жылы</option>
                <option>2024-2025 Оқу жылы</option>
              </select>
              <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Жалпы</option>
                <option>1 Тоқсан</option>
                <option>2 Тоқсан</option>
                <option>3 Тоқсан</option>
                <option>4 Тоқсан</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              {selectedTeacherId && (
                <button 
                  onClick={() => setSelectedTeacherId(null)}
                  className="text-slate-500 text-sm font-bold hover:text-slate-800 transition-colors"
                >
                  Сүзгіні тастау
                </button>
              )}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(selectedTeacher ? [
              { title: 'Барлық оқиғалар', value: selectedTeacher.totalEvents, trend: 'Жеке', trendType: 'neutral', icon: <Calendar className="w-5 h-5" />, color: 'bg-blue-500' },
              { title: 'Сабаққа келмеу', value: eventsList.filter(e => e.teacherId === selectedTeacher.id && e.type === 'Сабаққа келмеу').length, trend: 'Жеке', trendType: 'neutral', icon: <UserX className="w-5 h-5" />, color: 'bg-red-500' },
              { title: 'Сабаққа кешігу', value: eventsList.filter(e => e.teacherId === selectedTeacher.id && e.type === 'Сабаққа кешігу').length, trend: 'Жеке', trendType: 'neutral', icon: <Clock className="w-5 h-5" />, color: 'bg-amber-500' },
              { title: 'БТС емтиханы күні келмеуі', value: eventsList.filter(e => e.teacherId === selectedTeacher.id && e.type === 'БТС емтиханы күні келмеуі').length, trend: 'Жеке', trendType: 'neutral', icon: <FileWarning className="w-5 h-5" />, color: 'bg-rose-600' },
              { title: 'Кеш ескерту', value: eventsList.filter(e => e.teacherId === selectedTeacher.id && e.type === 'Кеш ескерту').length, trend: 'Жеке', trendType: 'neutral', icon: <BellRing className="w-5 h-5" />, color: 'bg-orange-500' },
              { title: 'Ескертпей сабаққа келмеуі', value: eventsList.filter(e => e.teacherId === selectedTeacher.id && e.type === 'Ескертпей сабаққа келмеуі').length, trend: 'Жеке', trendType: 'neutral', icon: <AlertCircle className="w-5 h-5" />, color: 'bg-red-600' },
              { title: 'Ауырып қалуы', value: eventsList.filter(e => e.teacherId === selectedTeacher.id && e.type === 'Ауырып қалуы').length, trend: 'Жеке', trendType: 'neutral', icon: <Stethoscope className="w-5 h-5" />, color: 'bg-emerald-500' },
              { title: 'Семинар / командировкаға кетуі', value: eventsList.filter(e => e.teacherId === selectedTeacher.id && e.type === 'Семинар / командировкаға кетуі').length, trend: 'Жеке', trendType: 'neutral', icon: <Plane className="w-5 h-5" />, color: 'bg-blue-400' },
              { title: 'Тәртіп көрсеткіші', value: `${selectedTeacher.score}%`, trend: `Рейтингте #${selectedTeacher.rank}`, trendType: 'neutral', icon: <BarChart3 className="w-5 h-5" />, color: 'bg-indigo-600' },
            ] : schoolKPIs).map((kpi, i) => (
              <motion.div 
                key={selectedTeacherId ? `teacher-${i}` : `school-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${kpi.color} text-white`}>
                    {kpi.icon}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                    kpi.trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : 
                    kpi.trendType === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                  }`}>
                    {kpi.trend}
                  </span>
                </div>
                <p className="text-slate-500 text-sm font-medium mb-1">{kpi.title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{kpi.value}</h3>
              </motion.div>
            ))}
          </div>

          {selectedTeacher ? (
            /* Teacher Detailed View */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Teacher Info Card */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center border-4 border-blue-100 flex-shrink-0">
                    <Users className="w-16 h-16 text-blue-600" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                      <h2 className="text-3xl font-bold text-slate-800">{selectedTeacher.name}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        selectedTeacher.status === 'Белсенді' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {selectedTeacher.status}
                      </span>
                    </div>
                    <p className="text-slate-500 font-medium mb-6">{selectedTeacher.subject} • Еңбек өтілі: 12 жыл • Кабинет: 304</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Тәртіп рейтингі</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${getScoreColor(selectedTeacher.score)}`}>{selectedTeacher.score}%</span>
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${getScoreBg(selectedTeacher.score)}`} style={{ width: `${selectedTeacher.score}%` }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="pl-6 border-l border-slate-100">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Мектептегі орны</p>
                        <p className="text-2xl font-bold text-slate-800">#{selectedTeacher.rank}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Absence Details Block */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Сабаққа келмеу және қатыспау</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <FileText className="w-4 h-4" />
                      Ағымдағы кезеңдегі аналитика
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-xs text-slate-400 font-bold mb-1 uppercase">Барлық келмеулер</p>
                      <p className="text-xl font-bold text-slate-800">{selectedTeacher.absences} рет</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-xs text-slate-400 font-bold mb-1 uppercase">Өтілмеген сабақтар</p>
                      <p className="text-xl font-bold text-rose-600">{selectedTeacher.lostLessons} сағ.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-xs text-slate-400 font-bold mb-1 uppercase">Ауыстырылған сабақтар</p>
                      <p className="text-xl font-bold text-emerald-600">{selectedTeacher.substitutions} сағ.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-xs text-slate-400 font-bold mb-1 uppercase">Құжаттар</p>
                      <div className="flex items-center gap-2">
                        {selectedTeacher.hasDocuments ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-500" />
                        )}
                        <span className="text-sm font-bold text-slate-700">{selectedTeacher.hasDocuments ? 'Бар' : 'Жоқ'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-800 mb-2">Келмеудің негізгі себептері:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Денсаулық жағдайы: 60%</li>
                      <li>• Отбасылық жағдайлар: 30%</li>
                      <li>• Әкімшілік тапсырмалар: 10%</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Discipline Rating Block */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Мұғалімдер рейтингі</h3>
                  <div className="space-y-4">
                    {derivedTeachers.sort((a, b) => b.score - a.score).slice(0, 5).map((t, i) => (
                      <div 
                        key={t.id} 
                        className={`flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer hover:bg-slate-50 ${t.id === selectedTeacherId ? 'bg-blue-50 border border-blue-100' : ''}`}
                        onClick={() => setSelectedTeacherId(t.id)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{t.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">{t.subject}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${getScoreColor(t.score)}`}>{t.score}%</p>
                          <div className="w-12 h-1 bg-slate-100 rounded-full mt-1">
                            <div className={`h-full ${getScoreBg(t.score)}`} style={{ width: `${t.score}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-rose-500 uppercase mb-4">Қауіпті аймақта</h4>
                    {derivedTeachers.filter(t => t.score < 75).map(t => (
                      <div 
                        key={t.id} 
                        className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 border border-rose-100 mb-2 cursor-pointer"
                        onClick={() => setSelectedTeacherId(t.id)}
                      >
                        <span className="text-sm font-bold text-rose-700">{t.name}</span>
                        <span className="text-sm font-bold text-rose-700">{t.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* School Overview Charts Row */
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Оқиғалар динамикасы</h3>
                      <p className="text-sm text-slate-500">Айлар бойынша оқиғалар саны</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs font-medium text-slate-500">Оқиғалар</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dynamicLineData}>
                        <defs>
                          <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                          cursor={{ stroke: '#3B82F6', strokeWidth: 2 }}
                        />
                        <Area type="monotone" dataKey="events" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorEvents)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Мұғалімдер рейтингі (Топ 5)</h3>
                  <div className="space-y-4">
                    {derivedTeachers.sort((a, b) => b.score - a.score).slice(0, 5).map((t, i) => (
                      <div 
                        key={t.id} 
                        className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all cursor-pointer"
                        onClick={() => setSelectedTeacherId(t.id)}
                      >
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-sm font-bold text-slate-500 shadow-sm">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800">{t.name}</p>
                          <p className="text-xs text-slate-400">{t.subject}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getScoreColor(t.score)}`}>{t.score}%</p>
                          <div className="w-20 h-1.5 bg-slate-200 rounded-full mt-1">
                            <div className={`h-full ${getScoreBg(t.score)}`} style={{ width: `${t.score}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveTab('ranking')}
                    className="w-full mt-6 py-3 text-blue-600 font-bold text-sm hover:underline"
                  >
                    Мұғалімдердің толық рейтингі
                  </button>
                </div>
              </div>

              {/* Heatmap & Pie Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Проблемалық аймақтар (Heatmap)</h3>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-50 rounded"></div> Төмен</div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-300 rounded"></div> Орташа</div>
                      <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded"></div> Жоғары</div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="p-2 text-left text-slate-400 font-medium">Сабақ / Күн</th>
                          {['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сн'].map(day => <th key={day} className="p-2 text-center text-slate-400 font-medium">{day}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3, 4, 5, 6].map(lesson => (
                          <tr key={lesson}>
                            <td className="p-2 font-bold text-slate-600">{lesson} Сабақ</td>
                            {[1, 2, 3, 4, 5, 6].map(day => {
                              const intensity = Math.random();
                              const color = intensity > 0.8 ? 'bg-blue-600' : intensity > 0.4 ? 'bg-blue-300' : 'bg-blue-50';
                              return (
                                <td key={day} className="p-1">
                                  <div className={`h-10 rounded-lg ${color} transition-all hover:scale-105 cursor-pointer`}></div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Оқиға түрлері</h3>
                  <p className="text-sm text-slate-500 mb-6">Пайыздық үлесі</p>
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full mt-6">
                      {pieData.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                          <span className="text-xs font-medium text-slate-600">{item.name}</span>
                          <span className="text-xs font-bold text-slate-400 ml-auto">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Table & Attention Row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-8">
            <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">
                  {selectedTeacher ? `Мұғалім оқиғалары: ${selectedTeacher.name}` : 'Соңғы оқиғалар'}
                </h3>
                <button 
                  onClick={() => setActiveTab('events')}
                  className="text-blue-600 text-sm font-bold hover:underline"
                >
                  Барлығын көру
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-6 py-4">Мұғалім</th>
                      <th className="px-6 py-4">Түрі</th>
                      <th className="px-6 py-4">Күні</th>
                      <th className="px-6 py-4">Сабақ</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEvents.map((event) => (
                      <tr 
                        key={event.id} 
                        className={`hover:bg-slate-50 transition-colors group ${event.isCritical ? 'bg-rose-50/30' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                              {event.teacherName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className={`font-bold text-sm ${event.isCritical ? 'text-rose-700' : 'text-slate-700'}`}>
                              {event.teacherName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {event.isCritical && <AlertTriangle className="w-3 h-3 text-rose-500" />}
                            <span className="text-sm text-slate-600">{event.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-500">{event.date}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-slate-700">{event.lesson || '—'}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-2 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Өшіру"
                          >
                            <Trash2 className="w-4 h-4 text-rose-400 hover:text-rose-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </>
      )}

          {activeTab === 'ranking' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Мұғалімдер рейтингі</h2>
                  <p className="text-slate-500 text-sm mt-1">Тәртіп және жауапкершілік көрсеткіштері бойынша</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {derivedTeachers.sort((a, b) => b.score - a.score).map((t, i) => (
                    <motion.div 
                      key={t.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6 group hover:border-blue-500 transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedTeacherId(t.id);
                        setActiveTab('dashboard');
                      }}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                        i === 0 ? 'bg-amber-100 text-amber-600' : 
                        i === 1 ? 'bg-slate-100 text-slate-500' : 
                        i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-slate-800">{t.name}</h4>
                          <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{t.subject}</span>
                        </div>
                        <div className="flex items-center gap-6 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {t.totalEvents} оқиға</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t.latenesses} кешігу</span>
                          <span className="flex items-center gap-1"><UserMinus className="w-3 h-3" /> {t.absences} келмеу</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end mb-2">
                          <span className={`text-xl font-black ${getScoreColor(t.score)}`}>{t.score}%</span>
                        </div>
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${getScoreBg(t.score)}`} style={{ width: `${t.score}%` }}></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-8">
                  {derivedTeachers.length > 0 && (
                    <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-600/20">
                      <h3 className="font-bold text-lg mb-2">Айдың үздік мұғалімі</h3>
                      <div className="flex items-center gap-4 mt-6">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🏆</div>
                        <div>
                          <p className="font-bold text-xl">{derivedTeachers.sort((a, b) => b.score - a.score)[0].name}</p>
                          <p className="text-blue-100 text-sm">{derivedTeachers.sort((a, b) => b.score - a.score)[0].subject}</p>
                        </div>
                      </div>
                      <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                        <div>
                          <p className="text-blue-100 text-xs uppercase tracking-wider font-bold">Көрсеткіш</p>
                          <p className="text-2xl font-black">{derivedTeachers.sort((a, b) => b.score - a.score)[0].score}%</p>
                        </div>
                        <button 
                          onClick={handleCongratulate}
                          className="px-4 py-2 bg-white text-blue-600 rounded-xl text-xs font-bold"
                        >
                          Құттықтау
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Рейтинг динамикасы</h3>
                    <div className="space-y-6">
                      {[
                        { label: 'Орташа көрсеткіш', value: derivedTeachers.length > 0 ? `${Math.round(derivedTeachers.reduce((acc, t) => acc + t.score, 0) / derivedTeachers.length)}%` : '0%', trend: '+0%', up: true },
                        { label: 'Үздіктер саны', value: derivedTeachers.filter(t => t.score >= 90).length.toString(), trend: '+0', up: true },
                        { label: 'Қауіпті аймақ', value: derivedTeachers.filter(t => t.score < 75).length.toString(), trend: '-0', up: true },
                      ].map((stat, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-slate-400 font-medium mb-1">{stat.label}</p>
                            <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-xs font-bold ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {stat.trend}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teachers' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Мұғалімдер тізімі</h2>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all"
                >
                  + Мұғалім қосу
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="АЖТ немесе пән бойынша іздеу..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <select 
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option>Барлық пәндер</option>
                    <option>Математика</option>
                    <option>Физика</option>
                    <option>Тарих</option>
                    <option>Ағылшын тілі</option>
                    <option>Биология</option>
                    <option>Химия</option>
                    <option>География</option>
                    <option>Информатика</option>
                    <option>Көркем еңбек</option>
                    <option>Домбыра</option>
                    <option>Денешынықтыру</option>
                    <option>Дүниежүзі тарихы</option>
                    <option>НВП</option>
                    <option>Қазақ тілі</option>
                    <option>Орыс тілі</option>
                    <option>Түрік тілі</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <tr>
                        <th 
                          className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => setTeacherSort({ 
                            key: 'name', 
                            direction: teacherSort.key === 'name' && teacherSort.direction === 'asc' ? 'desc' : 'asc' 
                          })}
                        >
                          <div className="flex items-center gap-2">
                            Мұғалім
                            {teacherSort.key === 'name' ? (
                              teacherSort.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => setTeacherSort({ 
                            key: 'subject', 
                            direction: teacherSort.key === 'subject' && teacherSort.direction === 'asc' ? 'desc' : 'asc' 
                          })}
                        >
                          <div className="flex items-center gap-2">
                            Пән
                            {teacherSort.key === 'subject' ? (
                              teacherSort.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-center cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => setTeacherSort({ 
                            key: 'score', 
                            direction: teacherSort.key === 'score' && teacherSort.direction === 'desc' ? 'asc' : 'desc' 
                          })}
                        >
                          <div className="flex items-center justify-center gap-2">
                            Score
                            {teacherSort.key === 'score' ? (
                              teacherSort.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-center cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => setTeacherSort({ 
                            key: 'rank', 
                            direction: teacherSort.key === 'rank' && teacherSort.direction === 'asc' ? 'desc' : 'asc' 
                          })}
                        >
                          <div className="flex items-center justify-center gap-2">
                            Орны
                            {teacherSort.key === 'rank' ? (
                              teacherSort.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                          </div>
                        </th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {derivedTeachers
                        .filter(t => {
                          const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                              t.subject.toLowerCase().includes(searchTerm.toLowerCase());
                          const matchesSubject = subjectFilter === 'Барлық пәндер' || t.subject === subjectFilter;
                          return matchesSearch && matchesSubject;
                        })
                        .sort((a, b) => {
                          const valA = a[teacherSort.key];
                          const valB = b[teacherSort.key];
                          if (typeof valA === 'string' && typeof valB === 'string') {
                            return teacherSort.direction === 'asc' 
                              ? valA.localeCompare(valB) 
                              : valB.localeCompare(valA);
                          }
                          return teacherSort.direction === 'asc' 
                            ? (valA as number) - (valB as number) 
                            : (valB as number) - (valA as number);
                        })
                        .map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                                {t.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 text-sm">{t.name}</p>
                                <p className="text-xs text-slate-400">ID: {t.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-600 font-medium">{t.subject}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col items-center">
                              <span className={`text-sm font-bold ${getScoreColor(t.score)}`}>{t.score}%</span>
                              <div className="w-16 h-1 bg-slate-100 rounded-full mt-1">
                                <div className={`h-full ${getScoreBg(t.score)}`} style={{ width: `${t.score}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-sm font-bold text-slate-700">#{t.rank}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => {
                                  setSelectedTeacherId(t.id);
                                  setActiveTab('dashboard');
                                }}
                                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                              >
                                Профиль
                              </button>
                              <button 
                                onClick={() => handleDeleteTeacher(t.id)}
                                className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all"
                                title="Өшіру"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Барлық оқиғалар</h2>
                <div className="flex gap-3">
                  <select 
                    value={eventTypeFilter}
                    onChange={(e) => setEventTypeFilter(e.target.value)}
                    className="bg-white border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option>Барлық түрлері</option>
                    <option value="Сабаққа келмеу">Сабаққа келмеу</option>
                    <option value="Сабаққа кешігу">Сабаққа кешігу</option>
                    <option value="БТС емтиханы күні келмеуі">БТС емтиханы күні келмеуі</option>
                    <option value="Кеш ескерту">Кеш ескерту</option>
                    <option value="Ескертпей сабаққа келмеуі">Ескертпей сабаққа келмеуі</option>
                    <option value="Ауырып қалуы">Ауырып қалуы</option>
                    <option value="Семинар / командировкаға кетуі">Семинар / командировкаға кетуі</option>
                  </select>
                  <button 
                    onClick={() => setIsAddEventModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all"
                  >
                    + Жаңа оқиға
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <tr>
                        <th 
                          className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => setEventSort({ 
                            key: 'teacherName', 
                            direction: eventSort.key === 'teacherName' && eventSort.direction === 'asc' ? 'desc' : 'asc' 
                          })}
                        >
                          <div className="flex items-center gap-2">
                            Мұғалім
                            {eventSort.key === 'teacherName' ? (
                              eventSort.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => setEventSort({ 
                            key: 'type', 
                            direction: eventSort.key === 'type' && eventSort.direction === 'asc' ? 'desc' : 'asc' 
                          })}
                        >
                          <div className="flex items-center gap-2">
                            Түрі
                            {eventSort.key === 'type' ? (
                              eventSort.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                          onClick={() => setEventSort({ 
                            key: 'date', 
                            direction: eventSort.key === 'date' && eventSort.direction === 'desc' ? 'asc' : 'desc' 
                          })}
                        >
                          <div className="flex items-center gap-2">
                            Күні
                            {eventSort.key === 'date' ? (
                              eventSort.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                            ) : <ArrowUpDown className="w-3 h-3 opacity-30" />}
                          </div>
                        </th>
                        <th className="px-6 py-4">Сабақ</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {eventsList
                        .filter(e => eventTypeFilter === 'Барлық түрлері' || e.type === eventTypeFilter)
                        .sort((a, b) => {
                          const valA = a[eventSort.key];
                          const valB = b[eventSort.key];
                          if (typeof valA === 'string' && typeof valB === 'string') {
                            return eventSort.direction === 'asc' 
                              ? valA.localeCompare(valB) 
                              : valB.localeCompare(valA);
                          }
                          return eventSort.direction === 'asc' 
                            ? (valA as number) - (valB as number) 
                            : (valB as number) - (valA as number);
                        })
                        .map((event) => (
                        <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800 text-sm">{event.teacherName}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-medium ${
                              event.type === 'Сабаққа кешігу' ? 'text-amber-600' : 
                              event.type === 'Ескертпей сабаққа келмеуі' ? 'text-red-600' : 'text-blue-600'
                            }`}>{event.type}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{event.date}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{event.lesson || '-'}</td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all"
                              title="Өшіру"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-slate-800">Аналитика және есептер</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-6">Бұзушылықтар динамикасы</h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dynamicLineData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                        <Line type="monotone" dataKey="events" stroke="#3b82f6" strokeWidth={4} dot={{r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-6">Түрлері бойынша үлесі</h3>
                  <div className="h-80 w-full flex items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6">Көбірек көңіл бөлуді қажет ететін мұғалімдер</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" axisLine={false} tickLine={false} hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} width={100} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="events" name="Оқиғалар саны" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 max-w-4xl relative">
              <h2 className="text-2xl font-bold text-slate-800">Баптаулар</h2>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Профиль баптаулары</h3>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-50 overflow-hidden">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-10 h-10 text-blue-600" />
                        )}
                      </div>
                      <input 
                        type="file" 
                        id="avatar-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setProfile({ ...profile, avatar: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label htmlFor="avatar-upload" className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">
                        Суретті өзгерту
                      </label>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Аты-жөні</label>
                        <input 
                          type="text" 
                          value={profile.name} 
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                        <input 
                          type="email" 
                          value={profile.email} 
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Лауазымы</label>
                        <input 
                          type="text" 
                          value={profile.position} 
                          onChange={(e) => setProfile({...profile, position: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Телефон</label>
                        <input 
                          type="text" 
                          value={profile.phone} 
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8 bg-slate-50 flex justify-end">
                  <button 
                    onClick={handleSaveSettings}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all"
                  >
                    Сақтау
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-6">Жүйелік баптаулар</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Мектеп атауы</label>
                      <input 
                        type="text" 
                        value={profile.schoolName} 
                        onChange={(e) => setProfile({...profile, schoolName: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Оқу жылы</label>
                      <select 
                        value={profile.academicYear} 
                        onChange={(e) => setProfile({...profile, academicYear: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      >
                        <option>2025-2026 Оқу жылы</option>
                        <option>2024-2025 Оқу жылы</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Ағымдағы тоқсан</label>
                      <select 
                        value={profile.currentTerm} 
                        onChange={(e) => setProfile({...profile, currentTerm: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      >
                        <option>Жалпы</option>
                        <option>1 Тоқсан</option>
                        <option>2 Тоқсан</option>
                        <option>3 Тоқсан</option>
                        <option>4 Тоқсан</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="p-8 bg-slate-50 flex justify-end">
                  <button 
                    onClick={handleSaveSettings}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all"
                  >
                    Сақтау
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-500" />
                    Хабарландырулар
                  </h3>
                  <div className="space-y-4">
                    {notificationSettings.map((item) => (
                      <label key={item.id} className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{item.label}</span>
                        <div 
                          onClick={() => toggleNotification(item.id)}
                          className={`w-12 h-6 rounded-full transition-all relative ${item.checked ? 'bg-blue-600' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.checked ? 'left-7' : 'left-1'}`}></div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-500" />
                    Қауіпсіздік
                  </h3>
                  <div className="space-y-4">
                    <button className="w-full py-3 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all text-left flex items-center justify-between">
                      Құпия сөзді өзгерту
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="w-full py-3 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all text-left flex items-center justify-between">
                      Екі факторлы аутентификация
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">Өшірулі</span>
                    </button>
                    <button className="w-full py-3 px-4 rounded-xl border border-slate-200 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all text-left flex items-center justify-between">
                      Сессияларды аяқтау
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <AddTeacherModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleAddTeacher} 
        />

        <AddEventModal 
          isOpen={isAddEventModalOpen} 
          onClose={() => setIsAddEventModalOpen(false)} 
          onAdd={handleAddEvent}
          teachers={teachersList}
        />
      </main>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  return (
    <div className="font-sans antialiased">
      <AnimatePresence mode="wait">
        {currentPage === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LandingPage onLogin={() => setCurrentPage('dashboard')} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DashboardPage onLogout={() => setCurrentPage('landing')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

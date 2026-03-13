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
  Layers,
  ShieldAlert,
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
  Legend,
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { AddEventModal } from './AddEventModal';
import { AddTeacherModal } from './AddTeacherModal';
import { COLORS } from '../data/mockData';
import { AnalyticsTab } from './dashboard/AnalyticsTab';
import { buildDashboardAnalytics } from './dashboard/analytics';
import { EventsTab } from './dashboard/EventsTab';
import { DashboardSidebar, DashboardTopBar } from './dashboard/DashboardLayout';
import { SettingsTab } from './dashboard/SettingsTab';
import { TeachersTab } from './dashboard/TeachersTab';
import { useDashboardData } from './dashboard/useDashboardData';
import {
  hasSupabaseConfig,
  isLocalAuthBypassEnabled,
  supabase,
} from '../lib/supabase';
import type { Event, Teacher } from '../types';

export function DashboardPage({ onLogout }: { onLogout: () => void }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'teachers' | 'events' | 'analytics' | 'ranking' | 'settings'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('Барлық пәндер');
  const [eventTypeFilter, setEventTypeFilter] = useState('Барлық түрлері');
  const [teacherSort, setTeacherSort] = useState<{ key: keyof Teacher; direction: 'asc' | 'desc' }>({ key: 'rank', direction: 'asc' });
  const [eventSort, setEventSort] = useState<{ key: keyof Event; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });

  const [notificationSettings, setNotificationSettings] = useState([
    { id: 'events', label: 'Жаңа оқиғалар туралы хабарлау', checked: true },
    { id: 'ratings', label: 'Рейтинг өзгерістері', checked: true },
    { id: 'reports', label: 'Апталық есептер', checked: false },
    { id: 'updates', label: 'Жүйелік жаңартулар', checked: true },
  ]);

  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showCongratulateToast, setShowCongratulateToast] = useState(false);

  const {
    teachersList,
    eventsList,
    profile,
    setProfile,
    isLoadingData,
    handleAddTeacher,
    handleDeleteTeacher,
    handleDeleteEvent,
    handleAddEvent,
  } = useDashboardData({
    selectedTeacherId,
    clearSelectedTeacher: () => setSelectedTeacherId(null),
  });

  const handleSaveSettings = async () => {
    if (!hasSupabaseConfig) {
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
      return;
    }

    try {
      const { data: existingProfile } = await supabase.from('school_profile').select('id').limit(1).single();
      
      const updateData = {
        school_name: profile.schoolName,
        director_name: profile.name,
        academic_year: profile.academicYear,
        current_term: profile.currentTerm,
        email: profile.email,
        phone: profile.phone,
        avatar_url: profile.avatar
      };

      let error;
      if (existingProfile) {
        const res = await supabase.from('school_profile').update(updateData).eq('id', existingProfile.id);
        error = res.error;
      } else {
        const res = await supabase.from('school_profile').insert([updateData]);
        error = res.error;
      }
      
      if (error) throw error;
      
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
    } catch (error: any) {
      console.error("Error saving settings:", error);
      alert("Сақтау кезінде қате шықты: " + error.message);
    }
  };

  const handleCongratulate = () => {
    setShowCongratulateToast(true);
    setTimeout(() => setShowCongratulateToast(false), 3000);
  };

  const toggleNotification = (id: string) => {
    setNotificationSettings(prev => prev.map(n => n.id === id ? { ...n, checked: !n.checked } : n));
  };

  const {
    pieData,
    eventsWithTeacherNames,
    derivedTeachers,
    dynamicLineData,
    barData,
    schoolKPIs,
  } = buildDashboardAnalytics(teachersList, eventsList);

  const selectedTeacher = derivedTeachers.find((teacher) => teacher.id === selectedTeacherId);
  const filteredEvents = selectedTeacherId
    ? eventsWithTeacherNames.filter((event) => event.teacherId === selectedTeacherId)
    : eventsWithTeacherNames;

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

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="font-bold text-slate-500">Деректер жүктелуде...</p>
        </div>
      </div>
    );
  }

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

      <DashboardSidebar
        activeTab={activeTab}
        isSidebarOpen={isSidebarOpen}
        onLogout={onLogout}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'teachers') setSelectedTeacherId(null);
        }}
        profile={profile}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <DashboardTopBar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          profile={profile}
          selectedTeacherName={selectedTeacher?.name || null}
        />

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
                          <span className="text-sm text-slate-500">{event.date.split('-').reverse().join('.')}</span>
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
            <TeachersTab
              derivedTeachers={derivedTeachers}
              searchTerm={searchTerm}
              subjectFilter={subjectFilter}
              teacherSort={teacherSort}
              setSearchTerm={setSearchTerm}
              setSubjectFilter={setSubjectFilter}
              setTeacherSort={setTeacherSort}
              getScoreBg={getScoreBg}
              getScoreColor={getScoreColor}
              onAddTeacher={() => setIsAddModalOpen(true)}
              onDeleteTeacher={handleDeleteTeacher}
              onOpenTeacherProfile={(id) => {
                setSelectedTeacherId(id);
                setActiveTab('dashboard');
              }}
            />
          )}

          {activeTab === 'events' && (
            <EventsTab
              eventSort={eventSort}
              eventTypeFilter={eventTypeFilter}
              eventsWithTeacherNames={eventsWithTeacherNames}
              setEventSort={setEventSort}
              setEventTypeFilter={setEventTypeFilter}
              onAddEvent={() => setIsAddEventModalOpen(true)}
              onDeleteEvent={handleDeleteEvent}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab
              barData={barData}
              colors={COLORS}
              dynamicLineData={dynamicLineData}
              pieData={pieData}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab
              handleSaveSettings={handleSaveSettings}
              notificationSettings={notificationSettings}
              profile={profile}
              setProfile={setProfile}
              toggleNotification={toggleNotification}
            />
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



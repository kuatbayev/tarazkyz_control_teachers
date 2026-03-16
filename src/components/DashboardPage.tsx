/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BellRing,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Stethoscope,
  Trash2,
  UserMinus,
  UserX,
  Users,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AddEventModal } from './AddEventModal';
import { AddTeacherModal } from './AddTeacherModal';
import { COLORS } from '../data/mockData';
import { ABSENCE_EVENT_TYPES, ALL_EVENT_TYPES_LABEL, ALL_SUBJECTS_LABEL, EVENT_TYPES, TERM_OPTIONS } from '../data/options';
import { AnalyticsTab } from './dashboard/AnalyticsTab';
import { buildDashboardAnalytics } from './dashboard/analytics';
import { DashboardSidebar, DashboardTopBar } from './dashboard/DashboardLayout';
import { EventsTab } from './dashboard/EventsTab';
import { SettingsTab } from './dashboard/SettingsTab';
import { TeachersTab } from './dashboard/TeachersTab';
import { useDashboardData } from './dashboard/useDashboardData';
import { hasSupabaseConfig, supabase } from '../lib/supabase';
import { filterEventsByTerm } from '../lib/termFilters';
import type { Event, Teacher } from '../types';

type ActiveTab = 'dashboard' | 'teachers' | 'events' | 'analytics' | 'ranking' | 'settings';

export function DashboardPage({ onLogout }: { onLogout: () => void }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState(ALL_SUBJECTS_LABEL);
  const [eventTypeFilter, setEventTypeFilter] = useState(ALL_EVENT_TYPES_LABEL);
  const [selectedTerm, setSelectedTerm] = useState('Жалпы');
  const [teacherViewMode, setTeacherViewMode] = useState<'all' | 'absentOnly'>('all');
  const [teacherSort, setTeacherSort] = useState<{ key: keyof Teacher; direction: 'asc' | 'desc' }>({ key: 'rank', direction: 'asc' });
  const [eventSort, setEventSort] = useState<{ key: keyof Event; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'desc' });
  const [showSaveToast, setShowSaveToast] = useState(false);

  const {
    teachersList,
    eventsList,
    profile,
    setProfile,
    isLoadingData,
    fetchDashboardData,
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
      const [{ data: existingProfile }, { data: authData }] = await Promise.all([
        supabase.from('school_profile').select('id').limit(1).single(),
        supabase.auth.getUser(),
      ]);
      const normalizedEmail = profile.email.trim();

      const schoolProfileData = {
        school_name: profile.schoolName,
        director_name: profile.name,
        academic_year: profile.academicYear,
        current_term: profile.currentTerm,
        email: normalizedEmail,
        avatar_url: profile.avatar,
      };

      const schoolProfileResult = existingProfile
        ? await supabase.from('school_profile').update(schoolProfileData).eq('id', existingProfile.id)
        : await supabase.from('school_profile').insert([schoolProfileData]);

      if (schoolProfileResult.error) throw schoolProfileResult.error;

      const userId = authData.user?.id;
      if (userId) {
        const adminProfileResult = await supabase.from('admin_profiles').upsert(
          {
            id: userId,
            full_name: profile.name,
            role: profile.position,
          },
          { onConflict: 'id' },
        );

        if (adminProfileResult.error) throw adminProfileResult.error;
      }

      await fetchDashboardData();
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      alert(`Сақтау кезінде қате шықты: ${error.message}`);
    }
  };

  const handleChangePassword = async (password: string) => {
    if (!hasSupabaseConfig) {
      return {
        success: false,
        message: 'Локалды режимде құпия сөзді өзгерту қолжетімсіз.',
      };
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      return {
        success: true,
        message: 'Құпия сөз сәтті өзгертілді.',
      };
    } catch (error: any) {
      console.error('Error changing password:', error);
      return {
        success: false,
        message: error.message || 'Құпия сөзді өзгерту кезінде қате шықты.',
      };
    }
  };

  useEffect(() => {
    setSelectedTerm(profile.currentTerm || 'Жалпы');
  }, [profile.currentTerm]);

  const filteredEvents: Event[] = filterEventsByTerm<Event>(eventsList, profile.academicYear, selectedTerm);
  const { pieData, eventsWithTeacherNames, derivedTeachers, dynamicLineData, barData, schoolKPIs } = buildDashboardAnalytics(teachersList, filteredEvents);
  const absentTeacherIds = new Set(
    eventsWithTeacherNames.filter((event) => ABSENCE_EVENT_TYPES.includes(event.type as (typeof ABSENCE_EVENT_TYPES)[number])).map((event) => event.teacherId),
  );
  const teachersForCurrentTerm = selectedTerm === 'Жалпы' ? derivedTeachers : derivedTeachers.filter((teacher) => teacher.totalEvents > 0);
  const visibleTeachers =
    teacherViewMode === 'absentOnly' && selectedTerm !== 'Жалпы'
      ? teachersForCurrentTerm.filter((teacher) => absentTeacherIds.has(teacher.id))
      : derivedTeachers;
  const selectedTermLabel = TERM_OPTIONS.find((term) => term.value === selectedTerm)?.label ?? selectedTerm;

  useEffect(() => {
    if (selectedTeacherId && !visibleTeachers.some((teacher) => teacher.id === selectedTeacherId)) {
      setSelectedTeacherId(null);
    }
  }, [selectedTeacherId, visibleTeachers]);

  const selectedTeacher = derivedTeachers.find((teacher) => teacher.id === selectedTeacherId) ?? null;
  const rankingTeachers = [...visibleTeachers].sort((a, b) => b.score - a.score);
  const topTeachers = rankingTeachers.slice(0, 5);
  const recentEvents = (selectedTeacherId ? eventsWithTeacherNames.filter((event) => event.teacherId === selectedTeacherId) : eventsWithTeacherNames).slice(0, 12);
  const absenceEvents = eventsWithTeacherNames.filter((event) => ABSENCE_EVENT_TYPES.includes(event.type as (typeof ABSENCE_EVENT_TYPES)[number]));
  const unexcusedAbsenceCount = eventsWithTeacherNames.filter((event) => event.type === 'Ескертпей сабаққа келмеуі').length;
  const absenceTeacherCount = new Set(absenceEvents.map((event) => event.teacherId)).size;
  const selectedTeacherEvents = selectedTeacherId
    ? eventsWithTeacherNames.filter((event) => event.teacherId === selectedTeacherId)
    : [];
  const selectedTeacherEventCounts = EVENT_TYPES.reduce<Record<string, number>>((acc, type) => {
    acc[type] = selectedTeacherEvents.filter((event) => event.type === type).length;
    return acc;
  }, {});
  const selectedTeacherKPIs = selectedTeacher
    ? [
        { title: 'Оқиғалар', value: selectedTeacher.totalEvents, trend: 'Жеке', trendType: 'neutral' as const, icon: <Calendar className="h-5 w-5" />, color: 'bg-blue-500' },
        { title: 'Сабаққа келмеуі', value: selectedTeacherEventCounts['Сабаққа келмеу'] ?? 0, trend: 'Жеке', trendType: 'neutral' as const, icon: <UserX className="h-5 w-5" />, color: 'bg-red-500' },
        { title: 'Сабаққа кешігу', value: selectedTeacherEventCounts['Сабаққа кешігу'] ?? 0, trend: 'Жеке', trendType: 'neutral' as const, icon: <Clock className="h-5 w-5" />, color: 'bg-amber-500' },
        { title: 'БТС емтиханы күні келмеуі', value: selectedTeacherEventCounts['БТС емтиханы күні келмеуі'] ?? 0, trend: 'Жеке', trendType: 'neutral' as const, icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-rose-500' },
        { title: 'PET/KET емтиханына келмеді', value: selectedTeacherEventCounts['PET/KET емтиханына келмеді'] ?? 0, trend: 'Жеке', trendType: 'neutral' as const, icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-pink-600' },
        { title: 'Кеш ескерту', value: selectedTeacherEventCounts['Кеш ескерту'] ?? 0, trend: 'Жеке', trendType: 'neutral' as const, icon: <BellRing className="h-5 w-5" />, color: 'bg-orange-500' },
        { title: 'Ескертпей сабаққа келмеуі', value: selectedTeacherEventCounts['Ескертпей сабаққа келмеуі'] ?? 0, trend: 'Жеке', trendType: 'neutral' as const, icon: <UserMinus className="h-5 w-5" />, color: 'bg-fuchsia-600' },
        { title: 'Ауырып қалуы', value: selectedTeacherEventCounts['Ауырып қалуы'] ?? 0, trend: 'Жеке', trendType: 'neutral' as const, icon: <Stethoscope className="h-5 w-5" />, color: 'bg-emerald-500' },
        { title: 'Сұранды', value: selectedTeacherEventCounts['Сұранды'] ?? 0, trend: 'Жеке', trendType: 'neutral' as const, icon: <CheckCircle2 className="h-5 w-5" />, color: 'bg-sky-600' },
        { title: 'Семинар / командировкаға кетуі', value: selectedTeacherEventCounts['Семинар / командировкаға кетуі'] ?? 0, trend: 'Жеке', trendType: 'neutral' as const, icon: <Briefcase className="h-5 w-5" />, color: 'bg-cyan-600' },
        { title: 'Тәртіп көрсеткіші', value: `${selectedTeacher.score}%`, trend: `Рейтингте #${selectedTeacher.rank}`, trendType: 'neutral' as const, icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-indigo-600' },
      ]
    : schoolKPIs;

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
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="font-bold text-slate-500">Деректер жүктелуде...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900">
      <AnimatePresence>
        {showSaveToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed right-8 top-24 z-[9999] flex items-center gap-3 rounded-2xl bg-emerald-600 px-6 py-3 text-white shadow-xl">
            <span className="text-sm font-bold">Өзгерістер сәтті сақталды!</span>
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

      <main className="flex h-screen flex-1 flex-col overflow-hidden">
        <DashboardTopBar isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} profile={profile} selectedTeacherName={selectedTeacher?.name ?? null} />

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-3">
                  <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500" value={selectedTeacherId || ''} onChange={(e) => setSelectedTeacherId(e.target.value || null)}>
                    <option value="">Барлық мұғалімдер (мектеп шолуы)</option>
                    {visibleTeachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                  <select
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                    value={profile.academicYear}
                    onChange={(e) => setProfile({ ...profile, academicYear: e.target.value })}
                  >
                    <option>2025-2026 оқу жылы</option>
                    <option>2024-2025 оқу жылы</option>
                  </select>
                  <select
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value)}
                  >
                    {TERM_OPTIONS.map((term) => (
                      <option key={term.value} value={term.value}>
                        {term.label}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedTeacherId && (
                  <button onClick={() => setSelectedTeacherId(null)} className="text-sm font-bold text-slate-500 hover:text-slate-800">
                    Сүзгіні тазалау
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">{selectedTermLabel}</span>
                {!selectedTeacher && selectedTerm !== 'Жалпы' && (
                  <span className="rounded-full bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700">
                    Келмеген мұғалімдер: {absenceTeacherCount}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {(selectedTeacher
                  ? [
                      { title: 'Оқиғалар', value: selectedTeacher.totalEvents, trend: 'Жеке', trendType: 'neutral' as const, icon: <Calendar className="h-5 w-5" />, color: 'bg-blue-500' },
                      { title: 'Келмеу', value: selectedTeacher.absences, trend: 'Жеке', trendType: 'neutral' as const, icon: <UserX className="h-5 w-5" />, color: 'bg-red-500' },
                      { title: 'Кешігу', value: selectedTeacher.latenesses, trend: 'Жеке', trendType: 'neutral' as const, icon: <Clock className="h-5 w-5" />, color: 'bg-amber-500' },
                      { title: 'Тәртіп көрсеткіші', value: `${selectedTeacher.score}%`, trend: `Рейтингте #${selectedTeacher.rank}`, trendType: 'neutral' as const, icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-indigo-600' },
                      { title: 'БТС емтиханы күні келмеуі', value: selectedTeacherEventCounts['БТС емтиханы күні келмеуі'] ?? 0, trend: 'Жеке', trendType: 'neutral' as const, icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-rose-500' },
                      { title: 'Кеш ескерту', value: selectedTeacherEventCounts['Кеш ескерту'] ?? 0, trend: 'Жеке', trendType: 'neutral' as const, icon: <BellRing className="h-5 w-5" />, color: 'bg-orange-500' },
                      { title: 'Ескертпей сабаққа келмеуі', value: selectedTeacherEventCounts['Ескертпей сабаққа келмеуі'] ?? 0, trend: 'Жеке', trendType: 'neutral' as const, icon: <UserMinus className="h-5 w-5" />, color: 'bg-fuchsia-600' },
                      { title: 'Ауырып қалуы', value: selectedTeacherEventCounts['Ауырып қалуы'] ?? 0, trend: 'Жеке', trendType: 'neutral' as const, icon: <Stethoscope className="h-5 w-5" />, color: 'bg-emerald-500' },
                      { title: 'Семинар / командировкаға кетуі', value: selectedTeacherEventCounts['Семинар / командировкаға кетуі'] ?? 0, trend: 'Жеке', trendType: 'neutral' as const, icon: <Briefcase className="h-5 w-5" />, color: 'bg-cyan-600' },
                    ]
                  : schoolKPIs
                ).map((kpi, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div className={`rounded-xl p-2.5 text-white ${kpi.color}`}>{kpi.icon}</div>
                      <span className={`rounded-lg px-2 py-1 text-[10px] font-bold ${kpi.trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : kpi.trendType === 'down' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'}`}>{kpi.trend}</span>
                    </div>
                    <p className="mb-1 text-sm font-medium text-slate-500">{kpi.title}</p>
                    <h3 className="text-2xl font-bold text-slate-800">{kpi.value}</h3>
                  </div>
                ))}
              </div>

              {!selectedTeacher && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Келмеген мұғалімдер</p>
                    <p className="mt-2 text-3xl font-bold text-slate-800">{absenceTeacherCount}</p>
                  </div>
                  <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Жалпы келмеу саны</p>
                    <p className="mt-2 text-3xl font-bold text-slate-800">{absenceEvents.length}</p>
                  </div>
                  <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Ескертпей келмеу</p>
                    <p className="mt-2 text-3xl font-bold text-slate-800">{unexcusedAbsenceCount}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                  {selectedTeacher ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                      <div className="flex flex-col items-center gap-6 md:flex-row">
                        <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-blue-100 bg-blue-50">
                          <Users className="h-14 w-14 text-blue-600" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <h2 className="text-3xl font-bold text-slate-800">{selectedTeacher.name}</h2>
                          <p className="mt-2 font-medium text-slate-500">{selectedTeacher.subject}</p>
                          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="rounded-2xl bg-slate-50 p-4">
                              <p className="text-xs font-bold uppercase text-slate-400">Мектептегі орны</p>
                              <p className="mt-1 text-2xl font-bold text-slate-800">#{selectedTeacher.rank}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                      <div className="mb-8 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">Оқиғалар динамикасы</h3>
                          <p className="text-sm text-slate-500">Айлар бойынша оқиғалар саны</p>
                        </div>
                      </div>
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={dynamicLineData}>
                            <defs>
                              <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                            <Area type="monotone" dataKey="events" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorEvents)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 p-6">
                      <h3 className="text-lg font-bold text-slate-800">{selectedTeacher ? `Мұғалім оқиғалары: ${selectedTeacher.name}` : 'Соңғы оқиғалар'}</h3>
                      <button onClick={() => setActiveTab('events')} className="text-sm font-bold text-blue-600 hover:underline">
                        Барлығын көру
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                          <tr>
                            <th className="px-6 py-4">Мұғалім</th>
                            <th className="px-6 py-4">Түрі</th>
                            <th className="px-6 py-4">Күні</th>
                            <th className="px-6 py-4"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {recentEvents.map((event) => (
                            <tr key={event.id} className="group transition-colors hover:bg-slate-50">
                              <td className="px-6 py-4">
                                <span className="text-sm font-bold text-slate-700">{event.teacherName}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm text-slate-600">{event.type}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm text-slate-500">{event.date.split('-').reverse().join('.')}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button onClick={() => handleDeleteEvent(event.id)} className="rounded-lg p-2 opacity-0 transition-colors hover:bg-rose-50 group-hover:opacity-100" title="Өшіру">
                                  <Trash2 className="h-4 w-4 text-rose-400 hover:text-rose-600" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'ranking' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Мұғалімдер рейтингі</h2>
                <p className="mt-1 text-sm text-slate-500">Тәртіп және жауапкершілік көрсеткіштері бойынша</p>
              </div>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                  {rankingTeachers.map((teacher, index) => (
                    <motion.div key={teacher.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="flex cursor-pointer items-center gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500" onClick={() => { setSelectedTeacherId(teacher.id); setActiveTab('dashboard'); }}>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-bold ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-slate-100 text-slate-500' : index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>{index + 1}</div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-3">
                          <h4 className="font-bold text-slate-800">{teacher.name}</h4>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">{teacher.subject}</span>
                        </div>
                        <div className="flex items-center gap-6 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {teacher.totalEvents} оқиға
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {teacher.latenesses} кешігу
                          </span>
                          <span className="flex items-center gap-1">
                            <UserMinus className="h-3 w-3" /> {teacher.absences} келмеу
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xl font-black ${getScoreColor(teacher.score)}`}>{teacher.score}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teachers' && (
            <TeachersTab
              derivedTeachers={visibleTeachers}
              teacherViewMode={teacherViewMode}
              searchTerm={searchTerm}
              subjectFilter={subjectFilter}
              teacherSort={teacherSort}
              setTeacherViewMode={setTeacherViewMode}
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
              selectedTerm={selectedTerm}
              eventTypeFilter={eventTypeFilter}
              eventsWithTeacherNames={eventsWithTeacherNames}
              setEventSort={setEventSort}
              setSelectedTerm={setSelectedTerm}
              setEventTypeFilter={setEventTypeFilter}
              onAddEvent={() => setIsAddEventModalOpen(true)}
              onDeleteEvent={handleDeleteEvent}
            />
          )}
          {activeTab === 'analytics' && <AnalyticsTab barData={barData} colors={COLORS} dynamicLineData={dynamicLineData} pieData={pieData} selectedTermLabel={selectedTermLabel} />}
          {activeTab === 'settings' && (
            <SettingsTab
              handleChangePassword={handleChangePassword}
              handleSaveSettings={handleSaveSettings}
              profile={profile}
              setProfile={setProfile}
            />
          )}
        </div>

        <AddTeacherModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddTeacher} />
        <AddEventModal isOpen={isAddEventModalOpen} onClose={() => setIsAddEventModalOpen(false)} onAdd={handleAddEvent} teachers={teachersList} />
      </main>
    </div>
  );
}

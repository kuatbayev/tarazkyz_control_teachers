/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
import { ALL_EVENT_TYPES_LABEL, ALL_SUBJECTS_LABEL, EVENT_TYPES } from '../data/options';
import { AnalyticsTab } from './dashboard/AnalyticsTab';
import { buildDashboardAnalytics } from './dashboard/analytics';
import { DashboardSidebar, DashboardTopBar } from './dashboard/DashboardLayout';
import { EventsTab } from './dashboard/EventsTab';
import { SettingsTab } from './dashboard/SettingsTab';
import { TeachersTab } from './dashboard/TeachersTab';
import { useDashboardData } from './dashboard/useDashboardData';
import { hasSupabaseConfig, supabase } from '../lib/supabase';
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

      const schoolProfileData = {
        school_name: profile.schoolName,
        director_name: profile.name,
        academic_year: profile.academicYear,
        current_term: profile.currentTerm,
        email: profile.email,
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
      alert(`РЎР°Т›С‚Р°Сѓ РєРµР·С–РЅРґРµ Т›Р°С‚Рµ С€С‹Т›С‚С‹: ${error.message}`);
    }
  };

  const handleChangePassword = async (password: string) => {
    if (!hasSupabaseConfig) {
      return {
        success: false,
        message: 'Р›РѕРєР°Р»РґС‹ СЂРµР¶РёРјРґРµ Т›Т±РїРёСЏ СЃУ©Р·РґС– У©Р·РіРµСЂС‚Сѓ Т›РѕР»Р¶РµС‚С–РјСЃС–Р·.',
      };
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      return {
        success: true,
        message: 'ТљТ±РїРёСЏ СЃУ©Р· СЃУ™С‚С‚С– У©Р·РіРµСЂС‚С–Р»РґС–.',
      };
    } catch (error: any) {
      console.error('Error changing password:', error);
      return {
        success: false,
        message: error.message || 'ТљТ±РїРёСЏ СЃУ©Р·РґС– У©Р·РіРµСЂС‚Сѓ РєРµР·С–РЅРґРµ Т›Р°С‚Рµ С€С‹Т›С‚С‹.',
      };
    }
  };

  const { pieData, eventsWithTeacherNames, derivedTeachers, dynamicLineData, barData, schoolKPIs } = buildDashboardAnalytics(teachersList, eventsList);
  const selectedTeacher = derivedTeachers.find((teacher) => teacher.id === selectedTeacherId) ?? null;
  const rankingTeachers = [...derivedTeachers].sort((a, b) => b.score - a.score);
  const topTeachers = rankingTeachers.slice(0, 5);
  const recentEvents = (selectedTeacherId ? eventsWithTeacherNames.filter((event) => event.teacherId === selectedTeacherId) : eventsWithTeacherNames).slice(0, 12);
  const selectedTeacherEvents = selectedTeacherId
    ? eventsWithTeacherNames.filter((event) => event.teacherId === selectedTeacherId)
    : [];
  const selectedTeacherEventCounts = EVENT_TYPES.reduce<Record<string, number>>((acc, type) => {
    acc[type] = selectedTeacherEvents.filter((event) => event.type === type).length;
    return acc;
  }, {});
  const selectedTeacherKPIs = selectedTeacher
    ? [
        { title: 'РћТ›РёТ“Р°Р»Р°СЂ', value: selectedTeacher.totalEvents, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <Calendar className="h-5 w-5" />, color: 'bg-blue-500' },
        { title: 'РЎР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓ', value: selectedTeacherEventCounts['РЎР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓ'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <UserX className="h-5 w-5" />, color: 'bg-red-500' },
        { title: 'РЎР°Р±Р°Т›Т›Р° РєРµС€С–РіСѓ', value: selectedTeacherEventCounts['РЎР°Р±Р°Т›Т›Р° РєРµС€С–РіСѓ'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <Clock className="h-5 w-5" />, color: 'bg-amber-500' },
        { title: 'Р‘РўРЎ РµРјС‚РёС…Р°РЅС‹ РєТЇРЅС– РєРµР»РјРµСѓС–', value: selectedTeacherEventCounts['Р‘РўРЎ РµРјС‚РёС…Р°РЅС‹ РєТЇРЅС– РєРµР»РјРµСѓС–'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-rose-500' },
        { title: 'РљРµС€ РµСЃРєРµСЂС‚Сѓ', value: selectedTeacherEventCounts['РљРµС€ РµСЃРєРµСЂС‚Сѓ'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <BellRing className="h-5 w-5" />, color: 'bg-orange-500' },
        { title: 'Р•СЃРєРµСЂС‚РїРµР№ СЃР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓС–', value: selectedTeacherEventCounts['Р•СЃРєРµСЂС‚РїРµР№ СЃР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓС–'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <UserMinus className="h-5 w-5" />, color: 'bg-fuchsia-600' },
        { title: 'РђСѓС‹СЂС‹Рї Т›Р°Р»СѓС‹', value: selectedTeacherEventCounts['РђСѓС‹СЂС‹Рї Т›Р°Р»СѓС‹'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <Stethoscope className="h-5 w-5" />, color: 'bg-emerald-500' },
        { title: 'РЎРµРјРёРЅР°СЂ / РєРѕРјР°РЅРґРёСЂРѕРІРєР°Т“Р° РєРµС‚СѓС–', value: selectedTeacherEventCounts['РЎРµРјРёРЅР°СЂ / РєРѕРјР°РЅРґРёСЂРѕРІРєР°Т“Р° РєРµС‚СѓС–'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <Briefcase className="h-5 w-5" />, color: 'bg-cyan-600' },
        { title: 'РўУ™СЂС‚С–Рї РєУ©СЂСЃРµС‚РєС–С€С–', value: `${selectedTeacher.score}%`, trend: `Р РµР№С‚РёРЅРіС‚Рµ #${selectedTeacher.rank}`, trendType: 'neutral' as const, icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-indigo-600' },
                      { title: 'Р‘РўРЎ РµРјС‚РёС…Р°РЅС‹ РєТЇРЅС– РєРµР»РјРµСѓС–', value: selectedTeacherEventCounts['Р‘РўРЎ РµРјС‚РёС…Р°РЅС‹ РєТЇРЅС– РєРµР»РјРµСѓС–'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-rose-500' },
                      { title: 'РљРµС€ РµСЃРєРµСЂС‚Сѓ', value: selectedTeacherEventCounts['РљРµС€ РµСЃРєРµСЂС‚Сѓ'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <BellRing className="h-5 w-5" />, color: 'bg-orange-500' },
                      { title: 'Р•СЃРєРµСЂС‚РїРµР№ СЃР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓС–', value: selectedTeacherEventCounts['Р•СЃРєРµСЂС‚РїРµР№ СЃР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓС–'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <UserMinus className="h-5 w-5" />, color: 'bg-fuchsia-600' },
                      { title: 'РђСѓС‹СЂС‹Рї Т›Р°Р»СѓС‹', value: selectedTeacherEventCounts['РђСѓС‹СЂС‹Рї Т›Р°Р»СѓС‹'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <Stethoscope className="h-5 w-5" />, color: 'bg-emerald-500' },
                      { title: 'РЎРµРјРёРЅР°СЂ / РєРѕРјР°РЅРґРёСЂРѕРІРєР°Т“Р° РєРµС‚СѓС–', value: selectedTeacherEventCounts['РЎРµРјРёРЅР°СЂ / РєРѕРјР°РЅРґРёСЂРѕРІРєР°Т“Р° РєРµС‚СѓС–'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <Briefcase className="h-5 w-5" />, color: 'bg-cyan-600' },
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
          <p className="font-bold text-slate-500">Р”РµСЂРµРєС‚РµСЂ Р¶ТЇРєС‚РµР»СѓРґРµ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900">
      <AnimatePresence>
        {showSaveToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed right-8 top-24 z-[9999] flex items-center gap-3 rounded-2xl bg-emerald-600 px-6 py-3 text-white shadow-xl">
            <span className="text-sm font-bold">УЁР·РіРµСЂС–СЃС‚РµСЂ СЃУ™С‚С‚С– СЃР°Т›С‚Р°Р»РґС‹!</span>
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
                    <option value="">Р‘Р°СЂР»С‹Т› РјТ±Т“Р°Р»С–РјРґРµСЂ (РјРµРєС‚РµРї С€РѕР»СѓС‹)</option>
                    {derivedTeachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                  <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500">
                    <option>2025-2026 РѕТ›Сѓ Р¶С‹Р»С‹</option>
                    <option>2024-2025 РѕТ›Сѓ Р¶С‹Р»С‹</option>
                  </select>
                  <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Р–Р°Р»РїС‹</option>
                    <option>1 С‚РѕТ›СЃР°РЅ</option>
                    <option>2 С‚РѕТ›СЃР°РЅ</option>
                    <option>3 С‚РѕТ›СЃР°РЅ</option>
                    <option>4 С‚РѕТ›СЃР°РЅ</option>
                  </select>
                </div>
                {selectedTeacherId && (
                  <button onClick={() => setSelectedTeacherId(null)} className="text-sm font-bold text-slate-500 hover:text-slate-800">
                    РЎТЇР·РіС–РЅС– С‚Р°Р·Р°Р»Р°Сѓ
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {(selectedTeacher
                  ? [
                      { title: 'РћТ›РёТ“Р°Р»Р°СЂ', value: selectedTeacher.totalEvents, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <Calendar className="h-5 w-5" />, color: 'bg-blue-500' },
                      { title: 'РљРµР»РјРµСѓ', value: selectedTeacher.absences, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <UserX className="h-5 w-5" />, color: 'bg-red-500' },
                      { title: 'РљРµС€С–РіСѓ', value: selectedTeacher.latenesses, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <Clock className="h-5 w-5" />, color: 'bg-amber-500' },
                      { title: 'РўУ™СЂС‚С–Рї РєУ©СЂСЃРµС‚РєС–С€С–', value: `${selectedTeacher.score}%`, trend: `Р РµР№С‚РёРЅРіС‚Рµ #${selectedTeacher.rank}`, trendType: 'neutral' as const, icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-indigo-600' },
                      { title: 'Р‘РўРЎ РµРјС‚РёС…Р°РЅС‹ РєТЇРЅС– РєРµР»РјРµСѓС–', value: selectedTeacherEventCounts['Р‘РўРЎ РµРјС‚РёС…Р°РЅС‹ РєТЇРЅС– РєРµР»РјРµСѓС–'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-rose-500' },
                      { title: 'РљРµС€ РµСЃРєРµСЂС‚Сѓ', value: selectedTeacherEventCounts['РљРµС€ РµСЃРєРµСЂС‚Сѓ'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <BellRing className="h-5 w-5" />, color: 'bg-orange-500' },
                      { title: 'Р•СЃРєРµСЂС‚РїРµР№ СЃР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓС–', value: selectedTeacherEventCounts['Р•СЃРєРµСЂС‚РїРµР№ СЃР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓС–'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <UserMinus className="h-5 w-5" />, color: 'bg-fuchsia-600' },
                      { title: 'РђСѓС‹СЂС‹Рї Т›Р°Р»СѓС‹', value: selectedTeacherEventCounts['РђСѓС‹СЂС‹Рї Т›Р°Р»СѓС‹'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <Stethoscope className="h-5 w-5" />, color: 'bg-emerald-500' },
                      { title: 'РЎРµРјРёРЅР°СЂ / РєРѕРјР°РЅРґРёСЂРѕРІРєР°Т“Р° РєРµС‚СѓС–', value: selectedTeacherEventCounts['РЎРµРјРёРЅР°СЂ / РєРѕРјР°РЅРґРёСЂРѕРІРєР°Т“Р° РєРµС‚СѓС–'] ?? 0, trend: 'Р–РµРєРµ', trendType: 'neutral' as const, icon: <Briefcase className="h-5 w-5" />, color: 'bg-cyan-600' },
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
                              <p className="text-xs font-bold uppercase text-slate-400">РњРµРєС‚РµРїС‚РµРіС– РѕСЂРЅС‹</p>
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
                          <h3 className="text-lg font-bold text-slate-800">РћТ›РёТ“Р°Р»Р°СЂ РґРёРЅР°РјРёРєР°СЃС‹</h3>
                          <p className="text-sm text-slate-500">РђР№Р»Р°СЂ Р±РѕР№С‹РЅС€Р° РѕТ›РёТ“Р°Р»Р°СЂ СЃР°РЅС‹</p>
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
                      <h3 className="text-lg font-bold text-slate-800">{selectedTeacher ? `РњТ±Т“Р°Р»С–Рј РѕТ›РёТ“Р°Р»Р°СЂС‹: ${selectedTeacher.name}` : 'РЎРѕТЈТ“С‹ РѕТ›РёТ“Р°Р»Р°СЂ'}</h3>
                      <button onClick={() => setActiveTab('events')} className="text-sm font-bold text-blue-600 hover:underline">
                        Р‘Р°СЂР»С‹Т“С‹РЅ РєУ©СЂСѓ
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
                          <tr>
                            <th className="px-6 py-4">РњТ±Т“Р°Р»С–Рј</th>
                            <th className="px-6 py-4">РўТЇСЂС–</th>
                            <th className="px-6 py-4">РљТЇРЅС–</th>
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
                                <button onClick={() => handleDeleteEvent(event.id)} className="rounded-lg p-2 opacity-0 transition-colors hover:bg-rose-50 group-hover:opacity-100" title="УЁС€С–СЂСѓ">
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

                <div className="space-y-8">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 text-lg font-bold text-slate-800">{selectedTeacher ? 'Т®Р·РґС–Рє РјТ±Т“Р°Р»С–РјРґРµСЂ' : 'РњТ±Т“Р°Р»С–РјРґРµСЂ СЂРµР№С‚РёРЅРіС– (РўРѕРї 5)'}</h3>
                    <div className="space-y-4">
                      {topTeachers.map((teacher, index) => (
                        <div key={teacher.id} className="flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-blue-200" onClick={() => setSelectedTeacherId(teacher.id)}>
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-500 shadow-sm">{index + 1}</div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800">{teacher.name}</p>
                            <p className="text-xs text-slate-400">{teacher.subject}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-bold ${getScoreColor(teacher.score)}`}>{teacher.score}%</p>
                            <div className="mt-1 h-1.5 w-20 rounded-full bg-slate-200">
                              <div className={`h-full ${getScoreBg(teacher.score)}`} style={{ width: `${teacher.score}%` }}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {!selectedTeacher && (
                      <button onClick={() => setActiveTab('ranking')} className="mt-6 w-full py-3 text-sm font-bold text-blue-600 hover:underline">
                        РњТ±Т“Р°Р»С–РјРґРµСЂРґС–ТЈ С‚РѕР»С‹Т› СЂРµР№С‚РёРЅРіС–
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ranking' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">РњТ±Т“Р°Р»С–РјРґРµСЂ СЂРµР№С‚РёРЅРіС–</h2>
                <p className="mt-1 text-sm text-slate-500">РўУ™СЂС‚С–Рї Р¶У™РЅРµ Р¶Р°СѓР°РїРєРµСЂС€С–Р»С–Рє РєУ©СЂСЃРµС‚РєС–С€С‚РµСЂС– Р±РѕР№С‹РЅС€Р°</p>
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
                            <Calendar className="h-3 w-3" /> {teacher.totalEvents} РѕТ›РёТ“Р°
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {teacher.latenesses} РєРµС€С–РіСѓ
                          </span>
                          <span className="flex items-center gap-1">
                            <UserMinus className="h-3 w-3" /> {teacher.absences} РєРµР»РјРµСѓ
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
          {activeTab === 'analytics' && <AnalyticsTab barData={barData} colors={COLORS} dynamicLineData={dynamicLineData} pieData={pieData} />}
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

import { useEffect, useState } from 'react';
import { DEFAULT_EVENT_TYPE, normalizeTermValue } from '../../data/options';
import { initialEvents, localMockEvents, localMockProfile, localMockTeachers, teachers } from '../../data/mockData';
import { hasSupabaseConfig, isLocalAuthBypassEnabled, supabase } from '../../lib/supabase';
import type { Event, Profile, Teacher } from '../../types';

const defaultProfile: Profile = {
  name: 'РђСЃС…Р°С‚ Р‘.',
  email: 'admin@bil.edu.kz',
  schoolName: 'Turkistan girls BIL',
  academicYear: '2025-2026 РѕТ›Сѓ Р¶С‹Р»С‹',
  currentTerm: '3 С‚РѕТ›СЃР°РЅ',
  position: 'РњРµРєС‚РµРї РґРёСЂРµРєС‚РѕСЂС‹',
  avatar: null,
};

type UseDashboardDataArgs = {
  selectedTeacherId: string | null;
  clearSelectedTeacher: () => void;
};

export function useDashboardData({ selectedTeacherId, clearSelectedTeacher }: UseDashboardDataArgs) {
  const [teachersList, setTeachersList] = useState<Teacher[]>(teachers);
  const [eventsList, setEventsList] = useState<Event[]>(initialEvents);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoadingData(true);

    if (!hasSupabaseConfig) {
      if (isLocalAuthBypassEnabled) {
        setTeachersList(localMockTeachers);
        setEventsList(localMockEvents);
        setProfile({
          ...localMockProfile,
          currentTerm: normalizeTermValue(localMockProfile.currentTerm),
        });
      }

      setIsLoadingData(false);
      return;
    }

    try {
      const [{ data: authData }, teachersRes, eventsRes, profileRes] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('teachers').select('*'),
        supabase.from('events').select('*').order('date', { ascending: false }),
        supabase.from('school_profile').select('*').limit(1).single(),
      ]);

      const userId = authData.user?.id;
      const adminProfileRes = userId
        ? await supabase.from('admin_profiles').select('*').eq('id', userId).maybeSingle()
        : { data: null, error: null };

      if (teachersRes.data) {
        setTeachersList(
          teachersRes.data.map((teacher) => ({
            id: teacher.id,
            name: teacher.name,
            subject: teacher.subject,
            score: 100,
            rank: 0,
            totalEvents: 0,
            absences: 0,
            latenesses: 0,
            sickDays: 0,
            lostLessons: 0,
            substitutions: 0,
            hasDocuments: teacher.has_documents,
          })),
        );
      }

      if (eventsRes.data) {
        setEventsList(
          eventsRes.data.map((event) => ({
            id: event.id,
            teacherId: event.teacher_id,
            teacherName: '',
            type: event.type,
            date: event.date,
            reason: event.reason || '',
          })),
        );
      }

      if (profileRes.data) {
        setProfile({
          name: adminProfileRes.data?.full_name || profileRes.data.director_name,
          email: profileRes.data.email || authData.user?.email || '',
          schoolName: profileRes.data.school_name,
          academicYear: profileRes.data.academic_year,
          currentTerm: normalizeTermValue(profileRes.data.current_term || 'Жалпы'),
          position: adminProfileRes.data?.role || 'РњРµРєС‚РµРї РґРёСЂРµРєС‚РѕСЂС‹',
          avatar: profileRes.data.avatar_url,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddTeacher = async (newTeacher: Partial<Teacher>) => {
    if (!hasSupabaseConfig) {
      const localTeacher: Teacher = {
        id: `local-teacher-${Date.now()}`,
        name: newTeacher.name || 'Р–Р°ТЈР° РјТ±Т“Р°Р»С–Рј',
        subject: newTeacher.subject || 'РџУ™РЅ',
        score: 100,
        rank: teachersList.length + 1,
        totalEvents: 0,
        absences: 0,
        latenesses: 0,
        sickDays: 0,
        lostLessons: 0,
        substitutions: 0,
        hasDocuments: true,
      };

      setTeachersList([...teachersList, localTeacher]);
      return true;
    }

    const teacherData = {
      name: newTeacher.name || 'Р–Р°ТЈР° РјТ±Т“Р°Р»С–Рј',
      subject: newTeacher.subject || 'РџУ™РЅ',
      has_documents: true,
    };

    try {
      const { data, error } = await supabase.from('teachers').insert([teacherData]).select();
      if (error) throw error;

      if (data && data.length > 0) {
        const teacher = data[0];
        setTeachersList([
          ...teachersList,
          {
            id: teacher.id,
            name: teacher.name,
            subject: teacher.subject,
            score: 100,
            rank: teachersList.length + 1,
            totalEvents: 0,
            absences: 0,
            latenesses: 0,
            sickDays: 0,
            lostLessons: 0,
            substitutions: 0,
            hasDocuments: teacher.has_documents,
          },
        ]);
      }

      return true;
    } catch (error: any) {
      console.error('Error adding teacher:', error);
      alert(`РњТ±Т“Р°Р»С–РјРґС– Т›РѕСЃСѓ РєРµР·С–РЅРґРµ Т›Р°С‚Рµ С€С‹Т›С‚С‹: ${error.message}`);
      return false;
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    const confirmedTeacherDelete = window.confirm('РћСЃС‹ РјТ±Т“Р°Р»С–РјРґС– С€С‹РЅС‹РјРµРЅ У©С€С–СЂРіС–ТЈС–Р· РєРµР»Рµ РјРµ?');
    if (!confirmedTeacherDelete) return;

    if (!hasSupabaseConfig) {
      setTeachersList(teachersList.filter((teacher) => teacher.id !== id));
      setEventsList(eventsList.filter((event) => event.teacherId !== id));
      if (selectedTeacherId === id) {
        clearSelectedTeacher();
      }
      return;
    }

    try {
      const { error } = await supabase.from('teachers').delete().eq('id', id);
      if (error) throw error;

      setTeachersList(teachersList.filter((teacher) => teacher.id !== id));
      setEventsList(eventsList.filter((event) => event.teacherId !== id));
      if (selectedTeacherId === id) {
        clearSelectedTeacher();
      }
    } catch (error: any) {
      console.error('Error deleting teacher:', error);
      alert(`РњТ±Т“Р°Р»С–РјРґС– У©С€С–СЂСѓ РєРµР·С–РЅРґРµ Т›Р°С‚Рµ С€С‹Т›С‚С‹: ${error.message}`);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const confirmedEventDelete = window.confirm('РћСЃС‹ РѕТ›РёТ“Р°РЅС‹ С€С‹РЅС‹РјРµРЅ У©С€С–СЂРіС–ТЈС–Р· РєРµР»Рµ РјРµ?');
    if (!confirmedEventDelete) return;

    if (!hasSupabaseConfig) {
      setEventsList(eventsList.filter((event) => event.id !== id));
      return;
    }

    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;

      setEventsList(eventsList.filter((event) => event.id !== id));
    } catch (error: any) {
      console.error('Error deleting event:', error);
      alert(`РћТ›РёТ“Р°РЅС‹ У©С€С–СЂСѓ РєРµР·С–РЅРґРµ Т›Р°С‚Рµ С€С‹Т›С‚С‹: ${error.message}`);
    }
  };

  const handleAddEvent = async (newEvent: Partial<Event>) => {
    if (!hasSupabaseConfig) {
      const teacher = teachersList.find((item) => item.id === newEvent.teacherId);
      const localEvent: Event = {
        id: `local-event-${Date.now()}`,
        teacherId: newEvent.teacherId || '',
        teacherName: teacher?.name || 'Р‘РµР»РіС–СЃС–Р· РјТ±Т“Р°Р»С–Рј',
        type: newEvent.type || DEFAULT_EVENT_TYPE,
        date: newEvent.date || new Date().toISOString().split('T')[0],
        reason: newEvent.reason || '',
      };

      setEventsList([localEvent, ...eventsList]);
      return true;
    }

    const eventData = {
      teacher_id: newEvent.teacherId || '',
      type: newEvent.type || DEFAULT_EVENT_TYPE,
      date: newEvent.date || new Date().toISOString().split('T')[0],
      reason: newEvent.reason || '',
    };

    try {
      const { data, error } = await supabase.from('events').insert([eventData]).select();
      if (error) throw error;

      if (data && data.length > 0) {
        const event = data[0];
        const teacher = teachersList.find((item) => item.id === event.teacher_id);
        setEventsList([
          {
            id: event.id,
            teacherId: event.teacher_id,
            teacherName: teacher?.name || newEvent.teacherName || 'Р‘РµР»РіС–СЃС–Р·',
            type: event.type,
            date: event.date,
            reason: event.reason || '',
          },
          ...eventsList,
        ]);
      }

      return true;
    } catch (error: any) {
      console.error('Error adding event:', error);
      alert(`РћТ›РёТ“Р°РЅС‹ Т›РѕСЃСѓ РєРµР·С–РЅРґРµ Т›Р°С‚Рµ С€С‹Т›С‚С‹: ${error.message}`);
      return false;
    }
  };

  return {
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
  };
}


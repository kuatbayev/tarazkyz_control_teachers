import { useEffect, useState } from 'react';
import { DEFAULT_EVENT_TYPE } from '../../data/options';
import { initialEvents, localMockEvents, localMockProfile, localMockTeachers, teachers } from '../../data/mockData';
import { hasSupabaseConfig, isLocalAuthBypassEnabled, supabase } from '../../lib/supabase';
import type { Event, Profile, Teacher } from '../../types';

const defaultProfile: Profile = {
  name: 'Асхат Б.',
  email: 'admin@bil.edu.kz',
  phone: '+7 (707) 123-45-67',
  schoolName: 'Turkistan girls BIL',
  academicYear: '2025-2026 оқу жылы',
  currentTerm: '3 тоқсан',
  position: 'Мектеп директоры',
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      if (!hasSupabaseConfig) {
        if (isLocalAuthBypassEnabled) {
          setTeachersList(localMockTeachers);
          setEventsList(localMockEvents);
          setProfile(localMockProfile);
        }
        setIsLoadingData(false);
        return;
      }

      try {
        const [teachersRes, eventsRes, profileRes] = await Promise.all([
          supabase.from('teachers').select('*'),
          supabase.from('events').select('*').order('date', { ascending: false }),
          supabase.from('school_profile').select('*').limit(1).single(),
        ]);

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
            name: profileRes.data.director_name,
            email: profileRes.data.email || '',
            phone: profileRes.data.phone || '',
            schoolName: profileRes.data.school_name,
            academicYear: profileRes.data.academic_year,
            currentTerm: profileRes.data.current_term,
            position: 'Мектеп директоры',
            avatar: profileRes.data.avatar_url,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleAddTeacher = async (newTeacher: Partial<Teacher>) => {
    if (!hasSupabaseConfig) {
      const localTeacher: Teacher = {
        id: `local-teacher-${Date.now()}`,
        name: newTeacher.name || 'New teacher',
        subject: newTeacher.subject || 'Subject',
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
      name: newTeacher.name || 'Жаңа мұғалім',
      subject: newTeacher.subject || 'Пән',
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
      alert(`Мұғалімді қосу кезінде қате шықты: ${error.message}`);
      return false;
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    const confirmedTeacherDelete = !hasSupabaseConfig ? window.confirm('Delete this teacher?') : true;
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
      alert(`Мұғалімді өшіру кезінде қате шықты: ${error.message}`);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const confirmedEventDelete = !hasSupabaseConfig ? window.confirm('Delete this event?') : true;
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
      alert(`Оқиғаны өшіру кезінде қате шықты: ${error.message}`);
    }
  };

  const handleAddEvent = async (newEvent: Partial<Event>) => {
    if (!hasSupabaseConfig) {
      const teacher = teachersList.find((item) => item.id === newEvent.teacherId);
      const localEvent: Event = {
        id: `local-event-${Date.now()}`,
        teacherId: newEvent.teacherId || '',
        teacherName: teacher?.name || 'Unknown teacher',
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
            teacherName: teacher?.name || newEvent.teacherName || 'Белгісіз',
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
      alert(`Оқиғаны қосу кезінде қате шықты: ${error.message}`);
      return false;
    }
  };

  return {
    teachersList,
    eventsList,
    profile,
    setProfile,
    isLoadingData,
    handleAddTeacher,
    handleDeleteTeacher,
    handleDeleteEvent,
    handleAddEvent,
  };
}

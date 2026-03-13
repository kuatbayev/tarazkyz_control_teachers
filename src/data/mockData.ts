import type { Event, Profile, Teacher } from '../types';

export const teachers: Teacher[] = [];

export const localMockTeachers: Teacher[] = [
  {
    id: 'local-teacher-1',
    name: 'Ainur Sarsen',
    subject: 'Mathematics',
    score: 96,
    rank: 1,
    totalEvents: 1,
    absences: 0,
    latenesses: 1,
    sickDays: 0,
    lostLessons: 0,
    substitutions: 0,
    hasDocuments: true,
  },
  {
    id: 'local-teacher-2',
    name: 'Dias Tolegen',
    subject: 'Physics',
    score: 89,
    rank: 2,
    totalEvents: 2,
    absences: 1,
    latenesses: 0,
    sickDays: 0,
    lostLessons: 1,
    substitutions: 0,
    hasDocuments: true,
  },
];

export const localMockEvents: Event[] = [
  {
    id: 'local-event-1',
    teacherId: 'local-teacher-1',
    teacherName: 'Ainur Sarsen',
    type: 'Сабаққа кешігу',
    date: '2026-03-10',
    reason: 'Morning traffic',
  },
  {
    id: 'local-event-2',
    teacherId: 'local-teacher-2',
    teacherName: 'Dias Tolegen',
    type: 'Сабаққа келмеу',
    date: '2026-03-08',
    reason: 'Medical leave',
  },
];

export const localMockProfile: Profile = {
  name: 'Local Admin',
  email: 'admin@local.test',
  phone: '+7 (700) 000-00-00',
  schoolName: 'Turkistan girls BIL',
  academicYear: '2025-2026',
  currentTerm: '3 term',
  position: 'Local development mode',
  avatar: null,
};

export const COLORS = ['#3B82F6', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6', '#EC4899', '#64748B'];

export const initialEvents: Event[] = [];

import type React from 'react';

export type Page = 'landing' | 'dashboard';

export interface Teacher {
  id: string;
  name: string;
  subject: string;
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

export interface KPI {
  title: string;
  value: string | number;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

export interface Event {
  id: string;
  teacherId: string;
  teacherName: string;
  type: string;
  date: string;
  reason: string;
  isCritical?: boolean;
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  schoolName: string;
  academicYear: string;
  currentTerm: string;
  position: string;
  avatar: string | null;
}

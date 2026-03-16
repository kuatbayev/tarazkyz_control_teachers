import React from 'react';
import { AlertTriangle, Calendar, Clock, Star, Stethoscope, UserMinus } from 'lucide-react';
import { DISPLAY_MONTHS, EVENT_TYPES, MONTH_NAMES } from '../../data/options';
import type { Event, KPI, Teacher } from '../../types';

export function buildDashboardAnalytics(teachersList: Teacher[], eventsList: Event[]) {
  const pieData = EVENT_TYPES.map((type) => {
    const count = eventsList.filter((event) => event.type === type).length;
    return { name: type, value: count };
  }).filter((item) => item.value > 0);

  const eventsWithTeacherNames = eventsList.map((event) => {
    const teacher = teachersList.find((item) => item.id === event.teacherId);
    return { ...event, teacherName: teacher?.name || event.teacherName || 'Белгісіз' };
  });

  const derivedTeachers = teachersList
    .map((teacher) => {
      const teacherEvents = eventsWithTeacherNames.filter((event) => event.teacherId === teacher.id);
      let score = 100;
      let absences = 0;
      let latenesses = 0;
      let sickDays = 0;
      let lostLessons = 0;

      teacherEvents.forEach((event) => {
        switch (event.type) {
          case 'Сабаққа келмеді':
            score -= 5;
            absences += 1;
            lostLessons += 1;
            break;
          case 'Сабаққа кешікті':
            score -= 2;
            latenesses += 1;
            break;
          case 'БТС емтиханына келмеді':
            score -= 5;
            absences += 1;
            lostLessons += 1;
            break;
          case 'PET/KET емтиханына келмеді':
            score -= 5;
            absences += 1;
            lostLessons += 1;
            break;
          case 'Ауырып қалуы':
            score -= 2;
            sickDays += 1;
            break;
          case 'Сұранды':
            score -= 1;
            break;
          case 'Семинар / командировкаға кетуі':
            break;
        }
      });

      return { ...teacher, score: Math.max(0, score), totalEvents: teacherEvents.length, absences, latenesses, sickDays, lostLessons: teacher.lostLessons || lostLessons };
    })
    .sort((a, b) => b.score - a.score)
    .map((teacher, index) => ({ ...teacher, rank: index + 1 }));

  const dynamicLineData = DISPLAY_MONTHS.map((monthName) => {
    const monthIndex = MONTH_NAMES.indexOf(monthName);
    const count = eventsList.filter((event) => {
      const parts = event.date.split('-');
      if (parts.length !== 3) return false;
      return parseInt(parts[1], 10) - 1 === monthIndex;
    }).length;
    return { name: monthName, events: count };
  });

  const barData = derivedTeachers
    .map((teacher) => {
      const nameParts = teacher.name.split(' ');
      const shortName = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[1][0]}.` : teacher.name;
      return { name: shortName, events: teacher.totalEvents };
    })
    .sort((a, b) => b.events - a.events)
    .slice(0, 5);

  const schoolKPIs: KPI[] = [
    { title: 'Барлық оқиғалар', value: eventsList.length, trend: eventsList.length > 0 ? '+12%' : '0%', trendType: 'up', icon: <Calendar className="h-5 w-5" />, color: 'bg-blue-500' },
    { title: 'Кешігулер', value: eventsList.filter((event) => event.type === 'Сабаққа кешікті').length, trend: eventsList.length > 0 ? '-5%' : '0%', trendType: 'down', icon: <Clock className="h-5 w-5" />, color: 'bg-amber-500' },
    { title: 'Сабаққа келмеді', value: derivedTeachers.reduce((acc, teacher) => acc + teacher.lostLessons, 0), trend: eventsList.length > 0 ? '+2%' : '0%', trendType: 'up', icon: <UserMinus className="h-5 w-5" />, color: 'bg-red-500' },
    { title: 'Ауырған күндер', value: derivedTeachers.reduce((acc, teacher) => acc + teacher.sickDays, 0), trend: eventsList.length > 0 ? '+8%' : '0%', trendType: 'up', icon: <Stethoscope className="h-5 w-5" />, color: 'bg-emerald-500' },
    { title: 'Орташа рейтинг', value: derivedTeachers.length > 0 ? `${Math.round(derivedTeachers.reduce((acc, teacher) => acc + teacher.score, 0) / derivedTeachers.length)}%` : '0%', trend: 'Жалпы', trendType: 'neutral', icon: <Star className="h-5 w-5" />, color: 'bg-indigo-500' },
    { title: 'Қауіпті аймақтағы мұғалімдер', value: derivedTeachers.filter((teacher) => teacher.score < 75).length, trend: 'Мониторинг', trendType: 'neutral', icon: <AlertTriangle className="h-5 w-5" />, color: 'bg-rose-600' },
  ];

  return { pieData, eventsWithTeacherNames, derivedTeachers, dynamicLineData, barData, schoolKPIs };
}

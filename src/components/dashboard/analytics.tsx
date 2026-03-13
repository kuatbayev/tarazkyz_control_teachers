import React from 'react';
import { AlertTriangle, Calendar, Clock, Star, Stethoscope, UserMinus } from 'lucide-react';
import type { Event, KPI, Teacher } from '../../types';

const eventTypes = [
  'РЎР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓ',
  'РЎР°Р±Р°Т›Т›Р° РєРµС€С–РіСѓ',
  'Р‘РўРЎ РµРјС‚РёС…Р°РЅС‹ РєТЇРЅС– РєРµР»РјРµСѓС–',
  'РљРµС€ РµСЃРєРµСЂС‚Сѓ',
  'Р•СЃРєРµСЂС‚РїРµР№ СЃР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓС–',
  'РђСѓС‹СЂС‹Рї Т›Р°Р»СѓС‹',
  'РЎРµРјРёРЅР°СЂ / РєРѕРјР°РЅРґРёСЂРѕРІРєР°Т“Р° РєРµС‚СѓС–',
];

const monthNames = ['ТљР°ТЈ', 'РђТ›Рї', 'РќР°Сѓ', 'РЎУ™Сѓ', 'РњР°Рј', 'РњР°Сѓ', 'РЁС–Р»', 'РўР°Рј', 'ТљС‹СЂ', 'ТљР°Р·', 'ТљР°СЂ', 'Р–РµР»'];
const displayMonths = ['ТљС‹СЂ', 'ТљР°Р·', 'ТљР°СЂ', 'Р–РµР»', 'ТљР°ТЈ', 'РђТ›Рї', 'РќР°Сѓ'];

export function buildDashboardAnalytics(teachersList: Teacher[], eventsList: Event[]) {
  const pieData = eventTypes
    .map((type) => {
      const count = eventsList.filter((event) => event.type === type).length;
      return { name: type, value: count };
    })
    .filter((item) => item.value > 0);

  const eventsWithTeacherNames = eventsList.map((event) => {
    const teacher = teachersList.find((item) => item.id === event.teacherId);

    return {
      ...event,
      teacherName: teacher?.name || event.teacherName || 'Р‘РµР»РіС–СЃС–Р·',
    };
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
          case 'РЎР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓ':
            score -= 5;
            absences += 1;
            lostLessons += 1;
            break;
          case 'РЎР°Р±Р°Т›Т›Р° РєРµС€С–РіСѓ':
            score -= 2;
            latenesses += 1;
            break;
          case 'Р‘РўРЎ РµРјС‚РёС…Р°РЅС‹ РєТЇРЅС– РєРµР»РјРµСѓС–':
            score -= 15;
            absences += 1;
            lostLessons += 1;
            break;
          case 'РљРµС€ РµСЃРєРµСЂС‚Сѓ':
            score -= 3;
            break;
          case 'Р•СЃРєРµСЂС‚РїРµР№ СЃР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓС–':
            score -= 10;
            absences += 1;
            lostLessons += 1;
            break;
          case 'РђСѓС‹СЂС‹Рї Т›Р°Р»СѓС‹':
            score -= 1;
            sickDays += 1;
            break;
          case 'РЎРµРјРёРЅР°СЂ / РєРѕРјР°РЅРґРёСЂРѕРІРєР°Т“Р° РєРµС‚СѓС–':
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
        lostLessons: teacher.lostLessons || lostLessons,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((teacher, index) => ({ ...teacher, rank: index + 1 }));

  const dynamicLineData = displayMonths.map((monthName) => {
    const monthIndex = monthNames.indexOf(monthName);
    const count = eventsList.filter((event) => {
      const parts = event.date.split('-');
      if (parts.length === 3) {
        const month = parseInt(parts[1], 10) - 1;
        return month === monthIndex;
      }
      return false;
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
    { title: 'Р‘Р°СЂР»С‹Т› РѕТ›РёТ“Р°Р»Р°СЂ', value: eventsList.length, trend: eventsList.length > 0 ? '+12%' : '0%', trendType: 'up', icon: <Calendar className="w-5 h-5" />, color: 'bg-blue-500' },
    { title: 'РљРµС€С–РіСѓР»РµСЂ', value: eventsList.filter((event) => event.type === 'РЎР°Р±Р°Т›Т›Р° РєРµС€С–РіСѓ').length, trend: eventsList.length > 0 ? '-5%' : '0%', trendType: 'down', icon: <Clock className="w-5 h-5" />, color: 'bg-amber-500' },
    { title: 'УЁС‚С–Р»РјРµРіРµРЅ СЃР°Р±Р°Т›С‚Р°СЂ', value: derivedTeachers.reduce((acc, teacher) => acc + teacher.lostLessons, 0), trend: eventsList.length > 0 ? '+2%' : '0%', trendType: 'up', icon: <UserMinus className="w-5 h-5" />, color: 'bg-red-500' },
    { title: 'РђСѓС‹СЂТ“Р°РЅ РєТЇРЅРґРµСЂ', value: derivedTeachers.reduce((acc, teacher) => acc + teacher.sickDays, 0), trend: eventsList.length > 0 ? '+8%' : '0%', trendType: 'up', icon: <Stethoscope className="w-5 h-5" />, color: 'bg-emerald-500' },
    { title: 'РћСЂС‚Р°С€Р° СЂРµР№С‚РёРЅРі', value: derivedTeachers.length > 0 ? `${Math.round(derivedTeachers.reduce((acc, teacher) => acc + teacher.score, 0) / derivedTeachers.length)}%` : '0%', trend: 'Р–Р°Р»РїС‹', trendType: 'neutral', icon: <Star className="w-5 h-5" />, color: 'bg-indigo-500' },
    { title: 'ТљР°СѓС–РїС‚С– Р°Р№РјР°Т›С‚Р°Т“С‹ РјТ±Т“Р°Р»С–РјРґРµСЂ', value: derivedTeachers.filter((teacher) => teacher.score < 75).length, trend: 'РўТ±СЂР°Т›С‚С‹', trendType: 'neutral', icon: <AlertTriangle className="w-5 h-5" />, color: 'bg-rose-600' },
  ];

  return {
    pieData,
    eventsWithTeacherNames,
    derivedTeachers,
    dynamicLineData,
    barData,
    schoolKPIs,
  };
}

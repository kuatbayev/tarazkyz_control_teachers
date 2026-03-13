import React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Search, Trash2 } from 'lucide-react';
import { ALL_SUBJECTS_LABEL, SUBJECT_OPTIONS } from '../../data/options';
import type { Teacher } from '../../types';

type TeacherSort = { key: keyof Teacher; direction: 'asc' | 'desc' };

type TeachersTabProps = {
  derivedTeachers: Teacher[];
  searchTerm: string;
  subjectFilter: string;
  teacherSort: TeacherSort;
  setSearchTerm: (value: string) => void;
  setSubjectFilter: (value: string) => void;
  setTeacherSort: (value: TeacherSort) => void;
  getScoreBg: (score: number) => string;
  getScoreColor: (score: number) => string;
  onAddTeacher: () => void;
  onDeleteTeacher: (id: string) => void;
  onOpenTeacherProfile: (id: string) => void;
};

export function TeachersTab({
  derivedTeachers,
  searchTerm,
  subjectFilter,
  teacherSort,
  setSearchTerm,
  setSubjectFilter,
  setTeacherSort,
  getScoreBg,
  getScoreColor,
  onAddTeacher,
  onDeleteTeacher,
  onOpenTeacherProfile,
}: TeachersTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Мұғалімдер тізімі</h2>
        <button onClick={onAddTeacher} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500">
          + Мұғалім қосу
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-4 border-b border-slate-100 p-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Аты немесе пән бойынша іздеу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border-none bg-slate-50 py-2.5 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="rounded-xl border-none bg-slate-50 px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={ALL_SUBJECTS_LABEL}>{ALL_SUBJECTS_LABEL}</option>
            {SUBJECT_OPTIONS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th
                  className="cursor-pointer px-6 py-4 transition-colors hover:bg-slate-100"
                  onClick={() =>
                    setTeacherSort({
                      key: 'name',
                      direction: teacherSort.key === 'name' && teacherSort.direction === 'asc' ? 'desc' : 'asc',
                    })
                  }
                >
                  <div className="flex items-center gap-2">
                    Мұғалім
                    {teacherSort.key === 'name' ? (
                      teacherSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-30" />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-4 transition-colors hover:bg-slate-100"
                  onClick={() =>
                    setTeacherSort({
                      key: 'subject',
                      direction: teacherSort.key === 'subject' && teacherSort.direction === 'asc' ? 'desc' : 'asc',
                    })
                  }
                >
                  <div className="flex items-center gap-2">
                    Пән
                    {teacherSort.key === 'subject' ? (
                      teacherSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-30" />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-4 text-center transition-colors hover:bg-slate-100"
                  onClick={() =>
                    setTeacherSort({
                      key: 'score',
                      direction: teacherSort.key === 'score' && teacherSort.direction === 'desc' ? 'asc' : 'desc',
                    })
                  }
                >
                  <div className="flex items-center justify-center gap-2">
                    Рейтинг
                    {teacherSort.key === 'score' ? (
                      teacherSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-30" />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-4 text-center transition-colors hover:bg-slate-100"
                  onClick={() =>
                    setTeacherSort({
                      key: 'rank',
                      direction: teacherSort.key === 'rank' && teacherSort.direction === 'asc' ? 'desc' : 'asc',
                    })
                  }
                >
                  <div className="flex items-center justify-center gap-2">
                    Орын
                    {teacherSort.key === 'rank' ? (
                      teacherSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-30" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {derivedTeachers
                .filter((teacher) => {
                  const matchesSearch =
                    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesSubject = subjectFilter === ALL_SUBJECTS_LABEL || teacher.subject === subjectFilter;
                  return matchesSearch && matchesSubject;
                })
                .sort((a, b) => {
                  const valA = a[teacherSort.key];
                  const valB = b[teacherSort.key];
                  if (typeof valA === 'string' && typeof valB === 'string') {
                    return teacherSort.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                  }
                  return teacherSort.direction === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
                })
                .map((teacher) => (
                  <tr key={teacher.id} className="group transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                          {teacher.name
                            .split(' ')
                            .map((part) => part[0])
                            .join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{teacher.name}</p>
                          <p className="text-xs text-slate-400">ID: {teacher.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-600">{teacher.subject}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <span className={`text-sm font-bold ${getScoreColor(teacher.score)}`}>{teacher.score}%</span>
                        <div className="mt-1 h-1 w-16 rounded-full bg-slate-100">
                          <div className={`h-full ${getScoreBg(teacher.score)}`} style={{ width: `${teacher.score}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-slate-700">#{teacher.rank}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenTeacherProfile(teacher.id)}
                          className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-blue-600 hover:text-white"
                        >
                          Профиль
                        </button>
                        <button
                          onClick={() => onDeleteTeacher(teacher.id)}
                          className="rounded-xl bg-slate-100 p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                          title="Өшіру"
                        >
                          <Trash2 className="h-4 w-4" />
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
  );
}

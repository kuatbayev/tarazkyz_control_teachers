import React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Search, Trash2 } from 'lucide-react';
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
        <h2 className="text-2xl font-bold text-slate-800">РњТ±Т“Р°Р»С–РјРґРµСЂ С‚С–Р·С–РјС–</h2>
        <button
          onClick={onAddTeacher}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all"
        >
          + РњТ±Т“Р°Р»С–Рј Т›РѕСЃСѓ
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="РђР–Рў РЅРµРјРµСЃРµ РїУ™РЅ Р±РѕР№С‹РЅС€Р° С–Р·РґРµСѓ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option>Р‘Р°СЂР»С‹Т› РїУ™РЅРґРµСЂ</option>
            <option>РњР°С‚РµРјР°С‚РёРєР°</option>
            <option>Р¤РёР·РёРєР°</option>
            <option>РўР°СЂРёС…</option>
            <option>РђТ“С‹Р»С€С‹РЅ С‚С–Р»С–</option>
            <option>Р‘РёРѕР»РѕРіРёСЏ</option>
            <option>РҐРёРјРёСЏ</option>
            <option>Р“РµРѕРіСЂР°С„РёСЏ</option>
            <option>РРЅС„РѕСЂРјР°С‚РёРєР°</option>
            <option>РљУ©СЂРєРµРј РµТЈР±РµРє</option>
            <option>Р”РѕРјР±С‹СЂР°</option>
            <option>Р”РµРЅРµС€С‹РЅС‹Т›С‚С‹СЂСѓ</option>
            <option>Р”ТЇРЅРёРµР¶ТЇР·С– С‚Р°СЂРёС…С‹</option>
            <option>РќР’Рџ</option>
            <option>ТљР°Р·Р°Т› С‚С–Р»С–</option>
            <option>РћСЂС‹СЃ С‚С–Р»С–</option>
            <option>РўТЇСЂС–Рє С‚С–Р»С–</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() =>
                    setTeacherSort({
                      key: 'name',
                      direction: teacherSort.key === 'name' && teacherSort.direction === 'asc' ? 'desc' : 'asc',
                    })
                  }
                >
                  <div className="flex items-center gap-2">
                    РњТ±Т“Р°Р»С–Рј
                    {teacherSort.key === 'name' ? (
                      teacherSort.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-30" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() =>
                    setTeacherSort({
                      key: 'subject',
                      direction: teacherSort.key === 'subject' && teacherSort.direction === 'asc' ? 'desc' : 'asc',
                    })
                  }
                >
                  <div className="flex items-center gap-2">
                    РџУ™РЅ
                    {teacherSort.key === 'subject' ? (
                      teacherSort.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-30" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-center cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() =>
                    setTeacherSort({
                      key: 'score',
                      direction: teacherSort.key === 'score' && teacherSort.direction === 'desc' ? 'asc' : 'desc',
                    })
                  }
                >
                  <div className="flex items-center justify-center gap-2">
                    Score
                    {teacherSort.key === 'score' ? (
                      teacherSort.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-30" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-center cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() =>
                    setTeacherSort({
                      key: 'rank',
                      direction: teacherSort.key === 'rank' && teacherSort.direction === 'asc' ? 'desc' : 'asc',
                    })
                  }
                >
                  <div className="flex items-center justify-center gap-2">
                    РћСЂРЅС‹
                    {teacherSort.key === 'rank' ? (
                      teacherSort.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-30" />
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
                  const matchesSubject = subjectFilter === 'Р‘Р°СЂР»С‹Т› РїУ™РЅРґРµСЂ' || teacher.subject === subjectFilter;
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
                  <tr key={teacher.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {teacher.name.split(' ').map((part) => part[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{teacher.name}</p>
                          <p className="text-xs text-slate-400">ID: {teacher.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 font-medium">{teacher.subject}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <span className={`text-sm font-bold ${getScoreColor(teacher.score)}`}>{teacher.score}%</span>
                        <div className="w-16 h-1 bg-slate-100 rounded-full mt-1">
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
                          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                        >
                          РџСЂРѕС„РёР»СЊ
                        </button>
                        <button
                          onClick={() => onDeleteTeacher(teacher.id)}
                          className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all"
                          title="УЁС€С–СЂСѓ"
                        >
                          <Trash2 className="w-4 h-4" />
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

import React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Trash2 } from 'lucide-react';
import type { Event } from '../../types';

type EventSort = { key: keyof Event; direction: 'asc' | 'desc' };

type EventsTabProps = {
  eventSort: EventSort;
  eventTypeFilter: string;
  eventsWithTeacherNames: Event[];
  setEventSort: (value: EventSort) => void;
  setEventTypeFilter: (value: string) => void;
  onAddEvent: () => void;
  onDeleteEvent: (id: string) => void;
};

export function EventsTab({
  eventSort,
  eventTypeFilter,
  eventsWithTeacherNames,
  setEventSort,
  setEventTypeFilter,
  onAddEvent,
  onDeleteEvent,
}: EventsTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Р‘Р°СЂР»С‹Т› РѕТ›РёТ“Р°Р»Р°СЂ</h2>
        <div className="flex gap-3">
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="bg-white border border-slate-200 px-4 py-2 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option>Р‘Р°СЂР»С‹Т› С‚ТЇСЂР»РµСЂС–</option>
            <option value="РЎР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓ">РЎР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓ</option>
            <option value="РЎР°Р±Р°Т›Т›Р° РєРµС€С–РіСѓ">РЎР°Р±Р°Т›Т›Р° РєРµС€С–РіСѓ</option>
            <option value="Р‘РўРЎ РµРјС‚РёС…Р°РЅС‹ РєТЇРЅС– РєРµР»РјРµСѓС–">Р‘РўРЎ РµРјС‚РёС…Р°РЅС‹ РєТЇРЅС– РєРµР»РјРµСѓС–</option>
            <option value="РљРµС€ РµСЃРєРµСЂС‚Сѓ">РљРµС€ РµСЃРєРµСЂС‚Сѓ</option>
            <option value="Р•СЃРєРµСЂС‚РїРµР№ СЃР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓС–">Р•СЃРєРµСЂС‚РїРµР№ СЃР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓС–</option>
            <option value="РђСѓС‹СЂС‹Рї Т›Р°Р»СѓС‹">РђСѓС‹СЂС‹Рї Т›Р°Р»СѓС‹</option>
            <option value="РЎРµРјРёРЅР°СЂ / РєРѕРјР°РЅРґРёСЂРѕРІРєР°Т“Р° РєРµС‚СѓС–">РЎРµРјРёРЅР°СЂ / РєРѕРјР°РЅРґРёСЂРѕРІРєР°Т“Р° РєРµС‚СѓС–</option>
          </select>
          <button
            onClick={onAddEvent}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all"
          >
            + Р–Р°ТЈР° РѕТ›РёТ“Р°
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() =>
                    setEventSort({
                      key: 'teacherName',
                      direction: eventSort.key === 'teacherName' && eventSort.direction === 'asc' ? 'desc' : 'asc',
                    })
                  }
                >
                  <div className="flex items-center gap-2">
                    РњТ±Т“Р°Р»С–Рј
                    {eventSort.key === 'teacherName' ? (
                      eventSort.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-30" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() =>
                    setEventSort({
                      key: 'type',
                      direction: eventSort.key === 'type' && eventSort.direction === 'asc' ? 'desc' : 'asc',
                    })
                  }
                >
                  <div className="flex items-center gap-2">
                    РўТЇСЂС–
                    {eventSort.key === 'type' ? (
                      eventSort.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-30" />
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() =>
                    setEventSort({
                      key: 'date',
                      direction: eventSort.key === 'date' && eventSort.direction === 'desc' ? 'asc' : 'desc',
                    })
                  }
                >
                  <div className="flex items-center gap-2">
                    РљТЇРЅС–
                    {eventSort.key === 'date' ? (
                      eventSort.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-30" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {eventsWithTeacherNames
                .filter((event) => eventTypeFilter === 'Р‘Р°СЂР»С‹Т› С‚ТЇСЂР»РµСЂС–' || event.type === eventTypeFilter)
                .sort((a, b) => {
                  const valA = a[eventSort.key];
                  const valB = b[eventSort.key];
                  if (typeof valA === 'string' && typeof valB === 'string') {
                    return eventSort.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                  }
                  const numericA = typeof valA === 'number' ? valA : 0;
                  const numericB = typeof valB === 'number' ? valB : 0;
                  return eventSort.direction === 'asc' ? numericA - numericB : numericB - numericA;
                })
                .map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-sm">{event.teacherName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          event.type === 'РЎР°Р±Р°Т›Т›Р° РєРµС€С–РіСѓ'
                            ? 'text-amber-600'
                            : event.type === 'Р•СЃРєРµСЂС‚РїРµР№ СЃР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓС–'
                              ? 'text-red-600'
                              : 'text-blue-600'
                        }`}
                      >
                        {event.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{event.date.split('-').reverse().join('.')}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onDeleteEvent(event.id)}
                        className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all"
                        title="УЁС€С–СЂСѓ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

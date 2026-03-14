import React from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Trash2 } from 'lucide-react';
import { ALL_EVENT_TYPES_LABEL, EVENT_TYPES, TERM_OPTIONS } from '../../data/options';
import type { Event } from '../../types';

type EventSort = { key: keyof Event; direction: 'asc' | 'desc' };

type EventsTabProps = {
  eventSort: EventSort;
  selectedTerm: string;
  eventTypeFilter: string;
  eventsWithTeacherNames: Event[];
  setEventSort: (value: EventSort) => void;
  setSelectedTerm: (value: string) => void;
  setEventTypeFilter: (value: string) => void;
  onAddEvent: () => void;
  onDeleteEvent: (id: string) => void;
};

export function EventsTab({
  eventSort,
  selectedTerm,
  eventTypeFilter,
  eventsWithTeacherNames,
  setEventSort,
  setSelectedTerm,
  setEventTypeFilter,
  onAddEvent,
  onDeleteEvent,
}: EventsTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Барлық оқиғалар</h2>
        <div className="flex gap-3">
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-blue-500"
          >
            {TERM_OPTIONS.map((term) => (
              <option key={term.value} value={term.value}>
                {term.label}
              </option>
            ))}
          </select>
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold outline-none transition-all focus:ring-2 focus:ring-blue-500"
          >
            <option value={ALL_EVENT_TYPES_LABEL}>{ALL_EVENT_TYPES_LABEL}</option>
            {EVENT_TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button onClick={onAddEvent} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500">
            + Жаңа оқиға
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th
                  className="cursor-pointer px-6 py-4 transition-colors hover:bg-slate-100"
                  onClick={() =>
                    setEventSort({
                      key: 'teacherName',
                      direction: eventSort.key === 'teacherName' && eventSort.direction === 'asc' ? 'desc' : 'asc',
                    })
                  }
                >
                  <div className="flex items-center gap-2">
                    Мұғалім
                    {eventSort.key === 'teacherName' ? (
                      eventSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-30" />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-4 transition-colors hover:bg-slate-100"
                  onClick={() =>
                    setEventSort({
                      key: 'type',
                      direction: eventSort.key === 'type' && eventSort.direction === 'asc' ? 'desc' : 'asc',
                    })
                  }
                >
                  <div className="flex items-center gap-2">
                    Түрі
                    {eventSort.key === 'type' ? (
                      eventSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-30" />
                    )}
                  </div>
                </th>
                <th
                  className="cursor-pointer px-6 py-4 transition-colors hover:bg-slate-100"
                  onClick={() =>
                    setEventSort({
                      key: 'date',
                      direction: eventSort.key === 'date' && eventSort.direction === 'desc' ? 'asc' : 'desc',
                    })
                  }
                >
                  <div className="flex items-center gap-2">
                    Күні
                    {eventSort.key === 'date' ? (
                      eventSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-30" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {eventsWithTeacherNames
                .filter((event) => eventTypeFilter === ALL_EVENT_TYPES_LABEL || event.type === eventTypeFilter)
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
                  <tr key={event.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{event.teacherName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-medium ${
                          event.type === 'Сабаққа кешігу'
                            ? 'text-amber-600'
                            : event.type === 'Сабаққа келмеу' || event.type === 'Ескертпей сабаққа келмеуі' || event.type === 'БТС емтиханы күні келмеуі'
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
                        className="rounded-xl bg-slate-100 p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                        title="Өшіру"
                      >
                        <Trash2 className="h-4 w-4" />
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

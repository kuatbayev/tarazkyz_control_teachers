import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
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
  const [selectedReasonEvent, setSelectedReasonEvent] = useState<Event | null>(null);

  const filteredEvents = useMemo(
    () =>
      eventsWithTeacherNames
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
        }),
    [eventSort, eventTypeFilter, eventsWithTeacherNames],
  );

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {selectedReasonEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReasonEvent(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Себебі / түсіндірме</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedReasonEvent.teacherName} · {selectedReasonEvent.type}
                  </p>
                </div>
                <button onClick={() => setSelectedReasonEvent(null)} className="rounded-full p-2 transition-colors hover:bg-slate-100">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>
              <div className="p-6">
                <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                  {selectedReasonEvent.reason?.trim() || 'Түсіндірме көрсетілмеген.'}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                  onClick={() => setEventSort({ key: 'teacherName', direction: eventSort.key === 'teacherName' && eventSort.direction === 'asc' ? 'desc' : 'asc' })}
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
                  onClick={() => setEventSort({ key: 'type', direction: eventSort.key === 'type' && eventSort.direction === 'asc' ? 'desc' : 'asc' })}
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
                  onClick={() => setEventSort({ key: 'date', direction: eventSort.key === 'date' && eventSort.direction === 'desc' ? 'asc' : 'desc' })}
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
                <th className="px-6 py-4 text-right">Әрекет</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{event.teacherName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm font-medium ${
                        event.type === 'Сабаққа кешікті'
                          ? 'text-amber-600'
                          : event.type === 'Сабаққа келмеді' || event.type === 'БТС емтиханына келмеді' || event.type === 'PET/KET емтиханына келмеді'
                            ? 'text-red-600'
                            : 'text-blue-600'
                      }`}
                    >
                      {event.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{event.date.split('-').reverse().join('.')}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedReasonEvent(event)}
                        className="rounded-xl bg-slate-100 p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                        title="Түсіндірмені көру"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteEvent(event.id)}
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

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { DEFAULT_EVENT_TYPE, EVENT_TYPES } from '../data/options';
import type { Event, Teacher } from '../types';

type AddEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: Partial<Event>) => void;
  teachers: Teacher[];
};

export function AddEventModal({ isOpen, onClose, onAdd, teachers }: AddEventModalProps) {
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || '');
  const [type, setType] = useState<Event['type']>(DEFAULT_EVENT_TYPE);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!teachers.length) {
      setTeacherId('');
      return;
    }

    if (!teachers.some((teacher) => teacher.id === teacherId)) {
      setTeacherId(teachers[0].id);
    }
  }, [teacherId, teachers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId) return;
    const teacher = teachers.find((item) => item.id === teacherId);
    onAdd({
      teacherId,
      teacherName: teacher?.name || 'Белгісіз',
      type,
      date,
      reason,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <h3 className="text-xl font-bold text-slate-800">Жаңа оқиға</h3>
              <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-slate-100">
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Мұғалім</label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  disabled={!teachers.length}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
                >
                  {!teachers.length && <option value="">Мұғалімдер табылмады</option>}
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Оқиға түрі</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Event['type'])}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
                >
                  {EVENT_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Күні</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Себебі / түсіндірме</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Мысалы: денсаулығына байланысты..."
                  className="h-24 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-500 transition-all hover:bg-slate-200"
                >
                  Болдырмау
                </button>
                <button
                  type="submit"
                  disabled={!teachers.length}
                  className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Қосу
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

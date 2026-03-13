import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Event, Teacher } from '../types';

type AddEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (event: Partial<Event>) => void;
  teachers: Teacher[];
};

export function AddEventModal({ isOpen, onClose, onAdd, teachers }: AddEventModalProps) {
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || '');
  const [type, setType] = useState<Event['type']>('РЎР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓ');
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
      teacherName: teacher?.name || 'Р‘РµР»РіС–СЃС–Р·',
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
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Р–Р°ТЈР° РѕТ›РёТ“Р°</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">РњТ±Т“Р°Р»С–Рј</label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  disabled={!teachers.length}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  {!teachers.length && <option value="">РњТ±Т“Р°Р»С–РјРґРµСЂ С‚Р°Р±С‹Р»РјР°РґС‹</option>}
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">РћТ›РёТ“Р° С‚ТЇСЂС–</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as Event['type'])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="РЎР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓ">РЎР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓ</option>
                  <option value="РЎР°Р±Р°Т›Т›Р° РєРµС€С–РіСѓ">РЎР°Р±Р°Т›Т›Р° РєРµС€С–РіСѓ</option>
                  <option value="Р‘РўРЎ РµРјС‚РёС…Р°РЅС‹ РєТЇРЅС– РєРµР»РјРµСѓС–">Р‘РўРЎ РµРјС‚РёС…Р°РЅС‹ РєТЇРЅС– РєРµР»РјРµСѓС–</option>
                  <option value="РљРµС€ РµСЃРєРµСЂС‚Сѓ">РљРµС€ РµСЃРєРµСЂС‚Сѓ</option>
                  <option value="Р•СЃРєРµСЂС‚РїРµР№ СЃР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓС–">Р•СЃРєРµСЂС‚РїРµР№ СЃР°Р±Р°Т›Т›Р° РєРµР»РјРµСѓС–</option>
                  <option value="РђСѓС‹СЂС‹Рї Т›Р°Р»СѓС‹">РђСѓС‹СЂС‹Рї Т›Р°Р»СѓС‹</option>
                  <option value="РЎРµРјРёРЅР°СЂ / РєРѕРјР°РЅРґРёСЂРѕРІРєР°Т“Р° РєРµС‚СѓС–">РЎРµРјРёРЅР°СЂ / РєРѕРјР°РЅРґРёСЂРѕРІРєР°Т“Р° РєРµС‚СѓС–</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">РљТЇРЅС–</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">РЎРµР±РµР±С– / РўТЇСЃС–РЅС–РєС‚РµРјРµ</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="РњС‹СЃР°Р»С‹: РљРµРїС‚РµР»С–СЃ, РћС‚Р±Р°СЃС‹Р»С‹Т› Р¶Р°Т“РґР°Р№Р»Р°СЂ..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  Р‘РѕР»РґС‹СЂРјР°Сѓ
                </button>
                <button
                  type="submit"
                  disabled={!teachers.length}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all"
                >
                  ТљРѕСЃСѓ
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

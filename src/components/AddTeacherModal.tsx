import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Teacher } from '../types';

type AddTeacherModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (teacher: Partial<Teacher>) => void;
};

export function AddTeacherModal({ isOpen, onClose, onAdd }: AddTeacherModalProps) {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('РњР°С‚РµРјР°С‚РёРєР°');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name, subject });
    setName('');
    setSubject('РњР°С‚РµРјР°С‚РёРєР°');
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
              <h3 className="text-xl font-bold text-slate-800">Р–Р°ТЈР° РјТ±Т“Р°Р»С–Рј Т›РѕСЃСѓ</h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">РњТ±Т“Р°Р»С–РјРЅС–ТЈ РђР–Рў</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="РњС‹СЃР°Р»С‹: РђСЃС…Р°С‚ РђСЃС…Р°С‚Т±Р»С‹"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">РџУ™РЅ</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
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

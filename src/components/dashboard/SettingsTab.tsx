import React from 'react';
import { Bell, ChevronRight, Settings, Users } from 'lucide-react';
import type { Profile } from '../../types';

type NotificationSetting = {
  id: string;
  label: string;
  checked: boolean;
};

type SettingsTabProps = {
  handleSaveSettings: () => void;
  notificationSettings: NotificationSetting[];
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  toggleNotification: (id: string) => void;
};

export function SettingsTab({
  handleSaveSettings,
  notificationSettings,
  profile,
  setProfile,
  toggleNotification,
}: SettingsTabProps) {
  return (
    <div className="space-y-8 max-w-4xl relative">
      <h2 className="text-2xl font-bold text-slate-800">Р‘Р°РїС‚Р°СѓР»Р°СЂ</h2>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">РџСЂРѕС„РёР»СЊ Р±Р°РїС‚Р°СѓР»Р°СЂС‹</h3>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-50 overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-10 h-10 text-blue-600" />
                )}
              </div>
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setProfile({ ...profile, avatar: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label htmlFor="avatar-upload" className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">
                РЎСѓСЂРµС‚С‚С– У©Р·РіРµСЂС‚Сѓ
              </label>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">РђС‚С‹-Р¶У©РЅС–</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Р›Р°СѓР°Р·С‹РјС‹</label>
                <input
                  type="text"
                  value={profile.position}
                  onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">РўРµР»РµС„РѕРЅ</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="p-8 bg-slate-50 flex justify-end">
          <button onClick={handleSaveSettings} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all">
            РЎР°Т›С‚Р°Сѓ
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Р–ТЇР№РµР»С–Рє Р±Р°РїС‚Р°СѓР»Р°СЂ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">РњРµРєС‚РµРї Р°С‚Р°СѓС‹</label>
              <input
                type="text"
                value={profile.schoolName}
                onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">РћТ›Сѓ Р¶С‹Р»С‹</label>
              <select
                value={profile.academicYear}
                onChange={(e) => setProfile({ ...profile, academicYear: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option>2025-2026 РћТ›Сѓ Р¶С‹Р»С‹</option>
                <option>2024-2025 РћТ›Сѓ Р¶С‹Р»С‹</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">РђТ“С‹РјРґР°Т“С‹ С‚РѕТ›СЃР°РЅ</label>
              <select
                value={profile.currentTerm}
                onChange={(e) => setProfile({ ...profile, currentTerm: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                <option>Р–Р°Р»РїС‹</option>
                <option>1 РўРѕТ›СЃР°РЅ</option>
                <option>2 РўРѕТ›СЃР°РЅ</option>
                <option>3 РўРѕТ›СЃР°РЅ</option>
                <option>4 РўРѕТ›СЃР°РЅ</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-8 bg-slate-50 flex justify-end">
          <button onClick={handleSaveSettings} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all">
            РЎР°Т›С‚Р°Сѓ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            РҐР°Р±Р°СЂР»Р°РЅРґС‹СЂСѓР»Р°СЂ
          </h3>
          <div className="space-y-4">
            {notificationSettings.map((item) => (
              <label key={item.id} className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{item.label}</span>
                <div onClick={() => toggleNotification(item.id)} className={`w-12 h-6 rounded-full transition-all relative ${item.checked ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.checked ? 'left-7' : 'left-1'}`}></div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            ТљР°СѓС–РїСЃС–Р·РґС–Рє
          </h3>
          <div className="space-y-4">
            <button className="w-full py-3 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all text-left flex items-center justify-between">
              ТљТ±РїРёСЏ СЃУ©Р·РґС– У©Р·РіРµСЂС‚Сѓ
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
            <button className="w-full py-3 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all text-left flex items-center justify-between">
              Р•РєС– С„Р°РєС‚РѕСЂР»С‹ Р°СѓС‚РµРЅС‚РёС„РёРєР°С†РёСЏ
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">УЁС€С–СЂСѓР»С–</span>
            </button>
            <button className="w-full py-3 px-4 rounded-xl border border-slate-200 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all text-left flex items-center justify-between">
              РЎРµСЃСЃРёСЏР»Р°СЂРґС‹ Р°СЏТ›С‚Р°Сѓ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

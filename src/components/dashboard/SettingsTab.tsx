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
    <div className="relative max-w-4xl space-y-8">
      <h2 className="text-2xl font-bold text-slate-800">Баптаулар</h2>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-8">
          <h3 className="mb-6 text-lg font-bold text-slate-800">Профиль баптаулары</h3>
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-blue-50 bg-blue-100">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <Users className="h-10 w-10 text-blue-600" />
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
              <label htmlFor="avatar-upload" className="cursor-pointer text-sm font-bold text-blue-600 hover:underline">
                Суретті өзгерту
              </label>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Аты-жөні</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Лауазымы</label>
                <input
                  type="text"
                  value={profile.position}
                  onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Телефон</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end bg-slate-50 p-8">
          <button onClick={handleSaveSettings} className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500">
            Сақтау
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-8">
          <h3 className="mb-6 text-lg font-bold text-slate-800">Жүйелік баптаулар</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Мектеп атауы</label>
              <input
                type="text"
                value={profile.schoolName}
                onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Оқу жылы</label>
              <select
                value={profile.academicYear}
                onChange={(e) => setProfile({ ...profile, academicYear: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
              >
                <option>2025-2026 оқу жылы</option>
                <option>2024-2025 оқу жылы</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">Ағымдағы тоқсан</label>
              <select
                value={profile.currentTerm}
                onChange={(e) => setProfile({ ...profile, currentTerm: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
              >
                <option>Жалпы</option>
                <option>1 тоқсан</option>
                <option>2 тоқсан</option>
                <option>3 тоқсан</option>
                <option>4 тоқсан</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end bg-slate-50 p-8">
          <button onClick={handleSaveSettings} className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500">
            Сақтау
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-800">
            <Bell className="h-5 w-5 text-blue-500" />
            Хабарландырулар
          </h3>
          <div className="space-y-4">
            {notificationSettings.map((item) => (
              <label key={item.id} className="group flex cursor-pointer items-center justify-between">
                <span className="text-sm text-slate-600 transition-colors group-hover:text-slate-900">{item.label}</span>
                <div onClick={() => toggleNotification(item.id)} className={`relative h-6 w-12 rounded-full transition-all ${item.checked ? 'bg-blue-600' : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${item.checked ? 'left-7' : 'left-1'}`}></div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-800">
            <Settings className="h-5 w-5 text-blue-500" />
            Қауіпсіздік
          </h3>
          <div className="space-y-4">
            <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-bold text-slate-700 transition-all hover:bg-slate-50">
              Құпия сөзді өзгерту
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </button>
            <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-bold text-slate-700 transition-all hover:bg-slate-50">
              Екі факторлы аутентификация
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase text-slate-500">Өшірулі</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-bold text-rose-600 transition-all hover:bg-rose-50">
              Сессияларды аяқтау
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

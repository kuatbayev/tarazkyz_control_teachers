import React from 'react';
import { BarChart3, Calendar, Layers, LayoutDashboard, LogOut, Menu, Settings, Users } from 'lucide-react';
import type { Profile } from '../../types';

type ActiveTab = 'dashboard' | 'teachers' | 'events' | 'analytics' | 'ranking' | 'settings';

type SidebarProps = {
  activeTab: ActiveTab;
  isSidebarOpen: boolean;
  onLogout: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  profile: Profile;
};

type TopBarProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  profile: Profile;
  selectedTeacherName: string | null;
};

export function DashboardSidebar({
  activeTab,
  isSidebarOpen,
  onLogout,
  onSelectTab,
  profile,
}: SidebarProps) {
  const items = [
    { id: 'dashboard', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Басқару панелі' },
    { id: 'ranking', icon: <BarChart3 className="h-5 w-5" />, label: 'Рейтинг' },
    { id: 'analytics', icon: <BarChart3 className="h-5 w-5" />, label: 'Аналитика' },
    { id: 'teachers', icon: <Users className="h-5 w-5" />, label: 'Мұғалімдер' },
    { id: 'events', icon: <Calendar className="h-5 w-5" />, label: 'Оқиғалар' },
    { id: 'settings', icon: <Settings className="h-5 w-5" />, label: 'Баптаулар' },
  ] as const;

  return (
    <aside className={`flex flex-col bg-[#0F172A] text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center gap-3 p-6">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 shadow-md shadow-blue-600/20">
          <Layers className="h-5 w-5 text-white" />
        </div>
        {isSidebarOpen && <span className="whitespace-nowrap text-lg font-bold tracking-tight">{profile.schoolName}</span>}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {isSidebarOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="border-t border-white/5 p-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-slate-400 transition-all hover:bg-red-400/10 hover:text-red-400"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {isSidebarOpen && <span className="font-medium">Шығу</span>}
        </button>
      </div>
    </aside>
  );
}

export function DashboardTopBar({
  onToggleSidebar,
  profile,
  selectedTeacherName,
}: TopBarProps) {
  return (
    <header className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="rounded-lg p-2 transition-colors hover:bg-slate-100">
          <Menu className="h-5 w-5 text-slate-500" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">
          {selectedTeacherName ? `Мұғалім профилі: ${selectedTeacherName}` : 'Мектеп шолуы'}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-bold text-slate-800">{profile.name}</p>
            <p className="text-xs text-slate-500">{profile.position}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-blue-500 bg-blue-100">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <Users className="h-5 w-5 text-blue-600" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

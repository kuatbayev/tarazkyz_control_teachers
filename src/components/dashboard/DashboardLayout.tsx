import React from 'react';
import { BarChart3, Calendar, LayoutDashboard, LogOut, Menu, Settings, Users, Layers } from 'lucide-react';
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
  return (
    <aside className={`bg-[#0F172A] text-white transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-600/20">
          <Layers className="w-5 h-5 text-white" />
        </div>
        {isSidebarOpen && <span className="font-bold text-lg tracking-tight whitespace-nowrap">{profile.schoolName}</span>}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {[
          { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Р‘Р°Т›С‹Р»Р°Сѓ РїР°РЅРµР»С–' },
          { id: 'ranking', icon: <BarChart3 className="w-5 h-5" />, label: 'Р РµР№С‚РёРЅРі' },
          { id: 'teachers', icon: <Users className="w-5 h-5" />, label: 'РњТ±Т“Р°Р»С–РјРґРµСЂ' },
          { id: 'events', icon: <Calendar className="w-5 h-5" />, label: 'РћТ›РёТ“Р°Р»Р°СЂ' },
          { id: 'analytics', icon: <BarChart3 className="w-5 h-5" />, label: 'РђРЅР°Р»РёС‚РёРєР°' },
          { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Р‘Р°РїС‚Р°СѓР»Р°СЂ' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id as ActiveTab)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {isSidebarOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isSidebarOpen && <span className="font-medium">РЁС‹Т“Сѓ</span>}
        </button>
      </div>
    </aside>
  );
}

export function DashboardTopBar({
  isSidebarOpen,
  onToggleSidebar,
  profile,
  selectedTeacherName,
}: TopBarProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Menu className="w-5 h-5 text-slate-500" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">
          {selectedTeacherName ? `РњТ±Т“Р°Р»С–РјРґС– С€РѕР»Сѓ: ${selectedTeacherName}` : 'РњРµРєС‚РµРїС‚С– С€РѕР»Сѓ'}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800">{profile.name}</p>
            <p className="text-xs text-slate-500">{profile.position}</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-500 overflow-hidden">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <Users className="w-5 h-5 text-blue-600" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

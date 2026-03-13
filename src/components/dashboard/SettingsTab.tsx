import React, { useState } from 'react';
import { ChevronRight, Settings, Users, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { Profile } from '../../types';

type PasswordChangeResult = {
  success: boolean;
  message: string;
};

type SettingsTabProps = {
  handleChangePassword: (password: string) => Promise<PasswordChangeResult>;
  handleSaveSettings: () => void;
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
};

export function SettingsTab({
  handleChangePassword,
  handleSaveSettings,
  profile,
  setProfile,
}: SettingsTabProps) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const resetPasswordModal = () => {
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setIsSavingPassword(false);
    setIsPasswordModalOpen(false);
  };

  const submitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setPasswordError('ТљТ±РїРёСЏ СЃУ©Р· РєРµРјС–РЅРґРµ 6 С‚Р°ТЈР±Р°РґР°РЅ С‚Т±СЂСѓС‹ РєРµСЂРµРє.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('ТљТ±РїРёСЏ СЃУ©Р·РґРµСЂ Р±С–СЂРґРµР№ РµРјРµСЃ.');
      return;
    }

    setPasswordError('');
    setIsSavingPassword(true);

    const result = await handleChangePassword(newPassword);

    if (!result.success) {
      setPasswordError(result.message);
      setIsSavingPassword(false);
      return;
    }

    resetPasswordModal();
    window.alert(result.message);
  };

  return (
    <div className="relative max-w-4xl space-y-8">
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetPasswordModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <h3 className="text-xl font-bold text-slate-800">ТљТ±РїРёСЏ СЃУ©Р·РґС– У©Р·РіРµСЂС‚Сѓ</h3>
                <button onClick={resetPasswordModal} className="rounded-full p-2 transition-colors hover:bg-slate-100">
                  <X className="h-5 w-5 text-slate-400" />
                </button>
              </div>
              <form onSubmit={submitPasswordChange} className="space-y-4 p-6">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Р–Р°ТЈР° Т›Т±РїРёСЏ СЃУ©Р·</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
                    placeholder="РљРµРјС–РЅРґРµ 6 С‚Р°ТЈР±Р°"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">ТљТ±РїРёСЏ СЃУ©Р·РґС– СЂР°СЃС‚Р°Сѓ</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
                    placeholder="ТљР°Р№С‚Р° РµРЅРіС–Р·С–ТЈС–Р·"
                  />
                </div>
                {passwordError && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{passwordError}</p>}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetPasswordModal}
                    className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-500 transition-all hover:bg-slate-200"
                  >
                    Р‘РѕР»РґС‹СЂРјР°Сѓ
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSavingPassword ? 'РЎР°Т›С‚Р°Р»СѓРґР°...' : 'УЁР·РіРµСЂС‚Сѓ'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <h2 className="text-2xl font-bold text-slate-800">Р‘Р°РїС‚Р°СѓР»Р°СЂ</h2>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-8">
          <h3 className="mb-6 text-lg font-bold text-slate-800">РџСЂРѕС„РёР»СЊ Р±Р°РїС‚Р°СѓР»Р°СЂС‹</h3>
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
                РЎСѓСЂРµС‚С‚С– У©Р·РіРµСЂС‚Сѓ
              </label>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">РђС‚С‹-Р¶У©РЅС–</label>
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
                <label className="mb-2 block text-sm font-bold text-slate-700">Р›Р°СѓР°Р·С‹РјС‹</label>
                <input
                  type="text"
                  value={profile.position}
                  onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end bg-slate-50 p-8">
          <button onClick={handleSaveSettings} className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500">
            РЎР°Т›С‚Р°Сѓ
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-8">
          <h3 className="mb-6 text-lg font-bold text-slate-800">Р–ТЇР№РµР»С–Рє Р±Р°РїС‚Р°СѓР»Р°СЂ</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">РњРµРєС‚РµРї Р°С‚Р°СѓС‹</label>
              <input
                type="text"
                value={profile.schoolName}
                onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">РћТ›Сѓ Р¶С‹Р»С‹</label>
              <select
                value={profile.academicYear}
                onChange={(e) => setProfile({ ...profile, academicYear: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
              >
                <option>2025-2026 РѕТ›Сѓ Р¶С‹Р»С‹</option>
                <option>2024-2025 РѕТ›Сѓ Р¶С‹Р»С‹</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">РђТ“С‹РјРґР°Т“С‹ С‚РѕТ›СЃР°РЅ</label>
              <select
                value={profile.currentTerm}
                onChange={(e) => setProfile({ ...profile, currentTerm: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
              >
                <option>Р–Р°Р»РїС‹</option>
                <option>1 С‚РѕТ›СЃР°РЅ</option>
                <option>2 С‚РѕТ›СЃР°РЅ</option>
                <option>3 С‚РѕТ›СЃР°РЅ</option>
                <option>4 С‚РѕТ›СЃР°РЅ</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end bg-slate-50 p-8">
          <button onClick={handleSaveSettings} className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500">
            РЎР°Т›С‚Р°Сѓ
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-800">
          <Settings className="h-5 w-5 text-blue-500" />
          ТљР°СѓС–РїСЃС–Р·РґС–Рє
        </h3>
        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
        >
          ТљТ±РїРёСЏ СЃУ©Р·РґС– У©Р·РіРµСЂС‚Сѓ
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
}

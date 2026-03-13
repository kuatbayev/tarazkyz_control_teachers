/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  clearStoredLocalAuthSession,
  getStoredLocalAuthSession,
  hasSupabaseConfig,
  isLocalAuthBypassEnabled,
  supabase,
} from './lib/supabase';
import type { Page } from './types';

const DashboardPage = lazy(() =>
  import('./components/DashboardPage').then((module) => ({ default: module.DashboardPage })),
);
const LandingPage = lazy(() =>
  import('./components/LandingPage').then((module) => ({ default: module.LandingPage })),
);

function AppShellLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] text-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
        <p className="font-bold text-slate-500">Бет жүктелуде...</p>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    if (isLocalAuthBypassEnabled && getStoredLocalAuthSession()) {
      return 'dashboard';
    }

    return 'landing';
  });

  useEffect(() => {
    if (!hasSupabaseConfig) {
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted && data.session) {
        setCurrentPage('dashboard');
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setCurrentPage(session ? 'dashboard' : 'landing');
      }
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = () => {
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    if (isLocalAuthBypassEnabled) {
      clearStoredLocalAuthSession();
    }

    if (hasSupabaseConfig) {
      await supabase.auth.signOut();
    }

    setCurrentPage('landing');
  };

  return (
    <div className="font-sans antialiased">
      <Suspense fallback={<AppShellLoader />}>
        <AnimatePresence mode="wait">
          {currentPage === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <LandingPage onLogin={handleLogin} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <DashboardPage onLogout={handleLogout} />
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  );
}

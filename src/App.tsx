/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DashboardPage } from './components/DashboardPage';
import { LandingPage } from './components/LandingPage';
import {
  hasSupabaseConfig,
  isLocalAuthBypassEnabled,
  localAuthStorageKey,
  supabase,
} from './lib/supabase';
import type { Page } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    if (isLocalAuthBypassEnabled && localStorage.getItem(localAuthStorageKey) === 'true') {
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
      localStorage.removeItem(localAuthStorageKey);
    }

    if (hasSupabaseConfig) {
      await supabase.auth.signOut();
    }

    setCurrentPage('landing');
  };

  return (
    <div className="font-sans antialiased">
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
    </div>
  );
}

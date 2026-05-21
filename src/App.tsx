import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore, THEMES } from './store/themeStore';
import { useQuizStore } from './store/quizStore';
import { useAudioInit } from './hooks/useCustomHooks';
import { SetupScreen } from './components/SetupScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { SyncDebugPanel } from './components/SyncDebugPanel';
import { Moon, Sun, Palette } from 'lucide-react';
import { Card, Button, Modal } from './components/ui';

function App() {
  const { status, isFirebaseConfigured, subscribeToQuestionUpdates, unsubscribeFromQuestionUpdates } = useQuizStore();
  const { isDark, toggleDarkMode, selectedThemeId, setTheme } = useThemeStore();
  const [showThemeModal, setShowThemeModal] = useState(false);
  
  // Initialize audio context on user interaction
  useAudioInit();

  // Load questions on app startup (keep data persistent)
  useEffect(() => {
    console.log('🔄 App.tsx: Loading questions on startup');
    const initializeQuestions = async () => {
      try {
        const store = useQuizStore.getState();
        await store.loadQuestions();
        console.log('✅ Questions loaded successfully');
      } catch (error) {
        console.error('❌ Error loading questions:', error);
      }
    };
    initializeQuestions();
  }, []);

  // Initialize real-time sync when app loads
  useEffect(() => {
    if (isFirebaseConfigured) {
      console.log('🚀 App.tsx: Firebase configured, initializing real-time sync');
      // Subscribe to real-time question updates
      subscribeToQuestionUpdates();
      
      // Cleanup on unmount
      return () => {
        console.log('🔌 App.tsx: Cleaning up real-time sync on unmount');
        unsubscribeFromQuestionUpdates();
      };
    } else {
      console.warn('⚠️ App.tsx: Firebase not configured');
    }
  }, [isFirebaseConfigured, subscribeToQuestionUpdates, unsubscribeFromQuestionUpdates]);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <motion.div
      className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-gray-900' : 'bg-white'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Main Content */}
      <AnimatePresence mode="wait">
        {status === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SetupScreen />
          </motion.div>
        )}

        {status === 'running' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QuizScreen />
          </motion.div>
        )}

        {status === 'completed' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ResultsScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons - Only show in quiz mode */}
      {status !== 'completed' && status !== 'running' && (
        <motion.div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
          {/* Theme Selector */}
          <motion.button
            onClick={() => setShowThemeModal(true)}
            className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Change Theme"
          >
            <Palette size={24} />
          </motion.button>

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            className="rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 p-4 text-white shadow-lg hover:shadow-xl transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </motion.button>
        </motion.div>
      )}

      {/* Theme Selector Modal */}
      <Modal
        isOpen={showThemeModal}
        onClose={() => setShowThemeModal(false)}
        title="🎨 Choose Theme"
      >
        <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
          {THEMES.map((theme) => (
            <motion.button
              key={theme.id}
              onClick={() => {
                setTheme(theme.id);
                setShowThemeModal(false);
              }}
              className={`p-4 rounded-lg text-center font-semibold transition-all ${
                selectedThemeId === theme.id
                  ? 'ring-2 ring-offset-2 ring-indigo-600'
                  : 'hover:opacity-80'
              }`}
              style={{
                background: theme.gradient,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-white text-sm">{theme.name}</div>
            </motion.button>
          ))}
        </div>
      </Modal>

      {/* Real-Time Sync Debug Panel */}
      <SyncDebugPanel isOpen={false} />
    </motion.div>
  );
}

export default App;

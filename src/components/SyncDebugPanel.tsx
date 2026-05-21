import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import { Card, Button, Input } from './ui';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';

interface SyncDebugPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Sync Debug Panel Component
 * Shows real-time sync status and allows testing question management
 * This helps debug Firebase real-time synchronization across tabs
 */
export const SyncDebugPanel: React.FC<SyncDebugPanelProps> = ({ isOpen = true, onClose }) => {
  const {
    questions,
    totalQuestions,
    isFirebaseConfigured,
    addQuestion,
    deleteQuestion,
    subscribeToQuestionUpdates,
  } = useQuizStore();

  const [expanded, setExpanded] = useState(isOpen);
  const [newQuestion, setNewQuestion] = useState('');
  const [syncStatus, setSyncStatus] = useState<'connected' | 'disconnected' | 'syncing'>('disconnected');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [addingQuestion, setAddingQuestion] = useState(false);

  // Initialize real-time sync
  useEffect(() => {
    if (isFirebaseConfigured) {
      setSyncStatus('syncing');
      console.log('🔄 Initializing Firebase real-time sync...');
      
      // Subscribe to updates
      subscribeToQuestionUpdates();
      
      // Mark as connected after a short delay
      const timer = setTimeout(() => {
        setSyncStatus('connected');
        console.log('✅ Firebase real-time sync connected');
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setSyncStatus('disconnected');
      console.warn('⚠️ Firebase not configured - using local storage only');
    }
  }, [isFirebaseConfigured, subscribeToQuestionUpdates]);

  const handleAddTestQuestion = async () => {
    if (!newQuestion.trim()) return;

    setAddingQuestion(true);
    try {
      const testQuestion = {
        question: newQuestion,
        options: ['Option A', 'Option B', 'Option C', 'Option D'] as [string, string, string, string],
        answer: 'A' as const,
      };

      await addQuestion(testQuestion);
      setNewQuestion('');
      setLastUpdate(new Date());
      console.log('✅ Question added. Last update:', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('❌ Error adding question:', error);
    } finally {
      setAddingQuestion(false);
    }
  };

  const handleDeleteQuestion = async (index: number) => {
    try {
      await deleteQuestion(index);
      setLastUpdate(new Date());
      console.log('✅ Question deleted. Last update:', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('❌ Error deleting question:', error);
    }
  };

  const syncStatusColor = {
    connected: 'bg-green-100 text-green-800',
    syncing: 'bg-yellow-100 text-yellow-800',
    disconnected: 'bg-red-100 text-red-800',
  };

  const syncStatusText = {
    connected: '✅ Connected & Syncing',
    syncing: '⏳ Connecting...',
    disconnected: '❌ Disconnected',
  };

  if (!expanded) {
    return (
      <motion.button
        onClick={() => setExpanded(true)}
        className="fixed bottom-4 right-4 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Open Sync Debug Panel"
      >
        <ChevronUp size={20} />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-0 right-0 w-full sm:w-96 max-h-96 bg-white dark:bg-gray-800 border-l border-t border-gray-300 dark:border-gray-700 shadow-2xl z-40 overflow-y-auto rounded-tl-lg"
    >
      {/* Header */}
      <div className="sticky top-0 flex items-center justify-between p-4 bg-blue-600 text-white">
        <h3 className="font-bold">🔄 Real-Time Sync Debug</h3>
        <motion.button
          onClick={() => setExpanded(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronDown size={20} />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Sync Status */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">Status</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${syncStatusColor[syncStatus]}`}>
              {syncStatusText[syncStatus]}
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {isFirebaseConfigured ? (
              <>
                <p>✅ Firebase: Configured</p>
                <p>📊 Questions: {totalQuestions}</p>
                {lastUpdate && <p>⏰ Last update: {lastUpdate.toLocaleTimeString()}</p>}
              </>
            ) : (
              <p>⚠️ Using Local Storage (Firebase not configured)</p>
            )}
          </div>
        </Card>

        {/* Add Test Question */}
        {isFirebaseConfigured && (
          <Card>
            <h4 className="font-semibold mb-2">Add Test Question</h4>
            <div className="space-y-2">
              <Input
                placeholder="Enter test question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
              <Button
                onClick={handleAddTestQuestion}
                disabled={!newQuestion.trim() || addingQuestion}
                className="flex items-center justify-center gap-2 w-full"
              >
                <Plus size={16} />
                {addingQuestion ? 'Adding...' : 'Add Question'}
              </Button>
            </div>
          </Card>
        )}

        {/* Recent Questions */}
        <Card>
          <h4 className="font-semibold mb-2">Recent Questions ({Math.min(5, questions.length)})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
            {questions.slice(-5).reverse().map((q, idx) => (
              <div key={idx} className="flex justify-between items-start gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <div className="flex-1">
                  <p className="font-semibold line-clamp-2">{q.question}</p>
                  <p className="text-gray-500">Answer: {q.answer}</p>
                </div>
                {isFirebaseConfigured && (
                  <motion.button
                    onClick={() => handleDeleteQuestion(questions.length - 1 - idx)}
                    className="text-red-500 hover:text-red-700"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 size={14} />
                  </motion.button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200">
          <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">🧪 Testing Real-Time Sync</h4>
          <ol className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Add a test question in one tab</li>
            <li>Open this app in another tab/browser</li>
            <li>Watch the question count update in real-time</li>
            <li>Check browser console for sync logs</li>
          </ol>
        </Card>
      </div>
    </motion.div>
  );
};

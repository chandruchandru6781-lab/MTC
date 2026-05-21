import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Play } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';
import { Button, Card, Input, Badge } from './ui';
import { shuffle } from '../utils/helpers';
import { quizData } from '../data/quizData';

interface SetupScreenProps {
  onStartQuiz?: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartQuiz }) => {
  const {
    teams,
    addTeam,
    removeTeam,
    setQuestionOrder,
    startQuiz,
  } = useQuizStore();

  const [teamInput, setTeamInput] = useState('');
  const [questions, setQuestions] = useState(quizData.length);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAddTeam = () => {
    if (!teamInput.trim()) {
      setError('Please enter a team name');
      return;
    }
    if (teams.some((t) => t.name.toLowerCase() === teamInput.toLowerCase())) {
      setError('Team name already exists');
      return;
    }
    addTeam(teamInput);
    setTeamInput('');
    setError('');
  };

  const handleStartQuiz = () => {
    if (teams.length === 0) {
      setError('Please add at least one team');
      return;
    }
    if (questions < 1 || questions > quizData.length) {
      setError(`Please select between 1 and ${quizData.length} questions`);
      return;
    }

    setError('');
    const allIndices = Array.from({ length: quizData.length }, (_, i) => i);
    const shuffledIndices = shuffle(allIndices).slice(0, questions);
    setQuestionOrder(shuffledIndices);
    startQuiz(questions);
    onStartQuiz?.();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="mx-auto max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          variants={itemVariants}
        >
          <motion.h1
            className="text-5xl sm:text-6xl font-black text-white drop-shadow-lg mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            🎯 MTC Quiz Master
          </motion.h1>
          <p className="text-xl sm:text-2xl text-white/90 font-medium">
            Advanced Learning Platform
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div variants={itemVariants}>
          <Card variant="elevated" className="p-8 bg-white/95 backdrop-blur">
            {/* Teams Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                👥 Teams
              </h2>

              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter team name"
                  value={teamInput}
                  onChange={(e) => setTeamInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTeam()}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddTeam}
                  variant="primary"
                  size="md"
                >
                  <Plus size={20} />
                  Add
                </Button>
              </div>

              {teams.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {teams.map((team) => (
                    <motion.div
                      key={team.id}
                      className="flex items-center justify-between gap-2 bg-indigo-50 px-4 py-2 rounded-lg"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                    >
                      <span className="font-semibold text-gray-800 truncate">
                        {team.name}
                      </span>
                      <button
                        onClick={() => removeTeam(team.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {error && (
                <motion.p
                  className="text-red-600 font-semibold mt-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  ⚠️ {error}
                </motion.p>
              )}
            </div>

            <hr className="my-6" />

            {/* Questions Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                📝 Questions
              </h2>

              <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-semibold text-gray-700">
                    Number of Questions
                  </label>
                  <Badge variant="primary">{questions}</Badge>
                </div>
                <input
                  type="range"
                  min="1"
                  max={quizData.length}
                  value={questions}
                  onChange={(e) => setQuestions(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Out of {quizData.length} total questions available
                </p>
              </div>
            </div>

            <hr className="my-6" />

            {/* Advanced Options */}
            <motion.div className="mb-8">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
              >
                ⚙️ Advanced Options
                <motion.span
                  animate={{ rotate: showAdvanced ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </button>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: showAdvanced ? 'auto' : 0,
                  opacity: showAdvanced ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-4"
              >
                <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                  <p className="text-sm text-gray-700">
                    ✅ Shuffle questions: Enabled
                  </p>
                  <p className="text-sm text-gray-700">
                    ✅ Audio feedback: Enabled
                  </p>
                  <p className="text-sm text-gray-700">
                    ✅ Animations: Enabled
                  </p>
                  <p className="text-sm text-gray-700">
                    ✅ Score tracking: Enabled
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Stats */}
            {teams.length > 0 && (
              <motion.div
                className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg"
                variants={itemVariants}
              >
                <h3 className="font-bold text-gray-800 mb-2">📊 Quiz Summary</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>🎯 Teams: {teams.length}</li>
                  <li>📝 Questions: {questions}</li>
                  <li>⏱️ Est. Duration: {Math.ceil((questions * 30) / 60)} minutes</li>
                </ul>
              </motion.div>
            )}

            {/* Start Button */}
            <motion.div variants={itemVariants}>
              <Button
                onClick={handleStartQuiz}
                variant="success"
                size="lg"
                className="w-full justify-center"
                disabled={teams.length === 0}
              >
                <Play size={24} />
                Start Quiz
              </Button>
            </motion.div>
          </Card>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          className="mt-8 text-center text-white/80 text-sm"
          variants={itemVariants}
        >
          <p>🏆 Test your knowledge and compete with your team!</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

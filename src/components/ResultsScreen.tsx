import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import { Card, Button } from './ui';
import { RotateCcw, Trophy } from 'lucide-react';

interface ResultsScreenProps {
  onRestart?: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ onRestart }) => {
  const { teams, totalQuestions, resetQuiz } = useQuizStore();
  const [showDetails, setShowDetails] = useState(false);

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  const handleRestart = () => {
    resetQuiz();
    onRestart?.();
  };

  const getPerformanceLevel = (score: number, total: number): string => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'Outstanding! 🏆';
    if (percentage >= 80) return 'Excellent! ⭐';
    if (percentage >= 70) return 'Great! 👏';
    if (percentage >= 60) return 'Good! 👍';
    return 'Keep Learning! 📚';
  };

  const totalTeamsScore = teams.reduce((sum, team) => sum + team.score, 0);
  const averageScore = teams.length > 0 ? totalTeamsScore / teams.length : 0;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mx-auto max-w-2xl">
        {/* Celebration Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl font-black text-white drop-shadow-lg mb-4"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎉 Quiz Complete!
          </motion.h1>
          <p className="text-xl text-white/90">Here are your results</p>
        </motion.div>

        {/* Final Scores */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 bg-white/95 backdrop-blur">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Trophy className="text-yellow-500" size={28} />
              Final Standings
            </h2>

            <div className="space-y-3">
              {sortedTeams.map((team, index) => {
                const percentage = (team.score / totalQuestions) * 100;
                const medals = ['🥇', '🥈', '🥉'];
                const medal = medals[index] || '🎯';

                return (
                  <motion.div
                    key={team.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                  >
                    <div className="text-3xl font-bold text-indigo-600 min-w-[3rem]">
                      {medal}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{team.name}</h3>
                      <p className="text-sm text-gray-600">
                        {team.score}/{totalQuestions} ({Math.round(percentage)}%)
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-indigo-600">{team.score}</div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Performance Analysis */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 bg-white/95 backdrop-blur">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Performance</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-semibold">Winning Team</p>
                <p className="text-xl font-bold text-blue-600 mt-1">
                  {sortedTeams[0]?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {sortedTeams[0]?.score || 0}/{totalQuestions}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-semibold">Average Score</p>
                <p className="text-xl font-bold text-purple-600 mt-1">
                  {Math.round(averageScore)}/{totalQuestions}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {Math.round((averageScore / totalQuestions) * 100)}%
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-semibold">Total Teams</p>
                <p className="text-xl font-bold text-green-600 mt-1">{teams.length}</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm font-semibold">Questions</p>
                <p className="text-xl font-bold text-orange-600 mt-1">{totalQuestions}</p>
              </div>
            </div>

            {teams.length === 1 && (
              <motion.div
                className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="font-semibold text-indigo-900 text-center">
                  {getPerformanceLevel(teams[0].score, totalQuestions)}
                </p>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleRestart}
            variant="success"
            size="lg"
            className="w-full justify-center"
          >
            <RotateCcw size={20} />
            Start New Quiz
          </Button>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          className="mt-8 text-center text-white/80 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>✨ Congratulations on completing the quiz! ✨</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

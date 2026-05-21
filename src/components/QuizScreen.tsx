import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import { quizData } from '../data/quizData';
import { Button, Card, Progress } from './ui';
import { playCorrectSound, playWrongSound } from '../utils/audioManager';
import { Volume2, VolumeX } from 'lucide-react';

interface QuizScreenProps {
  onQuizComplete?: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ onQuizComplete }) => {
  const {
    teams,
    currentQuestionIndex,
    questionOrder,
    totalQuestions,
    selectedTeamId,
    selectTeam,
    nextQuestion,
    updateTeamScore,
    addAnsweredQuestion,
    completeQuiz,
  } = useQuizStore();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [animating, setAnimating] = useState(false);

  const currentQuestionIdx = questionOrder[currentQuestionIndex];
  const currentQuestion = quizData[currentQuestionIdx];
  const progress = ((currentQuestionIndex) / totalQuestions) * 100;

  const handleSelectAnswer = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (selectedAnswer || teams.length === 0 || !selectedTeamId) return;

    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = answer === currentQuestion.answer;

    if (soundEnabled) {
      if (isCorrect) {
        playCorrectSound();
      } else {
        playWrongSound();
      }
    }

    if (isCorrect) {
      const team = teams.find((t) => t.id === selectedTeamId);
      if (team) {
        updateTeamScore(selectedTeamId, team.score + 1);
      }
    }

    addAnsweredQuestion({
      questionIndex: currentQuestionIdx,
      question: currentQuestion.question,
      options: currentQuestion.options,
      selectedAnswer: answer,
      correctAnswer: currentQuestion.answer,
      isCorrect,
      teamId: selectedTeamId,
      teamName: teams.find((t) => t.id === selectedTeamId)?.name || '',
      timestamp: Date.now(),
    });

    const delay = isCorrect ? 2000 : 1500;
    setTimeout(() => {
      setAnimating(true);
      setTimeout(() => {
        if (currentQuestionIndex + 1 >= totalQuestions) {
          completeQuiz();
          onQuizComplete?.();
        } else {
          setSelectedAnswer(null);
          setShowResult(false);
          setAnimating(false);
          nextQuestion();
        }
      }, 300);
    }, delay);
  };

  const handleSelectTeam = (teamId: string) => {
    if (!selectedAnswer) {
      selectTeam(teamId);
    }
  };

  const isCorrect = selectedAnswer === currentQuestion.answer;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              Question {currentQuestionIndex + 1}/{totalQuestions}
            </h1>
          </div>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="rounded-full bg-white/20 p-3 text-white hover:bg-white/30 transition-colors"
          >
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </motion.div>

        {/* Progress Bar */}
        <motion.div className="mb-8">
          <Progress value={progress} max={100} />
        </motion.div>

        {/* Team Selection */}
        {teams.length > 1 && !selectedAnswer && (
          <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 bg-white/95 backdrop-blur">
              <h3 className="text-lg font-bold text-gray-800 mb-4">👥 Select Team</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {teams.map((team) => (
                  <motion.button
                    key={team.id}
                    onClick={() => handleSelectTeam(team.id)}
                    className={`p-3 rounded-lg font-semibold transition-all ${
                      selectedTeamId === team.id
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {team.name}
                    <br />
                    <span className="text-sm opacity-75">{team.score} pts</span>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Question Card */}
        <AnimatePresence mode="wait">
          {!animating && (
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card className="p-8 bg-white/95 backdrop-blur">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
                  {currentQuestion.question}
                </h2>

                {/* Answer Options */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {(['A', 'B', 'C', 'D'] as const).map((optionLetter, index) => {
                    const isSelected = selectedAnswer === optionLetter;
                    const isAnswerOption = currentQuestion.answer === optionLetter;
                    let bgColor = 'bg-gray-100 hover:bg-gray-200';

                    if (showResult) {
                      if (isSelected && isCorrect) {
                        bgColor = 'bg-green-500 text-white';
                      } else if (isSelected && !isCorrect) {
                        bgColor = 'bg-red-500 text-white';
                      } else if (isAnswerOption && !isCorrect) {
                        bgColor = 'bg-green-500 text-white';
                      }
                    }

                    return (
                      <motion.button
                        key={optionLetter}
                        onClick={() => handleSelectAnswer(optionLetter)}
                        className={`p-4 rounded-lg text-left font-semibold transition-all ${bgColor} ${
                          selectedAnswer ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        disabled={selectedAnswer !== null}
                        whileHover={{ scale: selectedAnswer ? 1 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="font-bold text-lg mb-1">{optionLetter}</div>
                        <div className="text-sm">{currentQuestion.options[index]}</div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Result Message */}
                {showResult && (
                  <motion.div
                    className={`mt-6 p-4 rounded-lg text-center font-bold text-lg ${
                      isCorrect
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
                  </motion.div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scoreboard */}
        <motion.div className="mt-8">
          <Card className="p-6 bg-white/95 backdrop-blur">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Scores</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`p-4 rounded-lg text-center ${
                    selectedTeamId === team.id
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="text-sm font-semibold">{team.name}</div>
                  <div className="text-2xl font-bold mt-1">{team.score}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

import { useQuizStore } from '../store/quizStore';
import { QuizQuestion } from '../types';

/**
 * Custom hook for question management
 * Provides easy access to question management functions
 * Note: All management functions are now async and return Promises
 */
export const useQuestionManagement = () => {
  const {
    questions,
    totalQuestions,
    loadQuestions,
    addQuestion,
    editQuestion,
    deleteQuestion,
    deleteQuestions,
    resetQuestionsToDefault,
    updateTotalQuestions,
  } = useQuizStore();

  const handleAddQuestion = async (question: QuizQuestion): Promise<void> => {
    if (!isValidQuestion(question)) {
      throw new Error('Invalid question format');
    }
    await addQuestion(question);
  };

  const handleEditQuestion = async (index: number, question: QuizQuestion): Promise<void> => {
    if (index < 0 || index >= questions.length) {
      throw new Error('Invalid question index');
    }
    if (!isValidQuestion(question)) {
      throw new Error('Invalid question format');
    }
    await editQuestion(index, question);
  };

  const handleDeleteQuestion = async (index: number): Promise<void> => {
    if (index < 0 || index >= questions.length) {
      throw new Error('Invalid question index');
    }
    await deleteQuestion(index);
  };

  const handleDeleteMultipleQuestions = async (indices: number[]): Promise<void> => {
    const invalidIndices = indices.filter(i => i < 0 || i >= questions.length);
    if (invalidIndices.length > 0) {
      throw new Error('One or more invalid question indices');
    }
    await deleteQuestions(indices);
  };

  const handleResetToDefault = async (): Promise<void> => {
    if (window.confirm('Are you sure you want to reset all questions to default? This cannot be undone.')) {
      await resetQuestionsToDefault();
    }
  };

  const isValidQuestion = (question: any): question is QuizQuestion => {
    return (
      question &&
      typeof question.question === 'string' &&
      question.question.trim().length > 0 &&
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      question.options.every((opt: any) => typeof opt === 'string' && opt.trim().length > 0) &&
      ['A', 'B', 'C', 'D'].includes(question.answer)
    );
  };

  const duplicateQuestion = (index: number): QuizQuestion | null => {
    if (index >= 0 && index < questions.length) {
      return { ...questions[index] };
    }
    return null;
  };

  const searchQuestions = (keyword: string): Array<{ index: number; question: QuizQuestion }> => {
    const lowerKeyword = keyword.toLowerCase();
    return questions
      .map((q, index) => ({ index, question: q }))
      .filter(
        ({ question }) =>
          question.question.toLowerCase().includes(lowerKeyword) ||
          question.options.some(opt => opt.toLowerCase().includes(lowerKeyword))
      );
  };

  return {
    questions,
    totalQuestions,
    loadQuestions,
    addQuestion: handleAddQuestion,
    editQuestion: handleEditQuestion,
    deleteQuestion: handleDeleteQuestion,
    deleteQuestions: handleDeleteMultipleQuestions,
    resetQuestionsToDefault: handleResetToDefault,
    updateTotalQuestions,
    duplicateQuestion,
    searchQuestions,
  };
};

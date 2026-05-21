import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizStatus, Team, AnsweredQuestion, QuizQuestion } from '../types';
import { quizData } from '../data/quizData';
import { HybridQuizDataManager } from '../services/hybridQuizDataManager';

interface QuizStore {
  status: QuizStatus;
  teams: Team[];
  currentQuestionIndex: number;
  selectedTeamId: string | null;
  questionOrder: number[];
  totalQuestions: number;
  answeredQuestions: AnsweredQuestion[];
  questions: QuizQuestion[];
  isFirebaseConfigured: boolean;
  
  // Team Actions
  addTeam: (name: string) => void;
  removeTeam: (id: string) => void;
  setTeams: (teams: Team[]) => void;
  updateTeamScore: (teamId: string, score: number) => void;
  
  // Quiz Actions
  startQuiz: (totalQuestions: number) => void;
  setQuestionOrder: (order: number[]) => void;
  selectTeam: (teamId: string) => void;
  nextQuestion: () => void;
  addAnsweredQuestion: (question: AnsweredQuestion) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  setStatus: (status: QuizStatus) => void;
  
  // Question Management Actions (async)
  loadQuestions: () => Promise<void>;
  addQuestion: (question: QuizQuestion) => Promise<void>;
  editQuestion: (index: number, question: QuizQuestion) => Promise<void>;
  deleteQuestion: (index: number) => Promise<void>;
  deleteQuestions: (indices: number[]) => Promise<void>;
  resetQuestionsToDefault: () => Promise<void>;
  updateTotalQuestions: () => Promise<void>;
  
  // Firebase management
  subscribeToQuestionUpdates: () => void;
  unsubscribeFromQuestionUpdates: () => void;
}

// Store initialization state
let isStoreInitialized = false;

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => {
      // Initialize Hybrid Manager once (only on app start)
      if (!isStoreInitialized) {
        HybridQuizDataManager.initialize();
        isStoreInitialized = true;
      }

      const isFirebaseConfigured = HybridQuizDataManager.isUsingFirebase();

      return {
        status: 'setup',
        teams: [],
        currentQuestionIndex: 0,
        selectedTeamId: null,
        questionOrder: [],
        totalQuestions: quizData.length,
        answeredQuestions: [],
        questions: quizData,
        isFirebaseConfigured,

        // Team Actions
        addTeam: (name: string) =>
          set((state) => ({
            teams: [
              ...state.teams,
              {
                id: `team-${Date.now()}`,
                name,
                score: 0,
              },
            ],
          })),

        removeTeam: (id: string) =>
          set((state) => ({
            teams: state.teams.filter((team) => team.id !== id),
          })),

        setTeams: (teams: Team[]) => set({ teams }),

        updateTeamScore: (teamId: string, score: number) =>
          set((state) => ({
            teams: state.teams.map((team) =>
              team.id === teamId ? { ...team, score } : team
            ),
          })),

        // Quiz Actions
        startQuiz: (totalQuestions: number) =>
          set({
            status: 'running',
            currentQuestionIndex: 0,
            totalQuestions,
            answeredQuestions: [],
            selectedTeamId: get().teams.length === 1 ? get().teams[0].id : null,
          }),

        setQuestionOrder: (order: number[]) => set({ questionOrder: order }),

        selectTeam: (teamId: string) => set({ selectedTeamId: teamId }),

        nextQuestion: () =>
          set((state) => ({
            currentQuestionIndex: state.currentQuestionIndex + 1,
            selectedTeamId: state.teams.length === 1 ? state.teams[0].id : null,
          })),

        addAnsweredQuestion: (question: AnsweredQuestion) =>
          set((state) => ({
            answeredQuestions: [...state.answeredQuestions, question],
          })),

        completeQuiz: () => set({ status: 'completed' }),

        resetQuiz: () =>
          set({
            status: 'setup',
            currentQuestionIndex: 0,
            selectedTeamId: null,
            questionOrder: [],
            totalQuestions: get().questions.length,
            answeredQuestions: [],
            teams: get().teams.map((team) => ({ ...team, score: 0 })),
          }),

        setStatus: (status: QuizStatus) => set({ status }),

        // Question Management Actions (async)
        loadQuestions: async () => {
          const questions = await HybridQuizDataManager.getQuizData();
          set({
            questions,
            totalQuestions: questions.length,
          });
        },

        addQuestion: async (question: QuizQuestion) => {
          const updatedQuestions = await HybridQuizDataManager.addQuestion(question);
          set({
            questions: updatedQuestions,
            totalQuestions: updatedQuestions.length,
          });
        },

        editQuestion: async (index: number, question: QuizQuestion) => {
          const updatedQuestions = await HybridQuizDataManager.editQuestion(index, question);
          set({
            questions: updatedQuestions,
            totalQuestions: updatedQuestions.length,
          });
        },

        deleteQuestion: async (index: number) => {
          const updatedQuestions = await HybridQuizDataManager.deleteQuestion(index);
          set({
            questions: updatedQuestions,
            totalQuestions: updatedQuestions.length,
          });
        },

        deleteQuestions: async (indices: number[]) => {
          const updatedQuestions = await HybridQuizDataManager.deleteQuestions(indices);
          set({
            questions: updatedQuestions,
            totalQuestions: updatedQuestions.length,
          });
        },

        resetQuestionsToDefault: async () => {
          const defaultQuestions = await HybridQuizDataManager.resetToDefault(quizData);
          set({
            questions: defaultQuestions,
            totalQuestions: defaultQuestions.length,
          });
        },

        updateTotalQuestions: async () => {
          const count = await HybridQuizDataManager.getQuestionCount();
          set({ totalQuestions: count });
        },

        // Firebase management
        subscribeToQuestionUpdates: () => {
          console.log('📡 Subscribing to real-time question updates...');
          HybridQuizDataManager.subscribeToQuestions((questions) => {
            console.log(`✅ Real-time update received: ${questions.length} questions`);
            set({
              questions,
              totalQuestions: questions.length,
            });
          });
        },

        unsubscribeFromQuestionUpdates: () => {
          console.log('🔌 Unsubscribing from real-time updates');
          HybridQuizDataManager.unsubscribeFromQuestions();
        },
      };
    },
    {
      name: 'mtc-quiz-store',
      partialize: (state) => ({
        teams: state.teams,
        answeredQuestions: state.answeredQuestions,
      }),
    }
  )
);

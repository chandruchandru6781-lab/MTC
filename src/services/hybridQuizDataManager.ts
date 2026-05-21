import { QuizQuestion } from '../types';
import { FirebaseQuizService } from './firebaseQuizService';

const QUIZ_DATA_STORAGE_KEY = 'mtc_quiz_data';

/**
 * Hybrid Quiz Data Manager
 * Uses Firebase when available, falls back to localStorage
 * Provides seamless transition between offline and online modes
 */
export class HybridQuizDataManager {
  private static useFirebase = false;
  private static unsubscribe: (() => void) | null = null;

  /**
   * Initialize the manager - checks if Firebase is configured
   */
  static initialize(): void {
    this.useFirebase = FirebaseQuizService.isConfigured();
    if (this.useFirebase) {
      console.log('✅ HybridQuizDataManager: Firebase is CONFIGURED - Using cloud sync');
    } else {
      console.warn('⚠️ HybridQuizDataManager: Firebase NOT configured - Using localStorage');
    }
  }

  /**
   * Check if using Firebase
   */
  static isUsingFirebase(): boolean {
    return this.useFirebase;
  }

  /**
   * Get all quiz questions
   * If Firebase is configured, fetches from Firestore
   * Otherwise, uses localStorage
   */
  static async getQuizData(): Promise<QuizQuestion[]> {
    if (this.useFirebase) {
      return await FirebaseQuizService.getQuestions();
    }
    return this.getLocalData();
  }

  /**
   * Subscribe to real-time question updates
   * Only works with Firebase
   */
  static subscribeToQuestions(callback: (questions: QuizQuestion[]) => void): void {
    console.log(`🔄 Firebase enabled: ${this.useFirebase}`);
    if (this.useFirebase) {
      // Unsubscribe from previous subscription if exists
      if (this.unsubscribe) {
        console.log('🔌 Unsubscribing from previous listener');
        this.unsubscribe();
      }
      // Subscribe to Firebase updates
      console.log('📡 Setting up Firebase real-time listener...');
      this.unsubscribe = FirebaseQuizService.subscribeToQuestions((questions) => {
        console.log(`📨 Firebase callback triggered with ${questions.length} questions`);
        callback(questions);
      });
    } else {
      // Fallback: return local data
      console.log('💾 Using localStorage (Firebase not available)');
      callback(this.getLocalData());
    }
  }

  /**
   * Unsubscribe from real-time updates
   */
  static unsubscribeFromQuestions(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  /**
   * Add a new question
   */
  static async addQuestion(question: QuizQuestion): Promise<QuizQuestion[]> {
    if (this.useFirebase) {
      const { id, createdAt, updatedAt, ...questionData } = question;
      const result = await FirebaseQuizService.addQuestion(questionData);
      if (result) {
        const updated = await this.getQuizData();
        return updated;
      }
      return [];
    }
    return this.addLocalQuestion(question);
  }

  /**
   * Edit an existing question
   */
  static async editQuestion(index: number, updatedQuestion: QuizQuestion): Promise<QuizQuestion[]> {
    if (this.useFirebase && updatedQuestion.id) {
      const success = await FirebaseQuizService.updateQuestion(updatedQuestion.id, updatedQuestion);
      if (success) {
        return await this.getQuizData();
      }
      return [];
    }
    return this.editLocalQuestion(index, updatedQuestion);
  }

  /**
   * Delete a question by index
   */
  static async deleteQuestion(index: number): Promise<QuizQuestion[]> {
    if (this.useFirebase) {
      const data = await this.getQuizData();
      if (data[index]?.id) {
        const success = await FirebaseQuizService.deleteQuestion(data[index].id!);
        if (success) {
          return await this.getQuizData();
        }
      }
      return [];
    }
    return this.deleteLocalQuestion(index);
  }

  /**
   * Delete multiple questions
   */
  static async deleteQuestions(indices: number[]): Promise<QuizQuestion[]> {
    if (this.useFirebase) {
      const data = await this.getQuizData();
      const ids = indices
        .map(i => data[i]?.id)
        .filter((id): id is string => !!id);
      
      if (ids.length > 0) {
        const success = await FirebaseQuizService.deleteQuestions(ids);
        if (success) {
          return await this.getQuizData();
        }
      }
      return [];
    }
    return this.deleteLocalQuestions(indices);
  }

  /**
   * Reset to default data
   */
  static async resetToDefault(defaultData: QuizQuestion[]): Promise<QuizQuestion[]> {
    if (this.useFirebase) {
      // Get current questions
      const current = await this.getQuizData();
      const ids = current.map(q => q.id).filter((id): id is string => !!id);
      
      // Delete all
      if (ids.length > 0) {
        await FirebaseQuizService.deleteQuestions(ids);
      }

      // Add defaults
      for (const question of defaultData) {
        const { id, createdAt, updatedAt, ...questionData } = question;
        await FirebaseQuizService.addQuestion(questionData);
      }

      return await this.getQuizData();
    }
    return this.resetLocalToDefault(defaultData);
  }

  /**
   * Get question count
   */
  static async getQuestionCount(): Promise<number> {
    const data = await this.getQuizData();
    return data.length;
  }

  // ========== LOCAL STORAGE METHODS ==========

  private static getLocalData(): QuizQuestion[] {
    try {
      const stored = localStorage.getItem(QUIZ_DATA_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading local data:', error);
      return [];
    }
  }

  private static saveLocalData(data: QuizQuestion[]): void {
    try {
      localStorage.setItem(QUIZ_DATA_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving local data:', error);
    }
  }

  private static addLocalQuestion(question: QuizQuestion): QuizQuestion[] {
    const data = this.getLocalData();
    data.push(question);
    this.saveLocalData(data);
    return data;
  }

  private static editLocalQuestion(index: number, updatedQuestion: QuizQuestion): QuizQuestion[] {
    const data = this.getLocalData();
    if (index >= 0 && index < data.length) {
      data[index] = updatedQuestion;
      this.saveLocalData(data);
    }
    return data;
  }

  private static deleteLocalQuestion(index: number): QuizQuestion[] {
    const data = this.getLocalData();
    if (index >= 0 && index < data.length) {
      data.splice(index, 1);
      this.saveLocalData(data);
    }
    return data;
  }

  private static deleteLocalQuestions(indices: number[]): QuizQuestion[] {
    const sortedIndices = [...indices].sort((a, b) => b - a);
    let data = this.getLocalData();
    
    for (const index of sortedIndices) {
      if (index >= 0 && index < data.length) {
        data.splice(index, 1);
      }
    }
    
    this.saveLocalData(data);
    return data;
  }

  private static resetLocalToDefault(defaultData: QuizQuestion[]): QuizQuestion[] {
    this.saveLocalData(defaultData);
    return defaultData;
  }
}

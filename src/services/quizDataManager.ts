import { QuizQuestion } from '../types';

const QUIZ_DATA_STORAGE_KEY = 'mtc_quiz_data';

/**
 * Quiz Data Manager Service
 * Handles persistence of quiz questions to localStorage
 * Provides CRUD operations for quiz data
 */
export class QuizDataManager {
  /**
   * Get all quiz questions from storage or default data
   */
  static getQuizData(): QuizQuestion[] {
    try {
      const stored = localStorage.getItem(QUIZ_DATA_STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultData();
    } catch (error) {
      console.error('Error loading quiz data:', error);
      return this.getDefaultData();
    }
  }

  /**
   * Save quiz questions to storage
   */
  static saveQuizData(data: QuizQuestion[]): void {
    try {
      localStorage.setItem(QUIZ_DATA_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving quiz data:', error);
    }
  }

  /**
   * Add a new question to the quiz
   */
  static addQuestion(question: QuizQuestion): QuizQuestion[] {
    const data = this.getQuizData();
    data.push(question);
    this.saveQuizData(data);
    return data;
  }

  /**
   * Edit an existing question by index
   */
  static editQuestion(index: number, updatedQuestion: QuizQuestion): QuizQuestion[] {
    const data = this.getQuizData();
    if (index >= 0 && index < data.length) {
      data[index] = updatedQuestion;
      this.saveQuizData(data);
    }
    return data;
  }

  /**
   * Delete a question by index
   */
  static deleteQuestion(index: number): QuizQuestion[] {
    const data = this.getQuizData();
    if (index >= 0 && index < data.length) {
      data.splice(index, 1);
      this.saveQuizData(data);
    }
    return data;
  }

  /**
   * Delete multiple questions by indices (in descending order to avoid index shifts)
   */
  static deleteQuestions(indices: number[]): QuizQuestion[] {
    const sortedIndices = [...indices].sort((a, b) => b - a);
    let data = this.getQuizData();
    
    for (const index of sortedIndices) {
      if (index >= 0 && index < data.length) {
        data.splice(index, 1);
      }
    }
    
    this.saveQuizData(data);
    return data;
  }

  /**
   * Reset to default quiz data
   */
  static resetToDefault(): QuizQuestion[] {
    const defaultData = this.getDefaultData();
    this.saveQuizData(defaultData);
    return defaultData;
  }

  /**
   * Get the count of total questions
   */
  static getQuestionCount(): number {
    return this.getQuizData().length;
  }

  /**
   * Search questions by keyword
   */
  static searchQuestions(keyword: string): QuizQuestion[] {
    const data = this.getQuizData();
    const lowerKeyword = keyword.toLowerCase();
    
    return data.filter(q => 
      q.question.toLowerCase().includes(lowerKeyword) ||
      q.options.some(opt => opt.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * Export quiz data as JSON
   */
  static exportAsJSON(): string {
    return JSON.stringify(this.getQuizData(), null, 2);
  }

  /**
   * Import quiz data from JSON
   */
  static importFromJSON(jsonString: string): QuizQuestion[] {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data) && data.every(q => this.isValidQuestion(q))) {
        this.saveQuizData(data);
        return data;
      }
      throw new Error('Invalid quiz data format');
    } catch (error) {
      console.error('Error importing quiz data:', error);
      throw error;
    }
  }

  /**
   * Validate if an object is a valid quiz question
   */
  private static isValidQuestion(question: any): boolean {
    return (
      question &&
      typeof question.question === 'string' &&
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      question.options.every((opt: any) => typeof opt === 'string') &&
      ['A', 'B', 'C', 'D'].includes(question.answer)
    );
  }

  /**
   * Get default quiz data
   * This is imported from quizData.ts
   */
  private static getDefaultData(): QuizQuestion[] {
    // This will be set dynamically or imported
    return [];
  }

  /**
   * Initialize with default data
   */
  static initializeWithDefault(defaultData: QuizQuestion[]): void {
    const stored = localStorage.getItem(QUIZ_DATA_STORAGE_KEY);
    if (!stored) {
      this.saveQuizData(defaultData);
    }
  }
}

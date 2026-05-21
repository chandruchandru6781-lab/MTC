import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { QuizQuestion } from '../types';

const QUESTIONS_COLLECTION = 'quiz_questions';

/**
 * Firebase Quiz Service
 * Manages shared quiz questions using Firestore
 * All changes sync in real-time across all users
 */
export class FirebaseQuizService {
  /**
   * Get all questions from Firestore
   */
  static async getQuestions(): Promise<QuizQuestion[]> {
    try {
      const q = query(
        collection(db, QUESTIONS_COLLECTION),
        orderBy('createdAt', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as QuizQuestion));
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  }

  /**
   * Subscribe to real-time question updates
   * Calls the callback whenever questions change
   */
  static subscribeToQuestions(callback: (questions: QuizQuestion[]) => void): () => void {
    try {
      console.log('🔗 Connecting to Firestore quiz_questions collection...');
      const q = query(
        collection(db, QUESTIONS_COLLECTION),
        orderBy('createdAt', 'asc')
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const questions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as QuizQuestion));
        console.log(`✅ Firestore update: ${questions.length} questions received`);
        callback(questions);
      }, (error) => {
        console.error('❌ Firestore subscription error:', error);
      });

      console.log('✅ Firestore real-time listener attached');
      return unsubscribe;
    } catch (error) {
      console.error('❌ Error subscribing to questions:', error);
      return () => {};
    }
  }

  /**
   * Add a new question to Firestore
   */
  static async addQuestion(question: Omit<QuizQuestion, 'id'>): Promise<QuizQuestion | null> {
    try {
      const questionWithMetadata = {
        ...question,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(
        collection(db, QUESTIONS_COLLECTION),
        questionWithMetadata
      );

      return {
        id: docRef.id,
        ...questionWithMetadata
      } as QuizQuestion;
    } catch (error) {
      console.error('Error adding question:', error);
      return null;
    }
  }

  /**
   * Update an existing question
   */
  static async updateQuestion(id: string, updatedQuestion: Partial<QuizQuestion>): Promise<boolean> {
    try {
      const questionRef = doc(db, QUESTIONS_COLLECTION, id);
      await updateDoc(questionRef, {
        ...updatedQuestion,
        updatedAt: new Date(),
      });
      return true;
    } catch (error) {
      console.error('Error updating question:', error);
      return false;
    }
  }

  /**
   * Delete a question from Firestore
   */
  static async deleteQuestion(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, QUESTIONS_COLLECTION, id));
      return true;
    } catch (error) {
      console.error('Error deleting question:', error);
      return false;
    }
  }

  /**
   * Delete multiple questions
   */
  static async deleteQuestions(ids: string[]): Promise<boolean> {
    try {
      const deletePromises = ids.map(id =>
        deleteDoc(doc(db, QUESTIONS_COLLECTION, id))
      );
      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error('Error deleting questions:', error);
      return false;
    }
  }

  /**
   * Check if Firestore is properly configured
   */
  static isConfigured(): boolean {
    try {
      // Check if db and app exist
      if (!db || !db.app) return false;
      
      // Check if all required Firebase config values are set
      const firebaseConfig = db.app.options;
      const hasRequiredConfig = !!(
        firebaseConfig?.apiKey &&
        firebaseConfig?.projectId &&
        firebaseConfig?.appId
      );
      
      return hasRequiredConfig;
    } catch {
      return false;
    }
  }
}

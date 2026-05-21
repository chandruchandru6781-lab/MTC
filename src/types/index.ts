export interface QuizQuestion {
  id?: string; // Firebase document ID
  question: string;
  options: [string, string, string, string];
  answer: 'A' | 'B' | 'C' | 'D';
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Team {
  id: string;
  name: string;
  score: number;
}

export interface AnsweredQuestion {
  questionIndex: number;
  question: string;
  options: string[];
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  teamId: string;
  teamName: string;
  timestamp: number;
}

export type QuizStatus = 'setup' | 'running' | 'completed';

export interface Theme {
  id: string;
  name: string;
  gradient: string;
  bgColor: string;
  accentColor: string;
}

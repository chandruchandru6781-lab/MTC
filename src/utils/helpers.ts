// Fisher-Yates shuffle algorithm
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Format text for display
export const truncateText = (text: string, length: number): string => {
  return text.length > length ? `${text.slice(0, length)}...` : text;
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
export const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};

// Format score
export const formatScore = (score: number, total: number): string => {
  const percentage = Math.round((score / total) * 100);
  return `${score}/${total} (${percentage}%)`;
};

// Get emoji for performance
export const getPerformanceEmoji = (percentage: number): string => {
  if (percentage >= 90) return '🏆';
  if (percentage >= 80) return '⭐';
  if (percentage >= 70) return '👍';
  if (percentage >= 60) return '📚';
  return '💪';
};

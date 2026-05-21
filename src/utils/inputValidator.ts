/**
 * Input Validation Utilities
 * Prevents XSS, injection attacks, and data corruption
 */

// Maximum lengths for different fields
const VALIDATION_LIMITS = {
  question: 1000,
  option: 500,
  totalQuestions: 1000,
  answer: 1,
};

/**
 * Validate and sanitize quiz question text
 * Removes dangerous characters and limits length
 */
export const validateQuestion = (question: string): { valid: boolean; sanitized: string; error?: string } => {
  if (!question) {
    return { valid: false, sanitized: '', error: 'Question cannot be empty' };
  }

  const trimmed = question.trim();

  if (trimmed.length < 5) {
    return { valid: false, sanitized: '', error: 'Question must be at least 5 characters' };
  }

  if (trimmed.length > VALIDATION_LIMITS.question) {
    return { 
      valid: false, 
      sanitized: '', 
      error: `Question must be less than ${VALIDATION_LIMITS.question} characters` 
    };
  }

  // Sanitize: remove HTML tags but keep text
  const sanitized = trimmed
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();

  return { valid: true, sanitized };
};

/**
 * Validate and sanitize option text
 */
export const validateOption = (option: string): { valid: boolean; sanitized: string; error?: string } => {
  if (!option) {
    return { valid: false, sanitized: '', error: 'Option cannot be empty' };
  }

  const trimmed = option.trim();

  if (trimmed.length < 1) {
    return { valid: false, sanitized: '', error: 'Option cannot be empty' };
  }

  if (trimmed.length > VALIDATION_LIMITS.option) {
    return { 
      valid: false, 
      sanitized: '', 
      error: `Option must be less than ${VALIDATION_LIMITS.option} characters` 
    };
  }

  // Sanitize
  const sanitized = trimmed
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();

  return { valid: true, sanitized };
};

/**
 * Validate answer letter (A, B, C, or D)
 */
export const validateAnswer = (answer: string): { valid: boolean; error?: string } => {
  const validAnswers = ['A', 'B', 'C', 'D'];

  if (!answer || !validAnswers.includes(answer.toUpperCase())) {
    return { valid: false, error: 'Answer must be A, B, C, or D' };
  }

  return { valid: true };
};

/**
 * Validate complete quiz question
 */
export const validateQuizQuestion = (question: {
  question: string;
  options: [string, string, string, string];
  answer: string;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate question text
  const questionValidation = validateQuestion(question.question);
  if (!questionValidation.valid) {
    errors.push(questionValidation.error || 'Invalid question');
  }

  // Validate all options
  question.options.forEach((option, index) => {
    const optionValidation = validateOption(option);
    if (!optionValidation.valid) {
      errors.push(`Option ${String.fromCharCode(65 + index)}: ${optionValidation.error}`);
    }
  });

  // Validate answer
  const answerValidation = validateAnswer(question.answer);
  if (!answerValidation.valid) {
    errors.push(answerValidation.error || 'Invalid answer');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize JSON data from localStorage
 * Prevents parsing attacks
 */
export const sanitizeStorageData = (data: unknown): unknown => {
  // Ensure it's a serializable value
  try {
    return JSON.parse(JSON.stringify(data));
  } catch {
    return null;
  }
};

/**
 * Safe JSON parse with error handling
 */
export const safeJsonParse = <T = unknown>(jsonString: string, fallback: T): T => {
  try {
    const parsed = JSON.parse(jsonString);
    return parsed as T;
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
};

/**
 * Check if string contains potential malicious content
 */
export const containsMaliciousContent = (str: string): boolean => {
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /eval\s*\(/i,
    /expression\s*\(/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  return maliciousPatterns.some(pattern => pattern.test(str));
};

/**
 * Validate email format (for future use)
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length < 254;
};

/**
 * Validate URL format (for future use)
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

# Question Management System Documentation

## Overview

The question management system allows you to dynamically add, edit, and delete quiz questions. All changes are automatically persisted to the browser's localStorage, so they survive page refreshes and maintain state across sessions.

## Architecture

### Components

1. **QuizDataManager** (`src/services/quizDataManager.ts`)
   - Core service for CRUD operations on quiz questions
   - Handles localStorage persistence
   - Provides import/export functionality

2. **useQuizStore** (`src/store/quizStore.ts`)
   - Zustand store for state management
   - Integrates with QuizDataManager
   - Manages both team data and question data

3. **useQuestionManagement** (`src/hooks/useQuestionManagement.ts`)
   - Custom React hook for easy access to question management functions
   - Provides validation and error handling
   - Simplifies component integration

4. **QuestionManager** (`src/components/QuestionManager.tsx`)
   - Full-featured UI component for managing questions
   - Add, edit, delete, search, and bulk delete functionality
   - Can be integrated into your app

## Usage Examples

### Basic Usage in Components

```tsx
import { useQuestionManagement } from '../hooks/useQuestionManagement';

function MyComponent() {
  const {
    questions,
    totalQuestions,
    addQuestion,
    editQuestion,
    deleteQuestion,
  } = useQuestionManagement();

  // Add a new question
  const handleAddQuestion = () => {
    addQuestion({
      question: 'What is 2+2?',
      options: ['3', '4', '5', '6'],
      answer: 'B'
    });
  };

  // Edit a question at index 0
  const handleEditQuestion = () => {
    editQuestion(0, {
      question: 'What is 2+3?',
      options: ['4', '5', '6', '7'],
      answer: 'B'
    });
  };

  // Delete a question at index 0
  const handleDeleteQuestion = () => {
    deleteQuestion(0);
  };

  return (
    <div>
      <p>Total Questions: {totalQuestions}</p>
      <button onClick={handleAddQuestion}>Add Question</button>
      <button onClick={handleEditQuestion}>Edit Question</button>
      <button onClick={handleDeleteQuestion}>Delete Question</button>
    </div>
  );
}
```

### Using the QuestionManager Component

```tsx
import QuestionManager from '../components/QuestionManager';

function AdminPanel() {
  const [showManager, setShowManager] = useState(false);

  return (
    <div>
      <button onClick={() => setShowManager(true)}>Manage Questions</button>
      {showManager && (
        <QuestionManager onClose={() => setShowManager(false)} />
      )}
    </div>
  );
}
```

### Direct Service Usage

```tsx
import { QuizDataManager } from '../services/quizDataManager';

// Add a question
const updatedQuestions = QuizDataManager.addQuestion({
  question: 'Question text',
  options: ['A', 'B', 'C', 'D'],
  answer: 'A'
});

// Edit a question
QuizDataManager.editQuestion(0, newQuestion);

// Delete a question
QuizDataManager.deleteQuestion(0);

// Get all questions
const allQuestions = QuizDataManager.getQuizData();

// Search questions
const results = QuizDataManager.searchQuestions('keyword');

// Export as JSON
const jsonData = QuizDataManager.exportAsJSON();

// Import from JSON
QuizDataManager.importFromJSON(jsonString);

// Reset to default
QuizDataManager.resetToDefault();
```

## Features

### Add Question
- Creates a new question with 4 options and a correct answer
- Automatically saved to localStorage
- Updates the store's total question count

### Edit Question
- Update an existing question by index
- Validates the new question data
- Persists changes immediately

### Delete Question
- Remove a single question or multiple questions
- Confirmation dialog for safety
- Updates total count

### Search
- Find questions by keyword
- Searches both question text and options
- Case-insensitive

### Import/Export
- Export all questions as JSON
- Import questions from JSON
- Validates imported data format

### Reset to Default
- Restore original quiz data from `quizData.ts`
- Requires user confirmation

## Data Format

All questions must follow this format:

```typescript
interface QuizQuestion {
  question: string;
  options: [string, string, string, string];  // Exactly 4 options
  answer: 'A' | 'B' | 'C' | 'D';              // Must be A, B, C, or D
}
```

## Storage Details

- **Storage Location**: Browser's localStorage
- **Storage Key**: `mtc_quiz_data`
- **Persistence**: Survives page refreshes and browser restarts
- **Size**: Limited to ~5-10MB depending on browser

## Integration Steps

### Step 1: Initialize in Your App Component

```tsx
import { useQuizStore } from './store/quizStore';
import { useEffect } from 'react';

function App() {
  const { loadQuestions } = useQuizStore();

  useEffect(() => {
    loadQuestions();
  }, []);

  // Rest of your app
}
```

### Step 2: Use in Components

Option A: Using the custom hook
```tsx
import { useQuestionManagement } from './hooks/useQuestionManagement';
```

Option B: Using the QuestionManager component
```tsx
import QuestionManager from './components/QuestionManager';
```

Option C: Direct service usage
```tsx
import { QuizDataManager } from './services/quizDataManager';
```

## Error Handling

All functions include validation and error handling:

```tsx
try {
  addQuestion(question);
} catch (error) {
  console.error('Failed to add question:', error);
}
```

Common errors:
- Invalid question format
- Index out of bounds
- Invalid answer value (not A, B, C, or D)
- Wrong number of options (must be exactly 4)

## Performance Notes

- Operations are synchronous and fast (all in-memory and localStorage)
- Search is performed in-memory on the entire dataset
- No network requests involved
- Suitable for quizzes with up to 1000+ questions

## Best Practices

1. **Always validate before adding/editing**
   - Use the validation functions provided in the hook

2. **Provide user feedback**
   - Show success/error messages to users

3. **Confirm destructive actions**
   - Use confirmation dialogs for delete operations

4. **Backup data**
   - Regularly export questions as JSON for backup

5. **Handle errors gracefully**
   - Wrap operations in try-catch blocks

## Migration from Default Data

The system automatically initializes with default data from `quizData.ts`. To migrate:

1. Data is copied to localStorage on first use
2. Subsequent changes only affect localStorage
3. To reset to default: `QuizDataManager.resetToDefault()`
4. To restore: Clear localStorage and reload

## API Reference

### QuizDataManager

```typescript
// Get/Set
static getQuizData(): QuizQuestion[]
static saveQuizData(data: QuizQuestion[]): void

// CRUD
static addQuestion(question: QuizQuestion): QuizQuestion[]
static editQuestion(index: number, updatedQuestion: QuizQuestion): QuizQuestion[]
static deleteQuestion(index: number): QuizQuestion[]
static deleteQuestions(indices: number[]): QuizQuestion[]

// Utilities
static resetToDefault(): QuizQuestion[]
static getQuestionCount(): number
static searchQuestions(keyword: string): QuizQuestion[]
static exportAsJSON(): string
static importFromJSON(jsonString: string): QuizQuestion[]
static initializeWithDefault(defaultData: QuizQuestion[]): void
```

### useQuestionManagement Hook

```typescript
{
  questions: QuizQuestion[]
  totalQuestions: number
  loadQuestions: () => void
  addQuestion: (question: QuizQuestion) => void
  editQuestion: (index: number, question: QuizQuestion) => void
  deleteQuestion: (index: number) => void
  deleteQuestions: (indices: number[]) => void
  resetQuestionsToDefault: () => void
  updateTotalQuestions: () => void
  duplicateQuestion: (index: number) => QuizQuestion | null
  searchQuestions: (keyword: string) => Array<{index: number, question: QuizQuestion}>
}
```

## Troubleshooting

### Changes not persisting
- Check if localStorage is enabled in your browser
- Check browser console for errors
- Clear localStorage and reload

### Questions not loading
- Ensure `loadQuestions()` is called in your app initialization
- Check if default data is properly imported
- Verify localStorage data format

### Performance issues with many questions
- Consider pagination for UI display
- Search might be slow with 1000+ questions
- Consider moving to a backend database for large datasets

## Future Enhancements

- Database backend support
- Offline sync capability
- Question categories/tags
- Difficulty levels
- Time limits per question
- Image/media support in questions

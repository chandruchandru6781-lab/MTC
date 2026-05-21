# Quick Start: Question Management

## 🎯 What Does This Do?

Users can now **add, edit, and delete quiz questions** with changes automatically saved. No backend needed - everything works in the browser!

## ⚡ 30-Second Setup

### Option 1: Add Manage Button to Your App (Easiest)

```tsx
// In your App.tsx or main component
import { useState } from 'react';
import QuestionManager from './components/QuestionManager';

function App() {
  const [showManager, setShowManager] = useState(false);

  return (
    <div>
      <button onClick={() => setShowManager(true)}>
        📝 Manage Questions
      </button>

      {showManager && (
        <QuestionManager onClose={() => setShowManager(false)} />
      )}
    </div>
  );
}
```

Done! ✅ Users can now manage questions.

---

## 📋 Core Functions

Use these in any component:

```tsx
import { useQuestionManagement } from './hooks/useQuestionManagement';

function MyComponent() {
  const { questions, addQuestion, editQuestion, deleteQuestion, totalQuestions } = useQuestionManagement();

  // Add question
  addQuestion({
    question: 'What is 2+2?',
    options: ['3', '4', '5', '6'],
    answer: 'B'
  });

  // Edit question at index 0
  editQuestion(0, {
    question: 'What is 3+3?',
    options: ['5', '6', '7', '8'],
    answer: 'B'
  });

  // Delete question at index 0
  deleteQuestion(0);

  // Get all questions
  console.log(questions);
  console.log(`Total: ${totalQuestions}`);
}
```

---

## 🗂️ File Structure

**New files created:**
- `src/services/quizDataManager.ts` - Storage management
- `src/hooks/useQuestionManagement.ts` - React hook
- `src/components/QuestionManager.tsx` - Full UI
- `src/examples/QuestionManagementIntegration.tsx` - Integration examples

**Modified files:**
- `src/store/quizStore.ts` - Added question actions

---

## 📊 Data Format

Questions must look like this:

```typescript
{
  question: "Question text?",
  options: ["A", "B", "C", "D"],     // Exactly 4 options
  answer: "B"                         // A, B, C, or D
}
```

---

## 🔧 Available Functions

```typescript
// Hook functions
addQuestion(question)
editQuestion(index, question)
deleteQuestion(index)
deleteQuestions([indices])
resetQuestionsToDefault()
searchQuestions(keyword)
duplicateQuestion(index)
loadQuestions()
updateTotalQuestions()

// Direct service usage
QuizDataManager.getQuizData()
QuizDataManager.saveQuizData(data)
QuizDataManager.addQuestion(question)
QuizDataManager.editQuestion(index, question)
QuizDataManager.deleteQuestion(index)
QuizDataManager.resetToDefault()
QuizDataManager.exportAsJSON()
QuizDataManager.importFromJSON(json)
QuizDataManager.searchQuestions(keyword)
```

---

## 💾 Where Are Questions Stored?

- **Browser's localStorage** (no backend needed)
- **Key**: `mtc_quiz_data`
- **Auto-saves** on every change
- **Survives** page refresh and browser restart
- **~5-10MB** capacity (plenty for 1000+ questions)

---

## ✅ Features Included

- ✅ Add new questions
- ✅ Edit existing questions
- ✅ Delete single or multiple questions
- ✅ Search questions by keyword
- ✅ Duplicate questions
- ✅ Reset to default data
- ✅ Export/Import JSON
- ✅ Form validation
- ✅ Error messages
- ✅ Confirmation dialogs
- ✅ Auto-persistence
- ✅ Real-time updates

---

## 🚀 Usage Examples

### Example 1: Simple Button to Add Questions

```tsx
function QuizSetup() {
  const { addQuestion } = useQuestionManagement();

  return (
    <button onClick={() => addQuestion({
      question: 'New question?',
      options: ['A', 'B', 'C', 'D'],
      answer: 'A'
    })}>
      Add Question
    </button>
  );
}
```

### Example 2: Display All Questions

```tsx
function QuestionsList() {
  const { questions } = useQuestionManagement();

  return (
    <div>
      <h2>Total Questions: {questions.length}</h2>
      {questions.map((q, i) => (
        <div key={i}>
          <h4>{i + 1}. {q.question}</h4>
          <p>Options: {q.options.join(', ')}</p>
          <p>Answer: {q.answer}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Edit Form

```tsx
function EditQuestion() {
  const { questions, editQuestion } = useQuestionManagement();
  const [newText, setNewText] = useState('');

  const handleUpdate = () => {
    editQuestion(0, {
      ...questions[0],
      question: newText
    });
  };

  return (
    <div>
      <input 
        value={newText} 
        onChange={(e) => setNewText(e.target.value)} 
      />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Questions not saving | Enable localStorage in browser |
| Old data showing | Clear localStorage: `localStorage.clear()` |
| Validation error | Check: 4 options, answer is A/B/C/D |
| Module not found | Ensure all files are created in correct paths |

---

## 🔍 Check Your Storage

```javascript
// In browser console
localStorage.getItem('mtc_quiz_data')  // View all questions
localStorage.removeItem('mtc_quiz_data')  // Clear all questions
```

---

## 📚 Documentation

- **Detailed Guide**: See `QUESTION_MANAGEMENT_GUIDE.md`
- **Full Implementation**: See `IMPLEMENTATION_SUMMARY_QUESTIONS.md`
- **Integration Examples**: See `src/examples/QuestionManagementIntegration.tsx`

---

## ❓ FAQ

**Q: Do I need a backend?**
A: No! Everything works in the browser with localStorage.

**Q: Will data be lost?**
A: No, data persists across sessions. Only clear if you manually delete localStorage.

**Q: Can multiple users edit at same time?**
A: Not yet. Single user per browser. Can add backend sync later.

**Q: How many questions can I have?**
A: Thousands! Limited by browser's 5-10MB localStorage.

**Q: Is it secure?**
A: Browser storage isn't encrypted. For sensitive data, use a backend.

---

## 🎓 Next Steps

1. Choose integration method (QuestionManager component or custom)
2. Add to your app
3. Test with a few questions
4. Customize UI as needed
5. Deploy!

---

**Ready to go!** 🚀

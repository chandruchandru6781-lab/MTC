import React, { useState } from 'react';
import { useQuestionManagement } from '../hooks/useQuestionManagement';
import { QuizQuestion } from '../types';
import { validateQuizQuestion, validateQuestion, validateOption, validateAnswer } from '../utils/inputValidator';

interface QuestionFormState {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  answer: 'A' | 'B' | 'C' | 'D';
}

const initialFormState: QuestionFormState = {
  question: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  answer: 'A',
};

interface QuestionManagerProps {
  onClose?: () => void;
}

/**
 * Question Manager Component
 * Demonstrates how to add, edit, and delete quiz questions
 * Changes are automatically persisted to localStorage
 */
export const QuestionManager: React.FC<QuestionManagerProps> = ({ onClose }) => {
  const {
    questions,
    totalQuestions,
    addQuestion,
    editQuestion,
    deleteQuestion,
    deleteQuestions,
    resetQuestionsToDefault,
    searchQuestions,
  } = useQuestionManagement();

  const [formState, setFormState] = useState<QuestionFormState>(initialFormState);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' }>({ text: '', type: 'success' });

  const displayedQuestions = searchTerm 
    ? searchQuestions(searchTerm).map(r => ({ ...r, originalIndex: questions.indexOf(r.question) }))
    : questions.map((q, i) => ({ question: q, index: i, originalIndex: i }));

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newQuestion: QuizQuestion = {
      question: formState.question,
      options: [formState.option_a, formState.option_b, formState.option_c, formState.option_d] as [string, string, string, string],
      answer: formState.answer as 'A' | 'B' | 'C' | 'D',
    };

    // Validate input before submission
    const validation = validateQuizQuestion(newQuestion);
    if (!validation.valid) {
      setMessage({ 
        text: 'Validation errors: ' + validation.errors.join('; '), 
        type: 'error' 
      });
      return;
    }

    try {
      if (editingIndex !== null) {
        await editQuestion(editingIndex, newQuestion);
        setMessage({ text: 'Question updated successfully!', type: 'success' });
        setEditingIndex(null);
      } else {
        await addQuestion(newQuestion);
        setMessage({ text: 'Question added successfully!', type: 'success' });
      }
      setFormState(initialFormState);
    } catch (error) {
      setMessage({ 
        text: error instanceof Error ? error.message : 'Error saving question', 
        type: 'error' 
      });
    }
  };

  const handleEdit = (index: number) => {
    const question = questions[index];
    setFormState({
      question: question.question,
      option_a: question.options[0],
      option_b: question.options[1],
      option_c: question.options[2],
      option_d: question.options[3],
      answer: question.answer,
    });
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        deleteQuestion(index);
        setMessage({ text: 'Question deleted successfully!', type: 'success' });
      } catch (error) {
        setMessage({ 
          text: error instanceof Error ? error.message : 'Error deleting question', 
          type: 'error' 
        });
      }
    }
  };

  const handleToggleSelect = (index: number) => {
    setSelectedIndices(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIndices.length === 0) {
      setMessage({ text: 'No questions selected', type: 'error' });
      return;
    }

    if (window.confirm(`Delete ${selectedIndices.length} question(s)?`)) {
      try {
        deleteQuestions(selectedIndices);
        setSelectedIndices([]);
        setMessage({ text: `${selectedIndices.length} question(s) deleted successfully!`, type: 'success' });
      } catch (error) {
        setMessage({ 
          text: error instanceof Error ? error.message : 'Error deleting questions', 
          type: 'error' 
        });
      }
    }
  };

  const handleCancel = () => {
    setFormState(initialFormState);
    setEditingIndex(null);
  };

  const handleResetToDefault = async () => {
    if (window.confirm('Are you sure you want to reset all questions to default? This cannot be undone.')) {
      try {
        await resetQuestionsToDefault();
        setSelectedIndices([]);
        setMessage({ text: 'Questions reset to default successfully!', type: 'success' });
      } catch (error) {
        setMessage({ 
          text: error instanceof Error ? error.message : 'Error resetting questions', 
          type: 'error' 
        });
      }
    }
  };

  return (
    <div className="question-manager" style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Question Manager</h2>
        {onClose && <button className="btn btn-secondary" onClick={onClose}>Close</button>}
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`} role="alert">
          {message.text}
        </div>
      )}

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Questions</h5>
              <p className="card-text" style={{ fontSize: '2em' }}>{totalQuestions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Question Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>{editingIndex !== null ? 'Edit Question' : 'Add New Question'}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="question" className="form-label">Question *</label>
              <textarea
                id="question"
                name="question"
                className="form-control"
                value={formState.question}
                onChange={handleFormChange}
                rows={3}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="option_a" className="form-label">Option A *</label>
                <input
                  type="text"
                  id="option_a"
                  name="option_a"
                  className="form-control"
                  value={formState.option_a}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="option_b" className="form-label">Option B *</label>
                <input
                  type="text"
                  id="option_b"
                  name="option_b"
                  className="form-control"
                  value={formState.option_b}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="option_c" className="form-label">Option C *</label>
                <input
                  type="text"
                  id="option_c"
                  name="option_c"
                  className="form-control"
                  value={formState.option_c}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="option_d" className="form-label">Option D *</label>
                <input
                  type="text"
                  id="option_d"
                  name="option_d"
                  className="form-control"
                  value={formState.option_d}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="answer" className="form-label">Correct Answer *</label>
              <select
                id="answer"
                name="answer"
                className="form-select"
                value={formState.answer}
                onChange={handleFormChange}
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingIndex !== null ? 'Update Question' : 'Add Question'}
              </button>
              {editingIndex !== null && (
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Search and Tools */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-8 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4 mb-3">
              <button
                className="btn btn-danger w-100"
                onClick={handleDeleteSelected}
                disabled={selectedIndices.length === 0}
              >
                Delete Selected ({selectedIndices.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="card">
        <div className="card-header">
          <h5>Questions ({displayedQuestions.length})</h5>
        </div>
        <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {displayedQuestions.length === 0 ? (
            <p className="text-muted">No questions found</p>
          ) : (
            <div className="list-group">
              {displayedQuestions.map(({ question, index, originalIndex }) => (
                <div
                  key={originalIndex}
                  className={`list-group-item ${selectedIndices.includes(originalIndex) ? 'active' : ''}`}
                >
                  <div className="d-flex w-100 justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={selectedIndices.includes(originalIndex)}
                        onChange={() => handleToggleSelect(originalIndex)}
                      />
                      <div style={{ marginLeft: '10px', display: 'inline-block', width: 'calc(100% - 40px)' }}>
                        <h6>{originalIndex + 1}. {question.question}</h6>
                        <small>
                          <div>A) {question.options[0]}</div>
                          <div>B) {question.options[1]}</div>
                          <div>C) {question.options[2]}</div>
                          <div>D) {question.options[3]}</div>
                          <div>
                            <strong>Answer: {question.answer}</strong>
                          </div>
                        </small>
                      </div>
                    </div>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleEdit(originalIndex)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(originalIndex)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reset to Default */}
      <div className="mt-4">
        <button
          className="btn btn-warning"
          onClick={handleResetToDefault}
        >
          Reset All Questions to Default
        </button>
      </div>
    </div>
  );
};

export default QuestionManager;

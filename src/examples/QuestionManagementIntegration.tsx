import React, { useState } from 'react';
import QuestionManager from '../components/QuestionManager';

/**
 * Example Integration of Question Management into App
 * 
 * This example shows how to add question management capabilities
 * to your existing MTC Quiz Application
 */

export const AppWithQuestionManagement: React.FC = () => {
  const [showQuestionManager, setShowQuestionManager] = useState(false);

  return (
    <div>
      {/* Your existing app content */}
      <nav className="navbar">
        <div className="navbar-brand">MTC Quiz Application</div>
        <div className="navbar-menu">
          {/* Add this button to your existing navigation */}
          <button
            className="btn btn-info"
            onClick={() => setShowQuestionManager(true)}
            style={{ marginLeft: 'auto' }}
          >
            📝 Manage Questions
          </button>
        </div>
      </nav>

      {/* Main app content */}
      <main className="container my-4">
        {/* Your existing quiz components */}
      </main>

      {/* Question Manager Modal/Panel */}
      {showQuestionManager && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              maxWidth: '1000px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              margin: 'auto',
            }}
          >
            <QuestionManager
              onClose={() => setShowQuestionManager(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Simple Integration without Modal
 * 
 * Use this if you want to show the QuestionManager directly on a page
 */
export const AdminPanelExample: React.FC = () => {
  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <div className="admin-nav mb-4">
        <button className="btn btn-primary">Dashboard</button>
        <button className="btn btn-primary">Users</button>
        <button className="btn btn-primary active">Questions</button>
      </div>

      {/* Show QuestionManager directly */}
      <QuestionManager />
    </div>
  );
};

/**
 * Minimal Integration in Existing App
 * 
 * If you want to add to your existing App.tsx:
 * 
 * 1. Import the QuestionManager component:
 *    import QuestionManager from './components/QuestionManager';
 * 
 * 2. Add a state for modal:
 *    const [showQuestionManager, setShowQuestionManager] = useState(false);
 * 
 * 3. Add a button in your navigation:
 *    <button onClick={() => setShowQuestionManager(true)}>Manage Questions</button>
 * 
 * 4. Add the component to render conditionally:
 *    {showQuestionManager && (
 *      <QuestionManager onClose={() => setShowQuestionManager(false)} />
 *    )}
 */

export default AppWithQuestionManagement;

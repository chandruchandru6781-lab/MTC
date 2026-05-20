"""
MTC Quiz Application - Test Token Backend
Manages test tokens and sessions across multiple users
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime, timedelta
import string
import random

app = Flask(__name__)
CORS(app)

# Data storage file
DATA_FILE = 'test_sessions.json'

def load_sessions():
    """Load test sessions from file"""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_sessions(sessions):
    """Save test sessions to file"""
    with open(DATA_FILE, 'w') as f:
        json.dump(sessions, f, indent=2)

def generate_token():
    """Generate a random 8-character test token"""
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return ''.join(random.choice(chars) for _ in range(8))

@app.route('/api/test/create', methods=['POST'])
def create_test():
    """
    Create a new test session
    POST data: {
        "questionCount": 20,
        "validityMinutes": 60,
        "testName": "Quiz Test" (optional)
    }
    """
    try:
        data = request.json
        question_count = data.get('questionCount', 20)
        validity_minutes = data.get('validityMinutes', 60)
        test_name = data.get('testName', 'Quiz Test')
        
        # Generate unique token
        token = generate_token()
        sessions = load_sessions()
        
        # Ensure token is unique
        while token in sessions:
            token = generate_token()
        
        # Create session
        now = datetime.now()
        expires_at = (now + timedelta(minutes=validity_minutes)).isoformat()
        
        session = {
            'testToken': token,
            'testName': test_name,
            'createdAt': now.isoformat(),
            'expiresAt': expires_at,
            'questionCount': question_count,
            'validityMinutes': validity_minutes,
            'isExpired': False,
            'participantResponses': {}
        }
        
        sessions[token] = session
        save_sessions(sessions)
        
        return jsonify({
            'success': True,
            'testToken': token,
            'testLink': f'?test={token}',
            'expiresAt': expires_at
        }), 201
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/test/validate/<token>', methods=['GET'])
def validate_test(token):
    """
    Validate a test token
    Returns test details if valid, error if not
    """
    try:
        sessions = load_sessions()
        
        if token not in sessions:
            return jsonify({
                'success': False,
                'valid': False,
                'error': 'Invalid or expired test link'
            }), 404
        
        session = sessions[token]
        expires_at = datetime.fromisoformat(session['expiresAt'])
        
        # Check if expired
        if datetime.now() > expires_at:
            session['isExpired'] = True
            save_sessions(sessions)
            return jsonify({
                'success': False,
                'valid': False,
                'error': 'Test link has expired'
            }), 401
        
        return jsonify({
            'success': True,
            'valid': True,
            'testToken': token,
            'testName': session.get('testName', 'Quiz Test'),
            'questionCount': session['questionCount'],
            'createdAt': session['createdAt'],
            'expiresAt': session['expiresAt']
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/test/<token>', methods=['GET'])
def get_test(token):
    """Get test details"""
    try:
        sessions = load_sessions()
        
        if token not in sessions:
            return jsonify({
                'success': False,
                'error': 'Test not found'
            }), 404
        
        session = sessions[token]
        expires_at = datetime.fromisoformat(session['expiresAt'])
        
        if datetime.now() > expires_at:
            return jsonify({
                'success': False,
                'error': 'Test has expired'
            }), 401
        
        return jsonify({
            'success': True,
            'test': session
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/test/list', methods=['GET'])
def list_tests():
    """List all active test sessions"""
    try:
        sessions = load_sessions()
        now = datetime.now()
        
        # Filter active sessions
        active = {}
        for token, session in sessions.items():
            expires_at = datetime.fromisoformat(session['expiresAt'])
            if now <= expires_at:
                active[token] = session
        
        return jsonify({
            'success': True,
            'tests': active,
            'count': len(active)
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/test/<token>/delete', methods=['DELETE'])
def delete_test(token):
    """Delete a test session"""
    try:
        sessions = load_sessions()
        
        if token not in sessions:
            return jsonify({
                'success': False,
                'error': 'Test not found'
            }), 404
        
        del sessions[token]
        save_sessions(sessions)
        
        return jsonify({
            'success': True,
            'message': 'Test deleted successfully'
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/test/<token>/submit', methods=['POST'])
def submit_test(token):
    """
    Submit test responses
    POST data: {
        "participantName": "John Doe",
        "responses": {
            "q1": "A",
            "q2": "B",
            ...
        }
    }
    """
    try:
        sessions = load_sessions()
        
        if token not in sessions:
            return jsonify({
                'success': False,
                'error': 'Test not found'
            }), 404
        
        data = request.json
        session = sessions[token]
        
        # Store response
        session['participantResponses'] = {
            'participantName': data.get('participantName', 'Anonymous'),
            'responses': data.get('responses', {}),
            'submittedAt': datetime.now().isoformat()
        }
        
        save_sessions(sessions)
        
        return jsonify({
            'success': True,
            'message': 'Test submitted successfully'
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'service': 'MTC Quiz Backend'}), 200

if __name__ == '__main__':
    # Print startup info
    print("=" * 60)
    print("MTC Quiz Application - Backend Server")
    print("=" * 60)
    print("Starting server on http://localhost:5000")
    print("API Documentation:")
    print("  POST   /api/test/create           - Create new test")
    print("  GET    /api/test/validate/<token> - Validate test token")
    print("  GET    /api/test/<token>          - Get test details")
    print("  GET    /api/test/list             - List active tests")
    print("  DELETE /api/test/<token>/delete   - Delete test")
    print("  POST   /api/test/<token>/submit   - Submit test responses")
    print("=" * 60)
    
    app.run(debug=True, host='127.0.0.1', port=5000)

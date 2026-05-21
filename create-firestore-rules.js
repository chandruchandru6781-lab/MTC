#!/usr/bin/env node
/**
 * Automated Firestore Rules Setup
 * 
 * This creates a .rules file that you can deploy via Firebase CLI
 * 
 * INSTALLATION:
 * npm install -g firebase-tools
 * 
 * USAGE:
 * 1. Download your firebase-key.json from Firebase Console
 * 2. Place it in this directory  
 * 3. Run: firebase login --no-localhost
 * 4. Run: firebase deploy --only firestore:rules
 * 
 * Or manually:
 * 1. Copy firestore.rules content
 * 2. Go to Firebase Console → Firestore → Rules
 * 3. Paste and Publish
 */

const fs = require('fs');
const path = require('path');

const firebaseRulesContent = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Quiz Questions - Public read/write for development
    // Replace with authentication checks for production
    match /quiz_questions/{document=**} {
      allow read, write: if true;
    }
    
    // Quiz Sessions - Public read/write for development  
    match /quiz_sessions/{document=**} {
      allow read, write: if true;
    }
  }
}`;

// Create firestore.rules file
fs.writeFileSync(path.join(__dirname, 'firestore.rules'), firebaseRulesContent);
console.log('✅ Created firestore.rules file');
console.log('\n📋 To deploy using Firebase CLI:');
console.log('1. npm install -g firebase-tools');
console.log('2. firebase login');
console.log('3. firebase deploy --only firestore:rules');
console.log('\n📋 Or deploy manually:');
console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Select mtctraining-24d30');
console.log('3. Go to Firestore Database → Rules');
console.log('4. Copy firestore.rules content');
console.log('5. Paste and Publish');

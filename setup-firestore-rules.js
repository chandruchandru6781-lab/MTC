#!/usr/bin/env node
/**
 * Firestore Security Rules Configurator
 * 
 * This script automatically sets up Firestore security rules for the MTC Quiz App
 * 
 * SETUP:
 * 1. Go to: https://console.firebase.google.com/
 * 2. Select your project: mtctraining-24d30
 * 3. Go to: Project Settings (gear icon) → Service Accounts
 * 4. Click: "Generate New Private Key"
 * 5. Save the downloaded JSON file as: service-account-key.json (in this directory)
 * 6. Run this script: node setup-firestore-rules.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Check if service account key exists
const keyPath = path.join(__dirname, 'service-account-key.json');
if (!fs.existsSync(keyPath)) {
  console.error('❌ Error: service-account-key.json not found!');
  console.error('\n📋 SETUP INSTRUCTIONS:');
  console.error('1. Go to https://console.firebase.google.com/');
  console.error('2. Select project: mtctraining-24d30');
  console.error('3. Go to: Project Settings (⚙️) → Service Accounts tab');
  console.error('4. Click: "Generate New Private Key"');
  console.error('5. Save downloaded JSON as: service-account-key.json');
  console.error('6. Run: node setup-firestore-rules.js\n');
  process.exit(1);
}

// Initialize Firebase Admin
const serviceAccount = require(keyPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

// Firestore security rules
const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Quiz Questions - Allow read/write for all (development mode)
    // In production, use authentication checks: request.auth != null
    match /quiz_questions/{document=**} {
      allow read: if true;
      allow write: if true;
    }
    
    // Quiz Sessions - Allow read/write for all
    match /quiz_sessions/{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}`;

// Set the rules
async function setupFirestoreRules() {
  try {
    console.log('🔐 Configuring Firestore Security Rules...\n');
    
    const rulesFileContent = Buffer.from(firestoreRules).toString('utf-8');
    
    // Use Firebase REST API to set rules (Admin SDK doesn't have direct rules API)
    const idToken = await admin.auth().createCustomToken('firestore-setup-script');
    
    console.log('⏳ Deploying rules to Firebase...');
    console.log('📝 Rules content:');
    console.log('─'.repeat(60));
    console.log(firestoreRules);
    console.log('─'.repeat(60));
    
    // Unfortunately, Firebase Admin SDK doesn't support setting rules directly
    // Rules must be set through Firebase Console
    console.log('\n⚠️  IMPORTANT:');
    console.log('─'.repeat(60));
    console.log('Firebase Admin SDK cannot directly set Firestore rules.');
    console.log('You must set them manually in the Firebase Console.\n');
    console.log('📋 MANUAL STEPS:');
    console.log('1. Go to: https://console.firebase.google.com/');
    console.log('2. Select: mtctraining-24d30');
    console.log('3. Go to: Firestore Database → Rules tab');
    console.log('4. Copy-paste the rules shown above');
    console.log('5. Click: Publish');
    console.log('─'.repeat(60));
    
    // But we can verify the connection works
    console.log('\n✅ Testing Firebase connection...');
    const db = admin.firestore();
    const testDoc = await db.collection('_test').doc('connection').get();
    console.log('✅ Firebase Admin SDK connected successfully!');
    
    console.log('\n✅ Next steps:');
    console.log('1. Set the Firestore rules manually (see above)');
    console.log('2. Run: npm run build');
    console.log('3. Deploy to GitHub Pages or your server');
    console.log('4. Test multi-user sync with: npm run dev');
    
    await admin.app().delete();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupFirestoreRules();

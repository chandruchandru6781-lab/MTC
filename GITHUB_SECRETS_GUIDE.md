# GitHub Secrets Configuration Guide

## Why Real-Time Sync Isn't Working

Your deployed app on GitHub Pages needs **GitHub Secrets** to access Firebase. Without these secrets configured, the app falls back to localStorage and real-time sync between users is **impossible**.

## Critical: Required GitHub Secrets

You must add these 7 secrets to your GitHub repository to enable Firebase real-time sync:

### How to Add GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below exactly as shown

### Required Secrets

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_DATABASE_URL
```

### Where to Get These Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Project Settings** (gear icon)
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key** and download JSON

The values are in the JSON file:
```json
{
  "apiKey": "YOUR_VITE_FIREBASE_API_KEY",
  "authDomain": "YOUR_VITE_FIREBASE_AUTH_DOMAIN",
  "projectId": "YOUR_VITE_FIREBASE_PROJECT_ID",
  "storageBucket": "YOUR_VITE_FIREBASE_STORAGE_BUCKET",
  "messagingSenderId": "YOUR_VITE_FIREBASE_MESSAGING_SENDER_ID",
  "appId": "YOUR_VITE_FIREBASE_APP_ID",
  "databaseURL": "YOUR_VITE_FIREBASE_DATABASE_URL"
}
```

### Verify Secrets Are Set Correctly

After adding secrets:

1. Go to `.github/workflows/` directory
2. Your workflow file should have:

```yaml
- name: Build with environment variables
  env:
    VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
    VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
    VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
    VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
    VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
    VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
    VITE_FIREBASE_DATABASE_URL: ${{ secrets.VITE_FIREBASE_DATABASE_URL }}
  run: npm run build
```

## Steps to Fix Real-Time Sync

### 1. Add GitHub Secrets (Required)
```
Add all 7 secrets from your Firebase project to GitHub repository settings
```

### 2. Re-Deploy Your App
```bash
# Option A: Trigger deployment from GitHub UI
# Go to Actions → Re-run job

# Option B: Make a small commit and push
git commit --allow-empty -m "trigger deploy with firebase secrets"
git push origin main
```

### 3. Verify Firebase is Configured
After deployment:
1. Visit your deployed app
2. Open browser DevTools (F12 or Right-click → Inspect)
3. Go to **Console** tab
4. Look for: `✅ Firebase environment variables configured correctly`
   - If you see this, Firebase is properly configured
   - If you see `❌ Firebase not properly configured!`, secrets are missing

### 4. Verify Real-Time Sync Works

**Test with 2 browser tabs:**

Tab 1:
1. Visit your deployed app
2. Go to Question Manager
3. Add a new question
4. Submit

Tab 2:
1. Visit your deployed app in a different browser tab
2. Watch the question list
3. If real-time sync works, you'll see the new question appear instantly

## Additional Firebase Setup Required

Even with secrets configured, you need to configure Firestore:

### Enable Firestore
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. Click **Create Database**
5. Choose **Start in test mode** (for development)
6. Select **us-central1** region
7. Click **Create**

### Configure Firestore Security Rules

**Replace default rules with:**

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read/write for quiz_questions (for development)
    // WARNING: This is NOT safe for production!
    match /quiz_questions/{document=**} {
      allow read, write: if true;
    }

    // Restrict other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### For Production (Recommended)

Use authentication-based rules instead of public access:

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /quiz_questions/{document=**} {
      allow read, write: if request.auth != null;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Troubleshooting Checklist

✅ All 7 GitHub Secrets added and visible in repo settings?
✅ Secrets have correct values from Firebase project?
✅ Firestore Database created in Firebase Console?
✅ Firestore Security Rules configured?
✅ Firebase Storage API enabled in Google Cloud Console?
✅ App re-deployed after adding secrets?
✅ Browser console shows Firebase diagnostics message?

## Browser Console Messages

### Success (Real-Time Sync Enabled)
```
🔍 Firebase Diagnostics
Environment Variables: {
  hasApiKey: true,
  hasProjectId: true,
  hasAuthDomain: true,
  hasAppId: true,
  allConfigured: true,
  missingVariables: []
}
✅ Firebase environment variables configured correctly
```

### Problem (Real-Time Sync Disabled)
```
🔍 Firebase Diagnostics
Environment Variables: {
  allConfigured: false,
  missingVariables: [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_PROJECT_ID",
    ...
  ]
}
❌ Firebase not properly configured!
Missing variables: [...]
To enable real-time sync:
1. Add GitHub Secrets to your repo
2. Trigger a new deploy from GitHub
```

## Quick Reference

| Step | Status | Action |
|------|--------|--------|
| Add GitHub Secrets | ❌ **MUST DO** | Add all 7 secrets to repository settings |
| Create Firestore DB | ✅ NEEDED | Enable Firestore in Firebase Console |
| Set Security Rules | ✅ NEEDED | Configure rules in Firestore |
| Re-Deploy | ✅ NEEDED | Trigger new build after secrets added |
| Test | ✅ VERIFY | Check browser console for diagnostics |

## Still Not Working?

Check the browser console for specific error messages:

1. **"Firestore instance not initialized"** → Secrets not properly passed to build
2. **"projectId is required"** → Missing VITE_FIREBASE_PROJECT_ID secret
3. **"apiKey is required"** → Missing VITE_FIREBASE_API_KEY secret
4. **Permission denied** → Firestore security rules need update

## Contact Firebase Support

If issues persist after completing all steps:
1. Check [Firebase Status Page](https://status.firebase.google.com/)
2. Review [Firestore Documentation](https://firebase.google.com/docs/firestore)
3. Check [Firebase Pricing](https://firebase.google.com/pricing) for free tier limits

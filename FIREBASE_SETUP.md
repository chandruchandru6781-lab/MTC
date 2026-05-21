# Firebase Integration Setup Guide

## Overview
Your MTC Quiz app now supports **shared questions across all users** when deployed to GitHub. All changes sync in real-time.

## Why Firebase?
- ✅ Works with GitHub Pages (no backend server needed)
- ✅ Real-time synchronization across all users
- ✅ Free tier is generous (50,000 reads/day)
- ✅ Simple setup (5 minutes)
- ✅ Easy integration with React

## Setup Steps

### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter your project name (e.g., "MTC Quiz App")
4. Continue through setup (disable analytics for now)
5. Click **"Create project"**

### Step 2: Get Your Firebase Config
1. In Firebase Console, click **⚙️ Settings** (top left)
2. Go to **"Project settings"** tab
3. Scroll down to **"Your apps"** section
4. Click **"Create app"** → Select **"Web"** app
5. Register your app and **copy the config**

Your config will look like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123...",
  databaseURL: "https://your-project.firebaseio.com"
};
```

### Step 3: Create Firestore Database
1. In Firebase Console, go to **"Firestore Database"** (left sidebar)
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a region close to you
5. Click **"Create"**

### Step 4: Configure Your App

#### Option A: Using Environment Variables (Recommended)
1. Create a `.env.local` file in your project root:
```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

2. **Do NOT commit `.env.local` to GitHub** (it's private!)
   - It's already in `.gitignore`

3. Run your app locally:
```bash
npm run dev
```

#### Option B: Using `.env` File
If you want your app to work for everyone:
1. Edit `.env` (or create one without `.local`)
2. Add your Firebase config there
3. Commit to GitHub
4. Everyone using the app will share the same questions

### Step 5: Verify It Works
1. Run: `npm run dev`
2. Open http://localhost:5173
3. Go to **Question Management**
4. Add a test question
5. Open app in another browser/incognito window
6. **The question should appear instantly** ✅

### Step 6: Deploy to GitHub Pages

#### A. Enable GitHub Pages
1. Push your code to GitHub
2. Go to repo → **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: `GitHub Actions`
   - Accept the default workflow

#### B. Add Deployment Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm install
      - run: npm run build
      
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### C. Handle Private Keys
**IMPORTANT**: Don't expose your Firebase API key on GitHub!

**Option 1: Use GitHub Secrets**
1. Go to repo → **Settings** → **Secrets and variables** → **Actions**
2. Add each Firebase config as a secret:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_PROJECT_ID`
   - etc.

3. Update `.github/workflows/deploy.yml`:
```yaml
      - run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          # ... add all env vars
```

**Option 2: Use Firestore Security Rules**
Configure rules in Firebase Console → Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /quiz_questions/{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

⚠️ This allows anyone to modify questions. For production, add authentication.

## Testing Real-Time Sync

1. **Local Development**:
   - Run `npm run dev`
   - Open in 2 browser windows
   - Add/edit questions in one window
   - See instant updates in the other ✨

2. **On GitHub Pages**:
   - Share the deployed link
   - Multiple users can access simultaneously
   - Questions sync in real-time

## Troubleshooting

### "Firebase not configured" message
- Check if `.env.local` exists and has all values
- Verify Firebase config in Firebase Console
- Restart the dev server

### Questions not syncing
- Check browser console for errors (F12)
- Verify Firestore Database exists
- Check Firebase Rules allow read/write

### Firebase errors on GitHub Pages
- Make sure environment variables are in GitHub Secrets
- Verify the GitHub Actions workflow is running
- Check GitHub Actions logs for build errors

## Security Notes

### For Development (Test Mode)
✅ Anyone can read/write
✅ Good for testing
❌ Not recommended for production

### For Production
- Add Firebase Authentication
- Implement proper Firestore Rules
- Limit who can modify questions
- Consider adding an admin role

Example secure rules:
```
match /quiz_questions/{document=**} {
  allow read: if true;
  allow write: if request.auth != null && isAdmin();
}
```

## Support

If you have issues:
1. Check Firebase Console for errors
2. Look at browser console (F12)
3. Verify Firestore Database exists
4. Check GitHub Actions logs
5. Review Firebase Documentation: https://firebase.google.com/docs

## Next Steps

1. ✅ Create Firebase Project
2. ✅ Get Firebase Config
3. ✅ Create Firestore Database
4. ✅ Add environment variables
5. ✅ Test locally
6. ✅ Deploy to GitHub Pages
7. ✅ Share the link!

Enjoy your shared quiz app! 🎉

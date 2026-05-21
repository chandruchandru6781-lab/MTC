# Firebase Setup Checklist ✅

Use this checklist to complete your Firebase integration step-by-step.

---

## Phase 1: Firebase Project Setup (5 minutes)

### Create Firebase Project
- [ ] Go to https://console.firebase.google.com
- [ ] Click "Add project"
- [ ] Enter project name (e.g., "MTC Quiz App")
- [ ] Continue through setup
- [ ] Click "Create project"
- [ ] Wait for project to be created

### Get Firebase Configuration
- [ ] In Firebase Console, click ⚙️ Settings (top left)
- [ ] Go to "Project settings" tab
- [ ] Scroll down to "Your apps" section
- [ ] Click "Create app" → Select "Web"
- [ ] Register the app
- [ ] Copy the entire config object
  ```javascript
  {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "...",
    databaseURL: "..."
  }
  ```

### Create Firestore Database
- [ ] In Firebase Console, go to "Firestore Database" (left sidebar)
- [ ] Click "Create database"
- [ ] Select "Start in test mode"
- [ ] Choose your region
- [ ] Click "Create"
- [ ] Wait for database to be created

---

## Phase 2: Local Configuration (2 minutes)

### Create Environment File
- [ ] Open your project folder in VS Code
- [ ] Create a new file called `.env.local` (in root directory)
- [ ] Add this content (replace with YOUR values from Firebase):
  ```
  VITE_FIREBASE_API_KEY=paste_your_api_key_here
  VITE_FIREBASE_AUTH_DOMAIN=paste_your_auth_domain_here
  VITE_FIREBASE_PROJECT_ID=paste_your_project_id_here
  VITE_FIREBASE_STORAGE_BUCKET=paste_your_storage_bucket_here
  VITE_FIREBASE_MESSAGING_SENDER_ID=paste_your_sender_id_here
  VITE_FIREBASE_APP_ID=paste_your_app_id_here
  VITE_FIREBASE_DATABASE_URL=paste_your_database_url_here
  ```
- [ ] Save the file
- [ ] **Verify:** `.env.local` should be in `.gitignore` (don't commit it!)

---

## Phase 3: Installation (2 minutes)

### Install Dependencies
- [ ] Open terminal in your project
- [ ] Run: `npm install`
- [ ] Wait for installation to complete
- [ ] Verify firebase is in node_modules

---

## Phase 4: Local Testing (3 minutes)

### Start Development Server
- [ ] In terminal, run: `npm run dev`
- [ ] Copy the local URL (usually http://localhost:5173)
- [ ] Open it in your browser

### Test Real-Time Sync
- [ ] Open the app in **two separate browser windows/tabs**
- [ ] In Window 1, go to "Manage Questions" or Question Management
- [ ] Add a test question:
  - Question: "Test Question"
  - Options: A, B, C, D
  - Answer: A
- [ ] Click "Add Question"
- [ ] **Switch to Window 2**
- [ ] **Verify:** The new question appears instantly ✨
- [ ] Try adding another question in Window 2
- [ ] **Verify:** It appears in Window 1

### Verify Firebase is Connected
- [ ] In browser console (F12), look for: `✓ Firebase configured`
- [ ] If you see: `⚠ Firebase not configured`, check your `.env.local` file

---

## Phase 5: Prepare for GitHub Deployment (5 minutes)

### Create GitHub Workflow File (Optional but Recommended)
- [ ] Create folder: `.github/workflows` in your project root
- [ ] Create file: `.github/workflows/deploy.yml`
- [ ] Copy content from FIREBASE_SETUP.md section "Deploy to GitHub Pages"
- [ ] Save the file

### Add GitHub Secrets
- [ ] Go to your GitHub repo
- [ ] Go to **Settings** → **Secrets and variables** → **Actions**
- [ ] Click "New repository secret"
- [ ] Add each Firebase config as a secret:
  - [ ] `VITE_FIREBASE_API_KEY`
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
  - [ ] `VITE_FIREBASE_PROJECT_ID`
  - [ ] `VITE_FIREBASE_STORAGE_BUCKET`
  - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `VITE_FIREBASE_APP_ID`
  - [ ] `VITE_FIREBASE_DATABASE_URL`

---

## Phase 6: Deploy to GitHub (5 minutes)

### Push Code to GitHub
- [ ] Open terminal in your project
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Add Firebase integration"`
- [ ] Run: `git push origin main`
- [ ] Wait for push to complete

### Enable GitHub Pages
- [ ] Go to your GitHub repo
- [ ] Go to **Settings** → **Pages** (left sidebar)
- [ ] Under "Build and deployment":
  - [ ] Source: Select "GitHub Actions"
- [ ] If deploy.yml exists, GitHub Actions should automatically trigger
- [ ] Wait 2-3 minutes for deployment
- [ ] Your site should be available at: `https://your-username.github.io/your-repo-name`

### Verify Deployment
- [ ] Open the GitHub Pages URL in your browser
- [ ] Test adding a question (should work with Firebase!)
- [ ] Share the link with others
- [ ] Have someone else add a question
- [ ] Verify you see their question instantly

---

## Phase 7: Share & Enjoy 🎉

### Share with Others
- [ ] Copy your GitHub Pages URL
- [ ] Send it to your team/friends
- [ ] Tell them: **"Anyone with the link can add questions and see them in real-time!"**

### Verify Group Functionality
- [ ] Have at least 2 people access the app simultaneously
- [ ] Have one person add a question
- [ ] Verify all others see it instantly
- [ ] Test editing/deleting questions
- [ ] Verify changes sync for everyone

---

## Troubleshooting Checklist

### Firebase Not Configured
- [ ] Check `.env.local` exists in project root
- [ ] Verify all 7 config values are present
- [ ] Check for typos in variable names (must start with `VITE_`)
- [ ] Restart dev server: `npm run dev`

### npm install Failed
- [ ] Try again: `npm install`
- [ ] If Windows: Use Command Prompt instead of PowerShell
- [ ] Delete `package-lock.json` and try again

### Questions Not Syncing
- [ ] Check browser console (F12) for errors
- [ ] Verify Firestore Database exists in Firebase Console
- [ ] Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- [ ] Check that you're using the same Firebase project

### Build Fails on GitHub
- [ ] Check GitHub Actions logs (Actions tab in your repo)
- [ ] Verify all 7 `VITE_*` variables are in GitHub Secrets
- [ ] Check that `.gitignore` includes `.env.local`

---

## Summary

| Step | Task | Time | Status |
|------|------|------|--------|
| 1 | Create Firebase Project | 2 min | ⏹️ To-Do |
| 2 | Get Firebase Config | 2 min | ⏹️ To-Do |
| 3 | Create Firestore Database | 1 min | ⏹️ To-Do |
| 4 | Create .env.local | 2 min | ⏹️ To-Do |
| 5 | npm install | 2 min | ⏹️ To-Do |
| 6 | Test locally | 3 min | ⏹️ To-Do |
| 7 | Deploy to GitHub | 5 min | ⏹️ To-Do |
| **Total** | **Setup Complete** | **~17 min** | ⏹️ To-Do |

---

## Need Help?

1. **Read:** GETTING_STARTED_FIREBASE.md (comprehensive guide)
2. **Read:** FIREBASE_SETUP.md (detailed steps)
3. **Check:** Browser console for errors (F12)
4. **Check:** Firebase Console for database status
5. **Check:** GitHub Actions logs for deployment errors

**You've got this! 🚀**

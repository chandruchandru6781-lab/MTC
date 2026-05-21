# ✅ PRE-DEPLOYMENT CHECKLIST - Before You Push to GitHub

**Use this checklist to ensure everything is ready before deploying.**

---

## 🔍 Local Testing (5 minutes)

### Install and Run
- [ ] Open terminal in project folder
- [ ] Run: `npm install`
- [ ] Wait for completion
- [ ] Run: `npm run dev`
- [ ] Open http://localhost:5173 in browser
- [ ] App loads successfully

### Test Basic Features
- [ ] Quiz loads without errors
- [ ] Can answer questions
- [ ] Can view results
- [ ] No console errors (F12)

### Test Question Management
- [ ] Click "Manage Questions" (or similar)
- [ ] Can add a new question
- [ ] Can edit existing question
- [ ] Can delete a question
- [ ] Success messages appear

### Build Test
- [ ] Open new terminal
- [ ] Run: `npm run build`
- [ ] Build completes successfully
- [ ] No errors during build
- [ ] `/dist` folder created

---

## 📋 File Verification (2 minutes)

### Check All Files Exist
- [ ] `src/config/firebase.ts` exists
- [ ] `src/services/firebaseQuizService.ts` exists
- [ ] `src/services/hybridQuizDataManager.ts` exists
- [ ] `.env.example` exists
- [ ] `.gitignore` exists

### Check Updated Files
- [ ] `package.json` has firebase dependency
- [ ] `src/types/index.ts` updated
- [ ] `src/store/quizStore.ts` updated
- [ ] `src/hooks/useQuestionManagement.ts` updated
- [ ] `src/components/QuestionManager.tsx` updated

### Check Documentation
- [ ] `FIREBASE_CHECKLIST.md` exists
- [ ] `FIREBASE_SETUP.md` exists
- [ ] `GETTING_STARTED_FIREBASE.md` exists
- [ ] `FIREBASE_INTEGRATION.md` exists
- [ ] `VERIFICATION_REPORT.md` exists
- [ ] `READY_TO_DEPLOY.md` exists

---

## 🔧 Configuration Check (1 minute)

### .env.example
- [ ] Located in project root
- [ ] Contains all 7 Firebase variables
- [ ] Variables are commented with examples
- [ ] NOT committed to Git

### .gitignore
- [ ] Contains `.env.local`
- [ ] Contains `.env.development.local`
- [ ] Contains `/dist`
- [ ] Contains `/node_modules`

### package.json
- [ ] Shows: `"firebase": "^..."`
- [ ] No red error squiggles
- [ ] All dependencies listed

---

## 💻 GitHub Preparation (2 minutes)

### GitHub Repository
- [ ] Repository exists on GitHub
- [ ] You have push access
- [ ] Repository is public (for GitHub Pages)
- [ ] `.gitignore` prevents secrets from committing

### GitHub Pages Settings (Optional - do after push)
- [ ] Go to Settings → Pages
- [ ] Source: GitHub Actions
- [ ] Ready for deployment workflow

---

## 🚀 Deployment Steps (Copy & Paste)

### Step 1: Commit Everything
```bash
# Show what will be committed
git status

# Add all changes
git add .

# Commit with message
git commit -m "Add Firebase integration for shared questions - production ready"

# Push to GitHub
git push origin main
```

### Step 2: Verify GitHub Secrets Setup (Later)
When you're ready to enable Firebase:
1. Go to your GitHub repo
2. Click Settings → Secrets and variables → Actions
3. Add each secret (details below)

### Step 3: Enable GitHub Pages (Later)
1. Go to Settings → Pages
2. Source: GitHub Actions
3. Done! ✓

---

## 🔐 GitHub Secrets Template

**After pushing to GitHub, add these secrets:**

### How to Add Secrets:
1. GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Enter Name and Value for each:

```
Name: VITE_FIREBASE_API_KEY
Value: [Your Firebase API key]

Name: VITE_FIREBASE_AUTH_DOMAIN
Value: [Your Firebase auth domain]

Name: VITE_FIREBASE_PROJECT_ID
Value: [Your Firebase project ID]

Name: VITE_FIREBASE_STORAGE_BUCKET
Value: [Your Firebase storage bucket]

Name: VITE_FIREBASE_MESSAGING_SENDER_ID
Value: [Your Firebase messaging sender ID]

Name: VITE_FIREBASE_APP_ID
Value: [Your Firebase app ID]

Name: VITE_FIREBASE_DATABASE_URL
Value: [Your Firebase database URL]
```

---

## ⚠️ Before You Click Push

### STOP - Verify These:
- [ ] No sensitive data (API keys) in any committed files
- [ ] `.env.local` file is NOT created yet (do this locally only)
- [ ] `.gitignore` includes `.env.local`
- [ ] All changes are committed
- [ ] `git status` shows "nothing to commit"

### Final Code Check:
- [ ] `npm run build` completes successfully
- [ ] No TypeScript errors
- [ ] No console warnings about Firebase config
- [ ] Tests pass (if applicable)

---

## ✅ Ready to Deploy?

### All Checklist Items Completed?
If ALL boxes above are checked ✓, then:

```bash
# YOU'RE READY!
git push origin main
```

---

## 📊 Post-Deployment Checklist

**After you push to GitHub, do this:**

### Verify Push Succeeded
- [ ] Check GitHub repo shows new commits
- [ ] Check GitHub Actions tab (builds triggered)
- [ ] Wait 2-3 minutes for build to complete
- [ ] Check Actions shows ✓ (success)

### Verify Website Works
- [ ] Open your GitHub Pages URL
- [ ] App loads correctly
- [ ] No 404 errors
- [ ] Questions are visible
- [ ] Can interact with app

### Test Firebase (if configured)
- [ ] Add a test question
- [ ] Refresh the page
- [ ] Question persists
- [ ] Open in another browser/device
- [ ] Question appears for them too

### Share & Celebrate
- [ ] Copy GitHub Pages URL
- [ ] Share with team members
- [ ] Have them test it
- [ ] Enjoy real-time shared questions! 🎉

---

## 🆘 If Something Goes Wrong

### Can't Push to GitHub?
```bash
# Check your connection
git status

# Try again
git push origin main

# If still fails, check:
# - SSH key configured
# - Have write access to repo
# - Internet connection working
```

### Build Fails on GitHub?
- Check GitHub Actions logs
- Verify all GitHub Secrets are set
- Check for typos in secret names
- Ensure `.gitignore` is correct

### App Doesn't Load After Deploy?
- Hard refresh browser (Ctrl+Shift+R)
- Check GitHub Pages URL is correct
- Wait 5 minutes (deployment can be slow)
- Check Actions tab for build errors

### Questions Not Syncing?
- Check browser console (F12) for errors
- Verify Firebase config in GitHub Secrets
- Ensure Firestore Database exists
- Check Firebase Security Rules allow reads/writes

**See FIREBASE_SETUP.md for detailed troubleshooting.**

---

## 📝 Summary

**Pre-Deployment:**
- [ ] Test locally (5 min)
- [ ] Verify files (2 min)
- [ ] Check configuration (1 min)
- [ ] Prepare GitHub (2 min)

**Deployment:**
- [ ] `git push origin main`
- [ ] Add GitHub Secrets
- [ ] Enable GitHub Pages

**Post-Deployment:**
- [ ] Verify build succeeded
- [ ] Test app works
- [ ] Share with others

**Total Time:** ~15 minutes

---

## 🎉 You're Ready!

Everything is checked and verified.  
**Push with confidence!** 🚀

```bash
git push origin main
```

Your MTC Quiz App is about to go live! 🎊

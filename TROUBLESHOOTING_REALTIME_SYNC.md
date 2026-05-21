# Real-Time Sync Troubleshooting Guide

## Symptom: Real-Time Sync Not Working

**What you'll see:**
- Add a question in one tab
- Open app in another tab/browser
- Question doesn't appear immediately
- Need to refresh page to see new questions

**Why it's happening:**
Your app is using localStorage instead of Firebase because Firebase credentials are not injected into the app during deployment.

---

## Diagnostic Flow

### Step 1: Check Browser Console (30 seconds)

**Do this:**
1. Open your deployed app in browser
2. Press **F12** (or Right-click → Inspect)
3. Click **Console** tab
4. Look for message starting with `🔍 Firebase Diagnostics`

**What to look for:**

#### ✅ SUCCESS MESSAGE
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
**If you see this:** Firebase IS configured. Problem is elsewhere (skip to "Advanced Diagnostics" below)

#### ❌ FAILURE MESSAGE
```
🔍 Firebase Diagnostics
Environment Variables: {
  hasApiKey: false,
  hasProjectId: false,
  hasAuthDomain: false,
  hasAppId: false,
  allConfigured: false,
  missingVariables: [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_STORAGE_BUCKET",
    "VITE_FIREBASE_MESSAGING_SENDER_ID",
    "VITE_FIREBASE_APP_ID",
    "VITE_FIREBASE_DATABASE_URL"
  ]
}
❌ Firebase not properly configured!
```
**If you see this:** You haven't added GitHub Secrets yet. Follow "Quick Fix" below.

---

## Quick Fix (If Secrets Not Configured)

### The Problem
GitHub Secrets are not set in your repository, so Firebase credentials aren't passed to the build process.

### The Solution (3 steps, 5 minutes)

**Step 1: Go to Your GitHub Repository Settings**
```
https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions
```

**Step 2: Add These 7 Secrets**

For each secret, click "New repository secret" and add:

```
Name: VITE_FIREBASE_API_KEY
Value: YOUR_API_KEY_FROM_FIREBASE
```

Repeat for all 7:
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_DATABASE_URL

**Where to get values:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ (Settings icon) → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download JSON file
7. Copy values:
   ```json
   {
     "apiKey": "VITE_FIREBASE_API_KEY",
     "authDomain": "VITE_FIREBASE_AUTH_DOMAIN",
     "projectId": "VITE_FIREBASE_PROJECT_ID",
     "storageBucket": "VITE_FIREBASE_STORAGE_BUCKET",
     "messagingSenderId": "VITE_FIREBASE_MESSAGING_SENDER_ID",
     "appId": "VITE_FIREBASE_APP_ID",
     "databaseURL": "VITE_FIREBASE_DATABASE_URL"
   }
   ```

**Step 3: Re-Deploy Your App**

Option A (Automatic - via code):
```bash
git add .
git commit -m "Enable real-time sync"
git push origin main
# GitHub Actions will automatically build with secrets
```

Option B (Manual - via GitHub UI):
1. Go to **GitHub → Actions**
2. Find latest workflow run
3. Click **Re-run all jobs**

**Wait 2-5 minutes for build to complete, then refresh your app.**

**Step 4: Verify in Console**
1. Refresh deployed app in browser
2. Open DevTools Console (F12)
3. Should now show: `✅ Firebase environment variables configured correctly`

---

## Advanced Diagnostics

**If you see Firebase is configured but still no real-time sync:**

### Check 1: Firestore Database Exists

Go to [Firebase Console](https://console.firebase.google.com/) → Your Project → Firestore Database

**What you should see:**
```
✅ Firestore Database - us-central1 (or your region)
```

**If missing:**
1. Click **Create Database**
2. Choose **Start in test mode**
3. Select **us-central1** region
4. Click **Create**

### Check 2: Firestore Security Rules

In Firebase Console → Firestore → **Rules** tab

**Current rules should allow access:**
```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /quiz_questions/{document=**} {
      allow read, write: if true;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**If different:**
1. Click **Edit rules**
2. Replace with above
3. Click **Publish**

### Check 3: Firestore API Enabled

Go to [Google Cloud Console](https://console.cloud.google.com/)
1. Select your Firebase project
2. Go to **APIs & Services** → **Enabled APIs**
3. Search for "Firestore"
4. Should show: ✅ **Cloud Firestore API**

**If not listed:**
1. Click **+ Enable APIs and Services**
2. Search "Firestore"
3. Click **Cloud Firestore API**
4. Click **Enable**

### Check 4: Browser Console for Firebase Errors

Open browser DevTools Console (F12) and look for error messages:

**Error: "Permission denied for resource"**
- Fix: Update Firestore Security Rules (see Check 2 above)
- Reason: Security rules are blocking reads/writes

**Error: "Firebase: Error (auth/invalid-api-key)"**
- Fix: Check GitHub Secrets have correct values
- Reason: API key is invalid or missing

**Error: "projectId is required"**
- Fix: Add VITE_FIREBASE_PROJECT_ID to GitHub Secrets
- Reason: Project ID not found in config

**Error: "Could not reach Cloud Firestore backend"**
- Fix: Check internet connection, Firebase status page
- Reason: Network issue or Firebase service down

### Check 5: Test with Hard Refresh

Sometimes browsers cache old version:

1. Press **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
2. Or open in **Incognito/Private mode**

---

## Test Real-Time Sync (If Everything Looks Good)

**Setup:**
```
Tab 1: Open your deployed app
Tab 2: Open same app in different browser tab
```

**Test:**
1. In Tab 1: Go to **Question Manager**
2. In Tab 1: Add a new question and submit
3. In Tab 2: Watch question list
4. **Expected:** New question appears instantly (within 1 second)

**If it works:**
✅ Real-time sync is **enabled and working**

**If it doesn't work:**
❌ Check advanced diagnostics above for specific error

---

## Common Issues & Solutions

### Issue 1: Console Shows "Firebase not properly configured"

| Step | Action |
|------|--------|
| 1 | Verify all 7 GitHub Secrets added |
| 2 | Double-check values are correct (no extra spaces) |
| 3 | Re-deploy app (go to Actions → Re-run jobs) |
| 4 | Hard refresh browser (Ctrl+Shift+R) |
| 5 | Wait 5 minutes for GitHub Actions to complete |

### Issue 2: Questions Don't Sync Between Tabs

| Step | Action |
|------|--------|
| 1 | Check browser console for Firebase errors |
| 2 | Verify Firestore database exists |
| 3 | Check Firestore security rules |
| 4 | Check Firestore API is enabled |
| 5 | Try adding question again |

### Issue 3: Getting "Permission Denied" Error

| Step | Action |
|------|--------|
| 1 | Go to Firestore → Rules |
| 2 | Change `if true` to allow access |
| 3 | Publish rules |
| 4 | Refresh app and try again |

### Issue 4: Changes to Rules Don't Take Effect

| Step | Action |
|------|--------|
| 1 | Hard refresh browser (Ctrl+Shift+R) |
| 2 | Clear browser cache |
| 3 | Try in incognito/private mode |
| 4 | Wait 30 seconds after publishing rules |

---

## Reference: What Each GitHub Secret Does

| Secret | Purpose |
|--------|---------|
| VITE_FIREBASE_API_KEY | Authenticates your app to Firebase |
| VITE_FIREBASE_PROJECT_ID | Identifies your Firebase project |
| VITE_FIREBASE_AUTH_DOMAIN | Handles user authentication (optional for this app) |
| VITE_FIREBASE_STORAGE_BUCKET | Stores files in Firebase Storage (not used yet) |
| VITE_FIREBASE_MESSAGING_SENDER_ID | Enables push notifications (not used yet) |
| VITE_FIREBASE_APP_ID | Unique identifier for your Firebase app |
| VITE_FIREBASE_DATABASE_URL | Real-time database URL (Realtime DB, not Firestore) |

---

## Reference: Firestore Costs

Your app uses the **free tier** of Firebase:

- **First 50,000 read operations/day** - Free ✅
- **First 20,000 write operations/day** - Free ✅
- **No per-GB storage costs for development** - Free ✅

For a quiz app with ~100 users:
- Estimated cost: **$0.00/month** (within free tier)

See [Firebase Pricing](https://firebase.google.com/pricing) for details.

---

## Still Need Help?

### Check These Files for More Info
- **GITHUB_SECRETS_GUIDE.md** - Detailed GitHub Secrets setup
- **REALTIME_SYNC_FIX.md** - Technical implementation details
- **ENABLE_REALTIME_SYNC.md** - Quick start checklist

### Verify These Settings
- GitHub Secrets: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`
- Firebase Firestore: `https://console.firebase.google.com/` → Your project → Firestore
- GitHub Actions: `https://github.com/YOUR_USERNAME/YOUR_REPO/actions`
- Deployed app: Your GitHub Pages URL

### Common Mistakes to Avoid
❌ Don't share GitHub Secrets with anyone  
❌ Don't use API Key meant for web in backend code  
❌ Don't modify .github/workflows/deploy.yml unless you know what you're doing  
❌ Don't forget to publish Firestore rules after editing  
❌ Don't copy-paste from wrong Firebase project  

✅ Always verify values are copied exactly from Firebase  
✅ Always wait for GitHub Actions to complete before testing  
✅ Always hard-refresh browser after changes  
✅ Always check browser console for error messages  

---

## Firebase & GitHub Pages Limits

Your free Firebase project has these limits:

| Limit | Value |
|-------|-------|
| Concurrent connections | 100 |
| Read operations/day | 50,000 |
| Write operations/day | 20,000 |
| Delete operations/day | 20,000 |
| Storage | 1 GB |

With ~100 users answering 50 questions: **~5,000 operations/day** ✅ Safe

If you exceed limits, Firebase will alert you. Never charges without warning.

---

## Next Steps

1. ✅ Add GitHub Secrets (5 minutes)
2. ✅ Create Firestore database (5 minutes)
3. ✅ Configure Security Rules (2 minutes)
4. ✅ Re-deploy app (5 minutes)
5. ✅ Test real-time sync (2 minutes)

**Total time: ~20 minutes to enable real-time sync**

---

## Success Checklist

- [ ] All 7 GitHub Secrets added
- [ ] Secrets have correct values from Firebase
- [ ] Firestore database created in Firebase Console
- [ ] Firestore security rules configured
- [ ] App re-deployed after adding secrets
- [ ] Browser console shows `✅ Firebase properly configured`
- [ ] Tested real-time sync with multiple tabs
- [ ] New questions appear instantly across tabs
- [ ] No "Permission denied" errors in console
- [ ] App works without needing manual refresh

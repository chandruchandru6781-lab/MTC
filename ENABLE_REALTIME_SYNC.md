# Quick Start: Enable Real-Time Sync

## 🔴 CRITICAL: Do This First

### Add GitHub Secrets (5 minutes)

1. Go to: **GitHub → Your Repo → Settings → Secrets and variables → Actions**
2. Click **New repository secret** and add these 7 secrets:

| Secret Name | Value |
|---|---|
| VITE_FIREBASE_API_KEY | From Firebase Console |
| VITE_FIREBASE_PROJECT_ID | From Firebase Console |
| VITE_FIREBASE_AUTH_DOMAIN | From Firebase Console |
| VITE_FIREBASE_STORAGE_BUCKET | From Firebase Console |
| VITE_FIREBASE_MESSAGING_SENDER_ID | From Firebase Console |
| VITE_FIREBASE_APP_ID | From Firebase Console |
| VITE_FIREBASE_DATABASE_URL | From Firebase Console |

**Where to get values:** Firebase Console → Project Settings → Copy from JSON

### ✅ Done? Continue to next step...

---

## 🟡 Setup Firebase (10 minutes)

### Create Firestore Database

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database**
4. Click **Create Database**
5. Choose **Start in test mode**
6. Select **us-central1** region
7. Click **Create**

### Set Security Rules

1. Still in Firestore Database
2. Click **Rules** tab
3. Replace everything with:

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

4. Click **Publish**

### ✅ Done? Continue to next step...

---

## 🟢 Deploy Fix (2 minutes)

### Commit Code Changes

```bash
# Your code changes are ready to push
git add .
git commit -m "fix: enable real-time sync with firebase diagnostics"
git push origin main
```

### Or Re-Deploy Manually

If you don't want to commit:
1. Go to **GitHub → Actions**
2. Click latest workflow
3. Click **Re-run all jobs**

---

## ✨ Verify It Works (2 minutes)

### Check Browser Console

1. Visit your deployed app
2. Press **F12** or Right-click → **Inspect**
3. Go to **Console** tab
4. Look for message:
   - ✅ **`Firebase environment variables configured correctly`** = WORKING
   - ❌ **`Firebase not properly configured`** = Still missing secrets

### Test Real-Time Sync

**Open 2 browser tabs:**

**Tab 1:**
1. Visit your app
2. Go to Question Manager
3. Add a new question
4. Click Submit

**Tab 2:**
1. Watch the question list
2. If working: New question appears instantly
3. If not working: Question doesn't appear

---

## 🎯 Expected Result

✅ Questions added in one tab appear instantly in other tabs
✅ Browser console shows Firebase is configured
✅ Multiple users can see each other's questions in real-time

---

## 🆘 If It's Still Not Working

### Checklist

- [ ] All 7 GitHub Secrets added?
- [ ] Secrets have correct values?
- [ ] Firestore database created?
- [ ] Security rules published?
- [ ] App re-deployed after adding secrets?
- [ ] Browser cache cleared?
- [ ] Checked browser console for errors?

### Common Issues

**Problem:** Console shows `Firebase not properly configured`
**Fix:** Check GitHub Secrets are added and app is re-deployed

**Problem:** Console shows `Permission denied`
**Fix:** Check Firestore Security Rules are configured correctly

**Problem:** Questions don't sync between tabs
**Fix:** Make sure Firestore database exists (not just API key)

---

## 📚 Full Documentation

- **Detailed Setup:** See [GITHUB_SECRETS_GUIDE.md](GITHUB_SECRETS_GUIDE.md)
- **Implementation Details:** See [REALTIME_SYNC_FIX.md](REALTIME_SYNC_FIX.md)
- **Troubleshooting:** See browser console diagnostic messages

---

## 📞 Need Help?

Check browser console for specific error messages with:
- Project ID
- API key status
- Firestore connection errors

These messages tell exactly what's wrong!

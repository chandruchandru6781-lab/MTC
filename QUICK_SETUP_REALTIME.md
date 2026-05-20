# QUICK START - Real-Time Sync Setup (20 Minutes)

## 🎯 Your Goal
Enable real-time question sync so users see each other's questions instantly.

## ⏱️ Time Required
~20 minutes total

---

## STEP 1: Add GitHub Secrets (5 minutes)

### Go Here:
```
GitHub → Your Repo → Settings → Secrets and variables → Actions
```

### Add These 7 Secrets:

**From Firebase Console → Project Settings → Service Accounts:**

```
VITE_FIREBASE_API_KEY          = [Copy: apiKey]
VITE_FIREBASE_PROJECT_ID       = [Copy: projectId]
VITE_FIREBASE_AUTH_DOMAIN      = [Copy: authDomain]
VITE_FIREBASE_STORAGE_BUCKET   = [Copy: storageBucket]
VITE_FIREBASE_MESSAGING_SENDER_ID = [Copy: messagingSenderId]
VITE_FIREBASE_APP_ID           = [Copy: appId]
VITE_FIREBASE_DATABASE_URL     = [Copy: databaseURL]
```

✅ **Check:** All 7 secrets should show in repo settings

---

## STEP 2: Create Firestore Database (5 minutes)

### Go Here:
```
Firebase Console → Your Project → Firestore Database
```

### Do This:
1. Click **Create Database**
2. Choose **Start in test mode**
3. Select **us-central1** region
4. Click **Create**

✅ **Check:** Database shows as "us-central1"

---

## STEP 3: Set Firestore Security Rules (2 minutes)

### In Firebase Console:
1. Click **Rules** tab
2. Replace everything with:

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

3. Click **Publish**

✅ **Check:** Rules show "Last published: just now"

---

## STEP 4: Deploy App with Secrets (5 minutes)

### Option A: Via Git (Recommended)
```bash
git add .
git commit -m "Enable real-time sync with Firebase secrets"
git push origin main
```

### Option B: Via GitHub UI
1. Go to **GitHub → Actions**
2. Find latest workflow
3. Click **Re-run all jobs**

✅ **Check:** Build completes successfully (green checkmark)

---

## STEP 5: Verify It Works (2 minutes)

### Test in Browser:

**Tab 1:**
1. Open your deployed app
2. Press F12 → Console tab
3. Look for: `✅ Firebase environment variables configured correctly`

**Tab 2:**
1. Open same app in different tab
2. In Tab 1: Add a question → Submit
3. In Tab 2: Watch question list
4. Should appear **instantly**

✅ **Check:** Question appears in Tab 2 without refresh

---

## ✅ Success Checklist

- [ ] All 7 GitHub Secrets added
- [ ] Firestore database created
- [ ] Security rules published
- [ ] App re-deployed
- [ ] Browser console shows ✅ message
- [ ] Question syncs instantly across tabs
- [ ] Real-time sync is WORKING!

---

## 🆘 If Something Goes Wrong

### Problem: Console shows ❌ "Firebase not properly configured"
**Fix:** Check GitHub Secrets are added. Hard refresh browser (Ctrl+Shift+R). Wait 5 min for deploy.

### Problem: Console shows "Permission denied"
**Fix:** Make sure Firestore rules are published (click Publish button in Rules tab)

### Problem: Questions still don't sync
**Fix:** See TROUBLESHOOTING_REALTIME_SYNC.md for detailed diagnostics

---

## 📚 More Information

- **Quick Checklist:** ENABLE_REALTIME_SYNC.md
- **Full Setup Guide:** GITHUB_SECRETS_GUIDE.md
- **Troubleshooting:** TROUBLESHOOTING_REALTIME_SYNC.md
- **Technical Details:** REALTIME_SYNC_FIX.md

---

## 🎉 After Setup

Your app will have:
- ✅ Real-time question sync
- ✅ Instant updates across all users
- ✅ No page refresh needed
- ✅ Working on free Firebase tier
- ✅ Secure with GitHub Secrets

**Estimated cost: $0.00/month** (free tier)

---

## 📞 Still Need Help?

1. Check browser console (F12) for error messages
2. Verify all GitHub Secrets are correct
3. Confirm Firestore database exists
4. Make sure Security Rules are published
5. Hard refresh browser (Ctrl+Shift+R)

Your Firebase Diagnostics in console will tell you exactly what's wrong!

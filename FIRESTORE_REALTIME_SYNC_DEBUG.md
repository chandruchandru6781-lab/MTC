# Firestore Real-Time Sync Debugging Guide

## 🔍 Current Issue

**Symptom:** Real-time listener failing with `net::ERR_ABORTED` errors  
**Detection:** Question count shows 0 when Firestore listener fails to connect  
**Impact:** Real-time synchronization NOT working across tabs/devices

---

## ⚠️ CRITICAL: Check Firestore Security Rules

The most common cause of real-time sync failure is **incorrect security rules**.

### Step 1: Open Firebase Console
1. Go to https://console.firebase.google.com/
2. Select your project: **mtctraining-24d30**
3. Navigate to **Firestore Database** → **Rules** tab
4. Check what rules are currently set

### Step 2: Verify Current Rules Allow Reads

**MINIMUM for testing (INSECURE - DEV ONLY):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /quiz_questions/{document=**} {
      allow read, write: if true;
    }
  }
}
```

**If rules block reads:**
- Real-time listener will get permission denied errors
- Questions will show as 0
- Sync debug panel will show "Connected" but no data flows

### Step 3: Apply Correct Rules

1. Click **Edit Rules** in Firebase Console
2. Delete all existing rules
3. Paste the development rules above
4. Click **Publish**
5. Wait 1-2 minutes for rules to propagate

---

## 🧪 Testing After Rule Update

### Test 1: Verify Rules Applied
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter for requests to `firestore.googleapis.com`
4. Reload page
5. Check if requests say **200 OK** (success) or **403 Forbidden** (permission denied)

### Test 2: Real-Time Sync Test

**In Tab 1:**
1. Open http://localhost:5173/
2. Click **Open Sync Debug Panel** (bottom right)
3. Type in **"Enter test question..."** field: `Test: What is 2+2?`
4. Click **Add Question**
5. Watch for "Recently added" notification

**In Tab 2 (or new browser):**
1. Open http://localhost:5173/
2. Click **Open Sync Debug Panel**
3. Watch the **Questions: X** count
4. Should update automatically when Tab 1 adds questions

**Expected Behavior:**
- ✅ Test question appears in "Recent Questions" in Tab 1
- ✅ Question count increases by 1
- ✅ Tab 2 automatically shows updated count within 1-2 seconds
- ✅ Console shows `✅ Firestore update: X questions received`

---

## 🔧 If Sync Still Not Working

### Check 1: Firestore Collection Exists
1. In Firebase Console → Firestore Database → Collections
2. Verify `quiz_questions` collection exists
3. If not, add a test document:
   - Collection: `quiz_questions`
   - Document ID: `test123`
   - Fields: `question`, `options`, `answer`, `createdAt`, `updatedAt`

### Check 2: Browser Console Logs
1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for logs with 🔄, 📡, ✅, ❌ emojis
4. Check for any error messages about Firestore

**Expected logs:**
```
✅ HybridQuizDataManager: Firebase is CONFIGURED - Using cloud sync
🚀 App.tsx: Firebase configured, initializing real-time sync
📡 Subscribing to real-time question updates...
🔗 Connecting to Firestore quiz_questions collection...
✅ Firestore real-time listener attached
📨 Firebase callback triggered with 38 questions
✅ Real-time update received: 38 questions
```

### Check 3: Firebase Configuration
1. Verify `.env.local` has correct Firebase credentials
2. Check that `VITE_FIREBASE_PROJECT_ID=mtctraining-24d30`
3. Verify `VITE_FIREBASE_DATABASE_URL=https://mtctraining-24d30.firebaseio.com`

### Check 4: Network Connectivity
1. Open DevTools → Network tab
2. Try adding a test question
3. Check for failed requests to `firestore.googleapis.com`
4. Look for actual error responses (403, 500, timeout)

---

## 📋 Quick Firestore Rules Template

**Copy-paste ready for development:**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Quiz Questions - Allow read/write for development
    match /quiz_questions/{document=**} {
      allow read, write: if true;
    }
    
    // Quiz Sessions - Allow read/write for development
    match /quiz_sessions/{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **IMPORTANT:** This is for development ONLY. Replace with secure rules before production.

---

## 🚀 Production-Ready Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read-only questions
    match /quiz_questions/{document=**} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && 
                                      request.auth.email.endsWith('@mtcadmin.com');
    }
  }
}
```

---

## 📞 Still Not Working?

1. **Check Firebase Project Status:**
   - In Firebase Console, verify project is active
   - Check Billing (free tier might be limited)

2. **Clear Browser Cache:**
   - Close and reopen browser
   - Clear localStorage: `localStorage.clear()`
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

3. **Check Browser Console:**
   - Look for CORS errors
   - Look for authentication errors
   - Note any error messages and code

4. **Verify Network:**
   - Check internet connection
   - Check if you can reach `firestore.googleapis.com`
   - Try from different network

---

## ✅ Success Indicators

When real-time sync is working:

1. **Debug Panel shows:** "✅ Connected & Syncing"
2. **Question count updates** when switching tabs
3. **Console shows** `✅ Firestore update` messages
4. **Network tab shows** successful requests to `firestore.googleapis.com`
5. **Multiple tabs automatically sync** without page reload

---

## 🔐 Security Checklist

- [ ] Firestore rules are properly configured
- [ ] Rules allow your app to read questions
- [ ] Rules allow your app to write new questions (if needed)
- [ ] `quiz_questions` collection exists in Firestore
- [ ] Firebase credentials in `.env.local` are correct
- [ ] Project ID matches Firebase Console project


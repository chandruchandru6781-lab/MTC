# Firebase Security Rules

**Purpose:** Protect your Firestore database from unauthorized access  
**Last Updated:** May 20, 2026  

---

## ⚠️ CRITICAL: Default Rules Are Insecure

By default, Firebase allows ANYONE to read/write all data.

**Default (INSECURE):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## ✅ Recommended Security Rules

Use these rules for your quiz app:

### For Public Read-Only Quiz Questions
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow everyone to read questions
    match /quiz_questions/{document=**} {
      allow read: if true;
      // Prevent unauthorized writes
      allow write: if false;
    }
  }
}
```

### For Shared Editing (Current Implementation)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow everyone to read and write questions
    // (Use this while testing/development)
    match /quiz_questions/{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **WARNING:** This allows anyone to modify/delete questions. Use only in development.

### For Production (Authenticated Users)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access questions
    match /quiz_questions/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      // Only creator can delete
      allow delete: if request.auth.uid == resource.data.createdBy;
    }
    
    // Users collection (for future use)
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

### For Advanced: Questions by Topic
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Questions grouped by topic
    match /topics/{topicId}/questions/{questionId} {
      allow read: if true;  // Anyone can read
      
      // Only topic owner can modify
      allow create: if request.auth != null && 
                      request.auth.uid == get(/databases/$(database)/documents/topics/$(topicId)).data.ownerId;
      
      allow update, delete: if request.auth.uid == resource.data.createdBy;
    }
    
    // Topics collection
    match /topics/{topicId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth.uid == resource.data.ownerId;
      allow delete: if request.auth.uid == resource.data.ownerId;
    }
  }
}
```

---

## 📝 How to Apply Security Rules

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `mtctraining-24d30`
3. Go to **Firestore Database**
4. Click **Rules** tab

### Step 2: Replace the Current Rules
1. Clear the current rules
2. Copy the recommended rules from above
3. Paste into the editor
4. Click **Publish**

### Step 3: Test the Rules
Use the **Rules Simulator** in Firebase:
1. Click **Rules Simulator** (top right)
2. Test different operations:
   - **Read** test
   - **Write** test
   - **Delete** test
3. Verify access control works as expected

---

## 🔍 Understanding Security Rules

### Basic Structure
```
match /collection/{document} {
  allow operation: if condition;
}
```

### Operations
| Operation | Allows |
|-----------|--------|
| `read` | Reading documents |
| `write` | Creating & updating |
| `create` | Creating only |
| `update` | Updating only |
| `delete` | Deleting documents |
| `get` | Reading individual docs |
| `list` | Reading collections |

### Conditions
| Condition | Meaning |
|-----------|---------|
| `true` | Always allow |
| `false` | Always deny |
| `request.auth != null` | User is authenticated |
| `request.auth.uid == userId` | User is specific person |
| `resource.data.field == value` | Document field matches |
| `request.resource.data.field == value` | New data field matches |

### Examples
```
// Allow if authenticated
allow read: if request.auth != null;

// Allow if user owns the document
allow write: if request.auth.uid == resource.data.owner;

// Allow if field matches value
allow delete: if resource.data.status == 'archived';

// Allow if new data is valid
allow create: if request.resource.data.title != null && 
               request.resource.data.title.size() < 500;
```

---

## 🛡️ Security Rule Best Practices

### 1. Start Restrictive
```
❌ BAD - Too permissive
allow read, write: if true;

✅ GOOD - Only what's needed
allow read: if true;
allow write: if false;
```

### 2. Validate Data
```
❌ BAD - No validation
allow create: if request.auth != null;

✅ GOOD - Validate content
allow create: if request.auth != null &&
              request.resource.data.question.size() > 5 &&
              request.resource.data.question.size() < 1000;
```

### 3. Use Custom Claims (Advanced)
```
// Set custom claim in backend
admin.auth().setCustomUserClaims(uid, { role: 'teacher' });

// Use in rules
allow write: if request.auth.token.role == 'teacher';
```

### 4. Avoid Expensive Operations
```
❌ SLOW - Causes read overages
allow read: if get(/databases/$(database)/documents/config/global).data.allowAll == true;

✅ FAST - Simple condition
allow read: if request.auth != null;
```

### 5. Use Wildcards Carefully
```
❌ RISKY - Allows all subcollections
match /data/{document=**} {
  allow read: if true;
}

✅ SPECIFIC - Only quiz_questions
match /quiz_questions/{questionId} {
  allow read: if true;
}
```

---

## 🔐 Production Configuration

### Recommended for Production
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Default: deny all
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Public read-only quiz questions
    match /quiz_questions/{questionId} {
      allow read: if true;
      allow write: if false;
    }
    
    // User-specific data (for future auth)
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Quiz responses (track user answers)
    match /quiz_responses/{responseId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## ⚙️ Testing Rules

### Test in Firebase Console

**Test 1: Read Access**
```
Collection: quiz_questions
Document: any_question_id
Operation: get
User: Not authenticated
Expected: ✅ Allow (public read)
```

**Test 2: Write Access**
```
Collection: quiz_questions
Document: any_question_id
Operation: update
Data: { question: "New question" }
User: Not authenticated
Expected: ❌ Deny (no unauthorized writes)
```

**Test 3: Authenticated Write**
```
Collection: users/abc123/notes
Document: any_note_id
Operation: write
User: Authenticated (abc123)
Expected: ✅ Allow (user's own data)
```

---

## 🐛 Troubleshooting Rules

### "Permission denied" Error
**Problem:** Rules deny access  
**Solution:** Check if user is authenticated, check rule conditions

### Rules Editor Shows Red X
**Problem:** Syntax error in rules  
**Solution:** Check quotes, brackets, semicolons; use Rules Simulator to debug

### Changes Not Taking Effect
**Problem:** Rules not published  
**Solution:** Click **Publish** button to apply changes

### Slow Performance
**Problem:** Rules checking too many documents  
**Solution:** Use specific paths instead of wildcards; avoid expensive operations

---

## 📊 Monitoring Rules

### Monitor Access Logs
In Firebase Console:
1. Go to **Firestore Database**
2. Click **Logs** tab
3. Look for denied requests

### Common Denial Patterns
```
X rules_violation - quiz_questions write denied

This means someone tried to write to quiz_questions
but rules don't allow it. This is GOOD if intentional.
```

### Monitoring in Code
```typescript
import { doc, getDoc } from 'firebase/firestore';

try {
  const docSnapshot = await getDoc(doc(db, 'quiz_questions', 'id'));
  if (!docSnapshot.exists()) {
    console.log('Document not found or access denied');
  }
} catch (error: any) {
  if (error.code === 'permission-denied') {
    console.log('Access denied by security rules');
  }
}
```

---

## 🔄 Upgrading Rules Over Time

### Phase 1: Development (Current)
```
// Allow everyone to read and write
allow read, write: if true;
```

### Phase 2: Public Reading
```
// Allow reading, prevent writing
allow read: if true;
allow write: if false;
```

### Phase 3: User Authentication
```
// Require authentication
allow read: if request.auth != null;
allow write: if request.auth != null;
```

### Phase 4: Full Authorization
```
// Fine-grained control
allow read: if request.auth != null;
allow write: if request.auth.uid == resource.data.createdBy;
allow delete: if request.auth.uid == resource.data.createdBy;
```

---

## 📚 Resources

### Firebase Documentation
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/start)
- [Rules Best Practices](https://firebase.google.com/docs/firestore/security/rules-best-practices)
- [Rules Operators](https://firebase.google.com/docs/rules/rules-language)

### Security
- [OWASP Database Security](https://owasp.org/www-community/attacks/Database_Injection)
- [Google Cloud Security](https://cloud.google.com/security)

---

## ✅ Checklist

Before deploying:
- [ ] Reviewed current rules
- [ ] Applied recommended rules for your use case
- [ ] Tested with Rules Simulator
- [ ] Verified public read/private write
- [ ] Checked error logs for denials
- [ ] Documented your rules
- [ ] Set up monitoring

---

**Status:** Rules template provided  
**Last Updated:** May 20, 2026  

**Next Step:** Apply recommended rules in Firebase Console and test thoroughly.

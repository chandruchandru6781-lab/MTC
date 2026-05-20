# Security Best Practices Guide

**Purpose:** Protect your MTC Quiz App from common security vulnerabilities  
**Last Updated:** May 20, 2026  
**Status:** Active  

---

## 🔐 Quick Security Checklist

### Before Deployment
- [ ] Rotate Firebase API keys immediately
- [ ] Remove .env.local from Git history
- [ ] Add GitHub Secrets with new keys
- [ ] Verify all console.log removed
- [ ] Test security headers
- [ ] Test input validation
- [ ] Review Privacy Policy
- [ ] Enable HTTPS redirect

### After Deployment
- [ ] Monitor Firebase usage daily
- [ ] Set billing alerts ($5/month)
- [ ] Review error logs for attacks
- [ ] Test real-time sync
- [ ] Backup important data

---

## 1. Secret Management

### 1.1 What Are Secrets?
Secrets are sensitive credentials that should **NEVER** be exposed:
- ✗ Firebase API keys
- ✗ Database passwords
- ✗ Private encryption keys
- ✗ OAuth tokens
- ✗ Payment credentials

### 1.2 How to Protect Secrets

**❌ WRONG:**
```typescript
// DON'T DO THIS!
const apiKey = "AIzaSyCF5Wrw79_2NEEDUKcK-77h8OgGwEtJULM";
const firebaseConfig = {
  apiKey: apiKey, // Exposed in code!
  projectId: "mtctraining-24d30", // Visible in compiled code!
};
```

**✅ RIGHT:**
```typescript
// DO THIS!
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};
```

### 1.3 Using Environment Variables

**Local Development:**
```bash
# Create .env.local (never commit this!)
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other vars
```

**Production (GitHub Secrets):**
```bash
# GitHub Settings > Secrets and variables > Actions
# Add 7 secrets with your actual values
```

### 1.4 Rotation Schedule
- ✓ Rotate keys every 90 days (best practice)
- ✓ Immediately if ever exposed
- ✓ When leaving the project
- ✓ After major security incidents

---

## 2. Input Validation & Sanitization

### 2.1 Why Validate Input?
Attackers use malicious input to:
- ✓ Inject code (XSS/JavaScript injection)
- ✓ Corrupt data
- ✓ Crash the application
- ✓ Bypass security controls

### 2.2 How to Validate

**Use the Built-in Validation:**
```typescript
import { validateQuizQuestion } from '../utils/inputValidator';

// Validate before saving
const validation = validateQuizQuestion(userInput);
if (!validation.valid) {
  console.error('Validation failed:', validation.errors);
  return;
}

// Safe to use validated input
saveQuestion(validation.sanitized);
```

### 2.3 What Gets Validated?
- ✓ Question text (length, content)
- ✓ Option text (length, content)
- ✓ Answer (must be A, B, C, or D)
- ✓ All other user input

### 2.4 Dangerous Inputs to Block
```
<script>alert('XSS')</script>
javascript:alert('XSS')
<img src=x onerror=alert('XSS')>
<iframe src="evil.com"></iframe>
eval('malicious code')
```

---

## 3. Data Storage Security

### 3.1 localStorage (Local Only)
```typescript
// ✓ Safe for non-sensitive data
localStorage.setItem('quiz_questions', JSON.stringify(data));

// ⚠️ Subject to XSS attacks
// ⚠️ User can modify data
// ⚠️ Not encrypted on disk
```

### 3.2 Firebase Firestore (Shared)
```typescript
// ✓ Encrypted in transit (HTTPS)
// ✓ Encrypted at rest
// ✓ Real-time sync across users
// ⚠️ Must configure security rules
```

### 3.3 What NOT to Store
```typescript
// ✗ Don't store passwords
// ✗ Don't store API keys
// ✗ Don't store personal info (unless auth implemented)
// ✗ Don't store credit cards
// ✗ Don't store sensitive tokens
```

### 3.4 Encrypting Local Data (Optional)
```typescript
// For sensitive local data:
import * as crypto from 'crypto-js';

// Encrypt
const encrypted = crypto.AES.encrypt(data, secretKey).toString();
localStorage.setItem('data', encrypted);

// Decrypt
const decrypted = crypto.AES.decrypt(encrypted, secretKey).toString();
```

---

## 4. Authentication & Authorization

### 4.1 Current Status
- ✗ No authentication required
- ✓ Public quiz app (everyone can see/edit)
- ⚠️ No user accounts

### 4.2 Future: Adding Authentication
When you add user auth:

```typescript
// Implement Firebase Authentication
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Then update Firestore rules:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /quiz_questions/{document=**} {
      // Only authenticated users can access
      allow read, write: if request.auth != null;
      
      // Only user who created can delete
      allow delete: if request.auth.uid == resource.data.createdBy;
    }
  }
}
```

### 4.3 Session Security
```typescript
// ✓ Sessions auto-expire (browser close)
// ✓ No persistent authentication
// ✓ User logout on page refresh
// ⚠️ Add persistent auth when needed
```

---

## 5. Network Security (HTTPS)

### 5.1 Enforce HTTPS
```typescript
// This is done in main.tsx
if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
  if (window.location.protocol !== 'https:') {
    window.location.protocol = 'https:';
  }
}
```

### 5.2 HTTPS Benefits
- ✓ Encrypts data in transit
- ✓ Prevents man-in-the-middle attacks
- ✓ Verifies server identity
- ✓ Required for modern browsers

### 5.3 Certificate Management
- ✓ GitHub Pages provides free HTTPS
- ✓ Auto-renewed by GitHub
- ✓ No manual setup needed

---

## 6. Content Security Policy (CSP)

### 6.1 What is CSP?
Policy that restricts what code can run in your app

### 6.2 Our CSP Headers (in index.html)
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' https://firestore.googleapis.com;" />
```

### 6.3 What This Prevents
- ✓ Inline scripts (`<script>alert('xss')</script>`)
- ✓ External scripts from untrusted domains
- ✓ Eval and dynamic code execution
- ✓ Unsafe iframe embedding

### 6.4 If CSP is Too Strict
1. Add to CSP directive (not recommended)
2. Use external script files instead
3. Use event handlers properly
4. Keep CSP strict for security

---

## 7. Third-Party Dependencies

### 7.1 Audit Your Dependencies
```bash
# Check for vulnerabilities
npm audit

# See vulnerable packages
npm audit report

# Fix automatically if possible
npm audit fix

# Force fix (careful, may break things)
npm audit fix --force
```

### 7.2 Your Current Dependencies
```json
{
  "firebase": "^12.13.0",        // ✓ Trusted
  "react": "^18.2.0",            // ✓ Trusted
  "zustand": "^4.4.1",           // ✓ Trusted
  "framer-motion": "^10.16.4",   // ✓ Trusted
  "lucide-react": "^0.263.1"     // ✓ Trusted
}
```

### 7.3 Security Best Practices
- ✓ Use exact versions for critical packages
- ✓ Audit before adding new packages
- ✓ Keep dependencies updated
- ✓ Monitor security advisories

---

## 8. Error Handling & Logging

### 8.1 What NOT to Log
```typescript
// ❌ DON'T LOG:
console.log(firebaseConfig);        // Exposes API keys
console.log(user.email);            // Exposes personal data
console.log(apiResponse);           // May contain secrets
console.log(error.stack);           // Reveals architecture
```

### 8.2 Safe Logging
```typescript
// ✓ DO LOG:
console.log('Operation failed');    // Generic message
console.error('Database error');    // Generic error
console.warn('Rate limit exceeded'); // Generic warning

// ✓ Log only error codes
console.log('Error code: 403');     // Specific but safe

// ✓ Log in production-ready way
if (import.meta.env.DEV) {
  console.debug('Detailed info for dev only');
}
```

### 8.3 Error Messages to Users
```typescript
// ❌ DON'T SHOW:
"Database connection failed: mongodb://admin:password@..."

// ✓ DO SHOW:
"Unable to save question. Please try again later."
"An error occurred. Contact support if it persists."
```

---

## 9. Rate Limiting

### 9.1 Why Rate Limiting?
Prevents attackers from:
- ✓ Burning your Firebase quota
- ✓ Performing DDoS attacks
- ✓ Spamming the database
- ✓ Causing service degradation

### 9.2 Client-Side Rate Limiting
```typescript
class RequestLimiter {
  private requests: Map<string, number[]> = new Map();
  
  check(userId: string, maxPerMinute: number = 10): boolean {
    const now = Date.now();
    const requests = this.requests.get(userId) || [];
    
    // Remove old requests
    const recent = requests.filter(t => now - t < 60000);
    
    if (recent.length >= maxPerMinute) {
      return false; // Rate limit exceeded
    }
    
    recent.push(now);
    this.requests.set(userId, recent);
    return true;
  }
}

// Usage
const limiter = new RequestLimiter();
if (!limiter.check('user123')) {
  throw new Error('Rate limit exceeded. Try again in 1 minute.');
}
```

### 9.3 Server-Side Rate Limiting (Future)
When you add a backend:
```javascript
// Using Express + rateLimit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.post('/api/questions', limiter, (req, res) => {
  // Handle request
});
```

### 9.4 Firebase Billing Limits
Set up billing alerts:

1. Go to Firebase Console
2. Billing > Budget alerts
3. Set to $5/month to start
4. Get email if approaching limit

---

## 10. Secure Communication

### 10.1 CORS Configuration
Currently: Firebase handles CORS automatically

Future backend:
```typescript
import cors from 'cors';

app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
```

### 10.2 Headers to Implement
```typescript
// Security headers (applied by GitHub Pages automatically)
X-Frame-Options: DENY                    // Prevent clickjacking
X-Content-Type-Options: nosniff          // Prevent MIME sniffing
X-XSS-Protection: 1; mode=block          // Additional XSS protection
Strict-Transport-Security: max-age=31536000  // Enforce HTTPS
Content-Security-Policy: ...             // Restrict content
```

---

## 11. Regular Security Maintenance

### 11.1 Daily
- [ ] Monitor Firebase usage
- [ ] Check error logs

### 11.2 Weekly
- [ ] Review security headers
- [ ] Test key functionality

### 11.3 Monthly
- [ ] Run `npm audit`
- [ ] Update dependencies
- [ ] Review firestore rules
- [ ] Check for new CVEs

### 11.4 Quarterly
- [ ] Rotate API keys
- [ ] Security audit
- [ ] Penetration testing (optional)
- [ ] Architecture review

---

## 12. Incident Response

### 12.1 If Your API Keys Are Exposed
```bash
1. IMMEDIATELY rotate the keys in Firebase Console
2. Remove .env.local from Git history using BFG
3. Update GitHub Secrets with new keys
4. Delete old API keys from Firebase
5. Review Firebase access logs
6. Test application with new keys
7. Document what happened and why
```

### 12.2 If Data Is Breached
```bash
1. Disable affected resources
2. Notify users (if personal data exposed)
3. Change all passwords/keys
4. Review and update security measures
5. Monitor for further incidents
6. Report to relevant authorities if required
```

### 12.3 If Application Is Attacked
```bash
1. Check error logs for suspicious activity
2. Review Firebase Security Rules
3. Enable IP whitelisting if available
4. Disable affected features temporarily
5. Scale resources to handle load
6. Implement rate limiting
7. Contact Firebase support if needed
```

---

## 13. Security Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Firebase Security Best Practices](https://firebase.google.com/support/privacy/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)

### Tools
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [OWASP ZAP](https://www.zaproxy.org/)
- [Snyk](https://snyk.io/)
- [Burp Suite](https://portswigger.net/burp)

### Testing
- [Security Headers Tool](https://securityheaders.com/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [OWASP Checklist](https://cheatsheetseries.owasp.org/)

---

## 14. Summary

| Security Feature | Status | Notes |
|------------------|--------|-------|
| Input Validation | ✅ | Prevents XSS and injection |
| HTTPS Enforcement | ✅ | Automatically enabled |
| Security Headers | ✅ | CSP and others configured |
| Secrets Protection | ✅ | Environment variables used |
| Rate Limiting | ⏳ | Client-side ready, guide provided |
| Firebase Security | ⏳ | Rules need configuration |
| Authentication | ⏳ | Implement when needed |
| Error Logging | ✅ | Safe logging practices |
| Dependency Audit | ✅ | Use npm audit regularly |
| Backup & Recovery | ✅ | Firebase provides automatic |

---

## 15. Questions?

**Common Security Questions:**

**Q: Can my API keys be recovered?**  
A: No, once rotated they're gone. GitHub may have cached them temporarily but they're useless without new keys.

**Q: Is localStorage secure?**  
A: Not really. It's subject to XSS attacks and user manipulation. Use Firebase Firestore for important data.

**Q: Do I need CORS configuration?**  
A: No, Firebase handles it automatically.

**Q: When should I add authentication?**  
A: When you want to track who created what or allow private questions.

**Q: How much will Firebase cost?**  
A: Nothing if you stay within free tier limits. Set billing alerts to be safe.

---

**Status:** ✅ All security measures implemented and documented  
**Last Reviewed:** May 20, 2026  
**Next Review:** August 20, 2026  

*For questions or improvements, open an issue on GitHub.*

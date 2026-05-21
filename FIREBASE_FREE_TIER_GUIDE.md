# Firebase Free Tier Limits & Monitoring

**Purpose:** Stay within Firebase free tier to avoid unexpected charges  
**Last Updated:** May 20, 2026  

---

## 💰 Free Tier Limits

| Feature | Daily Limit | Your Risk | Action |
|---------|------------|-----------|--------|
| **Firestore Reads** | 50,000 | 🟢 Low | Monitor |
| **Firestore Writes** | 20,000 | 🟢 Low | Monitor |
| **Firestore Deletes** | 20,000 | 🟢 Low | Monitor |
| **Realtime DB Reads** | 100,000 | 🟢 Low | Monitor |
| **Realtime DB Writes** | 100,000 | 🟢 Low | Monitor |
| **Cloud Storage** | 5 GB | 🟢 Low | Not using |
| **Download** | 1 GB/day | 🟢 Low | Monitor |
| **Authentication** | 50,000/month | 🟢 Low | Not using |

---

## 📊 Usage Estimation

### Typical Quiz App Usage
```
User adds question:
  1 read (check collection)
  1 write (save question)
  = 2 operations per question

User takes quiz:
  1 read (fetch all questions)
  1 write (save response)
  = 2 operations per quiz

Per 100 users:
  100 questions added × 2 ops = 200 ops
  100 quizzes taken × 2 ops = 200 ops
  Total: 400 operations

Well within free tier! ✅
```

### When You Might Exceed Limits
- ✗ Abusive API calls (attackers)
- ✗ Inefficient queries (N+1 queries)
- ✗ Poorly configured sync
- ✗ Unoptimized real-time listeners
- ✗ Thousands of concurrent users

---

## 🚨 Billing Alert Setup

### Step 1: Enable Billing Alerts

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `mtctraining-24d30`
3. Click the hamburger menu (☰)
4. Go to **Billing**
5. Click **Budget alerts** in left sidebar
6. Click **Create budget**

### Step 2: Configure Budget

```
Budget name: MTC Quiz Free Tier
Budget amount: $5.00 USD
Threshold: 50%, 90%, 100%
Email: your-email@example.com
```

### Step 3: Receive Alerts

You'll get emails when you:
- ✓ Reach 50% of $5 budget ($2.50 spent)
- ✓ Reach 90% of $5 budget ($4.50 spent)
- ✓ Reach 100% of $5 budget ($5.00 spent)

**Action:** If you get alerts, investigate usage spike immediately.

---

## 📈 Monitoring Usage

### In Firebase Console

1. Go to **Firestore Database**
2. Click **Usage** tab
3. View daily reads/writes/deletes

### Understand the Graph
```
Top line: Your daily usage
Horizontal line: Free tier limit

If line hits horizontal line: ⚠️ ALERT!
If line goes above: 💰 START CHARGING!
```

### Set Up Daily Review Habit
- [ ] Check usage dashboard daily
- [ ] Look for unusual spikes
- [ ] Review error logs
- [ ] Monitor active connections

---

## 🛑 Rate Limiting (Prevent Overages)

### Why Limit Requests?
Without limits, attackers can:
- ✓ Spam write operations (burn quota)
- ✓ Cause denial-of-service
- ✓ Burn your monthly allowance in hours

### Implement Rate Limiting

**Client-Side Protection:**
```typescript
class RateLimiter {
  private userRequests: Map<string, number[]> = new Map();
  
  isAllowed(userId: string, maxPerMinute: number = 10): boolean {
    const now = Date.now();
    const requests = this.userRequests.get(userId) || [];
    
    // Keep only requests from last minute
    const recentRequests = requests.filter(t => now - t < 60000);
    
    if (recentRequests.length >= maxPerMinute) {
      return false; // Rate limit exceeded
    }
    
    recentRequests.push(now);
    this.userRequests.set(userId, recentRequests);
    return true;
  }
}

// Usage in component
const limiter = new RateLimiter();

const handleAddQuestion = async (question: QuizQuestion) => {
  const userId = 'anonymous'; // Or get real user ID
  
  if (!limiter.isAllowed(userId, 5)) { // Max 5 questions per minute
    alert('You\'re adding questions too fast. Please wait a minute.');
    return;
  }
  
  // Proceed with adding question
  await addQuestion(question);
};
```

**Recommended Limits:**
```
Add question: 5 per minute
Delete question: 10 per minute
Take quiz: 30 per minute
Search: 60 per minute
```

### Server-Side Rate Limiting (Future)

When you add a backend:
```javascript
const rateLimit = require('express-rate-limit');

// Create a limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to all routes
app.use(limiter);

// Or specific routes
app.post('/api/questions', limiter, (req, res) => {
  // Handle request
});
```

---

## 🔍 Cost Breakdown

### What You Might Pay

**Scenario 1: 100 active users**
```
Daily operations:
  100 users × 10 questions = 1,000 operations
  Well within free tier ✅
  Cost: $0
```

**Scenario 2: 10,000 active users**
```
Daily operations:
  10,000 users × 10 questions = 100,000 operations
  Exceeds 50K read limit
  Costs: $0.06/100K reads = ~$3-5/day
  Monthly: ~$100-150
```

**Scenario 3: Attacked (1M requests/day)**
```
1M requests × ($0.06/100K reads) = $600+/day
Total: ~$18,000/month ⚠️
This is why rate limiting is critical!
```

---

## ⚡ Optimization Tips

### Reduce Read Operations
```typescript
// ❌ BAD: Reads all questions every time
const questions = await getQuestions();

// ✅ GOOD: Cache locally, subscribe to updates
const [questions, setQuestions] = useState<QuizQuestion[]>([]);

useEffect(() => {
  const unsubscribe = subscribeToQuestions((newQuestions) => {
    setQuestions(newQuestions); // Update once, not fetches repeatedly
  });
  
  return unsubscribe;
}, []);
```

### Reduce Write Operations
```typescript
// ❌ BAD: Write each character as user types
const handleChange = (text: string) => {
  saveQuestion(text); // Too many writes!
};

// ✅ GOOD: Debounce, save on submit
const handleSubmit = (text: string) => {
  saveQuestion(text); // Save once when user clicks submit
};
```

### Reduce Bandwidth
```typescript
// ❌ BAD: Store huge objects
{
  id: "...",
  question: "...",
  options: [...],
  metadata: { /* 100 fields */ }
}

// ✅ GOOD: Store only needed fields
{
  id: "...",
  question: "...",
  options: [...]
}
```

### Use Indexes
```typescript
// Firestore automatically creates indexes for:
// - Single field queries
// - Sorting

// But you may need composite indexes for:
// - Multiple field queries
// - Complex filters

// Firebase will tell you when creating these queries
```

---

## 🚀 Scaling Beyond Free Tier

When you need to pay (if app grows):

### Step 1: Upgrade to Blaze Plan
1. Firebase Console → Billing
2. Click **Upgrade to Blaze**
3. Add billing information
4. Pay only for what you use

### Step 2: Set Spending Limits
1. Billing → Budget alerts
2. Set max monthly spend (e.g., $50)
3. You'll be warned when approaching limit

### Step 3: Optimize Further
1. Set up Cloud Functions for processing
2. Use Cloud CDN for static assets
3. Archive old data to reduce storage
4. Implement more aggressive caching

### Step 4: Monitor Costs
```
Monthly expenses to track:
  Firestore reads: $0.06 per 100K
  Firestore writes: $0.18 per 100K
  Cloud Storage: $0.020 per GB
  Egress: $0.12 per GB
  Functions: $0.40 per million invocations
```

---

## ✅ Daily Checklist

### Every Day
- [ ] Check Firebase usage dashboard
- [ ] Look for unusual spikes
- [ ] Review error logs
- [ ] Test app manually

### Every Week
- [ ] Verify billing alerts are configured
- [ ] Check for slow queries
- [ ] Review security rules
- [ ] Monitor active users

### Every Month
- [ ] Review total costs
- [ ] Analyze usage patterns
- [ ] Optimize inefficient queries
- [ ] Plan for growth

---

## 🎯 Free Tier Sustainability

### To Stay Within Free Tier:
1. ✅ Implement rate limiting
2. ✅ Monitor usage daily
3. ✅ Set up billing alerts
4. ✅ Optimize queries
5. ✅ Cache frequently accessed data
6. ✅ Use Cloud Functions wisely
7. ✅ Archive old data
8. ✅ Keep users under 1,000

### Signs You're Outgrowing Free Tier:
- ✗ Daily usage > 50K reads
- ✗ Multiple users per second
- ✗ Unexpected cost alerts
- ✗ Slow app performance
- ✗ Frequent rate limit hits

---

## 💡 FAQ

**Q: How much does Firebase cost after free tier?**  
A: You pay per operation:
- $0.06 per 100K reads
- $0.18 per 100K writes
- $0.12 per GB of egress
- Typical app: $5-50/month at 10K users

**Q: Can I cap my spending?**  
A: Yes, set a budget alert and monitor daily.

**Q: What happens if I exceed limits?**  
A: Firebase will either throttle requests or charge you, depending on your plan.

**Q: How do I avoid surprise bills?**  
A: 
- Set billing alerts
- Implement rate limiting
- Monitor dashboard daily
- Use free tier optimization

**Q: Is my data lost if I exceed limit?**  
A: No, your data is safe. You just get charged or throttled.

---

## 🔗 Useful Links

- [Firebase Pricing](https://firebase.google.com/pricing)
- [Firebase Quotas & Limits](https://firebase.google.com/docs/firestore/quotas)
- [Cost Optimization](https://firebase.google.com/docs/firestore/best-practices)
- [Billing Documentation](https://firebase.google.com/docs/projects/billing/usage-and-billing)

---

**Status:** ✅ Free tier sustainable if rate limiting is implemented  
**Last Updated:** May 20, 2026  
**Next Review:** June 20, 2026  

**Remember:** Monitor, limit, optimize - in that order!

# Consumer Data Manager — Integration Breakdown

**Status:** 📝 Planning  
**Duration:** Final 2-3 days (8-10 Juli)  
**Owner:** Both Backend & Frontend + QA

---

## 🔗 API Integration Points

### **Frontend ↔ Backend Connection**

**Auth Integration:**
```javascript
// Frontend stores JWT in localStorage
const token = localStorage.getItem('token')

// Every API call includes token
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}

// Auto-refresh token on 401
if (response.status === 401) {
  await refreshToken()
  retry(originalRequest)
}
```

**Error Handling:**
```javascript
try {
  const response = await fetch('/api/v1/konsumen', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  
  if (!response.ok) {
    const error = await response.json()
    // Show user-friendly error message
    showToast(error.message, 'error')
  }
} catch (error) {
  // Network error
  showToast('Connection failed. Retry?', 'error')
}
```

---

## 🧪 Testing Strategy

### **Unit Tests (Backend)**
- [ ] Validation functions (email, kontak_wa format)
- [ ] Calculation functions (total, margin%)
- [ ] State transitions (order status flow)
- [ ] Authorization checks

**Tools:** Jest + Supertest

```javascript
// Example: Test order creation
describe('Order creation', () => {
  it('should create order & deduct stok', async () => {
    const order = await createOrder({ konsumen_id, items })
    expect(order.status).toBe('draft')
    expect(order.invoice).toBeDefined()
  })
  
  it('should fail if stok insufficient', async () => {
    expect(() => createOrder({ items: [{ barang_id, jumlah: 999 }] }))
      .toThrow('Stok tidak cukup')
  })
})
```

### **Integration Tests (Backend)**
- [ ] Create order → invoice generated
- [ ] Confirm order → stok deducted
- [ ] Record payment → invoice status updated
- [ ] Pengiriman creation → route generated

**Tools:** Jest + Database fixtures

```javascript
describe('Order workflow', () => {
  it('full workflow: create → confirm → invoice', async () => {
    // Create
    const order = await api.post('/orders', { ...data })
    expect(order.invoice).toBeDefined()
    
    // Confirm
    await api.post(`/orders/${order.id}/confirm`)
    
    // Verify stok deducted
    const barang = await api.get(`/barang/${item.barang_id}`)
    expect(barang.stok).toBe(initialStok - item.jumlah)
  })
})
```

### **Frontend Component Tests**
- [ ] Form validation (show errors)
- [ ] List filtering & search
- [ ] Modal open/close
- [ ] Loading states
- [ ] Error notifications

**Tools:** React Testing Library

```javascript
describe('Create Order Form', () => {
  it('should validate required fields', () => {
    const { getByText } = render(<CreateOrderForm />)
    fireEvent.click(getByText('Create'))
    expect(getByText('Konsumen required')).toBeInTheDocument()
  })
})
```

### **E2E Tests**
- [ ] User login → dashboard
- [ ] Create order from scratch → invoice
- [ ] Select delivery items → generate route
- [ ] Record payment → invoice status changes

**Tools:** Cypress or Playwright

```javascript
describe('Order creation E2E', () => {
  it('should create order to invoice in one flow', () => {
    cy.login('admin@test.com', 'password')
    cy.visit('/orders')
    cy.contains('New Order').click()
    
    cy.get('[name="konsumen"]').select('Warung Jaya')
    cy.contains('Add Item').click()
    cy.get('[name="barang"]').select('Minyak Goreng')
    cy.get('[name="jumlah"]').type('5')
    
    cy.contains('Create Order').click()
    cy.contains('Invoice').should('be.visible')
  })
})
```

---

## ✅ Pre-Deployment Checklist

### **Code Quality**
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code coverage >= 80%
- [ ] No console errors
- [ ] No linting errors
- [ ] Security check (no hardcoded secrets)
- [ ] Performance check (no N+1 queries)

### **Frontend**
- [ ] All pages responsive (mobile, tablet, desktop)
- [ ] All links working
- [ ] Forms validate correctly
- [ ] Error messages clear & helpful
- [ ] Loading states working
- [ ] No dead code

### **Backend**
- [ ] All endpoints tested
- [ ] Database migrations working
- [ ] Error responses consistent
- [ ] Rate limiting configured
- [ ] CORS properly set

### **Documentation**
- [ ] API docs complete
- [ ] Database schema documented
- [ ] Deployment guide written
- [ ] User guide drafted
- [ ] Code comments added

### **Security**
- [ ] Passwords hashed (bcrypt)
- [ ] JWT secrets secure (env vars)
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (input sanitized)
- [ ] CSRF protection enabled (if session-based)

---

## 🚀 Deployment Steps

### **Phase 1: Staging Deployment**

```bash
# 1. Backend deployment
git push staging main
# → Automated: run tests, build, deploy to railway

# 2. Database migrations
npm run migrate:production
# → Create tables, indexes

# 3. Seed data (optional)
npm run seed:staging
# → Add test konsumen, barang, etc

# 4. Frontend deployment
npm run build
# → Optimized build
npm run deploy:vercel
# → Deploy to Vercel

# 5. Smoke tests
npm run test:e2e:staging
# → Run critical E2E tests
```

### **Phase 2: Production Deployment**

```bash
# 1. Backup production database
pg_dump production > backup_2026-07-10.sql

# 2. Deploy backend
git push production main
# → Tests, build, deploy

# 3. Run migrations
npm run migrate:production --force

# 4. Deploy frontend
npm run build:prod
npm run deploy:vercel:prod

# 5. Verify (monitoring)
curl https://app.consumerdatamanager.com/health
# → Should return { status: 'ok' }
```

---

## 📊 Monitoring & Observability

### **Error Tracking** (Sentry)
```javascript
import Sentry from '@sentry/react'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
})

// Errors automatically captured
try {
  // ...
} catch (error) {
  Sentry.captureException(error)
}
```

### **Logging** (Winston)
```javascript
logger.info('Order created', { orderId, konsumenId, total })
logger.error('Order failed', { error, userId, data })
logger.warn('Stok low', { barangId, stok })
```

### **Performance Monitoring** (Datadog/New Relic)
```
Track:
- API response times (goal: < 500ms)
- Database query times (goal: < 100ms)
- Frontend load time (goal: < 3s)
- Error rate (goal: < 0.1%)
```

### **Uptime Monitoring**
```
Tool: Uptime Robot
Check: https://api.consumerdatamanager.com/health every 5 min
Alert: If down for > 5 min, notify admin
```

---

## 🆘 Rollback Plan

**If deployment fails:**

```bash
# 1. Immediate rollback
git revert <bad-commit>
git push production main
# → Redeploy previous version

# 2. Restore database (if needed)
psql production < backup_2026-07-10.sql

# 3. Notify team
Slack message: "Rolled back to previous version. Investigating..."

# 4. Investigate issue
Check: Sentry, logs, monitoring
```

---

## 📋 Post-Deployment Tasks

- [ ] Smoke test all features
- [ ] Monitor error logs (first 1 hour)
- [ ] Verify database performance
- [ ] Check API response times
- [ ] Confirm emails/messages sending
- [ ] Monitor payment integration
- [ ] Get stakeholder sign-off

---

## 🔄 Continuous Improvement

### **First Week After Deploy**
- [ ] Gather user feedback
- [ ] Monitor performance metrics
- [ ] Fix critical bugs (hotfixes)
- [ ] Optimize slow queries
- [ ] Improve error messages based on user feedback

### **First Month**
- [ ] Analyze omset data (is calculation correct?)
- [ ] Check pengiriman routes (are they optimal?)
- [ ] Review inventory accuracy
- [ ] Gather team feedback for improvements

---

## ✅ Final Checklist

- [ ] All 5 breakdowns complete
- [ ] Code integrated & tested
- [ ] Documentation complete
- [ ] Deployment plan ready
- [ ] Monitoring configured
- [ ] Rollback plan documented
- [ ] Team trained
- [ ] Ready for production!

---

**Status:** Ready to Code  
**Next:** Implementation starts 2 Juli 2026 ✅

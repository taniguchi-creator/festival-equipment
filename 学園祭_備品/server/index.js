import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory / file backed API server for full-stack deployment
let equipmentDb = [];
let applicationsDb = [];
let classesDb = [];
let sentEmailsDb = [];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/equipment', (req, res) => {
  res.json(equipmentDb);
});

app.post('/api/applications', (req, res) => {
  const { user, items, purpose, startDate, endDate } = req.body;
  const newApp = {
    id: 'APP-' + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toISOString(),
    userName: user.name,
    userClass: user.className,
    userEmail: user.email,
    purpose,
    startDate,
    endDate,
    status: 'pending',
    items
  };
  applicationsDb.unshift(newApp);
  res.status(201).json(newApp);
});

app.post('/api/applications/:id/approve', (req, res) => {
  const { id } = req.params;
  const appItem = applicationsDb.find(a => a.id === id);
  if (!appItem) return res.status(404).json({ error: 'Application not found' });

  appItem.status = 'approved';
  appItem.processedAt = new Date().toISOString();

  // Stock reduction logic
  appItem.items.forEach(reqItem => {
    const eq = equipmentDb.find(e => e.id === reqItem.id);
    if (eq) {
      eq.stock = Math.max(0, eq.stock - reqItem.quantity);
    }
  });

  const emailNotification = {
    id: 'mail_' + Date.now(),
    to: appItem.userEmail,
    subject: `【KCS学園祭備品管理】貸出申請が承認されました (${appItem.id})`,
    sentAt: new Date().toISOString()
  };
  sentEmailsDb.unshift(emailNotification);

  res.json({ success: true, application: appItem, email: emailNotification });
});

app.post('/api/applications/:id/reject', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const appItem = applicationsDb.find(a => a.id === id);
  if (!appItem) return res.status(404).json({ error: 'Application not found' });

  appItem.status = 'rejected';
  appItem.rejectReason = reason || '承認されませんでした';
  appItem.processedAt = new Date().toISOString();

  const emailNotification = {
    id: 'mail_' + Date.now(),
    to: appItem.userEmail,
    subject: `【KCS学園祭備品管理】貸出申請結果のご連絡 (${appItem.id})`,
    sentAt: new Date().toISOString()
  };
  sentEmailsDb.unshift(emailNotification);

  res.json({ success: true, application: appItem, email: emailNotification });
});

app.listen(PORT, () => {
  console.log(`[KCS Equipment API Server] Running on http://localhost:${PORT}`);
});

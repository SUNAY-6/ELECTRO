require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const store = require('./services/store');
const { buildSeed } = require('./data/seed');
const { upload } = require('./middleware/upload');
const { requireAuth } = require('./middleware/auth');

if (!store.read()) {
  store.write(buildSeed(process.env));
}

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ONLINE', voltage: '3.3V', time: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/contact', require('./routes/contact'));

app.post('/api/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'NO PAYLOAD', message: 'Image file required.' });
  res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
});

app.use((err, _req, res, _next) => {
  const message = err.message || 'Unexpected server fault.';
  const status = err.status || 500;
  res.status(status).json({ error: 'SIGNAL INTERRUPTED', message });
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`ECE lab API online on :${PORT}`);
});

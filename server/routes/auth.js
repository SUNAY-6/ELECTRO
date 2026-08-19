const express = require('express');
const bcrypt = require('bcryptjs');
const store = require('../services/store');
const { signToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'INCOMPLETE SIGNAL', message: 'Username and password are required.' });
  }
  const admin = store.get('admin');
  const userOk = username === admin.username;
  const passOk = bcrypt.compareSync(password, admin.passwordHash);
  if (!userOk || !passOk) {
    return res.status(401).json({ error: 'ACCESS DENIED', message: 'Invalid credentials.' });
  }
  const token = signToken({ id: admin.id, username: admin.username });
  res.json({ token, username: admin.username });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ username: req.user.username });
});

router.put('/password', requireAuth, (req, res) => {
  const { currentPassword, nextPassword } = req.body || {};
  if (!currentPassword || !nextPassword || String(nextPassword).length < 8) {
    return res.status(400).json({ error: 'WEAK SIGNAL', message: 'Provide current password and a new password (8+ chars).' });
  }
  const admin = store.get('admin');
  if (!bcrypt.compareSync(currentPassword, admin.passwordHash)) {
    return res.status(401).json({ error: 'ACCESS DENIED', message: 'Current password is incorrect.' });
  }
  store.set('admin', { ...admin, passwordHash: bcrypt.hashSync(nextPassword, 10) });
  res.json({ ok: true });
});

module.exports = router;

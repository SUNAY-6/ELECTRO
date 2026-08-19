const express = require('express');
const { v4: uuid } = require('uuid');
const store = require('../services/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body || {};
  const errors = {};
  if (!name || String(name).trim().length < 2) errors.name = 'Name is required.';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email is required.';
  if (!subject || String(subject).trim().length < 2) errors.subject = 'Subject is required.';
  if (!message || String(message).trim().length < 10) errors.message = 'Message should be at least 10 characters.';
  if (Object.keys(errors).length) {
    return res.status(400).json({ error: 'SIGNAL REJECTED', message: 'Please correct the form.', errors });
  }
  const entry = {
    id: uuid(),
    name: String(name).trim(),
    email: String(email).trim(),
    subject: String(subject).trim(),
    message: String(message).trim(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  store.set('messages', [entry, ...store.get('messages')]);
  res.status(201).json({ ok: true, id: entry.id });
});

router.get('/messages', requireAuth, (_req, res) => {
  res.json(store.get('messages'));
});

router.put('/messages/:id/read', requireAuth, (req, res) => {
  const messages = store.get('messages');
  const idx = messages.findIndex((m) => m.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'NO PACKET', message: 'Message not found.' });
  const copy = [...messages];
  copy[idx] = { ...copy[idx], read: true };
  store.set('messages', copy);
  res.json(copy[idx]);
});

router.delete('/messages/:id', requireAuth, (req, res) => {
  store.set('messages', store.get('messages').filter((m) => m.id !== req.params.id));
  res.json({ ok: true });
});

module.exports = router;

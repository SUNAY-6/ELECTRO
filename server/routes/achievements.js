const express = require('express');
const { v4: uuid } = require('uuid');
const store = require('../services/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', (_req, res) => {
  const items = [...store.get('achievements')].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  res.json(items);
});

router.post('/', requireAuth, (req, res) => {
  const body = req.body || {};
  if (!body.title) return res.status(400).json({ error: 'INCOMPLETE', message: 'Title is required.' });
  const items = store.get('achievements');
  const item = {
    id: uuid(),
    title: body.title,
    organization: body.organization || '',
    description: body.description || '',
    date: body.date || new Date().toISOString().slice(0, 7),
    category: body.category || 'Award',
    image: body.image || '',
    certificateUrl: body.certificateUrl || '',
    order: Number.isFinite(body.order) ? body.order : items.length + 1,
  };
  store.set('achievements', [...items, item]);
  res.status(201).json(item);
});

router.put('/:id', requireAuth, (req, res) => {
  const items = store.get('achievements');
  const idx = items.findIndex((a) => a.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'NO NODE', message: 'Achievement not found.' });
  const next = { ...items[idx], ...req.body, id: items[idx].id };
  const copy = [...items];
  copy[idx] = next;
  store.set('achievements', copy);
  res.json(next);
});

router.delete('/:id', requireAuth, (req, res) => {
  const items = store.get('achievements');
  if (!items.some((a) => a.id === req.params.id)) {
    return res.status(404).json({ error: 'NO NODE', message: 'Achievement not found.' });
  }
  store.set('achievements', items.filter((a) => a.id !== req.params.id));
  res.json({ ok: true });
});

module.exports = router;

const express = require('express');
const store = require('../services/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json({
    profile: store.get('profile'),
    settings: store.get('settings'),
    stats: store.get('stats'),
  });
});

router.put('/', requireAuth, (req, res) => {
  const current = store.get('profile');
  const next = { ...current, ...(req.body || {}) };
  if (req.body?.stats) next.stats = { ...current.stats, ...req.body.stats };
  store.set('profile', next);
  res.json(next);
});

router.put('/settings', requireAuth, (req, res) => {
  const next = { ...store.get('settings'), ...(req.body || {}) };
  store.set('settings', next);
  res.json(next);
});

router.post('/view', (_req, res) => {
  res.json(store.bumpViews());
});

module.exports = router;

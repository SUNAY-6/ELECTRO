const express = require('express');
const { v4: uuid } = require('uuid');
const store = require('../services/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', (_req, res) => res.json(store.get('skills')));

router.post('/', requireAuth, (req, res) => {
  const body = req.body || {};
  if (!body.name) return res.status(400).json({ error: 'INCOMPLETE', message: 'Name is required.' });
  const skill = {
    id: uuid(),
    name: body.name,
    category: body.category || 'Tools',
    level: Number(body.level) || 70,
    description: body.description || '',
  };
  store.set('skills', [...store.get('skills'), skill]);
  res.status(201).json(skill);
});

router.put('/:id', requireAuth, (req, res) => {
  const skills = store.get('skills');
  const idx = skills.findIndex((s) => s.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'NO COMPONENT', message: 'Skill not found.' });
  const next = { ...skills[idx], ...req.body, id: skills[idx].id };
  const copy = [...skills];
  copy[idx] = next;
  store.set('skills', copy);
  res.json(next);
});

router.delete('/:id', requireAuth, (req, res) => {
  store.set('skills', store.get('skills').filter((s) => s.id !== req.params.id));
  res.json({ ok: true });
});

module.exports = router;

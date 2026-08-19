const express = require('express');
const { v4: uuid } = require('uuid');
const store = require('../services/store');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', (_req, res) => {
  const projects = [...store.get('projects')].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  res.json(projects);
});

router.get('/:id', (req, res) => {
  const project = store.get('projects').find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'NO MODULE', message: 'Project not found.' });
  res.json(project);
});

router.post('/', requireAuth, (req, res) => {
  const body = req.body || {};
  if (!body.title || !body.description) {
    return res.status(400).json({ error: 'INCOMPLETE', message: 'Title and description are required.' });
  }
  const now = new Date().toISOString();
  const projects = store.get('projects');
  const project = {
    id: uuid(),
    title: body.title,
    description: body.description,
    fullDescription: body.fullDescription || body.description,
    problem: body.problem || '',
    solution: body.solution || '',
    category: body.category || 'Hardware',
    technologies: Array.isArray(body.technologies) ? body.technologies : splitList(body.technologies),
    hardware: Array.isArray(body.hardware) ? body.hardware : splitList(body.hardware),
    features: Array.isArray(body.features) ? body.features : splitList(body.features),
    image: body.image || '',
    gallery: Array.isArray(body.gallery) ? body.gallery : body.image ? [body.image] : [],
    liveUrl: body.liveUrl || '',
    demoUrl: body.demoUrl || '',
    githubUrl: body.githubUrl || '',
    featured: Boolean(body.featured),
    status: body.status || 'Completed',
    date: body.date || now.slice(0, 7),
    order: Number.isFinite(body.order) ? body.order : projects.length + 1,
    createdAt: now,
    updatedAt: now,
  };
  store.set('projects', [...projects, project]);
  res.status(201).json(project);
});

router.put('/:id', requireAuth, (req, res) => {
  const projects = store.get('projects');
  const idx = projects.findIndex((p) => p.id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: 'NO MODULE', message: 'Project not found.' });
  const body = req.body || {};
  const next = {
    ...projects[idx],
    ...body,
    technologies: body.technologies !== undefined ? normalize(body.technologies) : projects[idx].technologies,
    hardware: body.hardware !== undefined ? normalize(body.hardware) : projects[idx].hardware,
    features: body.features !== undefined ? normalize(body.features) : projects[idx].features,
    updatedAt: new Date().toISOString(),
    id: projects[idx].id,
  };
  const copy = [...projects];
  copy[idx] = next;
  store.set('projects', copy);
  res.json(next);
});

router.delete('/:id', requireAuth, (req, res) => {
  const projects = store.get('projects');
  if (!projects.some((p) => p.id === req.params.id)) {
    return res.status(404).json({ error: 'NO MODULE', message: 'Project not found.' });
  }
  store.set('projects', projects.filter((p) => p.id !== req.params.id));
  res.json({ ok: true });
});

router.put('/reorder/all', requireAuth, (req, res) => {
  const ids = req.body?.ids;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'BAD PACKET', message: 'ids[] required.' });
  const map = new Map(store.get('projects').map((p) => [p.id, p]));
  const next = ids.map((id, i) => (map.get(id) ? { ...map.get(id), order: i + 1 } : null)).filter(Boolean);
  store.set('projects', next);
  res.json(next);
});

function splitList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value).split(',').map((s) => s.trim()).filter(Boolean);
}
function normalize(value) {
  return splitList(value);
}

module.exports = router;

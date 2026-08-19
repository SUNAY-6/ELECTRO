import { SEED } from '../data/seed';

const KEY = 'ece_lab_db_v1';

function uid() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}

function blank() {
  return {
    profile: structuredClone(SEED.profile),
    settings: structuredClone(SEED.settings),
    stats: { views: SEED.stats?.views || 0, lastView: new Date().toISOString() },
    projects: structuredClone(SEED.projects),
    achievements: structuredClone(SEED.achievements),
    skills: structuredClone(SEED.skills),
    messages: [],
    admin: { username: 'admin', password: 'circuit2026' },
  };
}

export function loadDb() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...blank(), ...parsed };
    }
  } catch {
    /* ignore corrupt payload */
  }
  const db = blank();
  saveDb(db);
  return db;
}

export function saveDb(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
  return db;
}

function list(name) {
  return loadDb()[name];
}

function write(name, value) {
  const db = loadDb();
  db[name] = value;
  saveDb(db);
  return db[name];
}

function splitList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export const localApi = {
  health: async () => ({ status: 'ONLINE', mode: 'STATIC', voltage: '3.3V' }),

  login: async (username, password) => {
    const admin = loadDb().admin;
    if (username !== admin.username || password !== admin.password) {
      const err = new Error('Invalid credentials.');
      err.status = 401;
      throw err;
    }
    return { token: `local-${Date.now()}`, username: admin.username };
  },

  me: async () => ({ username: loadDb().admin.username }),

  changePassword: async (currentPassword, nextPassword) => {
    const db = loadDb();
    if (currentPassword !== db.admin.password) {
      const err = new Error('Current password is incorrect.');
      err.status = 401;
      throw err;
    }
    if (!nextPassword || String(nextPassword).length < 8) {
      const err = new Error('New password must be 8+ characters.');
      err.status = 400;
      throw err;
    }
    db.admin.password = nextPassword;
    saveDb(db);
    return { ok: true };
  },

  profile: async () => {
    const db = loadDb();
    return { profile: db.profile, settings: db.settings, stats: db.stats };
  },

  updateProfile: async (body) => {
    const db = loadDb();
    db.profile = { ...db.profile, ...body };
    if (body?.stats) db.profile.stats = { ...db.profile.stats, ...body.stats };
    saveDb(db);
    return db.profile;
  },

  updateSettings: async (body) => {
    const db = loadDb();
    db.settings = { ...db.settings, ...body };
    saveDb(db);
    return db.settings;
  },

  pingView: async () => {
    const db = loadDb();
    db.stats.views = (db.stats.views || 0) + 1;
    db.stats.lastView = new Date().toISOString();
    saveDb(db);
    return db.stats;
  },

  projects: async () => [...list('projects')].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),

  createProject: async (body) => {
    const projects = list('projects');
    const now = new Date().toISOString();
    const project = {
      id: uid(),
      title: body.title,
      description: body.description,
      fullDescription: body.fullDescription || body.description,
      problem: body.problem || '',
      solution: body.solution || '',
      category: body.category || 'Hardware',
      technologies: splitList(body.technologies),
      hardware: splitList(body.hardware),
      features: splitList(body.features),
      image: body.image || '',
      gallery: body.image ? [body.image] : [],
      liveUrl: body.liveUrl || '',
      demoUrl: body.demoUrl || '',
      githubUrl: body.githubUrl || '',
      featured: Boolean(body.featured),
      status: body.status || 'Completed',
      date: body.date || now.slice(0, 7),
      order: projects.length + 1,
      createdAt: now,
      updatedAt: now,
    };
    write('projects', [...projects, project]);
    return project;
  },

  updateProject: async (id, body) => {
    const projects = list('projects');
    const idx = projects.findIndex((p) => p.id === id);
    if (idx < 0) throw new Error('Project not found.');
    const next = {
      ...projects[idx],
      ...body,
      technologies: body.technologies !== undefined ? splitList(body.technologies) : projects[idx].technologies,
      hardware: body.hardware !== undefined ? splitList(body.hardware) : projects[idx].hardware,
      features: body.features !== undefined ? splitList(body.features) : projects[idx].features,
      id,
      updatedAt: new Date().toISOString(),
    };
    const copy = [...projects];
    copy[idx] = next;
    write('projects', copy);
    return next;
  },

  deleteProject: async (id) => {
    write(
      'projects',
      list('projects').filter((p) => p.id !== id),
    );
    return { ok: true };
  },

  achievements: async () => [...list('achievements')].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),

  createAchievement: async (body) => {
    const items = list('achievements');
    const item = {
      id: uid(),
      title: body.title,
      organization: body.organization || '',
      description: body.description || '',
      date: body.date || new Date().toISOString().slice(0, 7),
      category: body.category || 'Award',
      image: body.image || '',
      certificateUrl: body.certificateUrl || '',
      order: items.length + 1,
    };
    write('achievements', [...items, item]);
    return item;
  },

  updateAchievement: async (id, body) => {
    const items = list('achievements');
    const idx = items.findIndex((a) => a.id === id);
    if (idx < 0) throw new Error('Achievement not found.');
    const copy = [...items];
    copy[idx] = { ...copy[idx], ...body, id };
    write('achievements', copy);
    return copy[idx];
  },

  deleteAchievement: async (id) => {
    write(
      'achievements',
      list('achievements').filter((a) => a.id !== id),
    );
    return { ok: true };
  },

  skills: async () => list('skills'),

  createSkill: async (body) => {
    const skill = {
      id: uid(),
      name: body.name,
      category: body.category || 'Tools',
      level: Number(body.level) || 70,
      description: body.description || '',
    };
    write('skills', [...list('skills'), skill]);
    return skill;
  },

  updateSkill: async (id, body) => {
    const skills = list('skills');
    const idx = skills.findIndex((s) => s.id === id);
    if (idx < 0) throw new Error('Skill not found.');
    const copy = [...skills];
    copy[idx] = { ...copy[idx], ...body, id };
    write('skills', copy);
    return copy[idx];
  },

  deleteSkill: async (id) => {
    write(
      'skills',
      list('skills').filter((s) => s.id !== id),
    );
    return { ok: true };
  },

  contact: async (body) => {
    const { name, email, subject, message } = body || {};
    const errors = {};
    if (!name || String(name).trim().length < 2) errors.name = 'Name is required.';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email is required.';
    if (!subject || String(subject).trim().length < 2) errors.subject = 'Subject is required.';
    if (!message || String(message).trim().length < 10) errors.message = 'Message should be at least 10 characters.';
    if (Object.keys(errors).length) {
      const err = new Error('Please correct the form.');
      err.payload = { errors };
      throw err;
    }
    const entry = {
      id: uid(),
      name: String(name).trim(),
      email: String(email).trim(),
      subject: String(subject).trim(),
      message: String(message).trim(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    write('messages', [entry, ...list('messages')]);
    return { ok: true, id: entry.id };
  },

  messages: async () => list('messages'),

  readMessage: async (id) => {
    const messages = list('messages');
    const idx = messages.findIndex((m) => m.id === id);
    if (idx < 0) throw new Error('Message not found.');
    const copy = [...messages];
    copy[idx] = { ...copy[idx], read: true };
    write('messages', copy);
    return copy[idx];
  },

  deleteMessage: async (id) => {
    write(
      'messages',
      list('messages').filter((m) => m.id !== id),
    );
    return { ok: true };
  },

  upload: async (file) => {
    const url = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Could not read image.'));
      reader.readAsDataURL(file);
    });
    return { url, filename: file.name };
  },
};

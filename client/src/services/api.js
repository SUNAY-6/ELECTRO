import { localApi } from './localDb';

const API = '/api';
const TOKEN_KEY = 'ece_token';
const forcedStatic = import.meta.env.VITE_STATIC === 'true';
let mode = forcedStatic ? 'local' : 'auto';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function parse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Signal interrupted.');
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

export async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  return parse(res);
}

async function call(remote, localFn) {
  if (mode === 'local') return localFn();
  try {
    const result = await remote();
    mode = 'remote';
    return result;
  } catch (err) {
    const reachedApi = Number.isInteger(err?.status);
    if (reachedApi && err.status >= 400 && err.status < 500) throw err;
    mode = 'local';
    return localFn();
  }
}

export const api = {
  health: () => call(() => request('/health'), localApi.health),
  login: (username, password) =>
    call(
      () => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
      () => localApi.login(username, password),
    ),
  me: () => {
    const token = getToken();
    if (token?.startsWith('local-') || mode === 'local') return localApi.me();
    return call(() => request('/auth/me'), localApi.me);
  },
  changePassword: (currentPassword, nextPassword) =>
    call(
      () => request('/auth/password', { method: 'PUT', body: JSON.stringify({ currentPassword, nextPassword }) }),
      () => localApi.changePassword(currentPassword, nextPassword),
    ),

  profile: () => call(() => request('/profile'), localApi.profile),
  updateProfile: (body) =>
    call(
      () => request('/profile', { method: 'PUT', body: JSON.stringify(body) }),
      () => localApi.updateProfile(body),
    ),
  updateSettings: (body) =>
    call(
      () => request('/profile/settings', { method: 'PUT', body: JSON.stringify(body) }),
      () => localApi.updateSettings(body),
    ),
  pingView: () => call(() => request('/profile/view', { method: 'POST' }), localApi.pingView),

  projects: () => call(() => request('/projects'), localApi.projects),
  createProject: (body) =>
    call(
      () => request('/projects', { method: 'POST', body: JSON.stringify(body) }),
      () => localApi.createProject(body),
    ),
  updateProject: (id, body) =>
    call(
      () => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
      () => localApi.updateProject(id, body),
    ),
  deleteProject: (id) =>
    call(
      () => request(`/projects/${id}`, { method: 'DELETE' }),
      () => localApi.deleteProject(id),
    ),

  achievements: () => call(() => request('/achievements'), localApi.achievements),
  createAchievement: (body) =>
    call(
      () => request('/achievements', { method: 'POST', body: JSON.stringify(body) }),
      () => localApi.createAchievement(body),
    ),
  updateAchievement: (id, body) =>
    call(
      () => request(`/achievements/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
      () => localApi.updateAchievement(id, body),
    ),
  deleteAchievement: (id) =>
    call(
      () => request(`/achievements/${id}`, { method: 'DELETE' }),
      () => localApi.deleteAchievement(id),
    ),

  skills: () => call(() => request('/skills'), localApi.skills),
  createSkill: (body) =>
    call(
      () => request('/skills', { method: 'POST', body: JSON.stringify(body) }),
      () => localApi.createSkill(body),
    ),
  updateSkill: (id, body) =>
    call(
      () => request(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
      () => localApi.updateSkill(id, body),
    ),
  deleteSkill: (id) =>
    call(
      () => request(`/skills/${id}`, { method: 'DELETE' }),
      () => localApi.deleteSkill(id),
    ),

  contact: (body) =>
    call(
      () => request('/contact', { method: 'POST', body: JSON.stringify(body) }),
      () => localApi.contact(body),
    ),
  messages: () => call(() => request('/contact/messages'), localApi.messages),
  readMessage: (id) =>
    call(
      () => request(`/contact/messages/${id}/read`, { method: 'PUT' }),
      () => localApi.readMessage(id),
    ),
  deleteMessage: (id) =>
    call(
      () => request(`/contact/messages/${id}`, { method: 'DELETE' }),
      () => localApi.deleteMessage(id),
    ),

  upload: async (file) =>
    call(async () => {
      const body = new FormData();
      body.append('file', file);
      return request('/upload', { method: 'POST', body });
    }, () => localApi.upload(file)),
};

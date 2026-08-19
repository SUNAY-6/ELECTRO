const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

function ensure() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function read() {
  ensure();
  if (!fs.existsSync(DB_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return null;
  }
}

function write(data) {
  ensure();
  const tmp = `${DB_PATH}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, DB_PATH);
}

function get(name) {
  const db = read();
  if (!db) throw new Error('Database not initialized');
  return db[name];
}

function set(name, value) {
  const db = read();
  db[name] = value;
  db.meta = { ...(db.meta || {}), updatedAt: new Date().toISOString() };
  write(db);
  return db[name];
}

function update(name, updater) {
  const current = get(name);
  const next = updater(current);
  return set(name, next);
}

function bumpViews() {
  const db = read();
  db.stats = db.stats || { views: 0, lastView: null };
  db.stats.views += 1;
  db.stats.lastView = new Date().toISOString();
  write(db);
  return db.stats;
}

module.exports = { read, write, get, set, update, bumpViews, DB_PATH };

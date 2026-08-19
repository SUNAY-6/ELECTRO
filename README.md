# ECE Lab Portfolio

Animated ECE / EEE portfolio. **Runs without a backend** (localStorage CMS), so it deploys to **GitHub Pages**. An optional Express API is included if you later want a real server.

## Run in VS Code (this is the usual error)

GitHub Pages and VS Code both fail if you try to start Express + Vite from the wrong folder, or if you expect Pages to host Node.

**Do this:**

1. Install [Node.js 20+](https://nodejs.org/) (LTS).
2. In VS Code: **File → Open Folder** → this repo root (the folder that contains `client/` and `package.json`).
3. Terminal:

```bash
npm install
npm run dev
```

4. Open **http://localhost:5173**

That starts **only the client**. Admin, projects, contact, and uploads all work in the browser. You do **not** need the `server/` folder to preview or to deploy.

Admin: `#/admin/login`  
User: `admin`  
Password: `circuit2026`

### Common VS Code errors

| Error | Fix |
| --- | --- |
| `vite` is not recognized / Cannot find package 'vite' | Run `npm install` in the **repo root**, then `npm run dev`. Do not run `npx vite` from the root. |
| `Cannot find module 'express'` | You started `server/` without installing it. Either ignore the server (`npm run dev`) or `npm install --prefix server`. |
| Port 5173 in use | Close the other terminal, or change the port in `client/vite.config.js`. |
| Blank page / 404 on refresh of `/admin` | Use the hash URL: `http://localhost:5173/#/admin/login`. |
| PowerShell refuses `./start.sh` | Don’t use the shell script. Use `npm run dev`. |

Optional API + client together:

```bash
npm install --prefix server
npm run dev:full
```

## Deploy to GitHub Pages (client + “server” as static)

**GitHub Pages cannot run Express, MongoDB, or any Node process.**  
The “server” on Pages is a **browser database** (localStorage). Same admin UI, same data, no backend.

### One-time GitHub setup

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` (or run the **Deploy to GitHub Pages** workflow).
4. Site URL:
   - Project repo `you/ece-lab` → `https://you.github.io/ece-lab/`
   - User site `you/you.github.io` → `https://you.github.io/`

Admin on Pages: `https://you.github.io/ece-lab/#/admin/login`

Edits you make in admin stay in **that browser**. They are not shared with other visitors. That is the Pages limitation.

### Manual publish (no Actions)

```bash
cd client
npm install
set VITE_STATIC=true
set VITE_BASE=/YOUR_REPO_NAME/
npm run build
```

Upload the `client/dist` folder to Pages (or any static host: Netlify, Cloudflare Pages, Vercel static).

On Mac/Linux:

```bash
VITE_STATIC=true VITE_BASE=/YOUR_REPO_NAME/ npm run build --prefix client
```

## If you need a real shared backend

Pages still cannot host it. Deploy:

- **Client** → GitHub Pages (this repo)
- **API** → [Render](https://render.com), [Railway](https://railway.app), or a VPS (`server/`)

Then point the client at that API. Until then, static mode is the supported path.

## Default admin

- `#/admin/login`
- `admin` / `circuit2026`

Change the password in Settings after first login.

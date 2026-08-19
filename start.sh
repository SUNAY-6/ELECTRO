#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"

(cd "$ROOT/server" && node server.js) &
(cd "$ROOT/client" && npm run dev -- --host 0.0.0.0 --port 5173) &
wait

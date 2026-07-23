#!/bin/zsh
# Always open the LATEST fighurs-site server (kills stale Vite first).
set -e
export PATH="$HOME/.local/node/bin:$PATH"
cd "$(dirname "$0")"

echo "Stopping old Vite ports…"
lsof -nP -iTCP -sTCP:LISTEN 2>/dev/null | awk '/node/ {print $2}' | sort -u | while read pid; do
  kill -9 "$pid" 2>/dev/null || true
done
sleep 0.5
rm -rf node_modules/.vite

PORT=5610
echo "Starting http://127.0.0.1:$PORT"
printf "OPEN http://127.0.0.1:$PORT/\n" > OPEN-THIS.txt
npm run dev -- --host 127.0.0.1 --port "$PORT" --strictPort --force

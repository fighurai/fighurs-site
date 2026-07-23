#!/bin/bash
set -x
for p in 5173 5174 5188 5190 5200 5205 5210 5220 5230 5250 5255 5260 5277; do
  for pid in $(lsof -ti tcp:$p 2>/dev/null); do
    kill -9 "$pid" && echo "killed $pid on $p"
  done
done
# kill other vite --host except leave restart to us
pkill -9 -f "vite --host 127.0.0.1" 2>/dev/null || true
rm -rf /Users/fighur/Desktop/fighurs-site/node_modules/.vite
export PATH="$HOME/.local/node/bin:$PATH"
cd /Users/fighur/Desktop/fighurs-site
exec npm run dev -- --host 127.0.0.1 --port 5288 --strictPort --force

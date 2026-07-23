#!/bin/bash
export PATH="$HOME/.local/node/bin:$PATH"
set +e
for p in 5173 5174 5188 5190 5200 5205 5210 5220 5230 5250 5255; do
  pids=$(lsof -nP -tiTCP:$p -sTCP:LISTEN 2>/dev/null)
  if [ -n "$pids" ]; then
    echo "Killing port $p: $pids"
    kill -9 $pids 2>/dev/null
  fi
done
pkill -9 -f "vite --host 127.0.0.1" 2>/dev/null
pkill -9 -f "/Users/fighur/Desktop/fighurs-site.*vite" 2>/dev/null
rm -rf /Users/fighur/Desktop/fighurs-site/node_modules/.vite
cd /Users/fighur/Desktop/fighurs-site
echo "STARTING $(date)" > /Users/fighur/Desktop/fighurs-site/.vite-5255.log
npm run dev -- --host 127.0.0.1 --port 5255 --strictPort --force >> /Users/fighur/Desktop/fighurs-site/.vite-5255.log 2>&1

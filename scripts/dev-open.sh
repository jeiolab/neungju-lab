#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${PORT:-3002}"
HOST="${HOST:-127.0.0.1}"

wait_for_port() {
  local i
  for i in $(seq 1 180); do
    if (echo >/dev/tcp/"$HOST"/"$PORT") >/dev/null 2>&1; then
      return 0
    fi
    sleep 1
  done
  return 1
}

npm run dev &
if ! wait_for_port; then
  echo "포트 $PORT 가 열리지 않았습니다. 터미널 로그를 확인하세요."
  exit 1
fi

if command -v open >/dev/null 2>&1; then
  open "http://localhost:$PORT"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "http://localhost:$PORT"
fi

wait

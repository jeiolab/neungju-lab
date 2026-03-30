#!/usr/bin/env bash
set -euo pipefail
URL="${1:-http://127.0.0.1:3002}"
if curl -sf -o /dev/null --max-time 3 "$URL"; then
  echo "OK: $URL 응답 확인"
  exit 0
fi
echo "FAIL: $URL 에 연결할 수 없습니다. (npm run dev 가 실행 중인지 확인하세요)"
exit 1

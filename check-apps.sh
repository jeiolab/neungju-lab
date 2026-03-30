#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
echo "== check-apps: TypeScript =="
npm run type-check
echo "== check-apps: OK =="

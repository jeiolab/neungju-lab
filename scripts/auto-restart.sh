#!/bin/bash

# 자동 재시작 및 모니터링 스크립트

PROJECT_DIR="/Users/josincheol/Documents/neungju"
PORT=3000
CHECK_INTERVAL=30

# NVM 로드
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd "$PROJECT_DIR"

check_and_restart() {
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" != "200" ]; then
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] 서버 오류 감지 (HTTP $HTTP_CODE), 재시작 중..."
        "$PROJECT_DIR/scripts/start-dev.sh"
    fi
}

# 초기 시작
echo "서버 자동 모니터링 시작..."
"$PROJECT_DIR/scripts/start-dev.sh"

# 주기적 체크
while true; do
    sleep $CHECK_INTERVAL
    check_and_restart
done


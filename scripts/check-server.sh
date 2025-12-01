#!/bin/bash

# 서버 상태 확인 및 자동 재시작 스크립트

PORT=3000
PROJECT_DIR="/Users/josincheol/Documents/neungju"

# 서버 상태 확인
check_server() {
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT 2>/dev/null || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ 서버 정상 작동 중 (HTTP $HTTP_CODE)"
        return 0
    else
        echo "❌ 서버 오류 감지 (HTTP $HTTP_CODE)"
        return 1
    fi
}

# 서버 재시작
restart_server() {
    echo "서버 재시작 중..."
    cd "$PROJECT_DIR"
    "$PROJECT_DIR/scripts/start-dev.sh"
}

# 메인 로직
if ! check_server; then
    echo "서버를 재시작합니다..."
    restart_server
else
    echo "서버가 정상적으로 작동 중입니다."
fi


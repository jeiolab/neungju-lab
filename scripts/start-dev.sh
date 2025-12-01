#!/bin/bash

# 개발 서버 자동 시작 및 헬스체크 스크립트

set -e

PROJECT_DIR="/Users/josincheol/Documents/neungju"
PORT=3000
MAX_RETRIES=3

# NVM 로드
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd "$PROJECT_DIR"

# 기존 서버 종료
echo "기존 서버 프로세스 확인 중..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

# 포트 확인 및 정리
if lsof -ti:$PORT > /dev/null 2>&1; then
    echo "포트 $PORT 정리 중..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    sleep 2
fi

# 빌드 확인
echo "빌드 확인 중..."
if ! npm run build > /dev/null 2>&1; then
    echo "❌ 빌드 실패! 오류를 확인하세요."
    exit 1
fi

# 서버 시작
echo "개발 서버 시작 중..."
npm run dev > /tmp/nextjs-dev.log 2>&1 &
SERVER_PID=$!

# 서버 시작 대기
echo "서버 시작 대기 중..."
for i in {1..10}; do
    sleep 2
    if curl -s http://localhost:$PORT > /dev/null 2>&1; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT)
        if [ "$HTTP_CODE" = "200" ]; then
            echo "✅ 서버가 정상적으로 시작되었습니다!"
            echo "📍 접속 주소: http://localhost:$PORT"
            echo "📋 서버 PID: $SERVER_PID"
            echo "📝 로그 파일: /tmp/nextjs-dev.log"
            exit 0
        fi
    fi
    echo "  시도 $i/10..."
done

echo "❌ 서버 시작 실패!"
echo "로그 확인: tail -f /tmp/nextjs-dev.log"
exit 1


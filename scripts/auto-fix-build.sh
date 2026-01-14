#!/bin/bash

# 빌드 오류 자동 수정 스크립트

echo "🔍 빌드 오류 확인 및 자동 수정 시작..."

MAX_ITERATIONS=10
ITERATION=0

while [ $ITERATION -lt $MAX_ITERATIONS ]; do
    ITERATION=$((ITERATION + 1))
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔄 반복 $ITERATION/$MAX_ITERATIONS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # 빌드 실행 (타임아웃 60초)
    echo "📦 빌드 실행 중..."
    BUILD_OUTPUT=$(timeout 60 npm run build 2>&1)
    BUILD_EXIT_CODE=$?
    
    # 빌드 성공
    if [ $BUILD_EXIT_CODE -eq 0 ]; then
        echo "✅ 빌드 성공!"
        exit 0
    fi
    
    # 빌드 실패 - 오류 파싱
    echo "❌ 빌드 실패. 오류 분석 중..."
    
    # TypeScript 타입 에러 찾기
    if echo "$BUILD_OUTPUT" | grep -q "Type error:"; then
        ERROR_LINE=$(echo "$BUILD_OUTPUT" | grep -A 5 "Type error:" | head -10)
        echo "🔧 TypeScript 타입 에러 발견:"
        echo "$ERROR_LINE"
        
        # response.text가 undefined일 수 있는 경우
        if echo "$BUILD_OUTPUT" | grep -q "response.text.*possibly 'undefined'"; then
            FILE=$(echo "$BUILD_OUTPUT" | grep "Type error:" | sed -n 's/.*\.\/\([^:]*\):.*/\1/p' | head -1)
            if [ -n "$FILE" ]; then
                echo "🔧 $FILE 수정 중..."
                sed -i '' "s/response\.text\.trim()/response.text?.trim() || ''/g" "$FILE"
                echo "✅ 수정 완료: $FILE"
                continue
            fi
        fi
        
        # status 타입 에러
        if echo "$BUILD_OUTPUT" | grep -q "Type 'string' is not assignable"; then
            FILE=$(echo "$BUILD_OUTPUT" | grep "Type error:" | sed -n 's/.*\.\/\([^:]*\):.*/\1/p' | head -1)
            LINE_NUM=$(echo "$BUILD_OUTPUT" | grep "Type error:" | sed -n 's/.*:\([0-9]*\):.*/\1/p' | head -1)
            if [ -n "$FILE" ] && [ -n "$LINE_NUM" ]; then
                echo "🔧 $FILE:$LINE_NUM 수정 중..."
                # status: 'IN_TRANSIT' -> status: 'IN_TRANSIT' as const
                sed -i '' "s/status: '\([^']*\)'/status: '\1' as const/g" "$FILE"
                sed -i '' 's/status: "\([^"]*\)"/status: "\1" as const/g' "$FILE"
                echo "✅ 수정 완료: $FILE"
                continue
            fi
        fi
        
        # Set iteration 에러
        if echo "$BUILD_OUTPUT" | grep -q "can only be iterated through when using"; then
            FILE=$(echo "$BUILD_OUTPUT" | grep "Type error:" | sed -n 's/.*\.\/\([^:]*\):.*/\1/p' | head -1)
            if [ -n "$FILE" ]; then
                echo "🔧 $FILE 수정 중..."
                sed -i '' 's/\[\.\.\.new Set(/Array.from(new Set(/g' "$FILE"
                echo "✅ 수정 완료: $FILE"
                continue
            fi
        fi
        
        # 모듈을 찾을 수 없는 경우
        if echo "$BUILD_OUTPUT" | grep -q "Cannot find module"; then
            FILE=$(echo "$BUILD_OUTPUT" | grep "Cannot find module" | sed -n 's/.*\.\/\([^:]*\):.*/\1/p' | head -1)
            MODULE=$(echo "$BUILD_OUTPUT" | grep "Cannot find module" | sed -n "s/.*Cannot find module '\([^']*\)'.*/\1/p" | head -1)
            if [ -n "$FILE" ] && [ -n "$MODULE" ]; then
                echo "🔧 $FILE에서 $MODULE 모듈을 찾을 수 없음"
                # index.tsx 파일이 App을 import하려고 하는 경우 제거
                if [[ "$MODULE" == "./App" ]] && [[ "$FILE" == *"index.tsx" ]]; then
                    echo "🗑️  불필요한 $FILE 제거 중..."
                    rm -f "$FILE"
                    echo "✅ 제거 완료: $FILE"
                    continue
                fi
            fi
        fi
    fi
    
    # 파싱 에러 찾기
    if echo "$BUILD_OUTPUT" | grep -q "Parsing error:"; then
        ERROR_LINE=$(echo "$BUILD_OUTPUT" | grep -A 3 "Parsing error:" | head -5)
        echo "🔧 파싱 에러 발견:"
        echo "$ERROR_LINE"
        
        # JSX 특수문자 에러 (>)
        if echo "$BUILD_OUTPUT" | grep -q "Did you mean.*&gt;"; then
            FILE=$(echo "$BUILD_OUTPUT" | grep "Parsing error:" | sed -n 's/.*\.\/\([^:]*\):.*/\1/p' | head -1)
            LINE_NUM=$(echo "$BUILD_OUTPUT" | grep "Parsing error:" | sed -n 's/.*:\([0-9]*\):.*/\1/p' | head -1)
            if [ -n "$FILE" ] && [ -n "$LINE_NUM" ]; then
                echo "🔧 $FILE:$LINE_NUM 수정 중..."
                # > 를 &gt; 로 변경 (단, 주석이나 문자열 내부가 아닌 경우)
                sed -i '' "${LINE_NUM}s/> {/&gt; {/g" "$FILE"
                sed -i '' "${LINE_NUM}s/->/→/g" "$FILE"
                sed -i '' "${LINE_NUM}s/ X > Y/ X \&gt; Y/g" "$FILE"
                echo "✅ 수정 완료: $FILE"
                continue
            fi
        fi
        
        # 문자열 리터럴 에러
        if echo "$BUILD_OUTPUT" | grep -q "Unterminated string literal"; then
            FILE=$(echo "$BUILD_OUTPUT" | grep "Parsing error:" | sed -n 's/.*\.\/\([^:]*\):.*/\1/p' | head -1)
            LINE_NUM=$(echo "$BUILD_OUTPUT" | grep "Parsing error:" | sed -n 's/.*:\([0-9]*\):.*/\1/p' | head -1)
            if [ -n "$FILE" ] && [ -n "$LINE_NUM" ]; then
                echo "🔧 $FILE:$LINE_NUM 수정 중..."
                # value="=""> -> value="="
                sed -i '' "${LINE_NUM}s/value=\"\"=>/value=\"=\"/g" "$FILE"
                echo "✅ 수정 완료: $FILE"
                continue
            fi
        fi
    fi
    
    # 수정할 수 없는 오류
    echo "⚠️  자동 수정할 수 없는 오류가 있습니다:"
    echo "$BUILD_OUTPUT" | grep -E "(Type error|Parsing error|Error:)" | head -5
    echo ""
    echo "📋 전체 빌드 로그:"
    echo "$BUILD_OUTPUT" | tail -30
    exit 1
done

echo "❌ 최대 반복 횟수에 도달했습니다. 수동으로 확인이 필요합니다."
exit 1

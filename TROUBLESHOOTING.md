# 문제 해결 가이드

## 서버 접속 문제 해결

### 문제: 사이트 접속이 안 됨 (HTTP 500, 연결 실패 등)

#### 자동 해결 방법 (권장)

```bash
# 안전한 서버 시작 (자동 빌드 확인 및 재시작)
npm run dev:safe

# 또는 서버 상태 확인 및 자동 재시작
npm run dev:check
```

#### 수동 해결 방법

1. **기존 서버 종료**
```bash
pkill -f "next dev"
```

2. **포트 정리**
```bash
lsof -ti:3000 | xargs kill -9
```

3. **빌드 확인**
```bash
npm run build
```

4. **서버 재시작**
```bash
npm run dev
```

### 일반적인 문제들

#### 1. 포트 충돌
- **증상**: "Port 3000 is already in use"
- **해결**: `npm run dev:safe` 사용 (자동으로 포트 정리)

#### 2. 빌드 오류
- **증상**: HTTP 500 에러
- **해결**: 
  ```bash
  npm run build
  # 오류 확인 후 수정
  npm run dev
  ```

#### 3. 모듈 오류
- **증상**: "Cannot find module"
- **해결**:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

#### 4. 캐시 문제
- **증상**: 변경사항이 반영되지 않음
- **해결**:
  ```bash
  rm -rf .next
  npm run dev
  ```

## 예방 조치

### 1. 안전한 서버 시작 사용
항상 `npm run dev:safe`를 사용하면:
- 자동으로 빌드 확인
- 기존 프로세스 정리
- 포트 충돌 해결
- 헬스체크 수행

### 2. 정기적인 서버 상태 확인
```bash
npm run dev:check
```

### 3. 빌드 전 확인
코드 변경 후 항상 빌드 확인:
```bash
npm run build
```

## 로그 확인

서버 로그 확인:
```bash
tail -f /tmp/nextjs-dev.log
```

또는 터미널에서 직접 실행:
```bash
npm run dev
```

## 빠른 진단

```bash
# 1. 서버 프로세스 확인
ps aux | grep "next dev"

# 2. 포트 사용 확인
lsof -ti:3000

# 3. 서버 응답 확인
curl http://localhost:3000

# 4. 빌드 확인
npm run build
```

## 연락처

문제가 지속되면: ilsangsw@gmail.com


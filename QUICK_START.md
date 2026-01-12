# 빠른 시작 가이드

## 서버 시작 (권장)

```bash
npm run dev:safe
```

이 명령어는:
- ✅ 기존 서버 자동 종료
- ✅ 포트 충돌 자동 해결
- ✅ 빌드 확인
- ✅ 서버 자동 시작
- ✅ 헬스체크 수행

## 접속 확인

서버가 시작되면 다음 주소로 접속하세요:
- **http://localhost:3000**

## 문제 해결

### 접속이 안 될 때

1. **브라우저 캐시 지우기**
   - Chrome/Edge: `Ctrl+Shift+Delete` (Windows) 또는 `Cmd+Shift+Delete` (Mac)
   - 또는 시크릿 모드로 접속: `Ctrl+Shift+N` (Windows) 또는 `Cmd+Shift+N` (Mac)

2. **서버 상태 확인**
   ```bash
   npm run dev:check
   ```

3. **강제 재시작**
   ```bash
   npm run dev:safe
   ```

4. **포트 확인**
   - 다른 앱이 3000번 포트를 사용 중일 수 있습니다
   - `npm run dev:safe`가 자동으로 해결합니다

### 자주 발생하는 문제

- **HTTP 500 에러**: `npm run dev:safe` 실행
- **포트 충돌**: `npm run dev:safe` 실행 (자동 해결)
- **변경사항 반영 안 됨**: 브라우저 강력 새로고침 (`Ctrl+Shift+R` 또는 `Cmd+Shift+R`)

## 연락처

문제가 지속되면: ilsangsw@gmail.com


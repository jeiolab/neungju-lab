# Neungju Apps - 통합 웹앱 대시보드

구글 AI 스튜디오에서 제작한 모든 웹앱을 한 곳에서 접근할 수 있는 통합 대시보드입니다.

## 🚀 시작하기

### 설치

```bash
npm install
# 또는
yarn install
```

### 개발 서버 실행

**권장 방법 (자동 빌드 확인 및 안전한 시작):**
```bash
npm run dev:safe
```

**일반 방법:**
```bash
npm run dev
# 또는
yarn dev
```

**서버 상태 확인 및 자동 재시작:**
```bash
npm run dev:check
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

> ⚠️ **접속 문제 발생 시**: 
> 1. `npm run dev:safe` 실행 (자동 복구)
> 2. 브라우저 캐시 지우기 또는 시크릿 모드 사용
> 3. [QUICK_START.md](./QUICK_START.md) 또는 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) 참고

### 빌드

```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
neungju/
├── app/                    # Next.js 앱 디렉토리
│   ├── apps/              # 개별 앱 페이지
│   │   ├── [id]/         # 동적 라우팅
│   ├── layout.tsx        # 루트 레이아웃
│   ├── page.tsx          # 메인 대시보드
│   └── globals.css       # 전역 스타일
├── data/
│   └── apps.ts           # 앱 목록 데이터
└── public/               # 정적 파일
```

## 📱 앱 추가하기

`data/apps.ts` 파일에 새로운 앱을 추가하고, `app/apps/appRegistry.tsx`에 등록하세요:

```typescript
// data/apps.ts
{
  id: 'your-app-id',
  name: '앱 이름',
  description: '앱 설명',
  badge: 'new',
  category: '정보',
  menuId: 'unit-1-1', // 단원별 분류
}

// app/apps/appRegistry.tsx
'your-app-id': () => import('./your-app-id/YourApp'),
```

자세한 가이드는 [APP_GUIDE.md](./APP_GUIDE.md)를 참고하세요.

## 🚢 배포

### Vercel 배포 (권장)

1. [Vercel](https://vercel.com)에 GitHub 저장소를 연결
2. 자동으로 빌드 및 배포됩니다

### GitHub Pages 배포

1. `next.config.js`에 `output: 'export'` 추가
2. `npm run build` 실행
3. `out` 폴더의 내용을 GitHub Pages에 배포

## 📝 라이선스

MIT


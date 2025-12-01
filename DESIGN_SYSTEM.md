# 디자인 시스템 가이드

이 문서는 프로젝트의 디자인 일관성을 유지하기 위한 가이드입니다.

## 색상 시스템

### 배경색
- **메인 배경**: `bg-background-light` (#f6f6f8) - 홈페이지 및 전체 배경
- **헤더/푸터**: `bg-background-light` 또는 `bg-white` (일관성 유지)
- **카드/컨테이너**: `bg-white` - 콘텐츠 영역

### 주요 색상
- **Primary**: `#1132d4` - 주요 액션 버튼, 링크, 강조
- **텍스트**: 
  - 제목: `text-gray-900`
  - 본문: `text-gray-600`
  - 보조: `text-gray-500`

### 테두리
- **기본 테두리**: `border-gray-200`
- **강조 테두리**: `border-primary`

## 레이아웃

### 컨테이너
- **최대 너비**: `max-w-6xl`
- **패딩**: `px-4 sm:px-6 lg:px-8`
- **세로 패딩**: `py-8 lg:py-12`

### 간격
- **카드 간격**: `gap-6`
- **섹션 간격**: `mb-6` 또는 `gap-4`

## 타이포그래피

### 폰트
- **디스플레이**: Lexend (제목, 헤더)
- **본문**: 시스템 기본 폰트

### 크기
- **메인 제목**: `text-4xl lg:text-5xl font-black`
- **카드 제목**: `text-xl font-bold`
- **본문**: `text-base` 또는 `text-sm`

## 컴포넌트 스타일

### 버튼
- **Primary 버튼**: `bg-primary text-white rounded-lg`
- **호버 효과**: `hover:bg-opacity-90`

### 카드
- **배경**: `bg-white`
- **테두리**: `border border-gray-200`
- **그림자**: `shadow-sm hover:shadow-lg`
- **호버 효과**: `hover:-translate-y-1`

### 헤더
- **배경**: `bg-white`
- **고정**: `sticky top-0 z-50`
- **테두리**: `border-b border-gray-200`

### 푸터
- **배경**: `bg-background-light` (홈페이지와 일치)
- **테두리**: `border-t border-gray-200`
- **패딩**: `py-6`

## 일관성 체크리스트

새로운 컴포넌트를 만들 때 다음을 확인하세요:

- [ ] 배경색이 `bg-background-light` 또는 `bg-white`를 사용하는가?
- [ ] 텍스트 색상이 `text-gray-900`, `text-gray-600`, `text-gray-500` 중 하나를 사용하는가?
- [ ] Primary 색상(`#1132d4`)이 버튼과 링크에 일관되게 사용되는가?
- [ ] 테두리가 `border-gray-200`를 사용하는가?
- [ ] 간격이 일관된가? (`gap-6`, `mb-6` 등)
- [ ] 폰트 크기가 디자인 시스템을 따르는가?

## 주의사항

1. **배경색 통일**: 모든 페이지는 `bg-background-light`를 기본 배경으로 사용
2. **헤더/푸터**: 모든 페이지에서 동일한 스타일 유지
3. **색상 변수**: Tailwind config의 색상 변수를 사용 (`primary`, `background-light`)
4. **반응형**: `sm:`, `md:`, `lg:` 브레이크포인트 사용


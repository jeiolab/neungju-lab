export const generateSecurityGuidebook = async (score: number, rank: string): Promise<string> => {
  // API Key 없이 정적 가이드북 생성
  const getRankMessage = (rank: string) => {
    switch (rank) {
      case 'S': return '🎉 완벽한 보안 컨설턴트! 당신은 이미 전문가 수준입니다.';
      case 'A': return '🌟 훌륭합니다! 보안의 핵심을 잘 이해하고 계시네요.';
      case 'B': return '👍 좋은 시작입니다! 조금만 더 노력하면 전문가가 될 수 있어요.';
      case 'C': return '📚 기본기를 다지고 있어요. 계속 공부하면 실력이 늘 거예요.';
      default: return '💪 보안은 꾸준한 학습이 중요합니다. 화이팅!';
    }
  };

  const getScoreAdvice = (score: number) => {
    if (score >= 90) return '당신은 이미 보안 전문가 수준입니다!';
    if (score >= 70) return '좋은 실력이지만, 더 깊이 있는 학습이 필요합니다.';
    if (score >= 50) return '기본기를 탄탄히 다지고 있어요. 계속 노력하세요!';
    return '보안의 기초를 차근차근 배워가고 있어요. 포기하지 마세요!';
  };

  return `# 나만의 맞춤형 보안 가이드북

## ${getRankMessage(rank)}

${getScoreAdvice(score)}

## 암호학 핵심 요약

### 🔐 대칭키 암호화
**비유**: 같은 열쇠로 잠그고 열 수 있는 금고
- 같은 키로 암호화와 복호화를 수행
- 빠르고 효율적이지만 키 전달이 어려움
- 예: AES, DES

### 🔑 공개키 암호화
**비유**: 우편함처럼 누구나 넣을 수 있지만 열 수 있는 사람은 한 명
- 공개키로 암호화, 개인키로 복호화
- 키 전달 문제 해결, 하지만 느림
- 예: RSA, ECC

### 🔒 해시 함수
**비유**: 일방통행 다리 - 갈 수는 있지만 돌아올 수 없음
- 원본 데이터를 고정 길이의 값으로 변환
- 역변환 불가능, 데이터 무결성 검증에 사용
- 예: SHA-256, MD5

## 현실 세계의 보안 수칙

### 1. 비밀번호 관리
- 각 사이트마다 다른 비밀번호 사용
- 비밀번호 관리자 앱 활용
- 최소 12자 이상, 특수문자 포함

### 2. 2단계 인증(2FA)
- 가능한 모든 계정에 2단계 인증 활성화
- SMS보다 앱 기반 인증이 더 안전
- 백업 코드는 안전한 곳에 보관

### 3. 공공 와이파이 주의
- 공용 와이파이에서는 중요한 작업 금지
- VPN 사용 권장
- 자동 연결 설정 해제

---
*점수: ${score}점 | 등급: ${rank}*
`;
};
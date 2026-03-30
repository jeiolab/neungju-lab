export enum GameOutcome {
  NORMAL_RX = 'A', // 정상 수신 (조건 미달)
  FAIL_RX = 'B',   // 수신 실패 (그룹 불일치)
  RX_NO_ALARM = 'C', // 수신 성공했으나 경보 아님 (온도 < 임계값) -> 사실 A와 유사하지만, 문제 정의상 구분
  ALARM = 'D'      // 경보 발동 (수신 성공 + 온도 >= 임계값)
}

// NOTE: The prompt distinguishes (A) Normal Rx and (C) Rx but no alarm.
// Usually "Normal Rx" implies successful data transfer.
// To fit the "Classification" game logic:
// A: 정상 수신 (수신은 됨, 경보 조건은 아님, 일반적인 데이터 수신 상황)
// B: 수신 실패 (그룹 다름)
// C: 수신 O, 조건 X (A와 의미가 중복될 수 있으나, '안전' 상태를 강조할 때 사용)
// D: 경보 발동 (수신 O, 조건 O)
// For simplicity in logic:
// If Group match:
//    If Temp >= Threshold -> Alarm (D)
//    If Temp < Threshold -> Normal/No Alarm (A or C). We will treat A as "Received Data" generically, but for the game we map outcomes.

export interface Scenario {
  senderGroup: number;
  receiverGroup: number;
  temperature: number;
  threshold: number;
  correctOutcome: GameOutcome;
  explanation: string;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  correctCount: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type TabType = 'concept' | 'game' | 'flow' | 'quiz' | 'reflection';
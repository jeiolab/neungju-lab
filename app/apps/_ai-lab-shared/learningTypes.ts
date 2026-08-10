/**
 * 학습 지원 기능(힌트·체크리스트·미션·용어·문장 틀)의 공통 타입.
 */
import type { Difficulty, StageId } from './types'

export interface GlossaryTerm {
  term: string
  plain: string
}

export interface HintStep {
  id: string
  /** 지금 바로 해 볼 행동 */
  action: string
  /** 왜 이 행동이 도움이 되는지 */
  why?: string
}

export interface ChecklistItem {
  id: string
  label: string
}

export interface TeacherMission {
  id: string
  title: string
  /** 학생이 달성해야 할 조건 (채점용 문장) */
  goal: string
  /** 권장 난이도 */
  difficulty: Difficulty
  /** 예상 분 */
  minutes: number
  tips?: string[]
}

export interface SentenceFrame {
  id: string
  /** 빈칸이 ___ 인 문장 틀 */
  template: string
  hint?: string
}

export interface MisconceptionItem {
  id: string
  claim: string
  /** 이 주장이 올바른지 */
  isCorrect: boolean
  explain: string
}

export interface LearningSupportConfig {
  /** 오늘의 핵심 용어 (보통 3개) */
  glossary: GlossaryTerm[]
  /** 단계별 다음 할 일 힌트 */
  hintsByStage: Partial<Record<StageId, HintStep[]>>
  /** 성찰 전 관찰 체크리스트 */
  checklist: ChecklistItem[]
  /** 교사 모드 미션 카드 */
  missions: TeacherMission[]
  /** 동료 설명용 문장 틀 */
  sentenceFrames: SentenceFrame[]
  /** 오개념 체크 (선택) */
  misconceptions?: MisconceptionItem[]
}

export interface SnapshotEntry {
  id: string
  label: string
  at: string
  metrics: Record<string, string | number>
  note?: string
}

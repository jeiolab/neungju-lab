/** 가상의 AI 도입 안건에 대한 배심원 판단. 사람을 심판하지 않습니다. */
export type Judgment = '찬성' | '반대' | '조건부'

/** 이해관계자가 처한 입장 */
export type StakeSide = 'benefit' | 'worry' | 'mixed'

/** 윤리 원칙. 고급에서 충돌을 다룹니다. */
export type PrincipleId = 'fairness' | 'transparency' | 'safety'

/** 책임 주체 */
export type ResponsibilityRole = 'developer' | 'operator' | 'regulator'

/** 근거 충실도 체크리스트 항목. 점수가 아니라 빠짐 확인용입니다. */
export type ChecklistId =
  | 'stakeholders'
  | 'evidence'
  | 'principles'
  | 'conditions'
  | 'responsibility'
  | 'uncertainty'

export interface Stakeholder {
  id: string
  name: string
  role: string
  side: StakeSide
  /** 이익을 얻는 점 */
  benefits: string
  /** 걱정하는 점 */
  worries: string
}

export interface EvidenceCard {
  id: string
  title: string
  /** 학생에게 공개되는 요약 */
  summary: string
  /** 출처 성격 안내 (가상) */
  sourceNote: string
  /** 신뢰도에 대한 힌트. 중급에서 스스로 평가합니다. */
  trustHint: string
  /** 이 증거가 지지하는 방향 힌트. 정답이 아닙니다. */
  leansToward: Judgment | '혼재'
}

export interface ProtectiveMeasure {
  id: string
  title: string
  description: string
}

export interface PrincipleConflict {
  id: string
  a: PrincipleId
  b: PrincipleId
  /** 왜 두 원칙이 부딪히는지 */
  tension: string
  /** 한쪽만 고르면 생기는 문제 */
  ifOnlyA: string
  ifOnlyB: string
}

export interface ResponsibilityOption {
  role: ResponsibilityRole
  /** 이 역할이 맡을 수 있는 일 예시 */
  duties: string[]
}

/** 배심원이 검토할 가상 도입 사례 한 건 */
export interface DeliberationCase {
  id: string
  title: string
  /** 한 줄 상황 */
  headline: string
  /** 도입 제안 본문 */
  proposal: string
  setting: string
  aiSystem: string
  stakeholders: Stakeholder[]
  evidence: EvidenceCard[]
  measures: ProtectiveMeasure[]
  principleConflicts: PrincipleConflict[]
  responsibilities: ResponsibilityOption[]
  /** 아직 알려지지 않은 정보 예시 (중·고급) */
  missingInfoHints: string[]
}

export const JUDGMENT_LABEL: Record<Judgment, string> = {
  찬성: '찬성 (도입)',
  반대: '반대 (도입 보류)',
  조건부: '조건부 (조건 달고 도입)',
}

export const JUDGMENT_HINT: Record<Judgment, string> = {
  찬성: '이익이 걱정보다 크고, 지금 조건으로도 괜찮다고 봅니다.',
  반대: '걱정이 더 크거나, 정보가 부족해 지금은 도입하면 안 된다고 봅니다.',
  조건부: '보호 조치를 붙이면 도입할 수 있다고 봅니다.',
}

export const PRINCIPLE_LABEL: Record<PrincipleId, string> = {
  fairness: '공정성',
  transparency: '투명성',
  safety: '안전',
}

export const PRINCIPLE_HELP: Record<PrincipleId, string> = {
  fairness: '비슷한 처지의 사람이 비슷한 대우를 받는지, 특정 집단만 불리하지 않은지 살핍니다.',
  transparency: '시스템이 무엇을 보고 결정하는지, 누가 어떻게 설명받을 수 있는지 살핍니다.',
  safety: '신체·심리·개인정보가 해치지 않는지, 잘못되었을 때 피해를 막을 장치가 있는지 살핍니다.',
}

export const ROLE_LABEL: Record<ResponsibilityRole, string> = {
  developer: '개발자·제작사',
  operator: '학교·운영 기관',
  regulator: '감독·규제 기관',
}

export const CHECKLIST_ITEMS: Array<{ id: ChecklistId; label: string; hint: string }> = [
  {
    id: 'stakeholders',
    label: '이해관계자의 이익과 걱정을 모두 언급했다',
    hint: '한쪽에만 유리한 말은 아닌지 확인합니다.',
  },
  {
    id: 'evidence',
    label: '근거(증거)를 적어도 하나 인용했다',
    hint: '느낌만이 아니라 열어 본 카드를 근거로 썼는지 봅니다.',
  },
  {
    id: 'principles',
    label: '원칙 충돌을 인정하고 우선순위를 밝혔다',
    hint: '어느 원칙을 더 중요하게 두었는지 적었는지 봅니다.',
  },
  {
    id: 'conditions',
    label: '조건부라면 구체적 보호 조치를 적었다',
    hint: '찬성·반대면 해당 없어도 됩니다. 조건부라면 조치가 필요합니다.',
  },
  {
    id: 'responsibility',
    label: '누가 무엇을 책임질지 나눴다',
    hint: '개발자·학교·감독기관 중 역할을 배분했는지 봅니다.',
  },
  {
    id: 'uncertainty',
    label: '아직 모르는 점·남은 불확실성을 적었다',
    hint: '완벽한 결론처럼 쓰지 않았는지 확인합니다.',
  },
]

export const SIDE_LABEL: Record<StakeSide, string> = {
  benefit: '주로 이익',
  worry: '주로 걱정',
  mixed: '이익과 걱정 둘 다',
}

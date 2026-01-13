import { GoogleGenAI } from "@google/genai";
import { MLStepType, AlgorithmType } from '../types';
import { ML_STEPS } from '../constants';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzeFailure = async (
  scenarioTitle: string,
  userSequence: MLStepType[],
  selectedAlgo: AlgorithmType | null,
  expectedAlgo: AlgorithmType
): Promise<string> => {
  const client = getClient();
  
  // Static fallback if no API key
  if (!client) {
    if (userSequence.length !== 5) return "공정 단계가 누락되었습니다. 5단계를 모두 채워주세요.";
    const correctOrder = [
      MLStepType.PROBLEM_DEFINITION,
      MLStepType.DATA_COLLECTION,
      MLStepType.PREPROCESSING,
      MLStepType.MODEL_TRAINING,
      MLStepType.EVALUATION
    ];
    
    // Check order
    for (let i = 0; i < 5; i++) {
      if (userSequence[i] !== correctOrder[i]) {
        const wrongStep = ML_STEPS.find(s => s.type === userSequence[i]);
        return `순서가 잘못되었습니다! ${i + 1}번째 단계는 '${wrongStep?.label}'이(가) 아닙니다.`;
      }
    }

    if (selectedAlgo !== expectedAlgo) {
      return `알고리즘 선택 오류! '${scenarioTitle}' 문제에는 '${selectedAlgo === AlgorithmType.REGRESSION ? '회귀' : '분류'}' 모델이 적합하지 않습니다.`;
    }
    
    return "알 수 없는 오류가 발생했습니다.";
  }

  try {
    const prompt = `
      당신은 엄격하지만 유능한 'AI 공장장'입니다. 
      신입 엔지니어가 '${scenarioTitle}' 프로젝트를 위해 ML 파이프라인을 조립했는데 실수를 했습니다.
      
      [정답 기준]
      순서: 문제 정의 -> 데이터 수집 -> 전처리 -> 모델 학습 -> 평가
      알고리즘: ${expectedAlgo === AlgorithmType.REGRESSION ? '회귀(Regression, 수치 예측)' : '분류(Classification, 범주/YesNo 예측)'}
      
      [엔지니어의 제출]
      순서: ${userSequence.join(' -> ')}
      선택한 알고리즘: ${selectedAlgo || '선택 안함'}
      
      다음 형식으로 2문장 이내로 짧고 굵게 피드백을 주세요. 공장장 톤으로 말해주세요.
      예시: "자네! 전처리도 없이 학습을 시키면 모델이 배탈이 나지 않나! 다시 하게."
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "공장장의 통신 상태가 좋지 않습니다. 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini Error", error);
    return "통신 오류로 피드백을 불러올 수 없습니다.";
  }
};

export const generateQuizQuestion = async (): Promise<{question: string, options: string[], answer: number, explanation: string} | null> => {
  const client = getClient();
  if (!client) return null;

  try {
    const prompt = `
      기계학습(Machine Learning)의 5단계 공정(문제정의, 데이터수집, 전처리, 모델학습, 평가)에 대한 
      초보자용 4지선다 퀴즈를 하나 만들어주세요. 특히 흔한 오개념(예: 데이터 없이 학습하기)을 다뤄주세요.
      
      JSON 형식으로 출력해주세요:
      {
        "question": "질문 내용",
        "options": ["보기1", "보기2", "보기3", "보기4"],
        "answer": 0, // 정답 인덱스 (0-3)
        "explanation": "해설"
      }
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error(error);
    return null;
  }
}

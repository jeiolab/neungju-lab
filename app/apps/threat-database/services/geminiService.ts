import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem } from '../types';

const apiKey = typeof window === 'undefined' ? process.env.API_KEY : (process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.NEXT_PUBLIC_API_KEY || '');
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// API 키가 없을 때 사용할 샘플 교육용 뉴스 데이터
const getSampleSecurityNews = (): NewsItem[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  return [
    {
      headline: "피싱 공격 증가: AI 기반 이메일 위조 기술 등장",
      summary: "최근 AI를 활용한 고도화된 피싱 이메일이 급증하고 있습니다. 공격자들이 ChatGPT와 같은 AI 도구를 사용해 더욱 정교한 이메일을 생성하여 사용자들을 속이고 있습니다. 특히 기업 임직원을 사칭한 이메일로 개인정보나 금융정보를 탈취하려는 시도가 늘어나고 있어 주의가 필요합니다.",
      date: today.toISOString().split('T')[0],
      impactLevel: 'High' as const,
      url: undefined
    },
    {
      headline: "랜섬웨어 공격 패턴 변화: 이중 협박 전술 사용",
      summary: "최근 랜섬웨어 공격자들이 데이터 암호화뿐만 아니라 데이터 유출을 위협하는 '이중 협박(Double Extortion)' 전술을 적극 활용하고 있습니다. 피해 기업은 암호화 해제 비용뿐만 아니라 데이터 유출 방지를 위한 추가 비용까지 지불해야 하는 상황에 처하고 있습니다.",
      date: yesterday.toISOString().split('T')[0],
      impactLevel: 'Critical' as const,
      url: undefined
    },
    {
      headline: "IoT 기기 보안 취약점: 스마트홈 해킹 사례 증가",
      summary: "스마트홈 IoT 기기들의 보안 취약점이 지속적으로 발견되고 있습니다. 공격자들이 취약한 IoT 기기를 통해 홈 네트워크에 침입하여 개인정보를 탈취하거나 다른 공격의 발판으로 활용하는 사례가 늘어나고 있습니다. 사용자들은 정기적인 펌웨어 업데이트와 강력한 비밀번호 설정이 필요합니다.",
      date: twoDaysAgo.toISOString().split('T')[0],
      impactLevel: 'Medium' as const,
      url: undefined
    }
  ];
};

export const generateSecurityNews = async (): Promise<NewsItem[]> => {
  if (!ai) {
    // API 키가 없을 때 샘플 교육용 데이터 반환
    return getSampleSecurityNews();
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Search for the latest cybersecurity news headlines from the last 24-48 hours (or very recent). Return 3 key news items in Korean. Include the source URL if available in the JSON.',
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              summary: { type: Type.STRING },
              date: { type: Type.STRING },
              impactLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
              url: { type: Type.STRING },
            },
            required: ['headline', 'summary', 'date', 'impactLevel'],
          },
        },
      },
    });

    if (response.text) {
        const parsed = JSON.parse(response.text) as NewsItem[];
        // 파싱된 데이터가 유효한지 확인
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
    }
    // API 응답이 없거나 유효하지 않을 때 샘플 데이터 반환
    console.warn("API 응답이 없거나 유효하지 않습니다. 샘플 데이터를 사용합니다.");
    return getSampleSecurityNews();
  } catch (error) {
    console.error("Failed to generate news", error);
    // API 호출 실패 시에도 샘플 데이터 반환 (에러 메시지 대신)
    return getSampleSecurityNews();
  }
};

export const analyzeEssay = async (essay: string): Promise<{ score: number; feedback: string }> => {
  if (!ai) {
    return { 
      score: 0, 
      feedback: "API 키가 설정되지 않아 에세이를 평가할 수 없습니다. 관리자에게 문의하세요." 
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Evaluate the following short essay on "Why do we need White Hat Hackers?". The essay is likely in Korean.
      Essay: "${essay}"
      
      Provide a JSON response with a score (0-100) and a brief, encouraging feedback paragraph in Korean explaining key points they missed or got right.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
          },
          required: ['score', 'feedback'],
        },
      },
    });
    
    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Essay analysis failed", error);
    return { score: 0, feedback: "시스템 오프라인. 현재 에세이를 평가할 수 없습니다." };
  }
};
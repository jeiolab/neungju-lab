import { GoogleGenAI } from "@/lib/genai-browser-shim";
import { Device, Connection, DeviceType } from '../types';

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
const ai = new GoogleGenAI({ apiKey });

export const getDesignFeedback = async (devices: Device[], connections: Connection[], currentScore: number): Promise<string> => {
  if (!apiKey) {
    return "API 키가 설정되지 않아 상세 AI 피드백을 받을 수 없습니다. (기본 로직 평가만 제공됨)";
  }

  try {
    const networkData = {
      deviceCount: devices.length,
      devices: devices.map(d => ({ type: d.type, id: d.id })),
      connections: connections.map(c => ({ from: c.sourceId, to: c.targetId, type: c.type })),
      score: currentScore
    };

    const prompt = `
      당신은 친절하고 전문적인 학교 네트워크 관리자 멘토입니다.
      학생이 설계한 교실 네트워크 구성을 보고 피드백을 주세요.
      
      현재 학생의 설계 데이터(JSON):
      ${JSON.stringify(networkData)}

      다음 기준을 참고하여 3문장 내외로 조언해주세요:
      1. 라우터, 스위치, AP의 연결 구조가 적절한가?
      2. 무선 기기(태블릿, 노트북)를 위한 AP 배치가 적절한가?
      3. 병목 현상이나 보안상 위험한 구성(예: 라우터 없이 직결)은 없는가?
      4. 잘한 점을 먼저 칭찬하고 개선점을 제안하세요.
      
      말투: 학생에게 말하듯 친절하게, 전문 용어는 쉽게 풀어서 설명.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서버 연결에 문제가 생겨 피드백을 불러올 수 없습니다.";
  }
};

export const getReflectionFeedback = async (userText: string): Promise<string> => {
  if (!apiKey) return "API 키가 없습니다.";

  try {
    const prompt = `
      학생이 학교 네트워크 개선점에 대해 다음과 같이 썼습니다:
      "${userText}"

      이 의견에 대해 네트워크 전문가로서 교육적인 피드백을 주세요.
      학생의 관찰력을 칭찬하고, 그 아이디어가 기술적으로 어떤 의미가 있는지, 혹은 추가로 고려할 점은 무엇인지 덧붙여주세요.
      3~4문장으로 답변하세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "피드백 생성 실패";
  } catch (error) {
    return "오류가 발생했습니다.";
  }
};
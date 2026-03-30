import { GoogleGenAI, Type } from "@/lib/genai-browser-shim";

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
const ai = new GoogleGenAI({ apiKey });

export const generateQuizQuestion = async () => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      정렬 알고리즘(순차 탐색 vs 이진 탐색) 또는 도서관 정리(십진분류법)와 관련된 객관식 퀴즈 문제 1개를 한국어로 생성해줘.
      정렬은 처음에 노력이 들지만 나중에 더 빠른 검색을 가능하게 한다는 트레이드오프 개념에 집중해줘.
      JSON 형식으로 반환해줘: 'question' (질문 문자열), 'options' (4개의 선택지 문자열 배열), 'correctIndex' (정답 인덱스 숫자 0-3), 'explanation' (해설 문자열).
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails
    return {
      question: "이진 탐색이 순차 탐색보다 빠른 이유는 무엇인가요?",
      options: [
        "모든 책을 하나씩 확인하기 때문이다.",
        "매 단계마다 남은 항목의 절반을 제외하기 때문이다.",
        "마법을 사용하기 때문이다.",
        "책이 적을 때만 작동하기 때문이다."
      ],
      correctIndex: 1,
      explanation: "이진 탐색은 탐색 범위를 반복적으로 절반으로 줄여나가므로, 시간 복잡도가 O(log n)으로 매우 효율적입니다."
    };
  }
};

export const evaluateReflection = async (userThought: string, booksCount: number): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      사용자의 생각: "${userThought}".
      상황: 사용자는 책이 ${booksCount}권일 때 정렬이 그만큼의 가치가 있는지 고민하고 있습니다.
      수석 도서관 사서의 입장에서 짧고 격려가 되는 피드백(최대 2문장)을 한국어로 제공해줘.
      필요하다면 '빅오(Big O) 표기법'을 부드럽게 언급해도 좋아.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "좋은 생각입니다! 정렬은 초기 투자 비용이 들지만, 나중에 수많은 책을 찾아야 할 때마다 그 가치를 증명합니다.";
  } catch (error) {
    return "좋은 생각입니다! 정렬은 초기 투자 비용이 들지만, 나중에 수많은 책을 찾아야 할 때마다 그 가치를 증명합니다.";
  }
};
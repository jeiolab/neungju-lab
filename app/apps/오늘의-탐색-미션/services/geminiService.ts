import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

export const generateDailyQuiz = async (context: string): Promise<QuizQuestion[]> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found. Returning mock quiz.");
    return MOCK_QUIZ;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      DFS와 BFS 그래프 탐색 알고리즘에 관한 5개의 객관식 문제를 한국어로 만들어주세요.
      문맥: 사용자는 미로/그래프 탐색 게임을 하고 있습니다.
      초점: 방문 순서, 자료구조(스택 vs 큐), 최단 경로 특성, 백트래킹.
      매일 풀 수 있는 간단한 퀴즈로 만들어주세요.
      결과는 엄격한 JSON 배열 형식으로 반환해야 합니다.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text response");
    
    return JSON.parse(text) as QuizQuestion[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return MOCK_QUIZ;
  }
};

export const generateThinkAboutIt = async (algo: string) => {
   if (!process.env.API_KEY) return "간선에 가중치가 있다면 최적의 경로는 어떻게 변할까요?";
   
   try {
     const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
     const response = await ai.models.generateContent({
       model: 'gemini-3-flash-preview',
       contents: `그래프의 ${algo} 알고리즘에 대해 심화 학습자를 위한 짧고 생각할 거리를 주는 질문 하나를 한국어로 만들어주세요. 1-2문장으로.`
     });
     return response.text || "그래프 이론을 계속 탐구해보세요!";
   } catch (e) {
     return "그래프 이론을 계속 탐구해보세요!";
   }
}

const MOCK_QUIZ: QuizQuestion[] = [
  {
    question: "BFS에서 주로 사용되는 자료구조는 무엇인가요?",
    options: ["스택 (Stack)", "큐 (Queue)", "힙 (Heap)", "트리 (Tree)"],
    correctIndex: 1,
    explanation: "BFS는 큐(Queue)를 사용하여 같은 레벨의 노드들을 순차적으로 탐색합니다."
  },
  {
    question: "가중치가 없는 그래프에서 최단 경로를 보장하는 알고리즘은?",
    options: ["DFS", "BFS", "둘 다 보장함", "둘 다 보장하지 않음"],
    correctIndex: 1,
    explanation: "BFS는 시작점에서 가까운 노드부터 탐색하므로 가중치가 없는 그래프에서 최단 경로를 보장합니다."
  },
  {
    question: "DFS에서 '백트래킹(Backtracking)'이란 무엇인가요?",
    options: ["앞으로 계속 전진하는 것", "막히면 이전 노드로 되돌아가는 것", "게임을 다시 시작하는 것", "모든 이웃을 한 번에 방문하는 것"],
    correctIndex: 1,
    explanation: "백트래킹은 더 이상 탐색할 자식 노드가 없을 때 부모 노드로 되돌아가는 과정을 말합니다."
  },
  {
      question: "미로 찾기에서 '오른손 법칙(우수법)'은 어떤 알고리즘과 유사한가요?",
      options: ["BFS", "DFS", "다익스트라", "A*"],
      correctIndex: 1,
      explanation: "벽을 따라 이동하는 방식은 한 방향으로 깊게 들어가는 DFS의 변형으로 볼 수 있습니다."
  },
  {
      question: "소셜 네트워크에서 '몇 다리 건너 아는 사이'인지 최단 거리를 찾을 때 유리한 알고리즘은?",
      options: ["DFS", "BFS", "정렬", "해싱"],
      correctIndex: 1,
      explanation: "BFS는 가까운 관계부터 탐색하므로 인맥의 최단 거리를 찾는 데 적합합니다."
  }
];
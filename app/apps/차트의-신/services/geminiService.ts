import { GoogleGenAI, Type, Schema } from "@/lib/genai-browser-shim";
import { DataPoint, InsightResponse, Mission, ChartType } from "../types";

// 서버 프록시 사용 (브라우저에 비밀 키 없음)
const apiKey = process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const modelName = "gemini-3-flash-preview";

export const generateInsight = async (
  dataContext: string,
  data: DataPoint[],
  chartType: string
): Promise<InsightResponse> => {
  // If API key is not available, return a fallback response
  if (!ai) {
    const maxValue = Math.max(...data.map(d => d.value));
    const maxItem = data.find(d => d.value === maxValue);
    return {
      analysis: maxItem ? `와! ${maxItem.name}이(가) ${maxValue}로 가장 높은 값을 가지고 있네요!` : "데이터를 분석해보세요.",
      tone: "encouraging"
    };
  }

  try {
    const dataString = data.map(d => `${d.name}: ${d.value}`).join(', ');
    
    const prompt = `
      You are an encouraging data science tutor for elementary students.
      
      Context: ${dataContext}
      Data: ${dataString}
      Selected Chart: ${chartType}

      1. Analyze the data briefly. Identify the max value, min value, or a significant trend.
      2. Provide a 1-sentence insight about the *data content* itself (e.g., "Wow, Chocolate is the most popular!").
      3. Keep the tone friendly, encouraging, and easy to understand.
      4. Language: Korean (Hangul).
    `;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        analysis: { type: Type.STRING, description: "A friendly 1-sentence insight about the data content in Korean." },
        tone: { type: Type.STRING, enum: ["encouraging", "neutral", "cautionary"], description: "The tone of the message." }
      },
      required: ["analysis", "tone"]
    };

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as InsightResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      analysis: "데이터를 불러오는 중입니다...",
      tone: "neutral"
    };
  }
};

export const generateMission = async (): Promise<Mission> => {
  // If API key is not available, return a fallback mission
  if (!ai) {
    return {
      id: 'fallback',
      title: 'AI 기능 비활성화',
      clientRequest: 'AI 기능을 사용하려면 API 키가 필요합니다.',
      description: '기본 미션을 사용해주세요.',
      data: [{ name: '데이터', value: 0 }],
      correctCharts: [],
      bestChart: ChartType.BAR,
      hint: 'API 키를 설정해주세요.',
      dataContext: 'no-api-key'
    };
  }

  try {
    const prompt = `
      Generate a fun, unique data visualization mission for elementary students.
      
      1. **Theme**: Pick a random, exciting theme (e.g., Space, Dinosaurs, K-Pop, YouTube, Video Games, Animals, Environment, Future City).
      2. **Chart Type**: Choose ONE best chart type from [Bar, Line, Pie, WordCloud].
         - Bar: Comparing amounts.
         - Line: Change over time.
         - Pie: Parts of a whole (percentage).
         - WordCloud: Frequency of words.
      3. **Data**: Generate 4-8 data points suitable for that chart.
      4. **Language**: Korean (Hangul).

      Output JSON format required.
    `;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Mission title (e.g., 'Dinosaur Size Comparison')" },
        clientRequest: { type: Type.STRING, description: "A conversational request from a fictional client (e.g., 'I want to know which dinosaur is the heaviest!')" },
        description: { type: Type.STRING, description: "Brief explanation of the data" },
        data: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              value: { type: Type.NUMBER },
              color: { type: Type.STRING, description: "Hex color code (optional)" }
            },
            required: ["name", "value"]
          }
        },
        bestChart: { type: Type.STRING, enum: ["Bar", "Line", "Pie", "WordCloud"] },
        hint: { type: Type.STRING, description: "A helpful hint about choosing the right chart" },
        dataContext: { type: Type.STRING, description: "Short English description of context for the AI insight generator later" }
      },
      required: ["title", "clientRequest", "description", "data", "bestChart", "hint", "dataContext"]
    };

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    // Map string response to internal Mission type structure
    return {
      id: `gen_${Date.now()}`,
      title: result.title,
      clientRequest: result.clientRequest,
      description: result.description,
      data: result.data,
      bestChart: result.bestChart as ChartType,
      correctCharts: [result.bestChart as ChartType], // Usually the best chart is the correct one
      hint: result.hint,
      dataContext: result.dataContext
    };

  } catch (error) {
    console.error("Mission Generation Error:", error);
    // Fallback mission in case of error
    return {
      id: 'fallback',
      title: '데이터 로딩 오류',
      clientRequest: '새로운 의뢰를 가져오는데 실패했어요.',
      description: '잠시 후 다시 시도해주세요.',
      data: [{ name: 'Error', value: 0 }],
      correctCharts: [],
      bestChart: ChartType.BAR,
      hint: 'API 연결을 확인해주세요.',
      dataContext: 'error'
    };
  }
};

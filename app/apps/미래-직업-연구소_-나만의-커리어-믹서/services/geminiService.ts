import { GoogleGenAI, Type } from "@/lib/genai-browser-shim";
import { JobResult } from "../types";

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
const ai = new GoogleGenAI({ apiKey });

export const generateFutureJob = async (
  interest: string,
  tech: string,
  style: string
): Promise<Omit<JobResult, 'id' | 'createdAt' | 'tags'>> => {
  
  const modelId = "gemini-3-flash-preview"; 

  const prompt = `
    You are a visionary AI Career Counselor for students in 2035.
    
    Task: Create a new future job title and description by combining the following user inputs:
    - Interest Area: ${interest}
    - Digital Technology: ${tech}
    - Work Style: ${style}

    Guidelines:
    1. The job should be realistic yet futuristic (set in year 2035).
    2. Focus on "Collaboration": How does the technology *assist* the human, not replace them?
    3. Reference the concept of "Human-AI Coexistence" (like the Hollywood writers using AI as a tool).
    4. Distinguish between "Human Skills" (empathy, creativity, judgment) and "Digital Skills" (coding, data analysis, prompting).
    5. The tone should be encouraging, professional, and exciting.
    6. Language: Korean.

    Output Format: JSON only.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      jobTitle: { type: Type.STRING, description: "A creative and cool future job title" },
      description: { type: Type.STRING, description: "2-3 sentences explaining what this professional does daily" },
      humanSkills: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of 3 key soft skills (e.g., Empathy, Leadership)"
      },
      digitalSkills: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of 3 key hard/tech skills"
      },
      coexistenceNote: { type: Type.STRING, description: "A short tip on how humans and tech work together in this role" }
    },
    required: ["jobTitle", "description", "humanSkills", "digitalSkills", "coexistenceNote"]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini generation error:", error);
    // Fallback mock data in case of API failure (graceful degradation)
    return {
      jobTitle: `${interest} ${tech} 융합 전문가`,
      description: "AI 서비스의 일시적인 문제로 정확한 직업 정보를 가져오지 못했습니다. 하지만 당신의 흥미와 기술은 무한한 가능성을 가지고 있습니다!",
      humanSkills: ["창의성", "문제해결력", "적응력"],
      digitalSkills: ["기본 IT 소양", "데이터 리터러시"],
      coexistenceNote: "기술은 도구일 뿐, 가치는 당신이 만듭니다."
    };
  }
};
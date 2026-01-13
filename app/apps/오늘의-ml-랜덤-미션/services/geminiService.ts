import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MissionType, MissionData, QuizQuestion, Concept } from "../types";
import { ML_TOPICS } from "../utils";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const generateDailyMission = async (dateStr: string, type: MissionType): Promise<MissionData> => {
  const ai = getClient();
  const seed = dateStr;
  const randomTopicIndex = Math.floor(Math.random() * ML_TOPICS.length);
  const topic = ML_TOPICS[randomTopicIndex];

  let prompt = `You are an ML Learning Coach. Generate a unique daily micro-learning mission for date ${seed}.
  Mission Type: ${type}
  Topic: ${topic}
  Language: Korean (Hangul)
  
  Output MUST be JSON matching the following structure based on the type.
  
  Common fields: "title", "description", "explanation" (feedback), "conceptTags" (array of strings).
  Specific "content" and "correctAnswer" fields per type:
  
  1. OX_REASON:
     content: { question: string, options: ["O", "X"], reasonOptions: [string, string, string, string] }
     correctAnswer: { answer: "O" or "X", reasonIndex: number }
     
  2. CLASSIFICATION:
     content: { scenario: string, options: ["회귀 (Regression)", "분류 (Classification)", "군집화 (Clustering)"] }
     correctAnswer: number (index of correct option)
     
  3. PIPELINE_PUZZLE:
     content: { goal: string, steps: [string, string, string] (mixed order) }
     correctAnswer: [number, number, number] (indices representing the correct order of the provided steps)
     
  4. DATA_ISSUE:
     content: { scenario: string, issueOptions: [string, string, string, string] }
     correctAnswer: number (index of correct issue)
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    }
  });

  const text = response.text || "{}";
  const json = JSON.parse(text);
  
  return {
    id: dateStr,
    type,
    ...json
  };
};

export const generateConcepts = async (tags: string[]): Promise<Concept[]> => {
  const ai = getClient();
  const prompt = `Explain these ML concepts simply for a beginner in Korean: ${tags.join(", ")}.
  Return a JSON array of objects with keys: "title", "description" (max 100 chars), "example".
  Max 3 concepts.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  return JSON.parse(response.text || "[]");
};

export const generateQuiz = async (difficulty: string, weakTags: string[]): Promise<QuizQuestion[]> => {
  const ai = getClient();
  const focus = weakTags.length > 0 ? `Focus specifically on these weak topics: ${weakTags.join(', ')}` : "General ML topics";
  
  const prompt = `Generate 10 Machine Learning quiz questions in Korean.
  Difficulty: ${difficulty}
  ${focus}
  
  Return a JSON array of objects:
  {
    "id": string (unique),
    "question": string,
    "options": string[] (4 choices),
    "correctIndex": number (0-3),
    "explanation": string,
    "tag": string (topic category),
    "difficulty": "${difficulty}"
  }`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });

  return JSON.parse(response.text || "[]");
};

export const evaluateThinking = async (promptText: string, userAnswer: string): Promise<string> => {
  const ai = getClient();
  const prompt = `
  Context: ML Learning App.
  Problem: ${promptText}
  User Answer: ${userAnswer}
  
  Provide a concise, encouraging feedback (in Korean, max 3 sentences) evaluating the user's answer. 
  Point out one good thing and one thing to consider.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  
  return response.text || "좋은 시도입니다! 계속 학습해보세요.";
};

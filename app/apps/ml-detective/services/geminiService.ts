import { CaseFile } from "../types";

export const generateDailyMystery = async (): Promise<CaseFile | null> => {
  try {
    const response = await fetch('/api/gemini/ml-detective', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("API request failed:", response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (data.error) {
      console.error("API error:", data.error);
      return null;
    }

    return data as CaseFile;
  } catch (error) {
    console.error("Failed to generate mystery:", error);
    return null;
  }
};
export const generateReflectionResponse = async (question: string, context: string): Promise<string> => {
    try {
        const response = await fetch('/api/gemini/algorithm-lab/reflection', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, context }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            return data.text;
        } else {
            console.error("API Error:", data.error);
            return data.text || "현재 AI 튜터와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
        }
    } catch (error) {
        console.error("Network Error:", error);
        return "네트워크 오류로 AI 튜터와 연결할 수 없습니다.";
    }
};
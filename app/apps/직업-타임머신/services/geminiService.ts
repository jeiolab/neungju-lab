export const getFutureDiaryFeedback = async (diaryEntry: string) => {
  try {
    const response = await fetch('/api/gemini/job-timemachine/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diaryEntry }),
    });

    if (!response.ok) {
      throw new Error('API response not ok');
    }

    const data = await response.json();
    return data.text || '피드백을 생성할 수 없습니다. 다시 시도해주세요.';
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "미래와의 통신 상태가 불안정합니다. 잠시 후 다시 시도해주세요. (API 키를 확인해주세요)";
  }
};

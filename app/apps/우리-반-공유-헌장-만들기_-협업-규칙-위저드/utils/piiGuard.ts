export const checkForPII = (text: string): { safe: boolean; detected: string[]; filteredText: string } => {
  let detectedTypes: string[] = [];
  let filteredText = text;

  // Phone Number Regex (Korean format mostly)
  const phoneRegex = /(01[016789]-?\d{3,4}-?\d{4})|(\d{2,3}-\d{3,4}-\d{4})/g;
  if (phoneRegex.test(text)) {
    detectedTypes.push('전화번호');
    filteredText = filteredText.replace(phoneRegex, '***-****-****');
  }

  // Email Regex
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  if (emailRegex.test(text)) {
    detectedTypes.push('이메일');
    filteredText = filteredText.replace(emailRegex, '*****@****.***');
  }

  // Resident Registration Number (Simple check for format XXXXXX-XXXXXXX)
  const rrnRegex = /\d{6}-?[1-4]\d{6}/g;
  if (rrnRegex.test(text)) {
    detectedTypes.push('주민등록번호');
    filteredText = filteredText.replace(rrnRegex, '******-*******');
  }
  
  // Note: Name detection is hard without NLP, skipping for simple regex guard.
  // We rely on prompts to warn users not to input names.

  return {
    safe: detectedTypes.length === 0,
    detected: detectedTypes,
    filteredText
  };
};
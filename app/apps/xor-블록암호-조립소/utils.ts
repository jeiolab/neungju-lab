// Converts a string to an array of ASCII numbers
export const stringToAscii = (text: string): number[] => {
  return text.split('').map(char => char.charCodeAt(0));
};

// Converts a number to an 8-bit binary string
export const numberToBinary = (num: number): string => {
  return num.toString(2).padStart(8, '0');
};

// Performs XOR on two binary strings of equal length
export const xorBinary = (binA: string, binB: string): string => {
  let result = '';
  for (let i = 0; i < binA.length; i++) {
    result += binA[i] === binB[i] ? '0' : '1';
  }
  return result;
};

// Converts binary string back to decimal number
export const binaryToNumber = (bin: string): number => {
  return parseInt(bin, 2);
};

// Converts decimal number back to char
export const numberToChar = (num: number): string => {
  return String.fromCharCode(num);
};

// Simulation Runner
export const runEncryptionSimulation = (plaintext: string, key: string) => {
  const stepsLog: any[] = [];
  
  // 1. Padding Logic (Simple Zero Padding for demo, assume block size 2 for demo visualization)
  const blockSize = 2;
  let paddedText = plaintext;
  const remainder = plaintext.length % blockSize;
  let paddingCount = 0;
  
  if (remainder !== 0) {
    paddingCount = blockSize - remainder;
    // Using '*' as visual padding char for educational clarity
    paddedText += '*'.repeat(paddingCount); 
  }
  
  stepsLog.push({ step: 'PADDING', output: paddedText, detail: `블록 크기(${blockSize})에 맞춰 ${paddingCount}글자 패딩 추가` });

  // 2. Split
  const blocks: string[] = [];
  for (let i = 0; i < paddedText.length; i += blockSize) {
    blocks.push(paddedText.substring(i, i + blockSize));
  }
  stepsLog.push({ step: 'SPLIT', output: blocks, detail: `${blocks.length}개의 블록으로 분할: [${blocks.join(', ')}]` });

  // 3. ASCII & 4. Binary & 5. Key Prep & 6. XOR & 7. Connect
  const encryptedBlocks: string[] = [];
  const encryptedHex: string[] = [];
  
  // Key expansion/trimming
  let expandedKey = key;
  while (expandedKey.length < blockSize) expandedKey += key;
  expandedKey = expandedKey.substring(0, blockSize);
  
  const keyAscii = stringToAscii(expandedKey);
  const keyBinary = keyAscii.map(k => numberToBinary(k));

  stepsLog.push({ step: 'KEY_PREP', output: expandedKey, detail: `키를 블록에 맞춤: ${expandedKey} (${keyBinary.join(' ')})` });

  blocks.forEach((block, index) => {
    const blockAscii = stringToAscii(block);
    const blockBinary = blockAscii.map(n => numberToBinary(n));
    
    // XOR
    const xorResultBinary = blockBinary.map((bin, idx) => xorBinary(bin, keyBinary[idx % keyBinary.length]));
    const xorResultNum = xorResultBinary.map(b => binaryToNumber(b));
    const xorResultChar = xorResultNum.map(n => numberToChar(n)).join('');
    const xorResultHex = xorResultNum.map(n => n.toString(16).toUpperCase().padStart(2, '0')).join('');

    encryptedBlocks.push(xorResultChar);
    encryptedHex.push(xorResultHex);

    stepsLog.push({ 
      step: 'PROCESS_BLOCK', 
      blockIndex: index,
      plain: block, 
      ascii: blockAscii,
      binary: blockBinary,
      keyBinary: keyBinary,
      xorBinary: xorResultBinary,
      resultHex: xorResultHex 
    });
  });

  const finalCipher = encryptedHex.join(' ');
  stepsLog.push({ step: 'CONNECT', output: finalCipher, detail: '암호화된 블록 연결 (Hex 표기)' });

  return { finalCipher, stepsLog };
};
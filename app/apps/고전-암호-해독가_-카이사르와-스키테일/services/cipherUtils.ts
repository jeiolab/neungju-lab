// Hangul Unicode Ranges
const HANGUL_START = 44032; // '가'
const HANGUL_END = 55203;   // '힣'
const HANGUL_LENGTH = 11172;

export const caesarCipher = (text: string, shift: number): string => {
  const normalizedShift = shift < 0 ? shift + 26 : shift;
  
  return text.split('').map(char => {
    const code = char.charCodeAt(0);

    // Uppercase A-Z
    if (code >= 65 && code <= 90) {
      return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
    }
    // Lowercase a-z
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
    }
    // Hangul
    if (code >= HANGUL_START && code <= HANGUL_END) {
       // Using modulo to wrap around Hangul Syllables
       // Note: A simpler approach for educational purposes is often just shifting, 
       // but we ensure it stays within Hangul range.
       let newCode = ((code - HANGUL_START + shift) % HANGUL_LENGTH);
       if (newCode < 0) newCode += HANGUL_LENGTH;
       return String.fromCharCode(newCode + HANGUL_START);
    }

    return char;
  }).join('');
};

export const scytaleCipher = (text: string, diameter: number, decode: boolean = false): string => {
  if (!text) return "";
  if (diameter <= 1) return text;

  const len = text.length;
  // For visualization purposes, we treat 'diameter' as the number of ROWS (faces on the rod).
  // The 'columns' are calculated based on length.
  const rows = diameter;
  const cols = Math.ceil(len / rows);
  
  if (decode) {
    // Decoding Scytale is effectively re-encoding with inverted dimensions if full grid
    // But for a linear string read:
    // We write column by column, read row by row to decrypt if it was encrypted row-by-row, read col-by-col.
    // Let's implement the standard physical simulation:
    // Write across the rod (rows), Unwind reads column-wise.
    
    // To Decode: We need to reconstruct the grid.
    // Since our encoding takes index i and places it based on transposition.
    // We can simply use the inverse logic.
    // Actually, Scytale logic is:
    // Encoded[k] = Original[ (k % rows) * cols + floor(k / rows) ] (roughly, handling padding)
    
    // Simpler approach:
    // 1. Create the empty grid
    // 2. Fill it column by column (because that's how it looks unwrapped)
    // 3. Read it row by row (because that's how it looks wrapped)
    
    // Wait, let's stick to the visual metaphor:
    // ENCODE: You write horizontally on the wrapped strip. When unwrapped, letters are adjacent. 
    // Wait, the classic description: You wrap a strip. You write ACROSS the rod (along the length).
    // So if Rod has circumference 3 (3 rows visible):
    // H E L
    // L O _
    // Unwrapped strip reads: H, L, E, O, L, _
    
    // So Encode:
    // Input: HEL LO
    // Grid (Cols = Length/Rows):
    // H E 
    // L O
    // L _
    // Output (Read columns vertical): HLL EO_
    
    const result = new Array(len);
    let k = 0;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
         const originalIndex = c + r * cols;
         if (originalIndex < len) {
             // Reversing the operation
             // Not exactly trivial without padding.
             // Let's stick to the matrix transpose logic.
         }
      }
    }
    // Let's use the standard transposition algorithm
    const resultStr: string[] = [];
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const index = i + j * cols;
            if(index < text.length) {
                resultStr.push(text[index]);
            }
        }
    }
    return resultStr.join('');

  } else {
    // ENCODE
    // Input: HELLO WORLD
    // Rows: 3
    // H L O R D
    // E L W L
    // L O _
    // Result: HLORD ELWL LO
    
    const result: string[] = [];
    for (let i = 0; i < rows; i++) {
        for (let j = i; j < len; j += rows) {
            result.push(text[j]);
        }
    }
    return result.join('');
  }
};

// Helper for the grid visualization
export const getScytaleGrid = (text: string, rows: number): string[][] => {
    const len = text.length;
    const cols = Math.ceil(len / rows);
    const grid: string[][] = [];

    let charIndex = 0;
    // We fill row by row for the "Wrapped" view
    for (let r = 0; r < rows; r++) {
        const rowArr: string[] = [];
        for (let c = 0; c < cols; c++) {
             // In the physical metaphor:
             // You write across the rod.
             // So visually, the grid IS the message written out naturally left-to-right?
             // No, the STRIP is the message. The ROD aligns non-adjacent letters.
             
             // Let's stick to the app logic:
             // Input is Plaintext.
             // We want to show how it looks on the rod.
             // On the rod, the message is written horizontally.
             // H E L L O
             // W O R L D
             // So the grid is just the plaintext broken into chunks of length 'Cols' ??
             // No.
             
             // Let's simplify for the user:
             // 1. We have a plaintext.
             // 2. We wrap a blank strip.
             // 3. We write the plaintext ACROSS the rod.
             //    So Row 1: H E L L O
             //    Row 2: W O R L D
             // 4. We unwrap. The strip reads: H W E O L R L L O D
             
             // So, Grid View (Wrapped) = Plaintext laid out in rows.
             if (charIndex < len) {
                 rowArr.push(text[charIndex]);
                 charIndex++;
             } else {
                 rowArr.push("");
             }
        }
        grid.push(rowArr);
    }
    return grid;
}

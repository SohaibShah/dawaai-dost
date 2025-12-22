/**
 * Transliterates English medicine names to Urdu script
 * This allows medicine names to flow naturally with Urdu text
 */

const TRANSLITERATION_MAP: Record<string, string> = {
  // Vowels
  'a': 'ا',
  'e': 'ی',
  'i': 'ی',
  'o': 'و',
  'u': 'و',
  
  // Consonants
  'b': 'ب',
  'c': 'ک',
  'd': 'ڈ',
  'f': 'ف',
  'g': 'گ',
  'h': 'ہ',
  'j': 'ج',
  'k': 'ک',
  'l': 'ل',
  'm': 'م',
  'n': 'ن',
  'p': 'پ',
  'q': 'ق',
  'r': 'ر',
  's': 'س',
  't': 'ٹ',
  'v': 'و',
  'w': 'و',
  'x': 'کس',
  'y': 'ی',
  'z': 'ز',
  
  // Common combinations
  'ch': 'چ',
  'sh': 'ش',
  'th': 'تھ',
  'kh': 'خ',
  'gh': 'غ',
  'ph': 'ف',
};

export function transliterateToUrdu(text: string): string {
  if (!text) return text;
  
  let result = '';
  let i = 0;
  const lowerText = text.toLowerCase();
  
  while (i < lowerText.length) {
    // Check for two-character combinations first
    if (i < lowerText.length - 1) {
      const twoChar = lowerText.substring(i, i + 2);
      if (TRANSLITERATION_MAP[twoChar]) {
        result += TRANSLITERATION_MAP[twoChar];
        i += 2;
        continue;
      }
    }
    
    // Check single character
    const char = lowerText[i];
    if (TRANSLITERATION_MAP[char]) {
      result += TRANSLITERATION_MAP[char];
    } else if (char === ' ') {
      result += ' ';
    } else {
      // Keep numbers and special characters as-is
      result += text[i];
    }
    i++;
  }
  
  return result;
}

/**
 * Common medicine name mappings for better accuracy
 * These override the basic transliteration
 */
const COMMON_MEDICINE_NAMES: Record<string, string> = {
  'panadol': 'پیناڈول',
  'paracetamol': 'پیراسیٹامول',
  'aspirin': 'اسپرین',
  'ibuprofen': 'آئبوپروفین',
  'amoxicillin': 'اموکسیسلن',
  'azithromycin': 'ازیتھرومائیسن',
  'ciprofloxacin': 'سپروفلوکساسن',
  'metformin': 'میٹفارمن',
  'atorvastatin': 'اٹورواسٹیٹن',
  'omeprazole': 'اومیپرازول',
  'lisinopril': 'لیسینوپرل',
  'amlodipine': 'املوڈیپین',
  'simvastatin': 'سمواسٹیٹن',
  'levothyroxine': 'لیووتھائروکسن',
  'insulin': 'انسولن',
  'vitamin': 'وٹامن',
  'calcium': 'کیلشیم',
  'iron': 'آئرن',
  'zinc': 'زنک',
};

export function transliterateMedicineName(name: string): string {
  const lowerName = name.toLowerCase().trim();
  
  // Check if we have a predefined mapping
  if (COMMON_MEDICINE_NAMES[lowerName]) {
    return COMMON_MEDICINE_NAMES[lowerName];
  }
  
  // Otherwise use generic transliteration
  return transliterateToUrdu(name);
}

/**
 * Transliterates Urdu (Arabic script) to Hindi (Devanagari script) for TTS
 * This allows the Hindi TTS model to speak Urdu text properly
 * 
 * Uses whole-word patterns for common Urdu words to ensure accurate pronunciation
 */

// Common Urdu word to Hindi transliteration patterns
const URDU_WORD_PATTERNS: Array<[RegExp, string]> = [
  // Question words and pronouns
  [/کیا/g, 'क्या'],
  [/آپ/g, 'आप'],
  [/یہ/g, 'यह'],
  [/وہ/g, 'वह'],
  [/کون/g, 'कौन'],
  [/کہاں/g, 'कहां'],
  [/کب/g, 'कब'],
  [/کیوں/g, 'क्यों'],
  [/کیسے/g, 'कैसे'],
  
  // Common verbs
  [/ہے/g, 'है'],
  [/ہیں/g, 'हैं'],
  [/تھا/g, 'था'],
  [/تھی/g, 'थी'],
  [/تھے/g, 'थे'],
  [/ہو/g, 'हो'],
  [/کر/g, 'कर'],
  [/کریں/g, 'करें'],
  [/کرنا/g, 'करना'],
  [/لیا/g, 'लिया'],
  [/لی/g, 'ली'],
  [/لیں/g, 'लें'],
  [/لینا/g, 'लेना'],
  [/دیا/g, 'दिया'],
  [/دیں/g, 'दें'],
  [/دینا/g, 'देना'],
  [/چاہیں/g, 'चाहें'],
  [/چاہتے/g, 'चाहते'],
  [/چاہتی/g, 'चाहती'],
  [/جائیں/g, 'जाएं'],
  [/جانا/g, 'जाना'],
  [/آئیں/g, 'आएं'],
  [/آنا/g, 'आना'],
  [/دیکھیں/g, 'देखें'],
  [/سمجھیں/g, 'समझें'],
  [/بتائیں/g, 'बताएं'],
  
  // Postpositions
  [/نے/g, 'ने'],
  [/کو/g, 'को'],
  [/سے/g, 'से'],
  [/میں/g, 'में'],
  [/پر/g, 'पर'],
  [/کے/g, 'के'],
  [/کی/g, 'की'],
  [/کا/g, 'का'],
  [/گے/g, 'गे'],
  [/گی/g, 'गी'],
  [/گا/g, 'गा'],
  
  // Conjunctions
  [/اور/g, 'और'],
  [/یا/g, 'या'],
  [/لیکن/g, 'लेकिन'],
  [/مگر/g, 'मगर'],
  [/اگر/g, 'अगर'],
  [/تو/g, 'तो'],
  
  // Medicine/health related
  [/دوا/g, 'दवा'],
  [/دوائی/g, 'दवाई'],
  [/دوائیں/g, 'दवाइयां'],
  [/ادویات/g, 'अदवियात'],
  [/خوراک/g, 'खुराक'],
  [/مریض/g, 'मरीज़'],
  [/ڈاکٹر/g, 'डॉक्टर'],
  [/علاج/g, 'इलाज'],
  [/صحت/g, 'सेहत'],
  
  // App-specific words
  [/ترمیم/g, 'तरमीम'],
  [/تبدیلی/g, 'तबदीली'],
  [/حذف/g, 'हज़्फ़'],
  [/شامل/g, 'शामिल'],
  [/واپس/g, 'वापस'],
  [/الرٹ/g, 'अलर्ट'],
  [/اختیار/g, 'इख्तियार'],
  [/منتخب/g, 'मुंतखब'],
  [/ترتیب/g, 'तरतीब'],
  [/سیٹنگز/g, 'सेटिंग्स'],
  [/تفصیلات/g, 'तफ्सीलात'],
  [/محفوظ/g, 'महफूज़'],

  
  // Ordinals
  [/پہلا/g, 'पहला'],
  [/پہلی/g, 'पहली'],
  [/دوسرا/g, 'दूसरा'],
  [/دوسری/g, 'दूसरी'],
  [/تیسرا/g, 'तीसरा'],
  [/تیسری/g, 'तीसरी'],
  
  // Common adjectives
  [/نیا/g, 'नया'],
  [/نئی/g, 'नई'],
  [/پرانا/g, 'पुराना'],
  [/پرانی/g, 'पुरानी'],
  [/اچھا/g, 'अच्छा'],
  [/اچھی/g, 'अच्छी'],
  [/برا/g, 'बुरा'],
  [/بری/g, 'बुरी'],
  [/بڑا/g, 'बड़ा'],
  [/بڑی/g, 'बड़ी'],
  [/چھوٹا/g, 'छोटा'],
  [/چھوٹی/g, 'छोटी'],
  
  // Actions
  [/ٹھیک/g, 'ठीक'],
  [/منسوخ/g, 'मनसूख'],
  [/بند/g, 'बंद'],
  [/کھولیں/g, 'खोलें'],
  [/بدلیں/g, 'बदलें'],
  [/ہٹائیں/g, 'हटाएं'],
  [/ہٹانے/g, 'हटाने'],
  [/ہٹانا/g, 'हटाना'],
  [/نشان/g, 'निशान'],
  [/دبائیں/g, 'दबाएं'],
  [/دبانا/g, 'दबाना'],
  [/مینو/g, 'मेनू'],
  
  // Negations and affirmations
  [/نہیں/g, 'नहीं'],
  [/ہاں/g, 'हां'],
  [/جی/g, 'जी'],
  [/بلکل/g, 'बिल्कुल'],
  [/ضرور/g, 'ज़रूर'],
  [/شاید/g, 'शायद'],
  
  // Other common words
  [/واقعی/g, 'वाक़ई'],
  [/عمل/g, 'अमल'],
  [/سکتا/g, 'सकता'],
  [/سکتی/g, 'सकती'],
  [/سکتے/g, 'सकते'],
  [/مکمل/g, 'मुकम्मल'],
  [/براہ/g, 'बराह'],
  [/کرم/g, 'करम'],
  [/براہ کرم/g, 'बराह करम'],
  [/شکریہ/g, 'शुक्रिया'],
  [/معذرت/g, 'माज़रत'],
];

const URDU_TO_HINDI_MAP: Record<string, string> = {
  // Consonants
  'ب': 'ब',
  'پ': 'प',
  'ت': 'त',
  'ٹ': 'ट',
  'ث': 'स',
  'ج': 'ज',
  'چ': 'च',
  'ح': 'ह',
  'خ': 'ख',
  'د': 'द',
  'ڈ': 'ड',
  'ذ': 'ज़',
  'ر': 'र',
  'ڑ': 'ड़',
  'ز': 'ज़',
  'ژ': 'झ',
  'س': 'स',
  'ش': 'श',
  'ص': 'स',
  'ض': 'ज़',
  'ط': 'त',
  'ظ': 'ज़',
  'ع': '',
  'غ': 'ग़',
  'ف': 'फ',
  'ق': 'क़',
  'ک': 'क',
  'گ': 'ग',
  'ल': 'ल',
  'म': 'म',
  'ن': 'न',
  'ں': 'ं',
  'ہ': 'ह',
  'ھ': 'ह',
  
  // Standalone vowels
  'ا': 'आ',
  'آ': 'आ',
  'و': 'ओ',
  'ی': 'ई',
  'ے': 'ए',
  'ؤ': 'ओ',
  'ئ': '',
  'ء': '',
  
  // Punctuation
  '۔': '।',
  '؟': '?',
  '،': ',',
};

export function transliterateUrduToHindi(urduText: string): string {
  if (!urduText) return urduText;
  
  let result = urduText;
  
  // First, apply common word pattern replacements for better accuracy
  for (const [pattern, replacement] of URDU_WORD_PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  
  // Then do character-by-character transliteration for remaining text
  let finalResult = '';
  for (let i = 0; i < result.length; i++) {
    const char = result[i];
    
    if (URDU_TO_HINDI_MAP[char] !== undefined) {
      finalResult += URDU_TO_HINDI_MAP[char];
    } else if (char === ' ' || /[0-9]/.test(char)) {
      finalResult += char;
    } else if (/[a-zA-Z]/.test(char)) {
      finalResult += char;
    } else if (/[\u0900-\u097F]/.test(char)) {
      // Already Hindi/Devanagari, keep as-is
      finalResult += char;
    } else {
      // Keep unmapped characters
      finalResult += char;
    }
  }
  
  return finalResult;
}

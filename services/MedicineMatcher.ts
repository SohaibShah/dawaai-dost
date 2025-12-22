import Fuse from 'fuse.js';
import medicineDatabase from '../assets/data/medicines.json';

// --- Types ---
interface MedicineEntry {
  name: string;
  strength: string;
}

const lengthBuckets: { [key: number]: Fuse<MedicineEntry> } = {};
const exactMatchMap = new Map<string, MedicineEntry>();

// Configuration: Lower threshold = Stricter match.
const FUSE_OPTIONS = {
  includeScore: true,
  threshold: 0.35, 
  keys: ['name']
};

// 1. ONE-TIME SETUP (Runs once when app loads)
// This splits our 33k medicines into smaller, faster chunks.
(() => {
  console.log("Building Medicine Index...");
  const tempBuckets: { [key: number]: MedicineEntry[] } = {};

  medicineDatabase.forEach((med: MedicineEntry) => {
    // A. Build Exact Match Map (Instant lookup)
    // Normalize to lowercase for case-insensitive exact matching
    exactMatchMap.set(med.name.toLowerCase(), med);

    // B. Build Length Buckets
    const len = med.name.length;
    if (!tempBuckets[len]) tempBuckets[len] = [];
    tempBuckets[len].push(med);
  });

  // C. Create Fuse Instances for each bucket
  // We only index reasonable lengths (e.g., words 3 to 20 chars long)
  Object.keys(tempBuckets).forEach((key) => {
    const len = parseInt(key);
    if (len >= 3) {
      lengthBuckets[len] = new Fuse(tempBuckets[len], FUSE_OPTIONS);
    }
  });
  console.log("Index Built. Ready for fast searching.");
})();

// --- Helper: Get relevant buckets ---
// If word is 6 letters, we return Fuse instances for lengths 5, 6, and 7.
const getFuseInstances = (wordLength: number) => {
  const instances = [];
  // Check -2 to +2 range (e.g., "Panadol" (7) might be read as "Panado" (6) or "Panadols" (8))
  for (let i = wordLength - 2; i <= wordLength + 2; i++) {
    if (lengthBuckets[i]) instances.push(lengthBuckets[i]);
  }
  return instances;
};

export const MedicineMatcher = {
  processText: (rawText: string) => {
    // 1. Extract Dosage (Fast Regex)
    const dosageRegex = /(\d+)\s?(mg|ml|g|mcg)/i;
    const dosageMatch = rawText.match(dosageRegex);
    let detectedDosage = dosageMatch ? dosageMatch[0].replace(/\s/g, '') : null;

    // 2. Split and Clean Lines
    const lines = rawText.split('\n');
    let bestMatch = null;
    let bestScore = 1; // Lower is better

    for (const line of lines) {
      // Clean: Remove special chars, keep spaces. "Flagyl 400" -> "Flagyl 400"
      const cleanLine = line.replace(/[^a-zA-Z0-9\s]/g, '').trim();
      
      // Heuristic: Skip lines that are too short or just numbers
      if (cleanLine.length < 3 || /^\d+$/.test(cleanLine)) continue;

      // --- TIER 1: EXACT MATCH (Instant) ---
      // Check if the whole line is exactly a medicine name
      const exact = exactMatchMap.get(cleanLine.toLowerCase());
      if (exact) {
        console.log(`[Instant Match] Found: ${exact.name}`);
        return {
          name: exact.name,
          dosage: detectedDosage || exact.strength,
          confidence: true
        };
      }

      // --- TIER 2: PARTITIONED FUZZY SEARCH (Fast) ---
      const relevantFuses = getFuseInstances(cleanLine.length);
      
      for (const fuse of relevantFuses) {
        const results = fuse.search(cleanLine);
        
        if (results.length > 0) {
          const match = results[0];
          const score = match.score !== undefined ? match.score : 1;

          // If score is amazing (< 0.1), trust it immediately and stop.
          if (score < 0.1) {
            console.log(`[Fuzzy Match] "${cleanLine}" -> ${match.item.name} (Score: ${score})`);
            return {
              name: match.item.name,
              dosage: detectedDosage || match.item.strength,
              confidence: true
            };
          }

          if (score < bestScore) {
            bestScore = score;
            bestMatch = match.item;
          }
        }
      }
    }

    // We accept fuzzy matches up to 0.35 score
    if (bestMatch && bestScore < 0.35) {
      console.log(`[Best Candidate] ${bestMatch.name} (Score: ${bestScore})`);
      return {
        name: bestMatch.name,
        dosage: detectedDosage || bestMatch.strength,
        confidence: true
      };
    }

    return { name: '', dosage: '', confidence: false };
  }
};
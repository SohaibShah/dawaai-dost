import Fuse from 'fuse.js';
import medicineDatabase from '../assets/data/medicines.json';

interface MedicineEntry {
  name: string;
  strength: string;
}

const lengthBuckets: { [key: number]: Fuse<MedicineEntry> } = {};
const exactMatchMap = new Map<string, MedicineEntry>();

const FUSE_OPTIONS = {
  includeScore: true,
  threshold: 0.35, 
  keys: ['name']
};

(() => {
  console.log("Building Medicine Index...");
  const tempBuckets: { [key: number]: MedicineEntry[] } = {};

  medicineDatabase.forEach((med: MedicineEntry) => {
    exactMatchMap.set(med.name.toLowerCase(), med);

    const len = med.name.length;
    if (!tempBuckets[len]) tempBuckets[len] = [];
    tempBuckets[len].push(med);
  });

  Object.keys(tempBuckets).forEach((key) => {
    const len = parseInt(key);
    if (len >= 3) {
      lengthBuckets[len] = new Fuse(tempBuckets[len], FUSE_OPTIONS);
    }
  });
  console.log("Index Built. Ready for fast searching.");
})();

const getFuseInstances = (wordLength: number) => {
  const instances = [];
  for (let i = wordLength - 2; i <= wordLength + 2; i++) {
    if (lengthBuckets[i]) instances.push(lengthBuckets[i]);
  }
  return instances;
};

export const MedicineMatcher = {
  processText: (rawText: string) => {
    const dosageRegex = /(\d+)\s?(mg|ml|g|mcg)/i;
    const dosageMatch = rawText.match(dosageRegex);
    let detectedDosage = dosageMatch ? dosageMatch[0].replace(/\s/g, '') : null;

    const lines = rawText.split('\n');
    let bestMatch = null;
    let bestScore = 1; // Lower is better

    for (const line of lines) {
      const cleanLine = line.replace(/[^a-zA-Z0-9\s]/g, '').trim();
      
      if (cleanLine.length < 3 || /^\d+$/.test(cleanLine)) continue;

      const exact = exactMatchMap.get(cleanLine.toLowerCase());
      if (exact) {
        console.log(`[Instant Match] Found: ${exact.name}`);
        return {
          name: exact.name,
          dosage: detectedDosage || exact.strength,
          confidence: true
        };
      }

      const relevantFuses = getFuseInstances(cleanLine.length);
      
      for (const fuse of relevantFuses) {
        const results = fuse.search(cleanLine);
        
        if (results.length > 0) {
          const match = results[0];
          const score = match.score !== undefined ? match.score : 1;

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
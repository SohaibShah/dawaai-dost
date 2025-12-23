import { Platform } from 'react-native';
// Use legacy API for file writes to avoid deprecation warnings
import * as FileSystem from 'expo-file-system/legacy';

let TextRecognition: any = null;
try {
  const MlkitOcr = require('@react-native-ml-kit/text-recognition');
  TextRecognition = MlkitOcr.default || MlkitOcr;
  console.log('[OCR] @react-native-ml-kit/text-recognition loaded successfully');
} catch (e) {
  console.log('[OCR] @react-native-ml-kit/text-recognition not available:', e);
}

const GOOGLE_API_KEY = "AIzaSyA0nKw0LB42ZPuNk9qygqjkMu_uvVsmtAw"; 
const GOOGLE_CV_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_API_KEY}`;

export const OcrService = {
  recognizeText: async (base64Image: string): Promise<string> => {
    try {
      if (Platform.OS !== 'web' && TextRecognition) {
        try {
          console.log("[OCR] Attempting to use on-device text recognition...");
          
          // ML Kit needs a file path, not base64
          // Save base64 to temp file first
          const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
          const fs: any = FileSystem as any;
          const cacheDir: string = fs.cacheDirectory || fs.documentDirectory || '';
          const tempFilePath = `${cacheDir}temp_ocr_image.jpg`;

          // Write base64 to file; expo-file-system v19 still supports writeAsStringAsync at runtime
          await fs.writeAsStringAsync(tempFilePath, cleanBase64, { encoding: 'base64' });

          console.log("[OCR] Saved temp file, running ML Kit recognition...");
          const result = await TextRecognition.recognize(tempFilePath);

          // Clean up temp file (idempotent when flag supported)
          if (fs.deleteAsync) {
            await fs.deleteAsync(tempFilePath, { idempotent: true });
          } else {
            await fs.deleteAsync?.(tempFilePath).catch(() => {});
          }
          
          if (result && result.text) {
            console.log("[OCR] Success with on-device OCR! Text length:", result.text.length);
            return result.text;
          }
          
          console.log("[OCR] On-device OCR returned no text, falling back to Cloud Vision...");
        } catch (nativeError) {
          console.warn("[OCR] On-device OCR failed, falling back to Cloud Vision:", nativeError);
        }
      } else {
        console.log("[OCR] On-device OCR not available (likely running in Expo Go), using Cloud Vision...");
      }

      console.log("[OCR] Starting request to Cloud Vision API...");
      const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

      const body = {
        requests: [
          {
            image: { content: cleanBase64 },
            features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
          },
        ],
      };

      const response = await fetch(GOOGLE_CV_URL, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`[OCR] API Error (${response.status}):`, errorBody);
        throw new Error(`Cloud Vision API Failed: ${response.status} ${errorBody}`);
      }

      const json = await response.json();

      if (!json.responses || !json.responses[0]) {
        console.warn("[OCR] API returned a valid response but no data.");
        return "";
      }

      const annotation = json.responses[0].fullTextAnnotation;
      if (annotation) {
        console.log("[OCR] Success! Text detected with Cloud Vision.");
        return annotation.text;
      } else {
        console.log("[OCR] No text detected in the image.");
        return "";
      }

    } catch (error) {
      console.error("[OCR] Service Exception:", error);
      throw error;
    }
  }
};
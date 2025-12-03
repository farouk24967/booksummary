
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Language, VoiceGender } from "../types";

// Initialize the Gemini API client with the API key from the environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AIResponse {
  mainIdea: string;
  keyPoints: string[];
  lessons: string[];
  quote: string;
}

export const generateBookSummary = async (title: string, author: string, language: Language): Promise<AIResponse | null> => {
  try {
    // Using gemini-2.5-flash as it is efficient for text summarization tasks
    const model = 'gemini-2.5-flash';
    
    const prompt = `Generate a structured summary for the book "${title}" by ${author}.
    Language: ${language}.
    
    Please provide the output in the following structure:
    1. Main Idea: A concise summary of the book's core concept (approx 30-50 words).
    2. Key Points: 3 to 5 major arguments or concepts presented in the book.
    3. Lessons: 3 actionable lessons or takeaways for the reader.
    4. Quote: One famous or impactful quote from the book.
    
    Ensure the content is high quality, accurate, and written in ${language}.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainIdea: { type: Type.STRING },
            keyPoints: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            lessons: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            quote: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIResponse;
    }
    return null;

  } catch (error: any) {
    console.error("Gemini API Error (generateBookSummary):", error.message || String(error));
    throw error;
  }
};

export const summarizePdf = async (base64Data: string, mimeType: string, language: Language): Promise<string | null> => {
  try {
    // Using gemini-2.5-flash for efficient multimodal processing
    const model = 'gemini-2.5-flash';

    const prompt = `Please analyze the attached PDF document and provide a comprehensive summary in ${language}. 
    The summary should be approximately 600 words long.
    
    Structure the summary as follows:
    1. **Introduction**: Brief overview of the document's purpose.
    2. **Core Arguments/Findings**: Detailed explanation of the main points.
    3. **Conclusion**: Final thoughts or implications.
    
    Format the output in clear Markdown.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    return response.text || null;
  } catch (error: any) {
    console.error("Gemini PDF Summary Error:", error.message || String(error));
    throw error;
  }
};

// Helper function to translate text before generating speech
const translateText = async (text: string, targetLanguage: Language): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Translate the following text into ${targetLanguage}. 
    Ensure the tone remains engaging and suitable for narration. 
    Return ONLY the translated text, no markdown, no preamble.
    
    Text: "${text.substring(0, 3000)}"`; // Truncate to avoid limit issues

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt
    });

    return response.text || text;
  } catch (error) {
    console.error("Translation error, using original text:", error);
    return text;
  }
};

export const generateSpeech = async (text: string, language: Language, gender: VoiceGender): Promise<string | null> => {
  try {
    const model = 'gemini-2.5-flash-preview-tts';
    
    // Step 1: Translate text if necessary (Basic check: We translate everything to ensure correct language output)
    // In a production app, we might check if text is already in target language, but here we enforce it.
    const textToSpeak = await translateText(text, language);

    // Step 2: Select Voice
    // Kore = Female leaning, Fenrir = Male leaning (Deep)
    const voiceName = gender === 'female' ? 'Kore' : 'Fenrir';

    const response = await ai.models.generateContent({
      model: model,
      contents: [{ parts: [{ text: textToSpeak }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio) {
      // Convert base64 to Blob URL
      try {
        const binaryString = window.atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Note: gemini-2.5-flash-preview-tts returns raw PCM (typically 24kHz, 16-bit, mono)
        // We wrap it in a WAV header so the <audio> element can play it.
        const wavHeader = createWavHeader(bytes.length, 24000, 1, 16);
        const wavBlob = new Blob([wavHeader, bytes], { type: 'audio/wav' });
        return URL.createObjectURL(wavBlob);
      } catch (e: any) {
          console.error("Error processing audio data:", e.message || String(e));
          return null;
      }
    }
    
    return null;
  } catch (error: any) {
    console.error("Gemini TTS Error:", error.message || String(error));
    throw error;
  }
};

// Helper to create a WAV header for raw PCM data
function createWavHeader(dataLength: number, sampleRate: number, numChannels: number, bitsPerSample: number) {
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // file length
  view.setUint32(4, 36 + dataLength, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, numChannels * (bitsPerSample / 8), true);
  // bits per sample
  view.setUint16(34, bitsPerSample, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, dataLength, true);

  return header;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

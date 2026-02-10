
import { GoogleGenAI, Type } from "@google/genai";
import { Card } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateCardsFromTopic(topic: string, count: number = 5): Promise<Card[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate ${count} educational flashcards about "${topic}". Provide a term and a concise definition for each.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            definition: { type: Type.STRING }
          },
          required: ["term", "definition"]
        }
      }
    }
  });

  try {
    const raw = JSON.parse(response.text || '[]');
    return raw.map((item: any, idx: number) => ({
      id: Math.random().toString(36).substr(2, 9),
      term: item.term,
      definition: item.definition
    }));
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
}

export async function explainConcept(term: string, context: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Explain the concept of "${term}" in the context of "${context}" for a high school student. Keep it under 100 words.`,
  });
  return response.text || "Sorry, I couldn't generate an explanation right now.";
}

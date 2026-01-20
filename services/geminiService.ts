
import { GoogleGenAI } from "@google/genai";
import { TranslationMode } from "../types";
import { SYSTEM_PROMPT } from "../constants";

export const translateText = async (text: string, mode: TranslationMode): Promise<string> => {
  if (!text.trim()) return "";

  try {
    // Correct initialization: Always use process.env.API_KEY directly as a named parameter.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Correct usage: Call generateContent directly on ai.models.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Modo: ${mode}\nTexto a traducir: ${text}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.8, // Slightly higher for more creative "costumbrista" metaphors
        topP: 0.95,
      },
    });

    // Correct extraction: access the .text property (not a method).
    return response.text?.trim() || "Lo siento, che. Se me cortó la conexión en medio del asado.";
  } catch (error) {
    console.error("Error en la traducción:", error);
    return "Error técnico. Parece que el servidor se tomó el palo.";
  }
};

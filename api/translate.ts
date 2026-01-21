import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `
Sos un traductor cultural argentino.
Convertís lenguaje corporativo/marketing en lenguaje criollo argentino,
con humor, metáforas cotidianas y tono porteño.
No seas ofensivo. Sé ingenioso y claro.
`;


export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, mode } = req.body as {
    text: string;
    mode: TranslationMode;
  };

  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Empty text" });
  }

  try {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      throw new Error("Missing API_KEY");
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Modo: ${mode}\nTexto a traducir: ${text}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    const result =
      response.text?.trim() ||
      "Se me fue la inspiración, che. Probá de nuevo.";

    return res.status(200).json({ result });
  } catch (error) {
    console.error("Error en /api/translate:", error);
    return res.status(500).json({
      error: "Error técnico del servidor",
    });
  }
}

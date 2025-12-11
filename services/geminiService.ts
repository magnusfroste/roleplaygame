import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhanceNarrative = async (
  baseText: string,
  playerAction: string,
  rollResult: number,
  success: boolean
): Promise<string> => {
  try {
    const prompt = `
      You are a Dungeon Master for a Sci-Fi RPG. 
      Context: The story says "${baseText}".
      Action: The player chose to "${playerAction}".
      Dice Roll: ${rollResult} (Scale 1-20).
      Outcome: The action was a ${success ? "SUCCESS" : "FAILURE"}.
      
      Task: Write a short, immersive paragraph (max 3 sentences) describing this specific outcome in SWEDISH. 
      Make it dramatic. Do not mention game mechanics (like "you rolled a 15"), just the narrative result.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || baseText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return baseText; // Fallback to static text
  }
};

export const generateAdminSummary = async (nodeJson: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Summarize this story node JSON into a 10-word description for an admin dashboard card in Swedish: ${nodeJson}`
        });
        return response.text || "Nodsammanfattning";
    } catch (e) {
        return "Nodsammanfattning";
    }
}
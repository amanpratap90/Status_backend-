
import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly in the initialization object
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHabitSuggestions = async (userContext: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User Context: ${userContext}. Suggest 3 highly effective habits based on this context. Return them in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["name", "description", "category"]
          }
        }
      }
    });
    
    // Use .text property directly, it is not a method
    const jsonStr = response.text || "[]";
    return JSON.parse(jsonStr.trim());
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return [];
  }
};


import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getGeminiProductInsight = async (productName: string, description: string) => {
  if (!API_KEY) return "AI System Offline. Please check credentials.";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a futuristic Cyber-Advisor for a high-tech store called NEON-X. Provide a 2-sentence "hacker-style" endorsement or warning about the product: ${productName}. Context: ${description}. Keep it mysterious and high-tech.`,
      config: {
        temperature: 0.9,
        topP: 1,
        maxOutputTokens: 100
      }
    });

    return response.text || "No data received from the mesh network.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error: Uplink connection failed. Redirecting signals...";
  }
};

export const getPersonalizedGreeting = async () => {
  if (!API_KEY) return "Welcome to the Void.";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a short, catchy, 1-sentence cyberpunk welcome greeting for a new user entering the store 'NEON-X'.",
    });
    return response.text || "Welcome, Traveler of the Grid.";
  } catch {
    return "Welcome to NEON-X.";
  }
};

import { GoogleGenAI, Chat } from "@google/genai";

// Function to get futuristic product insights
export const getGeminiProductInsight = async (productName: string, description: string) => {
  if (!process.env.API_KEY) return "AI System Offline. Check credentials.";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Fix: Removed maxOutputTokens to prevent potential response blocks when the model utilizes thinking tokens
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a futuristic Cyber-Advisor for NEON-X. Provide a 2-sentence "hacker-style" endorsement or warning for: ${productName}. Context: ${description}. Theme: Cyberpunk, mysterious, technical.`,
      config: {
        temperature: 0.9,
        topP: 1,
      }
    });

    // Directly access the .text property from GenerateContentResponse
    return response.text || "Insight unreachable in this sector.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error: Uplink connection failed.";
  }
};

// Function to generate a catchy greeting for the user
export const getPersonalizedGreeting = async () => {
  if (!process.env.API_KEY) return "Welcome to the Grid.";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a short, catchy, 1-sentence cyberpunk welcome greeting for a user entering the 'NEON-X' digital market.",
    });
    return response.text || "Identity verified. Welcome to the core.";
  } catch {
    return "Link established. Welcome to NEON-X.";
  }
};

// Function to initialize a new chat session with system instructions
export const createSystemChat = () => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are the NEON-X System Intelligence (SI). You reside within a futuristic digital marketplace. Your tone is helpful but deeply immersed in a cyberpunk aesthetic. Use terms like 'Grid', 'Nodes', 'Decryption', 'Asset', 'Credits'. Keep responses concise and formatted for a terminal interface.",
    },
  });
};
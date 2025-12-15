import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelName = 'gemini-2.5-flash';

export const enhanceDescription = async (text: string): Promise<string> => {
  if (!text) return "";
  
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `You are a copywriter for a skill-sharing platform. 
      Rewrite the following user description to be more engaging, professional, and clear. 
      Keep it concise (under 50 words). 
      Original text: "${text}"`,
    });
    return response.text || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text;
  }
};

export const getSmartMatchReasoning = async (userSkills: string[], requestTitle: string, requestDesc: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `
        Act as a matching algorithm explanation engine.
        User Skills: ${userSkills.join(', ')}.
        Request Title: "${requestTitle}".
        Request Description: "${requestDesc}".
        
        Explain in one short, motivating sentence why this user is a good match for this request.
        Start with "Good Match:" or "Potential Match:".
      `,
    });
    return response.text || "Match found based on your skills.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Recommended based on your profile.";
  }
};

import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "./types";

const cleanJsonResponse = (text: string) => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const getAIRecommendation = async (user: UserProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Profile: ${user.name}, Skills: ${user.skills.map(s => s.name).join(', ')}, Goal: ${user.primaryGoal}. 
  Suggest: 1. Next skill, 2. Hackathon theme, 3. Encouragement, 4. Internship tip. JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nextSkill: { type: Type.STRING },
            hackathonTheme: { type: Type.STRING },
            encouragement: { type: Type.STRING },
            internshipTip: { type: Type.STRING }
          },
          required: ["nextSkill", "hackathonTheme", "encouragement", "internshipTip"]
        }
      }
    });
    return JSON.parse(cleanJsonResponse(response.text || '{}'));
  } catch (error) {
    return { nextSkill: "System Design Essentials", hackathonTheme: "AI for Sustainability", encouragement: "Stay consistent.", internshipTip: "Focus on open-source." };
  }
};

export const suggestSquads = async (user: UserProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Form a high-synergy 4-person team including ${user.name} (Role: ${user.preferredRole}). 
  Requirement: Roles must be Backend, Frontend, UI/UX, and Lead/Pitch. All must be from non-elite colleges but with ELITE mindsets. JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              matchingReason: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              location: { type: Type.STRING }
            },
            required: ["name", "role", "matchingReason", "skills", "location"]
          }
        }
      }
    });
    return JSON.parse(cleanJsonResponse(response.text || '[]'));
  } catch (error) {
    return [];
  }
};

export const findNearbyPeers = async (lat: number, lng: number, skills: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Find 3 serious engineering students within a 5km radius of coordinates (${lat}, ${lng}). 
  Filter for "Offline Meetup Ready" status. These students must have high commitment scores (90%+). JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              distance: { type: Type.STRING },
              focusArea: { type: Type.STRING },
              seriousnessScore: { type: Type.NUMBER },
              lastActive: { type: Type.STRING }
            },
            required: ["name", "role", "distance", "focusArea", "seriousnessScore", "lastActive"]
          }
        }
      }
    });
    return JSON.parse(cleanJsonResponse(response.text || '[]'));
  } catch (error) {
    return [];
  }
};

export const rebalanceSquadMember = async (squadName: string, missingRole: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Find a replacement for ${missingRole} in "${squadName}". Candidate must have 100% activity history. JSON.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            role: { type: Type.STRING },
            matchingReason: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            activityScore: { type: Type.NUMBER }
          },
          required: ["name", "role", "matchingReason", "skills", "activityScore"]
        }
      }
    });
    return JSON.parse(cleanJsonResponse(response.text || '{}'));
  } catch (e) { return null; }
};

export const getChatResponse = async (history: any[], message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are Nexus AI. Strictly focused on high-performance engineering growth for Tier-2/3 college students. Efficient, slightly demanding, professional."
    }
  });
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "Connection lost.";
  } catch (e) { return "Nexus error."; }
};

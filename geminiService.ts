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
    console.error("AI Recommendation failed:", error);
    return { 
      nextSkill: "System Design Essentials", 
      hackathonTheme: "FinTech Innovation", 
      encouragement: "The grind never stops. Your discipline is your edge.", 
      internshipTip: "Contribute to a high-traffic repo to prove scale competence." 
    };
  }
};

export const generateUserRoadmap = async (user: UserProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const currentSkills = user.skills.map(s => `${s.name} (${s.level}%)`).join(', ');
  const targetSkills = user.skillsToLearn.join(', ');
  
  const prompt = `Generate a 4-stage industrial roadmap for an engineer knowing [${currentSkills}] wanting to learn [${targetSkills}].
  Stage 1: Consolidation of current core.
  Stage 2: Bridging to industrial tooling.
  Stage 3: Mastery of target technologies.
  Stage 4: Senior Architect integration.
  Return a JSON array of RoadmapNode.`;

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
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              status: { type: Type.STRING, description: 'completed, current, or locked' },
              description: { type: Type.STRING },
              subModules: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    progress: { type: Type.NUMBER }
                  },
                  required: ["name", "progress"]
                }
              },
              bossProject: { type: Type.STRING },
              interviewFocus: { type: Type.STRING },
              nexusTip: { type: Type.STRING },
              category: { type: Type.STRING, description: 'frontend, backend, systems, or cloud' }
            },
            required: ["id", "title", "subtitle", "status", "description", "subModules", "bossProject", "interviewFocus", "nexusTip"]
          }
        }
      }
    });
    return JSON.parse(cleanJsonResponse(response.text || '[]'));
  } catch (error) {
    console.error("Roadmap generation failed:", error);
    return [];
  }
};

export const suggestSquads = async (user: UserProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Form a high-synergy 4-person team including ${user.name} (Role: ${user.preferredRole}). 
  Roles must be Backend, Frontend, UI/UX, and Lead/Pitch. JSON.`;

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
    console.error("Squad suggestion failed:", error);
    return [];
  }
};

export const findNearbyPeers = async (lat: number, lng: number, skills: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Find 3 serious engineering students within 5km of (${lat}, ${lng}). High commitment only. JSON.`;

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
    console.error("Nearby peers search failed:", error);
    return [];
  }
};

export const rebalanceSquadMember = async (squadName: string, missingRole: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Find replacement for ${missingRole} in "${squadName}". JSON.`;
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
  } catch (e) {
    return null;
  }
};

export const getChatResponse = async (history: any[], message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are Nexus AI. Strictly focused on high-performance engineering growth for Tier-2/3 college students. Provide concrete technical advice, skip generic fluff. Be a demanding but helpful coach."
    }
  });
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "Connection lost.";
  } catch (e) {
    return "The Nexus neural link is currently unstable. Please retry.";
  }
};
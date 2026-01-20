import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "./types";

const cleanJsonResponse = (text: string) => {
  // More robust cleaning for AI-generated JSON
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  return cleaned.trim();
};

export const getAIRecommendation = async (user: UserProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Profile: ${user.name}, Skills: ${user.skills.map(s => s.name).join(', ')}, Goal: ${user.primaryGoal}. 
  Suggest: 1. Next skill, 2. Hackathon theme, 3. Encouragement, 4. Internship tip. JSON format.`;

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
      nextSkill: "Advanced System Design", 
      hackathonTheme: "FinTech Innovation", 
      encouragement: "Stay focused. Consistency is your greatest technical asset.", 
      internshipTip: "Contribute to open-source to showcase real-world impact." 
    };
  }
};

export const generateUserRoadmap = async (user: UserProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const currentSkills = user.skills.map(s => `${s.name} (${s.level}%)`).join(', ');
  const targetSkills = user.skillsToLearn.join(', ');
  
  const prompt = `Generate a 4-stage technical roadmap for an engineer with skills [${currentSkills}] and goals [${targetSkills}].
  Each node should focus on industrial standards. Return a JSON array of RoadmapNode.`;

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
              status: { type: Type.STRING },
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
              category: { type: Type.STRING }
            },
            required: ["id", "title", "subtitle", "status", "description", "subModules", "bossProject", "interviewFocus", "nexusTip"]
          }
        }
      }
    });
    const parsed = JSON.parse(cleanJsonResponse(response.text || '[]'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Roadmap generation failed:", error);
    return [];
  }
};

export const suggestSquads = async (user: UserProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Suggest a 4-person team including ${user.name} for a major hackathon. JSON format.`;

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
  const prompt = `Identify 3 technical peers near (${lat}, ${lng}) interested in ${skills.join(', ')}. JSON format.`;

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
    console.error("Peer search failed:", error);
    return [];
  }
};

export const rebalanceSquadMember = async (squadName: string, missingRole: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Find a high-performance replacement for a ${missingRole} in the squad "${squadName}". JSON.`;
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
      systemInstruction: "You are Nexus AI, a technical growth coach for engineering students. You provide concise, industrial-grade technical advice and roadmap guidance. Focus on high-performance engineering habits."
    }
  });
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "I'm experiencing a brief synchronization delay. Please restate your query.";
  } catch (e) {
    return "Neural link unstable. Please retry in a moment.";
  }
};
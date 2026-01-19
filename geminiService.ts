
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Squad } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIRecommendation = async (user: UserProfile) => {
  const prompt = `Based on this engineering student profile:
  Name: ${user.name}
  College Tier: 2/3
  Skills: ${user.skills.map(s => `${s.name} (${s.level}%)`).join(', ')}
  Commitment: ${user.commitmentHours} hrs/week
  Goal: ${user.primaryGoal}

  Suggest the following in a structured way:
  1. Next logical technical skill to master.
  2. A specific hackathon theme they should explore.
  3. A short encouragement for their current streak of ${user.streak} days.
  4. One internship preparation tip.
  
  Format as JSON.`;

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
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const getDeploymentRoadmap = async (squad: Squad) => {
  const prompt = `Squad Project: ${squad.name}
  Current Version: ${squad.version || 'v0.1.0'}
  Goal: ${squad.goal}
  Type: ${squad.type}
  
  Suggest a versioning roadmap (v1.0.0, v1.1.0, v2.0.0) with specific technical milestones for each.
  Focus on production-readiness for a student project.
  Return JSON object with field "milestones" as an array of { version: string, features: string[] }.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  version: { type: Type.STRING },
                  features: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{ "milestones": [] }');
  } catch (error) {
    console.error("Gemini Roadmap Error:", error);
    return { milestones: [] };
  }
};

export const getChatResponse = async (history: { role: string, parts: { text: string }[] }[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are 'Nexus AI', a growth companion for tier-2/3 engineering students. You are focused, professional, and slightly rigorous. You encourage discipline, consistency, and hard work. No small talk. Focus on roadmaps, hackathons, and internship prep."
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};

export const suggestSquads = async (user: UserProfile) => {
  const prompt = `Form 3 hypothetical high-compatibility teammates for ${user.name} for a major engineering hackathon.
  User Skills: ${user.skills.map(s => s.name).join(', ')}
  Goal: ${user.primaryGoal}
  
  Explain WHY each teammate is a good mindset match (e.g., 'shares same 25hr/week commitment').
  Return JSON array of objects with fields: name, role, matchingReason, skills.`;

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
              skills: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["name", "role", "matchingReason", "skills"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

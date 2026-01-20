
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "./types";

export const getAIRecommendation = async (user: UserProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    return {
      nextSkill: "Advanced System Design",
      hackathonTheme: "AI for Social Good",
      encouragement: "Stay consistent, your growth is measurable.",
      internshipTip: "Focus on your GitHub portfolio projects."
    };
  }
};

export const getChatResponse = async (history: any[], message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Form 3 hypothetical high-compatibility teammates for ${user.name} for a major engineering hackathon.
  User Skills: ${user.skills.map(s => s.name).join(', ')}
  Goal: ${user.primaryGoal}
  
  Explain WHY each teammate is a good mindset match.
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

import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "./types";

const cleanJsonResponse = (text: string) => {
  // Removes potential markdown code blocks like ```json ... ```
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

/**
 * Generates personalized growth recommendations based on the user's engineering profile.
 */
export const getAIRecommendation = async (user: UserProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Based on this engineering student profile:
  Name: ${user.name}
  College: Non-elite
  Skills: ${user.skills.map(s => `${s.name} (${s.level}%)`).join(', ')}
  Commitment: ${user.commitmentHours} hrs/week
  Goal: ${user.primaryGoal}

  Suggest the following in a structured way:
  1. Next logical technical skill to master.
  2. A specific hackathon theme they should explore.
  3. A short encouragement for their current streak of ${user.streak} days.
  4. One internship preparation tip.
  
  Format as valid JSON.`;

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
    
    const text = cleanJsonResponse(response.text || '');
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    return {
      nextSkill: "Advanced System Design",
      hackathonTheme: "AI for Social Good",
      encouragement: "Consistency is your greatest leverage. Keep pushing.",
      internshipTip: "Focus on refining your GitHub READMEs for core projects."
    };
  }
};

/**
 * Handles conversational queries from the user via the Nexus Intelligence companion.
 */
export const getChatResponse = async (history: any[], message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are 'Nexus AI', a growth companion for engineering students from non-elite colleges. You are focused, professional, and slightly rigorous. You encourage discipline, consistency, and hard work. No small talk. Focus on roadmaps, hackathons, and internship prep."
    }
  });

  try {
    const response = await chat.sendMessage({ message });
    return response.text || "I'm having trouble processing that request right now.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "The Nexus connection is unstable. Please check your configuration and try again.";
  }
};

/**
 * Suggests compatible teammates for hackathons based on technical skills and mindset.
 */
export const suggestSquads = async (user: UserProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Form 3 hypothetical high-compatibility teammates for ${user.name} for a major engineering hackathon.
  User Skills: ${user.skills.map(s => s.name).join(', ')}
  Goal: ${user.primaryGoal}
  Note: Teammates should also be from non-elite colleges to ensure similar mindset and hustle.
  
  Explain WHY each teammate is a good mindset match.
  Return JSON array of objects with fields: name, role, matchingReason, skills, location.`;

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
    
    const text = cleanJsonResponse(response.text || '');
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Squad Suggestion Error:", error);
    return [
      {
        name: "Vikram R.",
        role: "Backend Engineer",
        matchingReason: "Shares your focus on high-performance Node.js systems and consistent daily coding habit.",
        skills: ["Node.js", "Redis", "PostgreSQL"],
        location: "Pune, Maharashtra"
      },
      {
        name: "Ishita S.",
        role: "UI/UX Designer",
        matchingReason: "Passionate about bridging technical complexity with intuitive user interfaces for non-elite college platforms.",
        skills: ["Figma", "React", "Tailwind"],
        location: "Lucknow, UP"
      },
      {
        name: "Rahul K.",
        role: "DevOps specialist",
        matchingReason: "Focuses on automation and scale, complementing your frontend-heavy skill set with structural integrity.",
        skills: ["Kubernetes", "AWS", "CI/CD"],
        location: "Indore, MP"
      }
    ];
  }
};
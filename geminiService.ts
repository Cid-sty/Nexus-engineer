import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile } from "./types";

const cleanJsonResponse = (text: string) => {
  if (!text) return "";
  let cleaned = text.trim();
  // Remove markdown code blocks if present
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
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
      nextSkill: "System Design Fundamentals", 
      hackathonTheme: "AI for Local Governance", 
      encouragement: "Stay consistent. Your commitment is your only true competitive advantage.", 
      internshipTip: "Build one public-facing project that solves a real business problem." 
    };
  }
};

export const generateUserRoadmap = async (user: UserProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const currentSkills = user.skills.map(s => `${s.name} (${s.level}%)`).join(', ');
  const targetSkills = user.skillsToLearn.join(', ');
  
  const prompt = `Generate a 4-stage technical roadmap for a college student. 
  Focus on: Programming Languages, Industrial Stacks (MERN, Cloud, etc), and a Step-by-Step Learning Path.
  User current skills: [${currentSkills}]. Goals: [${targetSkills}].
  Return exactly 4 stages as a JSON array.`;

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
              status: { type: Type.STRING, description: "completed, current, or locked" },
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
              category: { type: Type.STRING, description: "frontend, backend, systems, or cloud" }
            },
            required: ["id", "title", "subtitle", "status", "description", "subModules", "bossProject", "interviewFocus", "nexusTip"]
          }
        }
      }
    });
    const result = JSON.parse(cleanJsonResponse(response.text || '[]'));
    return Array.isArray(result) && result.length > 0 ? result : getFallbackRoadmap(user);
  } catch (error) {
    console.error("Roadmap generation failed, using fallback:", error);
    return getFallbackRoadmap(user);
  }
};

// Robust fallback in case AI fails or times out
const getFallbackRoadmap = (user: UserProfile) => [
  {
    id: "stage-1",
    title: "Language Mastery",
    subtitle: "Deep-diving into Core Logic",
    status: "completed",
    description: "Strengthening the foundations of Programming with TypeScript and Data Structures.",
    subModules: [
      { name: "Advanced ES6+", progress: 100 },
      { name: "Async Control Flow", progress: 90 }
    ],
    bossProject: "Real-time Event Bus System",
    interviewFocus: "Memory Management & Execution Context",
    nexusTip: "Pedigree doesn't matter when your code is more optimized than theirs.",
    category: "systems"
  },
  {
    id: "stage-2",
    title: "Industrial Tech Stack",
    subtitle: "Full-Stack Architecture",
    status: "current",
    description: "Building production-grade applications using modern frameworks like React and Node.js.",
    subModules: [
      { name: "React Design Patterns", progress: 40 },
      { name: "Database Schema Optimization", progress: 20 }
    ],
    bossProject: "Multi-tenant SaaS Boilerplate",
    interviewFocus: "Scalable State Management",
    nexusTip: "Tier-1 companies hire for architecture, not just syntax.",
    category: "frontend"
  },
  {
    id: "stage-3",
    title: "Cloud & Deployment",
    subtitle: "Reliable Infrastructure",
    status: "locked",
    description: "Learning the art of deploying and scaling applications to millions of users.",
    subModules: [
      { name: "Docker Containerization", progress: 0 },
      { name: "CI/CD Pipelines", progress: 0 }
    ],
    bossProject: "Auto-scaling Video Streamer",
    interviewFocus: "High Availability Systems",
    nexusTip: "The best code is the code that is monitored and reliable.",
    category: "cloud"
  },
  {
    id: "stage-4",
    title: "Senior Integration",
    subtitle: "The Elite Drift",
    status: "locked",
    description: "Synthesizing all skills to become a high-impact individual contributor.",
    subModules: [
      { name: "System Design for Scale", progress: 0 },
      { name: "Microservices Bridge", progress: 0 }
    ],
    bossProject: "Distributed Ledger System",
    interviewFocus: "CAP Theorem & Trade-off Analysis",
    nexusTip: "Consistency is your greatest competitive edge in a Tier-2 environment.",
    category: "backend"
  }
];

export const suggestSquads = async (user: UserProfile) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Suggest a 4-person high-synergy team including ${user.name}. JSON format.`;

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
  const prompt = `Find 3 local engineering peers near (${lat}, ${lng}). JSON format.`;

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
      systemInstruction: "You are Nexus AI, a highly technical coach for college students aiming for elite software roles. Be direct, technical, and encouraging."
    }
  });
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "I'm recalibrating. Please repeat.";
  } catch (e) {
    return "Neural link unstable. Retry shortly.";
  }
};
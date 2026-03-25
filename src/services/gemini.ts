import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

export interface ShortFormScript {
  hook: string;
  scene1: string;
  scene2: string;
  scene3: string;
  ending: string;
  musicVibe: string;
  visualSuggestions: string;
  hashtags: string[];
}

export interface RepurposedContent {
  linkedin: string;
  twitter: string[];
  instagram: string;
  youtube: string;
  hooks: string[];
  shortForm: ShortFormScript;
}

export async function generateRepurposedContent(
  input: string,
  tone: string,
  length: string,
  isViral: boolean
): Promise<RepurposedContent> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Repurpose the following content into multiple formats:
    
    CONTENT:
    ${input}
    
    TONE: ${tone}
    LENGTH: ${length}
    VIRAL MODE: ${isViral ? "ON (Add high-impact hooks, curiosity gaps, and psychological triggers for maximum engagement)" : "OFF"}
    
    IMPORTANT: 
    - Maintain perfect spelling and grammar in all outputs.
    - Do NOT use forced abbreviations (e.g., 'Wy' for 'Why', 'Te' for 'The', 'Sop' for 'Stop').
    - Focus on high-quality, professional, yet viral content.
    1. A LinkedIn Post (professional yet engaging).
    2. A Twitter Thread (at least 5 tweets).
    3. An Instagram Caption (with hashtags).
    4. A YouTube Script (Intro, Body, Outro/CTA).
    5. 5 Viral Hook variations.
    6. A detailed Short-form video script (Reels/Shorts/TikTok) with the following structure:
       - [HOOK] (first 2-3 sec)
       - [SCENE 1] (0-5 sec)
       - [SCENE 2] (5-10 sec)
       - [SCENE 3] (10-20 sec)
       - [CTA] (Ending)
       - Suggested background music vibe
       - Visual suggestions (B-roll, text overlays)
       - 5-10 relevant hashtags
    
    Return the result strictly as a JSON object.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: "You are a world-class social media strategist and content creator. Your goal is to repurpose content into highly engaging, viral, and professional formats across different platforms. Even when 'VIRAL MODE' is ON, you must maintain perfect spelling, grammar, and professional quality. Never use forced abbreviations, intentional typos, or 'AI-slop' (like 'Wy' for 'Why', 'Te' for 'The', or 'Sop' for 'Stop'). Focus on curiosity gaps, psychological triggers, and platform-specific best practices to drive engagement. Ensure the content sounds human, authoritative, and compelling.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          linkedin: { type: Type.STRING },
          twitter: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          instagram: { type: Type.STRING },
          youtube: { type: Type.STRING },
          hooks: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          shortForm: { 
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.STRING },
              scene1: { type: Type.STRING },
              scene2: { type: Type.STRING },
              scene3: { type: Type.STRING },
              ending: { type: Type.STRING },
              musicVibe: { type: Type.STRING },
              visualSuggestions: { type: Type.STRING },
              hashtags: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["hook", "scene1", "scene2", "scene3", "ending", "musicVibe", "visualSuggestions", "hashtags"]
          }
        },
        required: ["linkedin", "twitter", "instagram", "youtube", "hooks", "shortForm"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

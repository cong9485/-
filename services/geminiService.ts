import { GoogleGenAI, Type } from "@google/genai";
import { Room, AISearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const findBestRooms = async (userQuery: string, availableRooms: Room[]): Promise<AISearchResult> => {
  try {
    // Simplify room data for token efficiency
    const roomSummaries = availableRooms.map(r => ({
      id: r.id,
      name: r.name,
      type: r.type,
      capacity: r.capacity,
      equipment: r.equipment,
      description: r.description
    }));

    const prompt = `
      You are an intelligent room booking assistant.
      The user is looking for a room.
      Here is the list of available rooms: ${JSON.stringify(roomSummaries)}
      
      User Query: "${userQuery}"
      
      Identify the best matching rooms based on capacity, equipment, and type.
      Return the IDs of the recommended rooms and a short explanation why.
      If the query is vague, suggest the most popular ones.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedRoomIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            reasoning: {
              type: Type.STRING
            }
          },
          required: ["recommendedRoomIds", "reasoning"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AISearchResult;
    }
    
    throw new Error("No response from AI");

  } catch (error) {
    console.error("AI Search Error:", error);
    return {
      recommendedRoomIds: [],
      reasoning: "Sorry, I couldn't process that request right now. Showing all rooms."
    };
  }
};

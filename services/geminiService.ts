
import { GoogleGenAI } from "@google/genai";
import { Tour, ResourceStatus } from "../types";

export const generateTourSummary = async (tour: Tour): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return "Gemini API Key is missing. Please check your configuration.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Sort resources by date
    const sortedResources = [...tour.resources].sort((a, b) => (a.date > b.date ? 1 : -1));

    // Construct a prompt based on tour data
    const resourceSummary = sortedResources.map(r => {
      let details = "";
      if (r.type === 'HOTEL') {
          details = `Twin: €${r.priceTwin || '?'}, Facilities: [Elevator: ${r.hasElevator?'Yes':'No'}, AC: ${r.hasAC?'Yes':'No'}, Parking: ${r.hasParking?'Yes':'No'}]`;
      } else {
          details = `Type: ${r.mealType || 'Restaurant'}, Avg: €${r.avgPrice || '?'}, Cuisine: ${r.cuisineType || '?'}`;
      }
      return `- [${r.date}] [${r.type}] ${r.name} (${r.status}): ${details}`;
    }).join('\n');

    const prompt = `
      You are an assistant for a Tour Operator. 
      Please generate a professional executive summary for the following tour. 
      The audience is the Sales Manager.
      
      Tour Code: ${tour.code}
      Tour Name: ${tour.name}
      Start Date: ${tour.startDate}
      Duration: ${tour.duration} days
      
      Resources (sorted by date):
      ${resourceSummary}
      
      Please analyze the status of resources:
      1. Organize the summary chronologically by Date/Day.
      2. Highlight confirmed items.
      3. Flag any "ISSUE" items that need immediate attention.
      4. Note any missing critical facilities for hotels (e.g., No Elevator, No AC) as warnings.
      5. Summarize pending items ("SEARCHING") and identify which days in the ${tour.duration}-day itinerary are completely missing resources.
      6. Provide a brief financial outlook based on the prices provided (Prices are in Euro €).
      
      Format the output as a clean text report suitable for email or Excel export notes.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Failed to generate summary. Please try again later.";
  }
};

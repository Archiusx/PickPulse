import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAi() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing. AI features will not work.");
      // Rather than throwing and crashing the entire app, we handle it gracefully here
      // so the rest of the application can still load.
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function getDemandForecast(localContext: string, currentInventory: any[]) {
  const ai = getAi();
  if (!ai) return null;

  const prompt = `
    You are an expert supply chain analyst for Blinkit. 
    Context: ${localContext}
    Current Inventory: ${JSON.stringify(currentInventory)}
    
    Based on the context (e.g., weather, events, holidays) and current stock, predict which 3 SKUs will spike in demand and suggest replenishment quantities.
    Return the response in JSON format:
    {
      "predictions": [
        { "sku": "Item Name", "reason": "Why it will spike", "suggestedIncrease": 50, "priority": "High" }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const text = response.text;
    if (!text) return null;
    
    // Extract JSON from potential markdown blocks if necessary, 
    // though responseMimeType: "application/json" should handle it.
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    console.error("Error fetching demand forecast:", error);
    return null;
  }
}

export async function getSlottingOptimization(pickingLogs: any[]) {
  const ai = getAi();
  if (!ai) return null;

  const prompt = `
    Analyze these picking logs and suggest shelf slotting optimizations to reduce picking time.
    Logs: ${JSON.stringify(pickingLogs)}
    
    Suggest 3 pairs of items that should be placed closer together.
    Return JSON:
    {
      "optimizations": [
        { "itemA": "Item 1", "itemB": "Item 2", "reason": "Frequently bought together" }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const text = response.text;
    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (error) {
    console.error("Error optimizing slotting:", error);
    return null;
  }
}

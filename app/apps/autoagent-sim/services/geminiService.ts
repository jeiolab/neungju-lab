import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AgentStats, Scenario, SimulationResult } from '../types';

// Initialize Gemini Client
// Note: process.env.API_KEY is assumed to be available as per instructions.
// If it's undefined in a dev environment, the calls will fail gracefully.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SIMULATION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    grade: {
      type: Type.STRING,
      enum: ['S', 'A', 'B', 'C', 'D', 'F'],
      description: 'The performance grade of the drive.'
    },
    outcome: {
      type: Type.STRING,
      description: 'A short title for the outcome (e.g., "Safe Arrival", "Minor Collision").'
    },
    description: {
      type: Type.STRING,
      description: 'A brief narrative of what happened during the drive.'
    },
    analysis: {
      type: Type.STRING,
      description: 'An educational analysis using terms like Autonomy, Reactivity, Goal-orientedness, Social Ability.'
    }
  },
  required: ['grade', 'outcome', 'description', 'analysis']
};

export const runSimulation = async (
  stats: AgentStats,
  scenario: Scenario
): Promise<SimulationResult> => {
  try {
    // Fallback for demo if no key is present (simulated delay)
    if (!apiKey) {
      console.warn("No API Key found. Using mock simulation.");
      return mockSimulation(stats, scenario);
    }

    const model = "gemini-3-flash-preview";
    const prompt = `
      Act as a simulation engine for an Autonomous Vehicle AI.
      
      Scenario: ${scenario.name} - ${scenario.description}
      
      Agent Parameters (0-100):
      - Speed/Efficiency: ${stats.speed}
      - Safety/Reactivity: ${stats.safety}
      - Social/Cooperation: ${stats.social}
      
      Determine the outcome of this drive based on the parameters and the scenario.
      High Speed reduces Safety. High Safety might reduce Efficiency. High Social helps in traffic but might slow down.
      
      The "analysis" field MUST explain the result using the concepts: 'Autonomy', 'Reactivity', 'Goal-orientedness', and 'Social Ability'.
      
      Return a JSON object.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: SIMULATION_SCHEMA,
        temperature: 0.4, // Lower temperature for more consistent simulation logic
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as SimulationResult;
    } else {
      throw new Error("Empty response from AI");
    }

  } catch (error) {
    console.error("Simulation failed:", error);
    // Fallback in case of API error
    return mockSimulation(stats, scenario);
  }
};

export const analyzeEthics = async (userThought: string): Promise<string> => {
  try {
    if (!apiKey) {
      return "API Key is missing. Please configure the environment variable to receive AI feedback on your ethical stance.";
    }

    const model = "gemini-3-flash-preview";
    const prompt = `
      The user has submitted their thought on the 'Trolley Problem' in the context of AI Autonomous Driving.
      User's Thought: "${userThought}"
      
      Provide a brief, thoughtful 'Ethics Committee Review' of their opinion. 
      Acknowledge their point, mention a counter-point or a complexity they might have missed, and thank them for their input.
      Keep it under 3 sentences. Be professional but engaging.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Unable to analyze at this moment.";
  } catch (error) {
    console.error("Ethics analysis failed:", error);
    return "The Ethics Committee is currently offline. Your thought has been recorded locally.";
  }
};

// Mock fallback to ensure the UI works even without a valid API key in the demo environment
const mockSimulation = (stats: AgentStats, scenario: Scenario): Promise<SimulationResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let grade: SimulationResult['grade'] = 'C';
      let outcome = "Driving Complete";
      let description = "The car drove through the scenario.";
      let analysis = "Balance detected.";

      const score = stats.speed + stats.safety + stats.social;
      
      if (scenario.id === 'heavy_rain') {
        if (stats.safety > 70) {
          grade = 'S';
          outcome = "Safe Arrival";
          description = "Despite the heavy rain, the car slowed down appropriately and arrived safely.";
          analysis = "High Reactivity allowed the agent to detect slippery roads, prioritizing Safety over Goal-orientedness.";
        } else if (stats.speed > 70) {
          grade = 'F';
          outcome = "Slipping Accident";
          description = "The car drove too fast for the weather conditions and slid into a guardrail.";
          analysis = "Goal-orientedness was set too high, compromising Safety and Reactivity needed for the weather.";
        } else {
          grade = 'B';
          outcome = "Arrived Late";
          description = "The car was very cautious and arrived later than expected.";
          analysis = "Reactivity was sufficient, but Efficiency was sacrificed for Safety.";
        }
      } else {
        // Generic fallback logic
        if (stats.safety < 30) {
           grade = 'D';
           outcome = "Near Miss";
           description = "The car made several risky maneuvers.";
           analysis = "Low Reactivity caused dangerous situations.";
        } else {
           grade = 'A';
           outcome = "Smooth Drive";
           description = "The car handled the situation well.";
           analysis = "Good balance of Autonomy and Social Ability.";
        }
      }

      resolve({ grade, outcome, description, analysis });
    }, 1500);
  });
};

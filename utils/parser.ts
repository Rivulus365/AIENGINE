import { GameState } from '../types';

const cleanJson = (jsonString: string): string => {
    // 1. Remove Single Line Comments (// ...)
    let clean = jsonString.replace(/\/\/.*$/gm, '');
    
    // 2. Remove Trailing Commas in Objects and Arrays
    // Matches , } -> } and , ] -> ]
    clean = clean.replace(/,\s*}/g, '}');
    clean = clean.replace(/,\s*]/g, ']');

    return clean;
};

export const extractGameState = (text: string): { cleanedText: string; gameState: GameState | null } => {
  // Regex to find the JSON block inside ```json ... ``` or just ``` ... ```
  // We use the 'g' flag to find ALL matches to prevent "Prompt Injection" attacks
  // where a user might trick the AI into echoing a fake JSON block early in the text.
  const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/g;
  
  const matches = [...text.matchAll(jsonBlockRegex)];

  if (matches.length > 0) {
    // SECURITY FIX: Always take the LAST match. 
    // The System Prompt enforces that the State JSON is printed at the very end.
    // This prevents parsing user-injected fake JSON blocks that might appear earlier in the narrative.
    const lastMatch = matches[matches.length - 1];
    
    if (lastMatch && lastMatch[1]) {
        try {
            const rawJson = lastMatch[1];
            const cleanedJson = cleanJson(rawJson);
            const parsedState = JSON.parse(cleanedJson);
            
            // Remove the block from the text for display purposes
            // We only remove the authoritative block to keep the narrative clean.
            const cleanedText = text.replace(lastMatch[0], '').trim();
            
            return { cleanedText, gameState: parsedState };
        } catch (e) {
            console.warn("Failed to parse Game State JSON. Attempting fallback repair.", e);
        }
    }
  }

  // Fallback: If no valid JSON block found, return original text and null state
  // This preserves the chat experience even if the HUD stops updating.
  return { cleanedText: text, gameState: null };
};

import { GameState } from '../types';

/**
 * Validates the structure of the incoming JSON from the AI
 * to ensure it matches the expected GameState interface.
 * Returns true if valid, false otherwise.
 */
export const validateGameState = (state: any): state is GameState => {
  if (!state || typeof state !== 'object') return false;

  // 1. Validate Player
  if (!state.player || typeof state.player !== 'object') {
      console.error("Validation Failed: Missing player object");
      return false;
  }
  
  // Check critical player stats
  if (typeof state.player.hp?.current !== 'number' || typeof state.player.hp?.max !== 'number') {
      console.error("Validation Failed: Invalid HP structure");
      return false;
  }

  // 2. Validate Inventory (Must be array)
  if (!Array.isArray(state.inventory)) {
      console.error("Validation Failed: Inventory is not an array");
      return false;
  }

  // 3. Validate Combat (Must exist)
  if (!state.combat || typeof state.combat !== 'object') {
      console.error("Validation Failed: Missing combat object");
      return false;
  }

  // 4. Validate World State
  if (!state.worldState || typeof state.worldState.location !== 'string') {
      console.error("Validation Failed: Invalid world state");
      return false;
  }

  return true;
};

/**
 * Repairs a broken state object if possible, or returns a safe fallback.
 */
export const repairGameState = (brokenState: any, lastValidState: GameState): GameState => {
    console.warn("Attempting to repair game state...");
    
    // Deep merge attempt or fallback to last valid
    // For now, we wrap the broken parts with last valid data
    return {
        ...lastValidState,
        player: {
            ...lastValidState.player,
            ...brokenState?.player,
            hp: brokenState?.player?.hp || lastValidState.player.hp
        },
        // If inventory is broken, keep old inventory to prevent item loss
        inventory: Array.isArray(brokenState?.inventory) ? brokenState.inventory : lastValidState.inventory,
        combat: brokenState?.combat || lastValidState.combat,
        combatLog: Array.isArray(brokenState?.combatLog) ? brokenState.combatLog : lastValidState.combatLog,
        worldState: brokenState?.worldState || lastValidState.worldState
    };
};

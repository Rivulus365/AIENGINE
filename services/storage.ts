
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { GameState, ChatMessage } from '../types';

interface SaveData {
  gameState: GameState;
  messages: ChatMessage[];
  lastSaved: number;
}

export const saveGame = async (userId: string, gameState: GameState, messages: ChatMessage[]) => {
  try {
    const data: SaveData = {
      gameState,
      messages,
      lastSaved: Date.now(),
    };
    // Save to collection 'saves', document ID = userId
    await setDoc(doc(db, "saves", userId), data);
  } catch (error) {
    console.error('Failed to save game to Firestore:', error);
  }
};

export const loadGame = async (userId: string): Promise<{ gameState: GameState; messages: ChatMessage[] } | null> => {
  try {
    const docRef = doc(db, "saves", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as SaveData;
      return { gameState: data.gameState, messages: data.messages };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Failed to load game from Firestore:', error);
    return null;
  }
};

export const clearSave = async (userId: string) => {
  try {
    await deleteDoc(doc(db, "saves", userId));
  } catch (error) {
    console.error('Failed to clear save data from Firestore:', error);
  }
};

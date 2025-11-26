
import { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { GameState, ChatMessage, BaseStats, Feat, ImageSize } from '../types';
import { INITIAL_GAME_STATE, CLASS_DEFINITIONS } from '../constants';
import { loadGame, saveGame, clearSave } from '../services/storage';
import { validateGameState, repairGameState } from '../utils/validator';
import { calculateDerivedStats, calculateMaxHp, generateInitialSkills } from '../utils/engine';
import { generateAdventureResponse, generateSceneImage, summarizeHistory } from '../services/gemini';
import { extractGameState } from '../utils/parser';

// --- HELPER LOGIC ---
const prepareHistoryForContext = async (
    currentHistory: ChatMessage[],
    limit: number = 25
): Promise<{ role: "user" | "model"; parts: { text: string }[] }[]> => {
    
    let historyForApi: { role: "user" | "model"; parts: { text: string }[] }[] = currentHistory.map(m => ({
        role: (m.role === 'system' ? 'user' : m.role) as "user" | "model",
        parts: [{ text: m.text }]
    }));

    if (historyForApi.length <= limit) return historyForApi;

    try {
        const startKeep = 3;
        const endKeep = 10;
        const chunkToSummarize = historyForApi.slice(startKeep, historyForApi.length - endKeep);
        
        if (chunkToSummarize.length > 5) {
            const summary = await summarizeHistory(chunkToSummarize);
            const summaryMessage: { role: "user" | "model"; parts: { text: string }[] } = {
                role: 'user',
                parts: [{ text: `[Previous Story Summary]: ${summary}` }]
            };
            return [
                ...historyForApi.slice(0, startKeep),
                summaryMessage,
                ...historyForApi.slice(historyForApi.length - endKeep)
            ];
        }
    } catch (e) {
        console.warn("Summarization failed, falling back to full history", e);
    }
    
    return historyForApi;
};

export const useGameEngine = (user: User | null) => {
    const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isCharacterCreated, setIsCharacterCreated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGameLoaded, setIsGameLoaded] = useState(false);

    // Track if we need to save (debounce logic)
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Load Game on Auth State Change
    useEffect(() => {
        const fetchSave = async () => {
            if (user) {
                setIsLoading(true);
                const savedData = await loadGame(user.uid);
                if (savedData) {
                    if (validateGameState(savedData.gameState)) {
                        setGameState(savedData.gameState);
                        setMessages(savedData.messages);
                        if (savedData.gameState.player.name) {
                            setIsCharacterCreated(true);
                        }
                    } else {
                        console.warn("Saved game state invalid, resetting...");
                    }
                }
                setIsGameLoaded(true);
                setIsLoading(false);
            } else {
                // Reset to initial if logged out
                setGameState(INITIAL_GAME_STATE);
                setMessages([]);
                setIsCharacterCreated(false);
                setIsGameLoaded(false);
            }
        };

        fetchSave();
    }, [user]);

    // Auto-Save Effect (Debounced)
    useEffect(() => {
        if (!user || !isCharacterCreated || !isGameLoaded) return;

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        saveTimeoutRef.current = setTimeout(() => {
             saveGame(user.uid, gameState, messages);
        }, 2000); // Save 2 seconds after last state change

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [gameState, messages, isCharacterCreated, isGameLoaded, user]);

    const addMessage = (role: 'user' | 'model' | 'system', text: string, image?: string): string => {
        const id = Date.now().toString() + Math.random().toString();
        setMessages(prev => [...prev, { id, role, text, image }]);
        return id;
    };

    const updateMessageImage = (id: string, imageUrl: string) => {
        setMessages(prev => prev.map(msg => 
            msg.id === id ? { ...msg, image: imageUrl } : msg
        ));
    };

    const handleCharacterComplete = async (name: string, charClass: string, stats: BaseStats, feat: Feat) => {
        const level = 1;
        const proficiencyBonus = 2;
        const derivedStats = calculateDerivedStats(stats, charClass, level, proficiencyBonus);
        
        const resources = {
            spellSlots: { current: 0, max: 0 },
            classFeats: { name: "Feature", current: 0, max: 0 }
        };

        if (['Mage', 'Cleric', 'Bard', 'Druid'].includes(charClass)) {
            resources.spellSlots = { current: 2, max: 2 };
            resources.classFeats = { name: "Arcane/Divine Ability", current: 1, max: 1 };
        } else if (charClass === 'Warrior') {
            resources.classFeats = { name: "Second Wind", current: 1, max: 1 };
        } else if (charClass === 'Paladin') {
            resources.classFeats = { name: "Lay on Hands", current: 5, max: 5 };
        }

        const maxHp = calculateMaxHp(charClass, stats.con, level);
        const initialProficiencies: string[] = ["Simple Weapons"]; 
        const initialSkills = generateInitialSkills(stats, initialProficiencies, proficiencyBonus);

        const newGameState: GameState = {
            ...INITIAL_GAME_STATE,
            player: {
                ...INITIAL_GAME_STATE.player,
                name,
                class: charClass,
                level,
                hp: { current: maxHp, max: maxHp },
                stats: stats,
                derivedStats: derivedStats,
                resources,
                skills: initialSkills,
                proficiencies: initialProficiencies, 
                activeFeats: [feat.name],
                activeSpells: [],
                features: CLASS_DEFINITIONS[charClass]?.features || []
            }
        };
        setGameState(newGameState);
        setIsCharacterCreated(true);

        const startPrompt = `I am ${name}, a Level 1 ${charClass}. My stats are STR:${stats.str} DEX:${stats.dex} CON:${stats.con} INT:${stats.int} WIS:${stats.wis} CHA:${stats.cha}. I have the feat ${feat.name}. Generate my starting inventory and drop me into the world.`;
        addMessage('user', startPrompt);
        return { startPrompt, newGameState };
    };

    const handleLevelUpComplete = (newStats: BaseStats) => {
        const newGameState = {
            ...gameState,
            player: { ...gameState.player, stats: newStats, unspentStatPoints: 0 }
        };
        setGameState(newGameState);
    };

    const handleRespawn = async () => {
        const maxHp = gameState.player.hp.max;
        const revivedHp = Math.floor(maxHp / 2);
        const revivedState = {
            ...gameState,
            player: { ...gameState.player, hp: { ...gameState.player.hp, current: revivedHp } }
        };
        setGameState(revivedState);
        const prompt = "[System]: The player has died. They respawn at the nearest safe location (Town or Camp) with 50% HP. Describe their awakening and the penalty.";
        addMessage('system', "Darkness takes you... but it is not the end. You gasp for breath.");
        return { prompt, revivedState };
    };

    const handleResetCampaign = async () => {
        if (user) {
            await clearSave(user.uid);
            window.location.reload();
        }
    };

    const handleManualSave = async () => {
        if (user) {
            await saveGame(user.uid, gameState, messages);
        }
    };

    const processTurn = async (userInput: string, currentGameState: GameState, currentHistory: ChatMessage[], options: { imageGenEnabled: boolean, imageSize: ImageSize }) => {
        setIsLoading(true);

        try {
            const historyForApi = await prepareHistoryForContext(currentHistory);
            const rawResponse = await generateAdventureResponse(historyForApi, userInput, currentGameState);
            const { cleanedText, gameState: rawNewState } = extractGameState(rawResponse);
            
            let newState = rawNewState;
            if (newState) {
                if (!validateGameState(newState)) {
                    console.warn("Invalid State returned from AI. Attempting repair.");
                    newState = repairGameState(newState, currentGameState);
                }
                setGameState(newState);
            }

            setIsLoading(false);
            const messageId = addMessage('model', cleanedText);

            if (options.imageGenEnabled) {
                const cleanText = cleanedText
                    .replace(/\(Rolled .*?\)/gi, '')
                    .replace(/Rolled \d+/gi, '')
                    .replace(/\[.*?\]/g, '')
                    .trim();
                
                const visualDescription = cleanText.slice(0, 300);
                const equipmentVisuals = newState?.equipment?.mainHand?.name ? `wielding ${newState.equipment.mainHand.name}` : '';
                const characterVisuals = `${newState?.player.class}, ${equipmentVisuals}`;
                
                generateSceneImage(visualDescription, characterVisuals, options.imageSize).then(imageUrl => {
                    if (imageUrl) updateMessageImage(messageId, imageUrl);
                });
            }

        } catch (error) {
            console.error("Turn processing failed:", error);
            setIsLoading(false);
            addMessage('model', "The world flickers... something went wrong. Try again.");
        }
    };

    return {
        gameState,
        messages,
        isCharacterCreated,
        isLoading,
        addMessage,
        processTurn,
        handleCharacterComplete,
        handleLevelUpComplete,
        handleRespawn,
        handleManualSave,
        handleResetCampaign
    };
}

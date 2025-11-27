import { db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Item, ClassDefinition, Spell, RaceDefinition, Feat, BackgroundDefinition, Enemy, SkillDefinition } from '../types';

// Cache to avoid repeated network calls for static data
const cache: Record<string, any> = {};

async function fetchCollection<T>(collectionName: string): Promise<Record<string, T>> {
    if (cache[collectionName]) {
        return cache[collectionName];
    }

    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    const data: Record<string, T> = {};

    snapshot.forEach(doc => {
        data[doc.id] = doc.data() as T;
    });

    cache[collectionName] = data;
    return data;
}

export const GameDataService = {
    getItems: () => fetchCollection<Item>('items'),
    getClasses: () => fetchCollection<ClassDefinition>('classes'),
    getSpells: () => fetchCollection<Spell>('spells'),
    getRaces: () => fetchCollection<RaceDefinition>('races'),
    getFeats: () => fetchCollection<Feat>('feats'),
    getBackgrounds: () => fetchCollection<BackgroundDefinition>('backgrounds'),
    getEnemies: () => fetchCollection<Enemy>('enemies'),
    getSkills: () => fetchCollection<SkillDefinition>('skills'),

    // Helper to get array versions for UI lists
    getClassOptions: async () => Object.values(await GameDataService.getClasses()),
    getFeatOptions: async () => Object.values(await GameDataService.getFeats()),
    getRaceOptions: async () => Object.values(await GameDataService.getRaces()),
};

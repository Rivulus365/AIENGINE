import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Import data
import { ITEM_LIBRARY } from '../data/items.js';
import { CLASS_DEFINITIONS } from '../data/classes.js';
import { SPELL_LIBRARY } from '../data/spells.js';
import { RACE_DEFINITIONS } from '../data/races.js';
import { FEAT_LIBRARY } from '../data/feats.js';
import { BACKGROUND_DEFINITIONS } from '../data/backgrounds.js';
import { BESTIARY } from '../data/enemies.js';
import { SKILL_DEFINITIONS } from '../data/skills.js';

// Initialize Firebase
// Assumes GOOGLE_APPLICATION_CREDENTIALS is set or gcloud auth application-default login has been run
const app = initializeApp({
    credential: applicationDefault(),
    projectId: 'aiengi'
});

const db = getFirestore(app);

async function migrateCollection(collectionName: string, data: Record<string, any>) {
    console.log(`Starting migration for ${collectionName}...`);
    let batch = db.batch();
    let count = 0;
    let total = 0;
    const BATCH_SIZE = 400; // Firestore batch limit is 500

    for (const [key, value] of Object.entries(data)) {
        // Sanitize key for document ID if needed, though simple strings are usually fine
        // We use the key from the record as the document ID
        const docRef = db.collection(collectionName).doc(key);
        batch.set(docRef, value);
        count++;
        total++;

        if (count >= BATCH_SIZE) {
            await batch.commit();
            console.log(`  Committed batch of ${count} documents.`);
            batch = db.batch(); // Create a new batch
            count = 0;
        }
    }

    // Commit remaining
    if (count > 0) {
        await batch.commit();
        console.log(`  Committed final batch of ${count} documents.`);
    }
    console.log(`Finished ${collectionName}: ${total} documents migrated.`);
}

async function main() {
    try {
        await migrateCollection('items', ITEM_LIBRARY);
        await migrateCollection('classes', CLASS_DEFINITIONS);
        await migrateCollection('spells', SPELL_LIBRARY);
        await migrateCollection('races', RACE_DEFINITIONS);
        await migrateCollection('feats', FEAT_LIBRARY);
        await migrateCollection('backgrounds', BACKGROUND_DEFINITIONS);
        await migrateCollection('enemies', BESTIARY);
        await migrateCollection('skills', SKILL_DEFINITIONS);

        console.log('Migration complete!');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

main();

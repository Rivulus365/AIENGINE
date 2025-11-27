import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({
    credential: applicationDefault(),
    projectId: 'gen-lang-client-0151453986'
});

const db = getFirestore(app);

async function test() {
    console.log('Attempting to list collections...');
    try {
        const collections = await db.listCollections();
        console.log('Collections:', collections.map(c => c.id));
    } catch (error) {
        console.error('Error listing collections:', error);
    }

    console.log('Attempting to write a test document...');
    try {
        await db.collection('test').doc('test_doc').set({ foo: 'bar' });
        console.log('Successfully wrote test document.');
    } catch (error) {
        console.error('Error writing test document:', error);
    }
}

test();

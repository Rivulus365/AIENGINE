import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse').default || require('pdf-parse');

async function extractPHBData() {
    const pdfPath = path.join('c:', 'Users', 'Administrator', 'Documents', 'Downloads', "Player's Handbook.pdf");

    console.log('Reading PDF file...');
    const dataBuffer = fs.readFileSync(pdfPath);

    console.log('Parsing PDF...');
    const data = await pdfParse(dataBuffer);

    console.log('PDF Info:');
    console.log(`- Pages: ${data.numpages}`);
    console.log(`- Text length: ${data.text.length} characters`);

    // Save the extracted text to a file for analysis
    const outputPath = path.join(__dirname, 'phb_extracted_text.txt');
    fs.writeFileSync(outputPath, data.text, 'utf-8');
    console.log(`\nExtracted text saved to: ${outputPath}`);

    // Let's search for specific sections
    const text = data.text;

    // Find races section
    console.log('\n=== Searching for Races ===');
    const raceKeywords = ['Aarakocra', 'Aasimar', 'Firbolg', 'Genasi', 'Goliath', 'Kenku', 'Lizardfolk', 'Tabaxi', 'Triton', 'Tortle', 'Yuan-ti'];
    raceKeywords.forEach(race => {
        const index = text.indexOf(race);
        if (index !== -1) {
            console.log(`Found: ${race} at position ${index}`);
            // Extract a snippet around the race name
            const snippet = text.substring(index, Math.min(index + 500, text.length));
            console.log(`Snippet: ${snippet.substring(0, 200)}...\n`);
        }
    });

    // Find spells section
    console.log('\n=== Searching for Spells ===');
    const spellKeywords = ['Counterspell', 'Haste', 'Polymorph', 'Wish', 'Power Word Kill', 'Meteor Swarm'];
    spellKeywords.forEach(spell => {
        const index = text.indexOf(spell);
        if (index !== -1) {
            console.log(`Found: ${spell} at position ${index}`);
        }
    });

    console.log('\n=== Extraction Complete ===');
    console.log('Review the extracted text file to manually identify and structure the data.');
}

// Run the extraction
extractPHBData().catch(console.error);

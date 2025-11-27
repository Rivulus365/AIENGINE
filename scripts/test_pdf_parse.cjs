const pdfParse = require('pdf-parse');
console.log('pdf-parse exports:', Object.keys(pdfParse));
console.log('Type:', typeof pdfParse);
console.log('Is function?:', typeof pdfParse === 'function');
console.log('Has default?:', pdfParse.default);
console.log('Full object:', pdfParse);

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');

// Get all JSON files in the directory
const files = fs.readdirSync(dataDir).filter(file => file.startsWith('questions') && file.endsWith('.json'));

const seenQuestions = new Set();
let totalDuplicates = 0;

console.log(`Scanning ${files.length} files for duplicates...`);

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  try {
    const questions = JSON.parse(content);
    const uniqueQuestions = [];
    let fileDuplicates = 0;

    questions.forEach(q => {
      const normalizedQuestion = q.question.trim().toLowerCase();

      if (seenQuestions.has(normalizedQuestion)) {
        // It's a duplicate
        fileDuplicates++;
        totalDuplicates++;
        console.log(`[Duplicate] "${q.question}" found in ${file}`);
      } else {
        seenQuestions.add(normalizedQuestion);
        uniqueQuestions.push(q);
      }
    });

    if (fileDuplicates > 0) {
      console.log(`Removed ${fileDuplicates} duplicates from ${file}`);
      fs.writeFileSync(filePath, JSON.stringify(uniqueQuestions, null, 2), 'utf8');
    }

  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
});

console.log('-----------------------------------');
console.log(`Total duplicates removed: ${totalDuplicates}`);
console.log('Done.');

const fs = require('fs');
const path = require('path');

const categories = ['Historia', 'Geografía', 'Ciencia', 'Deportes', 'Arte', 'Entretenimiento'];

function generateQuestions(packNum) {
  const questions = [];
  for (let i = 1; i <= 30; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    questions.push({
      category: cat,
      question: `¿Pregunta ${i} del Pack ${packNum}? (Placeholder)`,
      answer: `Respuesta ${i}`
    });
  }
  return questions;
}

const dataDir = path.join(__dirname, '../src/data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let indexContent = "const packs = {};\n\n";

for (let i = 1; i <= 10; i++) {
  const fileName = `questions_pack_${i}.json`;
  const filePath = path.join(dataDir, fileName);
  const data = generateQuestions(i);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Created ${fileName}`);
}

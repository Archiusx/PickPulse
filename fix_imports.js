import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');
content = content.replace("getDocs\\n}", "getDocs,\\n  getDoc\\n}");
fs.writeFileSync('./App.tsx', content);
console.log('done');

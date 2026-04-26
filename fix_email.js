import fs from 'fs';
let content = fs.readFileSync('./localDb.ts', 'utf-8');
content = content.replace(/admin@pickpulse\.com/g, 'adityadeshakar@gmail.com');
fs.writeFileSync('./localDb.ts', content);
console.log('done');

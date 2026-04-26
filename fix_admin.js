import fs from 'fs';
let content = fs.readFileSync('./fakeFirebase.ts', 'utf-8');

content = content.replace(/admin@pickpulse\.com/g, 'adityadeshakar@gmail.com');

fs.writeFileSync('./fakeFirebase.ts', content);
console.log('done');

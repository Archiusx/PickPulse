import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');

content = content.replace(/text-slate-900 text-xs([^>]*?)>/g, 'text-white text-xs$1>');
content = content.replace(/hover:bg-yellow-300/g, 'hover:bg-blue-400');

fs.writeFileSync('./App.tsx', content);

console.log('done');

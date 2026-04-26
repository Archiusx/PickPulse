import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');

// replace text-slate-900 with text-white on brand-yellow elements
// there's typically something like 'brand-yellow text-slate-900'
content = content.replace(/brand-yellow text-slate-900/g, 'brand-yellow text-white');
content = content.replace(/text-slate-900 fill-slate-900/g, 'text-white fill-white');

fs.writeFileSync('./App.tsx', content);

let cssContent = fs.readFileSync('./index.css', 'utf-8');
cssContent = cssContent.replace(/#F7D300/g, '#3b82f6'); // blue-500
fs.writeFileSync('./index.css', cssContent);

console.log('done');

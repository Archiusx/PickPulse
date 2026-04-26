import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');

// Bypass the !user check
content = content.replace(
  /if \(!user\) \{[\s\S]*?return \([\s\S]*?min-h-screen flex items-center justify-center bg-slate-900 p-4[\s\S]*?Welcome to PickPulse[\s\S]*?\);\s*\}/,
  ''
);

fs.writeFileSync('./App.tsx', content);

console.log('done');

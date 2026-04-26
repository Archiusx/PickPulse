import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');

content = content.replace(
    /className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all \$\{/,
    'className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap shrink-0 lg:w-full ${'
);

fs.writeFileSync('./App.tsx', content);

console.log('done');

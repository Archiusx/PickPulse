import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');

// I previously made this hidden on mobile. I will revert it and just make it scrollable horizontally if needed, or just let it stay below the buttons.
content = content.replace(/<div className="hidden lg:block mt-auto space-y-4">/, '<div className="mt-4 lg:mt-auto space-y-4 shrink-0">');

fs.writeFileSync('./App.tsx', content);
console.log('done via class replace');

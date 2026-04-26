import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');

// Nav wrapper change
content = content.replace(
  /<nav className="w-full lg:w-64 lg:h-full bg-slate-900 text-white p-4 lg:p-6 flex flex-col gap-4 lg:gap-8 lg:overflow-y-auto shrink-0 z-10">/,
  '<nav className="w-full lg:w-64 lg:h-full bg-slate-900 text-white p-4 lg:p-6 flex flex-col gap-4 lg:gap-8 lg:overflow-y-auto shrink-0 z-10">'
);

// We need to change the buttons container to row on mobile
// The buttons container is currently `<div className="flex flex-col gap-2">` inside nav.
content = content.replace(
  /<div className="flex flex-col gap-2">/,
  '<div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar">'
);

content = content.replace(
  /<div className="mt-auto space-y-4">/,
  '<div className="hidden lg:block mt-auto space-y-4">'
); // hide role and compliance on mobile

fs.writeFileSync('./App.tsx', content);

let cssContent = fs.readFileSync('./index.css', 'utf-8');
if(!cssContent.includes('.hide-scrollbar')) {
  cssContent += `\n.hide-scrollbar::-webkit-scrollbar { display: none; }\n.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }\n`;
}
fs.writeFileSync('./index.css', cssContent);

console.log('done');

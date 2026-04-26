import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');

// The Root Div
content = content.replace(
  /<div className={`h-\[100dvh\] w-full flex flex-col lg:flex-row overflow-hidden/,
  '<div className={`min-h-[100dvh] lg:h-[100dvh] w-full flex flex-col lg:flex-row lg:overflow-hidden'
);

// The Nav
content = content.replace(
  /<nav className="w-full lg:w-64 lg:h-full bg-slate-900 text-white p-4 lg:p-6 flex flex-col gap-4 lg:gap-8 overflow-y-auto shrink-0 z-10">/,
  '<nav className="w-full lg:w-64 lg:h-full bg-slate-900 text-white p-4 lg:p-6 flex flex-col gap-4 lg:gap-8 lg:overflow-y-auto shrink-0 z-10">'
);

// The Main
content = content.replace(
  /<main className="flex-1 h-full p-4 lg:p-8 overflow-y-auto overflow-x-hidden transition-colors duration-300 max-w-\[1600px\] mx-auto w-full">/,
  '<main className="flex-1 lg:h-full p-4 lg:p-8 lg:overflow-y-auto overflow-x-hidden transition-colors duration-300 max-w-[1600px] mx-auto w-full">'
);

fs.writeFileSync('./App.tsx', content);
console.log('done');

import fs from 'fs';
['./App.tsx', './index.css', './metadata.json'].forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/BlinkAI/g, 'PickPulse');
  content = content.replace(/Blinkit/g, 'PickPulse');
  content = content.replace(/blinkit-yellow/g, 'brand-yellow');
  content = content.replace(/blinkit-text/g, 'text-brand-yellow');
  fs.writeFileSync(file, content);
});
console.log('done');

import fs from 'fs';
let content = fs.readFileSync('./localDb.ts', 'utf-8');

content = content.replace(
  /role: 'Admin' \| 'Picker' \| 'Manager';/,
  "role: 'Admin' | 'Picker' | 'Manager' | 'Staff';"
);

fs.writeFileSync('./localDb.ts', content);
console.log('done');

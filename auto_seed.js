import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');

const oldSeed = `      // Seed initial data if empty
      if (items.length === 0 && user?.email === 'adityadeshakar@gmail.com') {
        INITIAL_INVENTORY.forEach(async (item) => {
          try {
            await setDoc(doc(db, 'inventory', item.id), item);
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, \`inventory/\${item.id}\`);
          }
        });
      }`;

const newSeed = `      // Seed initial data if empty
      if (items.length === 0 && user?.email === 'adityadeshakar@gmail.com') {
        seedDatabase();
      }`;

content = content.replace(oldSeed, newSeed);
fs.writeFileSync('./App.tsx', content);
console.log('done auto-seeding logic');

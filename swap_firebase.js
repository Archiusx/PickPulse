import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');

// Replace imports from firebase/firestore and firebase/auth with ./fakeFirebase
content = content.replace(/from\s+'firebase\/firestore'/g, "from './fakeFirebase'");
content = content.replace(/from\s+'firebase\/auth'/g, "from './fakeFirebase'");
content = content.replace(/import\s+{\s*db,\s*auth\s*}\s*from\s+'\.\/firebase';/, "");

// Also we need to make sure we import User as FirebaseUser correctly handled 
// Actually I can just prepend the DB and Auth import, wait fakeFirebase exports DB and Auth.
content = content.replace(/import \{.*?\}\s*from '\.\/fakeFirebase';/s, (match) => {
    return `import { db, auth } from './fakeFirebase';\n${match}`;
});

fs.writeFileSync('./App.tsx', content);
console.log('done');

import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');

content = content.replace(/import { db, auth } from '\.\/fakeFirebase';/, "import { db, auth } from './firebase';");
content = content.replace(/\} from '\.\/fakeFirebase';/g, (match, offset, str) => {
  const beforeStr = str.substring(offset - 150, offset);
  if (beforeStr.includes('signInWithPopup')) return "} from 'firebase/auth';";
  return "} from 'firebase/firestore';";
});

content = content.replace(
  /const \[user, setUser\] = useState<FirebaseUser \| null>\(auth.currentUser as FirebaseUser \| null\);/,
  "const [user, setUser] = useState<FirebaseUser | null>(null);"
);

content = content.replace(
  /const \[isAuthReady, setIsAuthReady\] = useState\(true\);/,
  "const [isAuthReady, setIsAuthReady] = useState(false);"
);

fs.writeFileSync('./App.tsx', content);
console.log("done");

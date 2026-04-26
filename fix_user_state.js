import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');

// The initial user state
content = content.replace(
  /const \[user, setUser\] = useState<FirebaseUser \| null>\(null\);/,
  'const [user, setUser] = useState<FirebaseUser | null>(auth.currentUser as FirebaseUser | null);'
);

// We also should bypass the loading state optionally
content = content.replace(
  /const \[isAuthReady, setIsAuthReady\] = useState\(false\);/,
  'const [isAuthReady, setIsAuthReady] = useState(true);'
);

fs.writeFileSync('./App.tsx', content);

console.log('done');

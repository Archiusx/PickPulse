import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');

if(!content.includes("import { seedDatabase }")) {
   content = content.replace("import './index.css';", "import './index.css';\nimport { seedDatabase } from './seedDatabase';");
}

let seedButtonHTML = `
          {userRole === 'Admin' && (
            <button
              onClick={async () => {
                 const success = await seedDatabase();
                 if(success) addToast('Sample data seeded successfully!', 'success');
              }}
              className="w-full flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-yellow-500/20 text-yellow-500 font-bold rounded-xl hover:bg-yellow-500/30 transition-colors"
            >
              Seed Sample Data
            </button>
          )}

          {/* Role Selector (Demo Only) */}
`;
content = content.replace(/\{\/\* Role Selector \(Demo Only\) \*\/\}/, seedButtonHTML);

// Fix syncProfile
const syncProfileEdit = `
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        
        let roleToSet = 'Picker';
        if(user.email === 'adityadeshakar@gmail.com') roleToSet = 'Admin';
        
        if (!docSnap.exists() || !docSnap.data().role) {
           await setDoc(userRef, {
             uid: user.uid,
             email: user.email,
             displayName: user.displayName,
             photoURL: user.photoURL,
             role: roleToSet
           }, { merge: true });
        } else {
           await setDoc(userRef, {
             uid: user.uid,
             email: user.email,
             displayName: user.displayName,
             photoURL: user.photoURL
           }, { merge: true });
        }
`;

content = content.replace(/const userRef = doc\(db, 'users', user\.uid\);[\s\S]*?photoURL: user\.photoURL\s*\}, \{ merge: true \}\);/g, syncProfileEdit);

fs.writeFileSync('./App.tsx', content);
console.log('done');

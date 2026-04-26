import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');

// The replacement strategy:
// We want to avoid overwriting the user's role on every login, but ensure it defaults to 'Admin'
// if it's their first time.

const oldSyncProfile = `    // Sync profile to Firestore
    const syncProfile = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: user.email === 'adityadeshakar@gmail.com' ? 'Admin' : 'Picker' // Default role
        }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, \`users/\${user.uid}\`);
      }
    };`;

const newSyncProfile = `    // Sync profile to Firestore
    const syncProfile = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        // We'll let the onSnapshot handle reading the initial role.
        // But we want to ensure basic info is synced. We'll omit 'role' from the blanket merge 
        // to avoid overwriting whatever they select.
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, \`users/\${user.uid}\`);
      }
    };`;

content = content.replace(oldSyncProfile, newSyncProfile);

// Ensure default state is 'Admin'
content = content.replace(
  /const \[userRole, setUserRole\] = useState<UserRole>\('.*?'\);/,
  "const [userRole, setUserRole] = useState<UserRole>('Admin');"
);

// We need to ensure that the onSnapshot assigns 'Admin' if doc doesn't have a role,
// but fakeFirebase returns `Admin` if we just set it in localDb.

fs.writeFileSync('./App.tsx', content);
console.log('done');

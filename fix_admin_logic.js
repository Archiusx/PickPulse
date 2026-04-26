import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');

const oldSync = `        if (!docSnap.exists() || !docSnap.data().role) {
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
        }`;

const newSync = `        if (!docSnap.exists() || !docSnap.data().role || user.email === 'adityadeshakar@gmail.com') {
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
        }`;

content = content.replace(oldSync, newSync);

fs.writeFileSync('./App.tsx', content);
console.log('done updating sync logic');

import fs from 'fs';
let content = fs.readFileSync('./App.tsx', 'utf-8');

// 1. Update UserRole
content = content.replace(
  /type UserRole = 'Admin' \| 'Picker' \| 'Manager';/,
  "type UserRole = 'Admin' | 'Picker' | 'Manager' | 'Staff';"
);

// 2. Add an update to the DB directly on change 
// Find the select onChange
content = content.replace(
  /onChange=\{\(e\) => \{\s*setUserRole\(e\.target\.value as UserRole\);\s*addToast\(\`Switched to \$\{e\.target\.value\} role\`, 'info'\);\s*\}\}/,
  `onChange={async (e) => {
                const newRole = e.target.value as UserRole;
                setUserRole(newRole);
                addToast(\`Switched to \${newRole} role\`, 'info');
                if (user) {
                  try {
                    await setDoc(doc(db, 'users', user.uid), { role: newRole }, { merge: true });
                  } catch (err) {
                    console.error("Failed to update role:", err);
                  }
                }
              }}`
);

// 3. Add 'Staff' to select options
content = content.replace(
  /<option value="Picker">Picker<\/option>/,
  '<option value="Picker">Picker</option>\n              <option value="Staff">Staff</option>'
);

fs.writeFileSync('./App.tsx', content);
console.log('done');

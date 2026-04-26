import { v4 as uuidv4 } from 'uuid';
import { localDb } from './localDb';
import { liveQuery } from 'dexie';

// Auth mocks
export const auth = {
  currentUser: { 
    uid: 'admin-user', 
    email: 'adityadeshakar@gmail.com', 
    displayName: 'Admin User',
    emailVerified: true,
    isAnonymous: false,
    tenantId: null,
    providerData: []
  }
};

export const signInWithPopup = async (auth, provider) => {
  return { user: auth.currentUser };
};
export const GoogleAuthProvider = class {};
export const onAuthStateChanged = (authObj, callback) => {
  setTimeout(() => callback(authObj.currentUser), 100);
  return () => {};
};
export const signOut = async (auth) => {};

// Firestore mocks
export const db = 'DB_PLACEHOLDER';
export const serverTimestamp = () => new Date().toISOString();
export const limit = (num) => ({ type: 'limit', num });
export const where = (field, op, val) => ({ type: 'where', field, op, val });


export const collection = (db, path, ...paths) => {
  return [path, ...paths].join('/');
};

export const doc = (db, path, id, ...paths) => {
  let full = path;
  if (id) full += '/' + id;
  if (paths.length) full += '/' + paths.join('/');
  return full;
};

export const query = (ref, ...constraints) => {
  return { ref, constraints };
};

export const orderBy = (field, dir) => {
  return { type: 'orderBy', field, dir };
};

export const onSnapshot = (q, callback, onError) => {
  let tableQuery;
  let collectionName = typeof q === 'string' ? q : q.ref;
  if (!collectionName) collectionName = '';
  
  const baseTable = collectionName.split('/')[0];
  
  if (baseTable === 'inventory') tableQuery = localDb.inventory.toCollection();
  else if (baseTable === 'compliance') tableQuery = localDb.compliance.toCollection();
  else if (baseTable === 'picker_status') tableQuery = localDb.pickers.toCollection();
  else if (baseTable === 'users') tableQuery = localDb.users.toCollection();
  else if (baseTable === 'orders') tableQuery = localDb.orders.toCollection();
  else if (baseTable === 'tickets') tableQuery = localDb.tickets.toCollection();
  else if (baseTable === 'vendor_messages') tableQuery = localDb.vendorMessages.toCollection();
  else if (baseTable === 'approvals') tableQuery = localDb.approvals.toCollection();
  else tableQuery = localDb.inventory.toCollection();

  const observable = liveQuery(() => tableQuery.toArray());
  const subscription = observable.subscribe(result => {
    let finalResult = result;
    
    // sorting logic mock
    if (q.constraints) {
      let order = q.constraints.find(c => c.type === 'orderBy');
      if (order) {
        finalResult = finalResult.sort((a,b) => {
          let aVal = a[order.field];
          let bVal = b[order.field];
          if (order.dir === 'desc') return aVal < bVal ? 1 : -1;
          return aVal > bVal ? 1 : -1;
        });
      }
    }
    
    // wrap in fake snapshot
    if (collectionName.includes('/')) {
      const docId = collectionName.split('/')[1];
      const docData = result.find(r => r.id === docId || r.uid === docId);
      if (docData) {
         callback({ exists: () => true, data: () => docData, id: docId });
      } else {
         callback({ exists: () => false, data: () => ({}), id: docId });
      }
    } else {
      callback({
        docs: finalResult.map(item => ({
          id: item.id || item.uid,
          data: () => item
        }))
      });
    }
  });

  return () => subscription.unsubscribe();
};

const getTable = (path) => {
   const base = path.split('/')[0];
   if (base === 'inventory') return localDb.inventory;
   if (base === 'compliance') return localDb.compliance;
   if (base === 'picker_status') return localDb.pickers;
   if (base === 'users') return localDb.users;
   if (base === 'orders') return localDb.orders;
   if (base === 'tickets') return localDb.tickets;
   if (base === 'vendor_messages') return localDb.vendorMessages;
   if (base === 'approvals') return localDb.approvals;
   return localDb.inventory;
}

export const addDoc = async (collPath, data) => {
  const table = getTable(collPath);
  const id = uuidv4();
  await table.add({ ...data, id });
  return { id };
};

export const setDoc = async (docPath, data, options) => {
  const table = getTable(docPath);
  const id = docPath.split('/')[1];
  if (options && options.merge) {
    const existing = await table.get(id);
    await table.put({ ...existing, ...data, id });
  } else {
    await table.put({ ...data, id });
  }
};

export const updateDoc = async (docPath, data) => {
  const table = getTable(docPath);
  const id = docPath.split('/')[1];
  await table.update(id, data);
};

export const deleteDoc = async (docPath) => {
  const table = getTable(docPath);
  const id = docPath.split('/')[1];
  await table.delete(id);
};

export const getDocs = async (q) => {
  let collectionName = typeof q === 'string' ? q : q.ref;
  const table = getTable(collectionName);
  let res = await table.toArray();
  return {
    docs: res.map(item => ({
      id: item.id || item.uid,
      data: () => item
    }))
  };
};

export const getDocFromServer = async (docPath, docId) => {
   let fullPath = docId ? docPath + '/' + docId : docPath;
   const baseTbl = fullPath.split('/')[0];
   const table = getTable(baseTbl);
   const id = fullPath.split('/').pop();
   const item = await table.get(id);
   if (item) return { exists: () => true, data: () => item, id };
   throw new Error("offline");
};

export const writeBatch = () => {
    return {
       set: () => {},
       update: () => {},
       delete: () => {},
       commit: async () => {}
    };
};

export type User = any;


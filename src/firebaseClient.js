import { initializeApp } from 'firebase/app';
import { initializeAuth, browserSessionPersistence, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail, signOut, onIdTokenChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { isAdminIdentity } from './authz';

export function createClient(config) {
  const app = initializeApp(config);
  const auth = initializeAuth(app, { persistence: browserSessionPersistence });
  const database = config.databaseURL ? getDatabase(app) : null;
  return {
    observeAuth(callback) {
      let generation = 0;
      const unsubscribe = onIdTokenChanged(auth, async user => {
        const current = ++generation;
        try { const token = user ? await user.getIdTokenResult() : null; if (current === generation) callback({ user, isAdmin: isAdminIdentity(user, token?.claims), loading: false }); }
        catch { if (current === generation) callback({ user: null, isAdmin: false, loading: false }); }
      });
      return () => { generation++; unsubscribe(); };
    },
    login: (email,password) => signInWithEmailAndPassword(auth,email,password),
    async register(name,email,password) { const result=await createUserWithEmailAndPassword(auth,email,password); await updateProfile(result.user,{displayName:name}); return result; },
    resetPassword: email => sendPasswordResetEmail(auth,email),
    logout: () => signOut(auth),
    observeCatalog(callback,onError) { return database ? onValue(ref(database,'products'),snap=>callback(snap.val()),onError) : () => {}; },
    async saveProduct(product) { if (!database) throw Error('Conecte o banco de dados para publicar o catálogo.'); await set(ref(database,`products/${product.id}`),product); },
  };
}

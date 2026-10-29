const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};
export const firebaseReady = Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
export const databaseReady = firebaseReady && Boolean(config.databaseURL);
let clientPromise;
function client() {
  if (!firebaseReady) return Promise.reject(Error('O acesso real será ativado após a conexão do Firebase.'));
  return clientPromise ||= import('./firebaseClient').then(m=>m.createClient(config)).catch(error=>{ clientPromise=undefined; throw error; });
}
export function observeAuth(callback) {
  if (!firebaseReady) { callback({user:null,isAdmin:false,loading:false}); return () => {}; }
  let cancelled=false,unsubscribe;
  client().then(c=>{if(!cancelled)unsubscribe=c.observeAuth(callback);}).catch(()=>{if(!cancelled)callback({user:null,isAdmin:false,loading:false});});
  return ()=>{cancelled=true;unsubscribe?.();};
}
export function observeCatalog(callback,onError) {
  if (!databaseReady) return ()=>{};
  let cancelled=false,unsubscribe;
  client().then(c=>{if(!cancelled)unsubscribe=c.observeCatalog(callback,onError);}).catch(error=>{if(!cancelled)onError?.(error);});
  return ()=>{cancelled=true;unsubscribe?.();};
}
export const login = async (email,password) => (await client()).login(email,password);
export const register = async (name,email,password) => (await client()).register(name,email,password);
export const resetPassword = async email => (await client()).resetPassword(email);
export const logout = async () => { if(firebaseReady)await(await client()).logout(); };
export const saveProduct = async product => (await client()).saveProduct(product);
export const authError = error => ({
  'auth/invalid-credential':'E-mail ou senha incorretos.',
  'auth/invalid-email':'Informe um e-mail válido.',
  'auth/email-already-in-use':'Não foi possível cadastrar com estes dados. Tente entrar ou recuperar seu acesso.',
  'auth/weak-password':'Escolha uma senha mais forte, com pelo menos 8 caracteres.',
  'auth/too-many-requests':'Muitas tentativas. Aguarde e tente novamente.',
  'auth/network-request-failed':'Não foi possível conectar. Verifique sua internet.',
  'auth/operation-not-allowed':'O acesso por e-mail ainda precisa ser habilitado na loja.',
}[error.code] || (error.code?'Não foi possível concluir. Tente novamente.':error.message));

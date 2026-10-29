import test from 'node:test';
import assert from 'node:assert/strict';
import { initialProducts, validateProduct, validateDemoOrder } from '../src/catalog.js';
import { readStored, clearStoreData } from '../src/storage.js';
import { isAdminIdentity } from '../src/authz.js';

test('cadastro rejeita textos e URLs além dos limites do banco', () => {
  const product = initialProducts[0];
  assert.equal(validateProduct({ ...product, description: 'x'.repeat(2501) }), false);
  assert.equal(validateProduct({ ...product, subtitle: 'x'.repeat(151) }), false);
  assert.equal(validateProduct({ ...product, color: 'x'.repeat(101) }), false);
  assert.equal(validateProduct({ ...product, badge: 'x'.repeat(41) }), false);
  assert.equal(validateProduct({ ...product, sizes: ['38', '38'] }), false);
  const untrusted = new URL('https://tracker.example/image.png');
  untrusted.username='user'; untrusted.password='password';
  assert.equal(validateProduct({ ...product, image: untrusted.href }), false);
});
test('resumo malformado ou adulterado não chega à interface', () => {
  const order = { id:'R7-1234ABCD', createdAt:'2026-10-27T12:00:00Z', status:'Demonstração', total:9990, items:[{name:'Boné',size:'Único',qty:1,price:9990}] };
  assert.equal(validateDemoOrder(order),true);
  assert.equal(validateDemoOrder({...order,items:[null]}),false);
  assert.equal(validateDemoOrder({...order,total:1}),false);
  assert.equal(validateDemoOrder({...order,createdAt:'erro'}),false);
});
test('armazenamento indisponível, corrompido ou excessivo tem fallback seguro', () => {
  assert.deepEqual(readStored({getItem:()=>'{invalido'},'key',[]),[]);
  assert.equal(readStored({getItem:()=> 'x'.repeat(512001)},'key','fallback'),'fallback');
  assert.equal(readStored({getItem:()=>{throw Error('blocked');}},'key','fallback'),'fallback');
});
test('limpeza LGPD apaga apenas as chaves da loja', () => {
  const removed=[]; assert.equal(clearStoreData({removeItem:k=>removed.push(k)},{removeItem:k=>removed.push(k)}),true);
  assert.deepEqual(removed.sort(),['rua7.catalog.v1','rua7.cart.v1','rua7.demo-orders','rua7.favorites.v1'].sort());
});
test('admin exige claim booleana e e-mail confirmado', () => {
  assert.equal(isAdminIdentity({emailVerified:true},{admin:true}),true);
  assert.equal(isAdminIdentity({emailVerified:false},{admin:true}),false);
  assert.equal(isAdminIdentity({emailVerified:true},{admin:'true'}),false);
  assert.equal(isAdminIdentity(null,{admin:true}),false);
});

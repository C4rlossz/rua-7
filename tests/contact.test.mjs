import test from 'node:test';
import assert from 'node:assert/strict';
import {makeContactDraft,draftMailto} from '../src/contactRequest.js';
import {readFile} from 'node:fs/promises';
test('solicitação produz rascunho limitado e codifica corpo sem injetar cabeçalhos',()=>{
  const draft=makeContactDraft({type:'Acesso aos dados',message:'Preciso consultar meus dados & direitos?'});
  const url=draftMailto('contato@example.com',draft);assert.equal(new URL(url).searchParams.get('body'),draft.body);
  assert.throws(()=>makeContactDraft({type:'Acesso aos dados',message:'x'.repeat(1201)}));
  assert.throws(()=>makeContactDraft({type:'Acesso aos dados',email:'a@b.com\nbcc:test@example.com',message:'Descrição válida'}));
  assert.throws(()=>makeContactDraft({type:'Acesso aos dados',page:'x\ny',message:'Descrição válida'}));
});
test('arquivo de regras pode ser lido como JSON e bloqueia escrita anônima na raiz',async()=>{
  const {rules}=JSON.parse(await readFile(new URL('../database.rules.json',import.meta.url),'utf8'));
  assert.equal(rules['.write'],false);assert.equal(rules['.read'],false);
  assert.match(rules.products.$id['.write'],/email_verified === true/);
});

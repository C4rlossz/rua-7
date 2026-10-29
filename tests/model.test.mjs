import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getProductModel } from '../src/productModel.js';
const file=await readFile(new URL('../public/models/rua7-movimento-v2.glb',import.meta.url));
const length=file.readUInt32LE(12),gltf=JSON.parse(file.subarray(20,20+length).toString('utf8'));
test('modelo original é GLB 2 íntegro e autocontido, sem fotos nem fontes remotas',()=>{
  assert.equal(file.readUInt32LE(0),0x46546c67);assert.equal(file.readUInt32LE(4),2);assert.equal(file.readUInt32LE(8),file.length);
  assert.equal(gltf.buffers.length,1);assert.equal(gltf.buffers[0].uri,undefined);
  assert.ok(gltf.bufferViews.every(v=>(v.byteOffset||0)+v.byteLength<=gltf.buffers[0].byteLength));
  assert.equal((gltf.images||[]).length,0);assert.ok(file.length<3_000_000);
});
test('geometria tem volume, normais e orçamento limitado para celular',()=>{
  const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
  for(const mesh of gltf.meshes)for(const p of mesh.primitives){const a=gltf.accessors[p.attributes.POSITION];for(let i=0;i<3;i++){min[i]=Math.min(min[i],a.min[i]);max[i]=Math.max(max[i],a.max[i]);}assert.notEqual(p.attributes.NORMAL,undefined);}
  assert.ok(max[0]-min[0]>3);assert.ok(max[1]-min[1]>1);assert.ok(max[2]-min[2]>1);assert.ok(gltf.meshes.length<=16);
});
test('links antigos encontram conceito original e produto sem modelo mantém fallback',()=>{
  assert.equal(getProductModel({id:'tenis-floral'}).url,'/models/rua7-movimento-v2.glb');
  assert.equal(getProductModel({id:'tenis-floral'}).illustrative,true);
  assert.equal(getProductModel({id:'tenis-02'}),null);
  assert.equal(getProductModel({id:'tenis-floral',modelUrl:'/models/custom.glb'}).url,'/models/custom.glb');
});

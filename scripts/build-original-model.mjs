import * as T from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';
import { mkdir, writeFile } from 'node:fs/promises';

// Original illustrative Rua 7 concept. No third-party photographs or textures.
const root = new URL('../', import.meta.url), source = new T.Group();
const material = (name, color, roughness=.75) => Object.assign(new T.MeshStandardMaterial({color,roughness,side:T.DoubleSide}),{name});
const white=material('Tecido perola','#eeece8'),purple=material('Paineis Rua 7','#8c62cd'),deep=material('Forro uva','#3c2853'),sole=material('Sola escultural','#ded9e7'),tread=material('Borracha violeta','#5a348c'),lace=material('Cadarcos lavanda','#ddd1ef'),stitch=material('Costuras','#b5a8c6'),hole=material('Microperfuracoes','#877c94');
function add(g,m,name,pos,rot,scale){const mesh=new T.Mesh(g,m);mesh.name=name;if(pos)mesh.position.set(...pos);if(rot)mesh.rotation.set(...rot);if(scale)mesh.scale.set(...scale);source.add(mesh);return mesh;}
function tube(points,r,mat=stitch,closed=false,segments=24){return add(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),closed),segments,r,5,closed),mat,'Detalhe volumetrico');}
const profile=[[-1.8,.02,.42],[-1.7,.27,.52],[-1.45,.49,.58],[-1.13,.59,.66],[-.78,.62,.77],[-.42,.57,.97],[-.05,.52,1.15],[.34,.49,1.32],[.68,.48,1.26],[1.02,.47,1.42],[1.35,.39,1.48],[1.59,.21,1.31],[1.66,.02,1.02]];
function sample(x){for(let i=0;i<profile.length-1;i++){const a=profile[i],b=profile[i+1];if(x>=a[0]&&x<=b[0]){const t=(x-a[0])/(b[0]-a[0]);return {w:T.MathUtils.lerp(a[1],b[1],t),h:T.MathUtils.lerp(a[2],b[2],t)};}}return{w:.02,h:.43};}
function surface(x,theta){const {w,h}=sample(x);return[x,.36+(h-.36)*Math.pow(Math.max(0,Math.sin(theta)),.55),w*Math.cos(theta)];}
function surfaceGrid(rows,cols,fn,skip){const p=[],uv=[],idx=[];for(let i=0;i<=rows;i++)for(let j=0;j<=cols;j++){p.push(...fn(i/rows,j/cols));uv.push(i/rows,j/cols);}for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){if(skip?.((i+.5)/rows,(j+.5)/cols))continue;const a=i*(cols+1)+j,b=a+cols+1;idx.push(a,b,a+1,b,b+1,a+1);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
add(surfaceGrid(80,44,(u,v)=>surface(-1.8+u*3.46,v*Math.PI),(u,v)=>u>.64&&u<.96&&v>.23&&v<.77),white,'Cabedal original');
const outline=[];for(let i=0;i<=60;i++){const x=-1.8+i/60*3.46;outline.push([x,sample(x).w]);}for(let i=60;i>=0;i--){const x=-1.8+i/60*3.46;outline.push([x,-sample(x).w]);}
const shape=new T.Shape();outline.forEach(([x,z],i)=>i?shape.lineTo(x,z):shape.moveTo(x,z));shape.closePath();
const soleGeo=new T.ExtrudeGeometry(shape,{depth:.27,bevelEnabled:true,bevelThickness:.065,bevelSize:.075,bevelSegments:4,steps:1});soleGeo.rotateX(Math.PI/2);soleGeo.translate(0,.33,0);add(soleGeo,sole,'Sola continua com volume');
const lower=outline.map(([x,z])=>[x,.035,z*1.01]);tube(lower,.025,tread,true,110);
for(const sign of[-1,1]){
  const wave=[];for(let i=0;i<=50;i++){const x=-1.65+i/50*3.14;wave.push([x,.19+.055*Math.sin((x+1.6)*3.4),sign*(sample(x).w+.018)]);}tube(wave,.017,purple,false,65);
  // Angular asymmetrical panels deliberately avoid third-party brand marks.
  for(const points of [[[-.62,.45],[-.35,.94],[.28,1.15],[.42,.91],[-.08,.79],[-.25,.47]],[[.70,.48],[.88,1.17],[1.29,1.31],[1.49,.78],[1.42,.43]]]){
    const polygon=new T.Shape(points.map(p=>new T.Vector2(...p)));
    const g=new TessellateModifier(.055,9).modify(new T.ShapeGeometry(polygon));
    const vertices=g.attributes.position;
    for(let i=0;i<vertices.count;i++){const x=vertices.getX(i),y=vertices.getY(i),{w,h}=sample(x),ratio=T.MathUtils.clamp((y-.36)/(h-.36),0,.99),sin=Math.pow(ratio,1/.55);vertices.setZ(i,sign*(w*Math.sqrt(1-sin*sin)+.018));}g.computeVertexNormals();
    add(g,purple,'Painel angular original');
  }
  const toe=[];for(let i=0;i<=25;i++){const x=-1.6+i/25*.88;toe.push([x,sample(x).h-.095,sign*sample(x).w*.72]);}tube(toe,.009,stitch);
}
add(new T.SphereGeometry(1,28,16),deep,'Palmilha',[.96,.68,0],null,[.57,.075,.31]);
const collar=[];for(let i=0;i<56;i++){const a=i/56*Math.PI*2,x=.99+.52*Math.cos(a);collar.push([x,sample(x).h+.015,.34*Math.sin(a)]);}tube(collar,.055,deep,true,72);
const tongue=new T.Shape();tongue.moveTo(-.65,-.23);tongue.lineTo(.49,-.23);tongue.quadraticCurveTo(.63,0,.49,.23);tongue.lineTo(-.65,.23);tongue.closePath();
const tg=new T.ExtrudeGeometry(tongue,{depth:.045,bevelEnabled:true,bevelSize:.025,bevelThickness:.02,bevelSegments:3});tg.rotateX(Math.PI/2);for(let i=0;i<tg.attributes.position.count;i++){const x=tg.attributes.position.getX(i);tg.attributes.position.setY(i,tg.attributes.position.getY(i)+.89+(x+.6)*.52);}tg.computeVertexNormals();add(tg,purple,'Lingueta lavanda');
for(let row=0;row<7;row++){const x=-.59+row*.155,y=.94+(x+.6)*.52;for(const sign of[-1,1]){add(new T.TorusGeometry(.04,.009,5,12),deep,'Ilhos',[x,y-.025,sign*.26],[-Math.PI/2,0,0]);tube([[x,y,sign*.26],[x+.045,y+.055,sign*.1],[x+.11,y+.055,-sign*.1],[x+.14,y+.07,-sign*.26]],.024,lace,false,15);}}
tube([[.4,1.47,0],[.44,1.54,.16],[.58,1.51,.22],[.57,1.46,.06],[.4,1.47,0]],.023,lace,false,26);
tube([[.4,1.47,0],[.43,1.54,-.16],[.57,1.52,-.22],[.58,1.47,-.06],[.4,1.47,0]],.023,lace,false,26);
for(let row=0;row<5;row++)for(let col=-3;col<=3;col++){const x=-1.45+row*.13,z=col*.11,w=sample(x).w;if(Math.abs(z)>w*.74)continue;const p=surface(x,Math.acos(z/w));p[1]+=.002;add(new T.CircleGeometry(.012,8),hole,'Microperfuracao',p,[-Math.PI/2,0,0]);}
for(let row=0;row<12;row++){const x=-1.6+row*.27,w=sample(x).w;add(new T.BoxGeometry(.09,.05,w*1.7),tread,'Tracao inferior',[x,-.04,0]);}
source.updateMatrixWorld(true);const groups=new Map();for(const child of source.children){let g=child.geometry.clone().applyMatrix4(child.matrixWorld);if(g.index)g=g.toNonIndexed();if(!g.attributes.uv)g.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array(g.attributes.position.count*2),2));const key=child.material.name;if(!groups.has(key))groups.set(key,{material:child.material,geometries:[]});groups.get(key).geometries.push(g);}
const model=new T.Group();model.name='Rua 7 Movimento 01 — conceito original';for(const {material,geometries}of groups.values()){const mesh=new T.Mesh(mergeGeometries(geometries),material);mesh.name=material.name;model.add(mesh);}
model.userData={creator:'Carlos Eduardo / Rua 7',method:'Original procedural illustrative design; no third-party photo textures',version:2,commercialProduct:false};
globalThis.FileReader=class{readAsArrayBuffer(blob){blob.arrayBuffer().then(a=>{this.result=a;this.onloadend?.();});}readAsDataURL(blob){blob.arrayBuffer().then(a=>{this.result='data:application/octet-stream;base64,'+Buffer.from(a).toString('base64');this.onloadend?.();});}};
const glb=await new GLTFExporter().parseAsync(model,{binary:true,onlyVisible:true});await mkdir(new URL('public/models/',root),{recursive:true});await writeFile(new URL('public/models/rua7-movimento-v2.glb',root),Buffer.from(glb));
console.log(JSON.stringify({file:'public/models/rua7-movimento-v2.glb',bytes:glb.byteLength,meshes:model.children.length,triangles:model.children.reduce((n,m)=>n+m.geometry.attributes.position.count/3,0),externalTextures:0}));

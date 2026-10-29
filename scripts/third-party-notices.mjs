import {readFile,readdir,stat,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const lock=JSON.parse(await readFile('package-lock.json','utf8')),records=[],notices=['RUA 7 — COMPONENTES DE TERCEIROS','Gerado a partir dos pacotes instalados. Licenças individuais prevalecem.','Código original: MIT, Carlos Eduardo, 2026. Recursos visuais: veja ASSETS.md.',''];
let upstream=[];try{upstream=JSON.parse(await readFile('docs/licenses/sources.json','utf8'));}catch{}
for(const [dir,entry]of Object.entries(lock.packages)){
  if(!dir.includes('node_modules'))continue;
  try{const pkg=JSON.parse(await readFile(path.join(dir,'package.json'),'utf8'));const names=(await readdir(dir)).filter(n=>/^(licen[sc]e|notice|copying|ofl)(\.|$)/i.test(n));const proofs=[];
    for(const name of names){const file=path.join(dir,name);if(!(await stat(file)).isFile())continue;const data=await readFile(file);proofs.push({file:file.replaceAll('\\','/'),sha256:createHash('sha256').update(data).digest('hex')});if(!entry.dev)notices.push(`\n===== ${pkg.name}@${pkg.version} / ${name} =====\n`,data.toString('utf8'));}
    const family=pkg.name==='firebase'||pkg.name.startsWith('@firebase/')?'firebase':({'@react-three/fiber':'fiber','@mediapipe/tasks-vision':'mediapipe',draco3d:'draco',maath:'maath','stats-gl':'stats'}[pkg.name]);
    const source=upstream.find(s=>s.name===family&&s.file);
    if(!proofs.length&&source){proofs.push(source);if(!entry.dev)notices.push(`\n===== ${pkg.name}@${pkg.version} / upstream evidence =====\n${source.url}\n${source.limitation}\n`,await readFile(source.file,'utf8'));}
    const license=pkg.license||(pkg.name==='webgl-constants'&&proofs.length?'MIT (verified LICENSE)':'NOT DECLARED');
    records.push({name:pkg.name,version:pkg.version,license,development:Boolean(entry.dev),proofs,status:source&&!names.length?'PENDENTE — texto upstream, confirmar versão exata':proofs.length?'APROVADO — evidência local':'PENDENTE — somente metadados'});
  }catch{records.push({directory:dir,version:entry.version,license:entry.license||'NOT DECLARED',status:'NÃO VERIFICADO — pacote opcional não instalado'});}
}
await mkdir('audit/evidence',{recursive:true});await writeFile('audit/evidence/dependency-licenses.json',JSON.stringify(records,null,2));await writeFile('public/third-party-notices.txt',notices.join('\n'));
console.log(JSON.stringify({packages:records.length,metadataOnly:records.filter(r=>r.status.startsWith('PENDENTE')).length,notInstalled:records.filter(r=>r.status.startsWith('NÃO')).length,unidentified:records.filter(r=>r.license==='NOT DECLARED').length}));

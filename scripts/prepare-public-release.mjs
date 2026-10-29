import {readFile,readdir,mkdir,copyFile,writeFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=process.cwd(),pkg=JSON.parse(await readFile('package.json','utf8'));
const output=path.resolve(root,'exports',`rua-7-public-${pkg.version}`);
if(!output.startsWith(path.resolve(root,'exports')+path.sep))throw Error('Invalid output path');
try{await stat(output);throw Error('A pasta de exportação já existe. Preserve a anterior e escolha uma nova versão.');}catch(e){if(e.code!=='ENOENT')throw e;}
const allowed=['src','public','scripts','tests','tools','docs','audit','.github','qa','README.md','README.pt-BR.md','LICENSE','SECURITY.md','CONTRIBUTING.md','CHANGELOG.md','ASSETS.md','VERIFICACAO.md','.env.example','.gitignore','package.json','package-lock.json','index.html','vite.config.js','firebase.json','database.rules.json'];
const excluded=new Set(['.git','.openai','node_modules','dist','exports','.firebase','lighthouse-before.json']);
const manifest=[];
async function copy(relative){const file=path.join(root,relative),info=await stat(file);if(info.isDirectory()){for(const item of await readdir(file)){if(excluded.has(item)||item.startsWith('.env')&&item!=='.env.example')continue;await copy(path.join(relative,item));}return;}
  const normalized=relative.replaceAll('\\','/');
  if(/(?:air-floral-\d\.png|tenis-floral-v1\.glb|build-floral-model\.mjs)$/.test(normalized))throw Error('Recurso não autorizado na exportação: '+normalized);
  const data=await readFile(file),target=path.join(output,relative);await mkdir(path.dirname(target),{recursive:true});await copyFile(file,target);manifest.push({file:normalized,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')});
}
for(const relative of allowed)await copy(relative);
await writeFile(path.join(output,'RELEASE-MANIFEST.json'),JSON.stringify({version:pkg.version,date:new Date().toISOString(),note:'Cópia sem histórico Git, configuração privada de hospedagem, node_modules ou fotos antigas. Lighthouse anterior omitido porque contém capturas da versão substituída. Não é autorização de publicação. Revise audit/09-checklist-publicacao.md.',files:manifest},null,2));
console.log(JSON.stringify({output,files:manifest.length,bytes:manifest.reduce((n,f)=>n+f.bytes,0)}));

import {readFile,writeFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const text=async file=>{const b=await readFile(file);return b.toString(b[0]===255&&b[1]===254?'utf16le':'utf8').replace(/^\uFEFF/,'');};
const json=async file=>JSON.parse(await text(file));
const metrics=[];
for(const[mode,file]of [['Desenvolvimento antes','lighthouse-before.json'],['Desenvolvimento depois','lighthouse-after.json'],['Preview de produção depois','lighthouse-production.json']]){const r=await json('audit/evidence/'+file);metrics.push({mode,file,date:r.fetchTime,url:r.finalDisplayedUrl,scores:Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k,Math.round(v.score*100)])),LCP:r.audits['largest-contentful-paint'].numericValue,TBT:r.audits['total-blocking-time'].numericValue,CLS:r.audits['cumulative-layout-shift'].numericValue,formFactor:r.configSettings.formFactor,throttling:r.configSettings.throttlingMethod});}
const names=['home-mobile','product-mobile','product-3d','login-mobile','admin-login','rights-mobile','privacidade','termos','cookies','acessibilidade','atendimento','checkout','admin-catalog'];
const axe=[];for(const name of names){const file=`axe-${name}-after.json`,r=await json('audit/evidence/'+file);axe.push({file,url:r.url,date:r.date,violations:r.violations.map(v=>v.id),manualChecks:r.incomplete?.length||0});}
const http=[];for(const route of ['/','/colecao','/produto/tenis-floral','/login','/admin/login','/privacidade','/termos','/cookies','/direitos','/acessibilidade','/atendimento','/images/rua7-movimento-0.png','/images/campaign-mobile.jpg','/models/rua7-movimento-v2.glb','/third-party-notices.txt','/robots.txt']){const r=await fetch('http://127.0.0.1:4173'+route);http.push({route,status:r.status,type:r.headers.get('content-type')});await r.arrayBuffer();}
const assets=[];async function walk(dir){for(const name of await readdir(dir)){const file=dir+'/'+name,info=await stat(file);if(info.isDirectory()){await walk(file);continue;}if(!/\.(png|jpe?g|svg|glb|woff2?)$/.test(file))continue;const b=await readFile(file);assets.push({file,bytes:b.length,sha256:createHash('sha256').update(b).digest('hex'),origin:file.includes('campaign')||file.includes('logo')?'IA anterior, ver ASSETS.md':file.includes('rua7-movimento')?'Geometria/renderização original nesta auditoria':file.includes('.woff')?'Fontsource local, SIL OFL-1.1':'Vetor local, ver ASSETS.md',licenseEvidence:'ASSETS.md e dependency-licenses.json',status:file.includes('campaign')||file.includes('logo')?'PENDENTE — revisão humana de IA/marca':'APROVADO no escopo de origem local identificada'});}}
await walk('public');await walk('dist/assets');
await writeFile('audit/evidence/asset-inventory.json',JSON.stringify(assets,null,2));
await writeFile('audit/evidence/final-summary.json',JSON.stringify({date:new Date().toISOString(),metrics,axe,http},null,2));
const rows=metrics.map(m=>`| ${m.mode} | ${m.scores.performance} | ${m.scores.accessibility} | ${m.scores['best-practices']} | ${m.scores.seo} | ${(m.LCP/1000).toFixed(2)} s | ${Math.round(m.TBT)} ms | ${m.CLS.toFixed(5)} |`).join('\n');
const cases=axe.map(a=>`| ${a.file} | ${a.violations.length} | ${a.manualChecks} |`).join('\n');
const report=`# G — Testes, funcionalidade, performance e evidências

Ambiente local Windows, Node.js 24, npm, Vite, Chromium headless para Lighthouse e navegador integrado para testes manuais. Data de referência: 27/10/2026. Relatório gerado dos arquivos de evidência, sem simular execução de CI ou serviços remotos.

## Execução e resultados

- npm test: baseline com 11 testes aprovados; após correções, **17 aprovados, zero falhas** em evidence/tests-after.txt. Inclui centavos/estoque, tamanho obrigatório, sacola adulterada, recibo sem dados pessoais, limites de produto, URL não confiável, armazenamento indisponível, limpeza local, claim administrativa, rascunho de direitos e integridade/volume do novo GLB.
- Teste de regressão inicial de limites de texto falhou pelo motivo esperado antes da implementação (hardening-red.txt), depois passou. JSON das regras inválido encontrado e reparado; parse/contrato local aprovados, sem equivaler a teste Firebase.
- npm run build: aprovado em evidence/build-after.txt. Inventário dos módulos efetivamente renderizados em bundled-modules.json. Harness axe e ferramentas de desenvolvimento não entram no build.
- npm audit: antes quatro alertas altos propagados, depois zero. Arquivos npm-audit-before/after. Scanner fonte/histórico em snapshot-after e diff-check documentam escopo e resultado final.
- Fluxo manual: produto sem tamanho foi bloqueado, tamanho 40 selecionado, checkout preenchido pelo exemplo fictício, revisão e conclusão sem cobrança. Recibo R7-5E15D550, 2 itens, total R$ 999,80, sem dados de contato no resumo (order-after.txt). Novo teste móvel abriu checkout com uma unidade.
- Busca: foco inicial no campo, Shift+Tab até Fechar, Escape e retorno de foco observados. Controles de 3D, giro, zoom e restauração observados. Sessão nova da produção: zero erros/avisos em console-production.json após desativar decodificadores não usados pelo GLB original. Durante edição houve erro transitório de hot reload, resolvido ao recarregar; não foi apresentado como falha de produção persistente.
- Formulário de direitos: texto de teste gerou rascunho e aviso de que nada foi enviado. Não houve envio de e-mail ou aceitação de contrato real.
- Prévia HTTP: ${http.length} caminhos consultados, ${http.filter(r=>r.status===200).length} respostas 200; tipos no final-summary.json. Resposta HTML em uma rota SPA não comprova sozinha seu funcionamento. As rotas interativas principais foram verificadas no navegador.

## Acessibilidade automatizada por estado

| Evidência final | Violações detectadas | Itens que exigem análise manual |
|---|---:|---:|
${cases}

Zero violações nesses casos não equivale a WCAG integral. O conjunto final inclui WCAG 2/2.1 A/AA e 2.2 AA pertinentes à ferramenta; casos anteriores à ampliação de tags têm escopo menor. Leitores de tela reais, zoom de texto, aparelhos físicos e todos os estados não foram demonstrados. 04-acessibilidade.md registra recursos, correções e limites.

## Lighthouse de laboratório — pontuações 0 a 100

| Ambiente | Performance | Acessibilidade | Boas práticas | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
${rows}

Comparar desenvolvimento antes/depois nas mesmas condições locais é uma indicação, com variação de execução; o preview de produção é outra condição e não substitui o baseline. Estes valores não são Core Web Vitals de usuários reais nem p75 de campo. O LCP de produção ainda exige melhoria e validação na hospedagem real; não foi declarado aprovado em todos os limiares de campo. TBT não é INP.

SEO caiu por decisão explícita de manter a demonstração não indexável (robots e noindex). Isso não impede acesso direto público futuro. Canonical, sitemap e indexação comercial aguardam domínio e ofertas definitivos; nenhum endereço canônico foi inventado. Open Graph básico está presente. Cache/CDN/TLS e metadados de compartilhamento remotos ainda precisam de teste.

Melhorias: banner móvel de 64.084 bytes em vez do PNG de 2.404.060, JPEG desktop 255.787, logo otimizada 31.354. Fontes locais. O primeiro carregamento dispensa o SDK Firebase sem configuração. O 3D carrega apenas sob demanda, usa GLB de aproximadamente 2 MB e evita decodificadores não necessários. CSS e código não usados e LCP continuam oportunidades registradas, sem reescrever a arquitetura para obter uma pontuação artificial.

## Não executado / não verificado

Firebase Auth real, recuperação/criação de conta e autorização remota; emuladores (Java ausente), gravação/isolamento no banco, transações comerciais/webhooks, testes de carga/abuso, restauração de backup, pentest de infraestrutura, CI no GitHub, leitores de tela/usuários com deficiência e verificação jurídica integral. Não há cobertura percentual de código medida ou suite automatizada end-to-end no CI; os fluxos de navegador citados foram executados manualmente. Lint/typecheck dedicados não estão configurados neste projeto JavaScript; build e inspeção não são equivalentes a eles.
`;
await writeFile('audit/06-testes.md',report);
console.log(JSON.stringify({axeCases:axe.length,violations:axe.reduce((s,a)=>s+a.violations.length,0),http: http.length,assets:assets.length,metrics:metrics.map(m=>({mode:m.mode,scores:m.scores}))}));

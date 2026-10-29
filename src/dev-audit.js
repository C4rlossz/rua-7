// Local-only inspection harness, removed from production by the DEV branch.
import axe from 'axe-core';
const box=document.createElement('section');box.id='audit-tools';box.style.cssText='position:fixed;bottom:4px;right:4px;z-index:9999;padding:8px;background:white;border:2px solid #24123f;color:#24123f';
const button=document.createElement('button');button.textContent='Executar auditoria de acessibilidade';button.style.cssText='min-height:44px;padding:10px;color:#24123f;background:#ede9fe';
const output=document.createElement('output');output.id='audit-result';output.hidden=true;output.setAttribute('aria-live','polite');
button.onclick=async()=>{button.disabled=true;button.textContent="Auditando…";try{const result=await axe.run({exclude:[['#audit-tools']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}});output.textContent=JSON.stringify({url:location.pathname,date:new Date().toISOString(),violations:result.violations,passes:result.passes.map(p=>({id:p.id,description:p.description})),incomplete:result.incomplete});button.textContent='Auditoria concluída: '+result.violations.length+' ocorrências';document.body.dataset.auditComplete='true';}catch(error){output.textContent=JSON.stringify({error:String(error)});}finally{button.disabled=false;}};
box.append(button,output);document.body.append(box);

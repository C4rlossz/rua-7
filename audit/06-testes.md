# G — Testes, funcionalidade, performance e evidências

Ambiente local Windows, Node.js 24, npm, Vite, Chromium headless para Lighthouse e navegador integrado para testes manuais. Data de referência: 27/10/2026. Relatório gerado dos arquivos de evidência, sem simular execução de CI ou serviços remotos.

## Execução e resultados

- npm test: baseline com 11 testes aprovados; após correções, **17 aprovados, zero falhas** em evidence/tests-after.txt. Inclui centavos/estoque, tamanho obrigatório, sacola adulterada, recibo sem dados pessoais, limites de produto, URL não confiável, armazenamento indisponível, limpeza local, claim administrativa, rascunho de direitos e integridade/volume do novo GLB.
- Teste de regressão inicial de limites de texto falhou pelo motivo esperado antes da implementação (hardening-red.txt), depois passou. JSON das regras inválido encontrado e reparado; parse/contrato local aprovados, sem equivaler a teste Firebase.
- npm run build: aprovado em evidence/build-after.txt. Inventário dos módulos efetivamente renderizados em bundled-modules.json. Harness axe e ferramentas de desenvolvimento não entram no build.
- npm audit: antes quatro alertas altos propagados, depois zero. Arquivos npm-audit-before/after. Scanner fonte/histórico em snapshot-after e diff-check documentam escopo e resultado final.
- Fluxo manual: produto sem tamanho foi bloqueado, tamanho 40 selecionado, checkout preenchido pelo exemplo fictício, revisão e conclusão sem cobrança. Recibo R7-5E15D550, 2 itens, total R$ 999,80, sem dados de contato no resumo (order-after.txt). Novo teste móvel abriu checkout com uma unidade.
- Busca: foco inicial no campo, Shift+Tab até Fechar, Escape e retorno de foco observados. Controles de 3D, giro, zoom e restauração observados. Sessão nova da produção: zero erros/avisos em console-production.json após desativar decodificadores não usados pelo GLB original. Durante edição houve erro transitório de hot reload, resolvido ao recarregar; não foi apresentado como falha de produção persistente.
- Formulário de direitos: texto de teste gerou rascunho e aviso de que nada foi enviado. Não houve envio de e-mail ou aceitação de contrato real.
- Prévia HTTP: 16 caminhos consultados, 16 respostas 200; tipos no final-summary.json. Resposta HTML em uma rota SPA não comprova sozinha seu funcionamento. As rotas interativas principais foram verificadas no navegador.

## Acessibilidade automatizada por estado

| Evidência final | Violações detectadas | Itens que exigem análise manual |
|---|---:|---:|
| axe-home-mobile-after.json | 0 | 1 |
| axe-product-mobile-after.json | 0 | 2 |
| axe-product-3d-after.json | 0 | 2 |
| axe-login-mobile-after.json | 0 | 1 |
| axe-admin-login-after.json | 0 | 1 |
| axe-rights-mobile-after.json | 0 | 0 |
| axe-privacidade-after.json | 0 | 0 |
| axe-termos-after.json | 0 | 0 |
| axe-cookies-after.json | 0 | 0 |
| axe-acessibilidade-after.json | 0 | 0 |
| axe-atendimento-after.json | 0 | 0 |
| axe-checkout-after.json | 0 | 1 |
| axe-admin-catalog-after.json | 0 | 1 |

Zero violações nesses casos não equivale a WCAG integral. O conjunto final inclui WCAG 2/2.1 A/AA e 2.2 AA pertinentes à ferramenta; casos anteriores à ampliação de tags têm escopo menor. Leitores de tela reais, zoom de texto, aparelhos físicos e todos os estados não foram demonstrados. 04-acessibilidade.md registra recursos, correções e limites.

## Lighthouse de laboratório — pontuações 0 a 100

| Ambiente | Performance | Acessibilidade | Boas práticas | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Desenvolvimento antes | 60 | 91 | 100 | 92 | 40.77 s | 280 ms | 0.00000 |
| Desenvolvimento depois | 65 | 100 | 100 | 66 | 23.63 s | 131 ms | 0.00004 |
| Preview de produção depois | 84 | 100 | 100 | 66 | 4.51 s | 12 ms | 0.00004 |

Comparar desenvolvimento antes/depois nas mesmas condições locais é uma indicação, com variação de execução; o preview de produção é outra condição e não substitui o baseline. Estes valores não são Core Web Vitals de usuários reais nem p75 de campo. O LCP de produção ainda exige melhoria e validação na hospedagem real; não foi declarado aprovado em todos os limiares de campo. TBT não é INP.

SEO caiu por decisão explícita de manter a demonstração não indexável (robots e noindex). Isso não impede acesso direto público futuro. Canonical, sitemap e indexação comercial aguardam domínio e ofertas definitivos; nenhum endereço canônico foi inventado. Open Graph básico está presente. Cache/CDN/TLS e metadados de compartilhamento remotos ainda precisam de teste.

Melhorias: banner móvel de 64.084 bytes em vez do PNG de 2.404.060, JPEG desktop 255.787, logo otimizada 31.354. Fontes locais. O primeiro carregamento dispensa o SDK Firebase sem configuração. O 3D carrega apenas sob demanda, usa GLB de aproximadamente 2 MB e evita decodificadores não necessários. CSS e código não usados e LCP continuam oportunidades registradas, sem reescrever a arquitetura para obter uma pontuação artificial.

## Não executado / não verificado

Firebase Auth real, recuperação/criação de conta e autorização remota; emuladores (Java ausente), gravação/isolamento no banco, transações comerciais/webhooks, testes de carga/abuso, restauração de backup, pentest de infraestrutura, CI no GitHub, leitores de tela/usuários com deficiência e verificação jurídica integral. Não há cobertura percentual de código medida ou suite automatizada end-to-end no CI; os fluxos de navegador citados foram executados manualmente. Lint/typecheck dedicados não estão configurados neste projeto JavaScript; build e inspeção não são equivalentes a eles.

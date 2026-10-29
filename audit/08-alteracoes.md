# I — Registro de alterações

| Arquivos/grupo | Alteração e motivo |
|---|---|
| public/models, public/images, scripts/build-original-model.mjs | Substituição autorizada das fotos/texturas sem licença por conceito original, renderizações e gerador reproduzível. Campanha e logo comprimidas; banner móvel e descoberta antecipada |
| src/catalog.js, storage.js, store.jsx, assetPolicy.js | Dados limitados, recibos validados, tolerância a armazenamento indisponível, migração das referências antigas e limpeza local controlada |
| src/firebase.js, firebaseClient.js, authz.js, AuthPages.jsx, Admin.jsx | SDK por demanda, sessão do navegador, admin com e-mail confirmado, cancelamento de observadores, labels, privacidade e saída do modo local |
| database.rules.json | Reparação do JSON e restrição de campos, papel administrativo, e-mail e recursos locais. Implantação/teste remoto pendentes |
| src/App.jsx, Home.jsx, ui.jsx, LegalFooter.jsx, audit-improvements.css | Rotas jurídicas, rodapé de autoria, títulos, pausa, contraste, nomes acessíveis, foco de busca e alvos de toque |
| src/LegalPages.jsx, legalContent.js, contactRequest.js, site-info.json | Políticas coerentes com o modo demonstrativo, rascunhos de direitos/contato/acessibilidade e nome/contato configuráveis |
| src/model360.jsx | Decodificadores Draco/Meshopt desativados para os GLBs originais sem compressão. Evita erro de WebAssembly sob CSP sem permitir avaliação insegura de scripts |
| index.html, public/robots.txt, route-preload.js, main.jsx | Metadados, não indexação intencional da demonstração, fontes locais e otimização do banner |
| vite.config.js, firebase.json, public/_headers, scripts/security-headers.mjs | Cabeçalhos de segurança de preview e modelos de implantação; inventário de módulos emitidos |
| package*.json | MIT, versão 1.1.0, correção gRPC, fontes locais e ferramentas de auditoria de desenvolvimento |
| tests | Regressão de dados inválidos, sessão local, autorização, contato e novo objeto 3D |
| scripts/audit-snapshot.mjs, third-party-notices.mjs, build-inventory.mjs, prepare-public-release.mjs | Inventários, hash, licenças, scanner e pacote limpo sem histórico privado |
| README, ASSETS, LICENSE, SECURITY, CONTRIBUTING, CHANGELOG, docs, audit, .github | Documentação, matriz, fontes, evidências e CI preparado |

Mudanças de compatibilidade intencionais: recursos externos arbitrários deixam de ser aceitos por padrão; modelo/fotos antigas não reaparecem ao carregar catálogo salvo; sessão Firebase passa a durar a sessão do navegador; administração remota exige e-mail confirmado. Preços/tamanhos/estoque continuam demonstrativos. O ID antigo do primeiro tênis permanece para não quebrar links. O gerador antigo foi preservado em arquivo privado fora do projeto, sem redistribuição.

Funcionalidades preservadas: identidade roxa/branca, cinco tipos de produto, filtros, favoritos, galeria, giro/zoom 3D, seleção de tamanho, sacola, checkout demonstrativo, interfaces de conta e painel. Não foi adicionada cobrança real. Não houve publicação ou alteração irreversível remota.

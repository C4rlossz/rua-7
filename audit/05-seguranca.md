# F — Segurança

Revisão não intrusiva de código, dependências, configuração, validação e comportamento local. Referência conceitual OWASP Top 10; não é pentest externo, certificação ou prova de ausência de vulnerabilidades.

| Fronteira | Evidência, medida e classificação |
|---|---|
| Dependências vulneráveis | Quatro alertas altos propagados na cadeia gRPC antes; override 1.13.6 após avaliar o advisory, sem rebaixar Firebase. npm audit posterior: zero. CORRIGIDO. [Advisory oficial](https://github.com/grpc/grpc-node/security/advisories/GHSA-m9gg-hp2v-232j) |
| Autorização | Cliente e arquivo de regras exigem claim admin booleana e e-mail confirmado. Sem criação pública de admin. Regras negam acesso à raiz e campos não previstos. JSON inválido anterior reparado. CORRIGIDO em arquivo; NÃO VERIFICADO no servidor |
| Sessão | SDK configurado para browserSessionPersistence; observadores cancelam respostas tardias. Credenciais desabilitadas quando Firebase não configurado. Não há senha fixa no cliente. Configuração remota NÃO VERIFICADA |
| Entradas e persistência | Limites de strings, tipos, números, itens, recibos coerentes e fallback para armazenamento inválido/indisponível. Conteúdo React não usa HTML arbitrário. CORRIGIDO por testes; não se afirma proteção total contra XSS |
| Recursos e privacidade | Origens externas negadas por padrão, GLB local, CSP restringe objetos, base, scripts e conexões. Nenhum upload implementado. SVG/modelo novo deve ser revisado. CORRIGIDO no padrão local |
| Cabeçalhos | CSP, nosniff, no-referrer e Permissions-Policy configurados no preview, firebase.json e _headers. Evidência HTTP local registrada. Aplicação efetiva no Sites e TLS/HSTS reais NÃO VERIFICADOS após publicação |
| Segredos | Scanner de padrões da árvore atual e textos únicos no histórico alcançável; resultado final em snapshot-after. Achado inicial de URL de credencial era dado fictício de teste, removido como literal. Sem resultado exposto em texto puro. Não equivale a revisão completa de binários, todos os refs remotos ou segredos desconhecidos |
| SQL/SSRF/CSRF | Não há SQL, fetch de URL pelo servidor ou sessão própria baseada em cookie para mutações. NÃO APLICÁVEL a esses mecanismos ausentes; não prova segurança dos provedores ou de código futuro |
| CORS e APIs | Sem API HTTP própria. Realtime Database e Auth dependem de configuração/regras do provedor; CORS não é autorização. NÃO VERIFICADO remoto |
| Criptografia, logs e abuso | Trânsito/repouso em infraestrutura externa, quotas, alertas, MFA, rate limiting, backups e restauração NÃO VERIFICADOS. Não se fabricou proteção no front-end que possa substituir o servidor |

Riscos residuais: Firebase não conectado, regras não testadas em emulador/produção, implementação futura de pagamento/estoque ausente, provedor sem inspeção contratual e cabeçalhos remotos pendentes. Java não disponível para executar emuladores neste ambiente; teste unitário do JSON não é teste de autorização Firebase.

CI configurada com leitura mínima, sem persistir credencial de checkout, testes/build/audit e scanner. Ainda usa tags de ações v4, não SHA imutável; endurecer supply chain e validar CI em repositório real. Nenhuma action foi executada no GitHub nesta auditoria. Procedimentos de relato e incidente: SECURITY.md e docs/OPERATIONS.md.

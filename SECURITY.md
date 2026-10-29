# Segurança

Relate falhas a Carloseduardo1402@gmail.com, informando versão, rota, passos mínimos e impacto. Não envie senhas, tokens, documentos pessoais ou dados de terceiros. Não publique detalhes exploráveis antes de combinar tratamento com o responsável.

Versão auditada: 1.1.0, 27/10/2026. Canal operacional e tempo de resposta dependem de Carlos Eduardo; não há SLA contratado nem equipe 24 horas.

Esta aplicação é demonstrativa. Não processe pagamentos nem dados de clientes reais. Firebase remoto, quotas, monitoramento, alertas e restauração ainda precisam de configuração e testes. Uma permissão administrativa exige custom claim `admin: true` atribuída pelo servidor e e-mail confirmado. Nunca coloque conta de serviço ou Admin SDK no cliente. Variáveis `VITE_*` são públicas no navegador.

Antes de atualizar dependências: `npm ci`, `npm test`, `npm audit --audit-level=high`, `npm run build` e `npm run audit:source`. Não execute correções forçadas ou rebaixamentos sem avaliar incompatibilidades. O scanner local usa padrões e não substitui uma revisão especializada.

O histórico privado contém recursos substituídos sem autorização de redistribuição. Publique somente o pacote limpo preparado em `exports`, com histórico novo. Consulte o checklist da auditoria antes de qualquer publicação.

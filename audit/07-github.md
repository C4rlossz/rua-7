# H — Preparação do GitHub

APROVADO em arquivo: README com instalação, limites e rotas; LICENSE MIT escolhida por Carlos Eduardo; .gitignore e .env.example; SECURITY, CONTRIBUTING, CHANGELOG, arquitetura, procedimentos, documentação de políticas e inventário de recursos.

CORRIGIDO: referências atuais aos recursos substituídos e credenciais de demonstração foram revisadas. Scanner de padrões cobre fontes atuais e blobs de texto únicos do histórico Git alcançável; evidência em snapshot-after. Um achado intermediário foi a URL fictícia de teste, não uma credencial de serviço; a fixture passou a construir a URL em memória, preservando o teste de rejeição. O scanner não é atestado universal de ausência de segredo.

PENDENTE: destino GitHub/conta não informados, CI ainda não executou remotamente, ações por tag em vez de SHA, revisão de licenças/ativos e aprovação pública. A conta de contato é dado público intencional e autorizado, não deve ser removida como falso segredo.

**Não publicar o histórico atual:** ele conserva fotos sem autorização e capturas antigas. Script release:prepare cria fonte limpa sem .git, node_modules, .openai, credenciais ou relatório Lighthouse anterior com imagens antigas. ZIP não contém configurações da conta de hospedagem. A pasta é apropriada para iniciar um repositório novo após revisar as pendências. Não se reescreveu ou apagou o histórico privado.

Comandos de preparação não executam git push ou deploy. Um futuro colaborador deve revisar RELEASE-MANIFEST.json, rodar npm ci/test/build/audit, validar o checklist e somente então realizar publicação autorizada. A execução do CI foi preparada, não simulada como aprovada.

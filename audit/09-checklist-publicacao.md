# J — Checklist de publicação

## Preparação local e demonstração

| Item | Situação e evidência |
|---|---|
| Responsável e contato autorizados | APROVADO — site-info, rodapé e documentos: Carlos Eduardo, e-mail fornecido |
| Licença do código | APROVADO — MIT escolhida, LICENSE e pacote |
| Fotos sem autorização na árvore atual | CORRIGIDO — conceito original, testes do GLB e inventário |
| Histórico antigo em pacote público | CORRIGIDO pela exportação sem .git; NÃO publicar histórico privado |
| Segredos conhecidos | APROVADO somente no escopo do scanner final de padrões; revisão humana complementar recomendada |
| Testes essenciais e compilação | APROVADO conforme evidence/tests-after e build-after; não inclui backend real |
| Checkout sem cobrança | APROVADO — teste manual e unitário; sem pedido comercial ou envio |
| Políticas e controle local | CORRIGIDO — rotas e formulários coerentes com demo; rascunho não envia automaticamente |
| Acessibilidade | CORRIGIDO nos estados medidos; PENDENTE leitores de tela, zoom real e aparelhos físicos |
| Licenças e marca | PENDENTE — confirmar evidências exatas de versões sinalizadas, proveniência de IA e busca de marca conforme uso pretendido |
| Menores, fornecedores e escopo legal público | PENDENTE — avaliação humana de ECA Digital/acesso provável, contratos/transferências e retenção |
| CI, headers e comportamento no provedor | NÃO VERIFICADO remotamente. Revalidar após implantação autorizada, antes de abrir contas reais |
| Aprovação expressa para publicação | PENDENTE — exigida pelo prompt do usuário, seções 10 e 15. Não houve push ou mudança pública nesta auditoria |

## Bloqueadores para contas e vendas reais

Firebase: autenticar a conta proprietária, criar/selecionar projeto, configurar Auth/Database, atribuir admin no servidor, verificar e-mail, testar recuperação, regras negativas/positivas no emulador e projeto correto, domínios, quotas e abuso. Nenhuma dessas integrações remotas pode ser aprovada pela presença das telas.

Comércio: confirmar fotos licenciadas ou produtos próprios, preço, tamanhos, estoque por variação, reserva transacional, identificação legal do fornecedor, endereço/canais legalmente adequados, política de entrega/arrependimento/troca/reembolso e gateway com validação do servidor e webhooks. Os cinco itens atuais são ilustrativos; não ativar cobrança com este catálogo.

Operação: concluir avaliação de privacidade/menores, contratos de fornecedores e transferências internacionais; adotar atendimento a direitos, incidentes, retenção, backups e restauração. Verificar acessibilidade com pessoas/tecnologias reais. Rever score de desempenho na hospedagem e condições de rede reais. Somente depois ativar indexação, domínio canônico, sitemap e metadados comerciais.

## Procedimento futuro de publicação autorizada

Revisar riscos e recursos com o titular; confirmar o que será público. Usar o pacote limpo, iniciar histórico novo, executar npm ci/test/audit/build e validar hospedagem em prévia. Conferir status HTTP de páginas/ativos, redirecionamento SPA, TLS, cabeçalhos, ausência de dados privados, política de cookies real do provedor e retorno do domínio. Solicitar aprovação expressa do resultado concreto antes de push/abertura pública. Uma aprovação não substitui licenças, direitos ou obrigações legais pendentes.

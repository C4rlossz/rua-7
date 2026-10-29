# B — Privacidade e LGPD

Controlador proposto: Carlos Eduardo, pessoa física, canal Carloseduardo1402@gmail.com. Identificação pública aprovada pelo usuário. Não se inventou CNPJ, endereço, CPF ou encarregado contratado. A qualificação contratual dos provedores como operadores/controladores e a rotina de atendimento precisam ser confirmadas pelo responsável.

O código atual é demonstrativo, sem pagamento e sem Firebase configurado. A classificação abaixo diferencia operação observada e operação futura. Bases são avaliação contextual proposta, sujeita à validação humana; não se presume que todo dado técnico ou identificador de produto seja pessoal isoladamente.

| Operação | Dados, finalidade e fluxo | Base proposta / retenção / situação |
|---|---|---|
| Sacola e favoritos | IDs, tamanhos e quantidade no localStorage; escolhas do visitante, potencialmente pessoais se associadas à identidade/dispositivo | Avaliar necessidade para funcionalidade solicitada e contexto pré-contratual, art. 7º V quando aplicável; outra base exige justificativa. Até limpeza pelo visitante/navegador. CORRIGIDO: controle em /cookies |
| Catálogo local | Dados públicos de produto e edições do painel demonstrativo | Não há necessidade de inserir dados pessoais. Até limpeza. APROVADO no escopo de minimização local |
| Checkout de teste | Nome, e-mail e endereço apenas na memória do formulário; exemplo fictício disponível | Evitar dados reais. Se visitante os inserir, há tratamento transitório a considerar; não usar consentimento universal. Descartados ao desmontar o formulário; não enviados pela aplicação. CORRIGIDO no desenho atual |
| Recibo demonstrativo | Produtos, tamanhos, quantidades, total, ID aleatório e data na sessão | Sem nome/e-mail/endereço. Até fim da sessão ou limpeza; máximo 100 resumos. APROVADO por teste de conteúdo e validação |
| Contato e direitos | Assunto, texto e e-mail opcional inicialmente locais; rascunho por mailto ou TXT | Direitos: obrigação legal, art. 7º II. Contato comercial: art. 7º V quando procedimento solicitado; outros casos exigem base própria. Só há envio pelo aplicativo do visitante. Retenção mínima/proporcional a definir operacionalmente. PENDENTE adoção do procedimento |
| Conta futura | Nome, e-mail, credenciais e sessão no Firebase Auth | Art. 7º V para conta solicitada, sujeito ao contexto. SDK configurado com persistência de sessão. Encerramento e retenções devem ter fluxo operacional. NÃO VERIFICADO remotamente |
| Catálogo remoto futuro | Leitura pública, alteração por administrador autorizado | Evitar dados pessoais no catálogo. Função administrativa deve ter controle de acesso e logs proporcionais. NÃO VERIFICADO |
| Hospedagem e segurança | Servidor recebe IP, dados técnicos e requisições | Interesse legítimo pode ser pertinente à segurança, art. 7º IX, com avaliação de necessidade, balanceamento e transparência; não presumido automaticamente. Provedor, prazo de logs, contrato e transferência NÃO VERIFICADOS |

A LGPD prevê bases distintas, direitos e medidas de segurança; crianças exigem análise própria de melhor interesse. Fontes: [LGPD atualizada, arts. 3º, 7º, 14, 18–19, 33 e 46](https://www2.camara.leg.br/legin/fed/lei/2018/lei-13709-14-agosto-2018-787077-normaatualizada-pl.html), [ANPD — tratamento de dados de menores](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes).

## Cookies, fornecedores e transferências

Não foram identificados analytics, pixels ou cookies opcionais no código importado. A presença do pacote Firebase no lockfile não prova ativação de todos os seus serviços. As fontes agora são servidas localmente. O inventário de armazenamento está publicado em /cookies; não se criou banner de consentimento fictício para rastreadores inexistentes. Isso não atesta a ausência de cookies da plataforma de hospedagem ou do login privado da prévia anterior. [Guia da ANPD sobre cookies](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia_orientativo_cookies_e_protecao_de_dados_pessoais).

Sites/hospedagem, Google/Firebase quando ativado e e-mail podem envolver outros países. Não foi comprovada residência exclusiva no Brasil, contrato, prazo de logs ou mecanismo de transferência. Confirmar termos, suboperadores, garantias e mecanismos válidos antes da operação real. Não afirmar adequação contratual sem examinar a contratação concreta.

## Direitos, riscos e operações humanas

Implementados: aviso, termos, armazenamento descrito, limpeza local e formulário de direitos. O formulário não envia nem recebe mensagens automaticamente, nem cria protocolo. Procedimento em docs/OPERATIONS.md cobre identificação proporcional, acesso/correção/exclusão e retenção mínima do registro de atendimento. A exclusão de conta em servidor ainda depende de atendimento humano e do serviço ativado.

Dados sensíveis, documentos, crédito e decisões de elegibilidade: NÃO APLICÁVEL às funcionalidades implementadas; texto livre pode receber dados indevidos, motivo para aviso de minimização e revisão humana. Marketing/perfilização: NÃO APLICÁVEL no código atual. Revogação e registro de consentimento opcional: NÃO APLICÁVEL sem operação opcional baseada em consentimento; implementar se a operação mudar.

RIPD: PENDENTE decisão fundamentada conforme risco, escala, menores e ativação futura. Não há conclusão automática de dispensa. Antes de disponibilização pública, avaliar acesso provável de crianças/adolescentes e alcance do ECA Digital vigente; site de streetwear não pode presumir público exclusivamente adulto. Não se implementou coleta de documento ou falsa barreira de idade. [Lei 15.211/2025](https://www2.camara.leg.br/legin/fed/lei/2025/lei-15211-17-setembro-2025-797997-normaatualizada-pl.pdf), [ANPD — ECA Digital](https://www.gov.br/anpd/pt-br/assuntos/noticias/eca-digital).

GDPR: acesso global, sozinho, não demonstra direcionamento à União Europeia. Não foram identificados entrega fora do Brasil, segmentação europeia ou monitoramento comportamental no código. É uma inferência de escopo, não parecer de inaplicabilidade; reavaliar se oferecer a residentes na UE ou monitorar comportamento abrangido. [Comissão Europeia — aplicação territorial](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/application-gdpr_en).

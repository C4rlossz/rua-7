# Cookies e armazenamento

Inventário da aplicação e controles do navegador. Atualização: 27 de outubro de 2026.

## Tecnologias identificadas

No código auditado não foram encontrados pixels de publicidade, analytics ou cookies opcionais de rastreamento. As fontes foram movidas para o próprio site. O armazenamento de sacola e favoritos utiliza localStorage; o resumo de pedidos de teste utiliza sessionStorage. Isso não equivale a cookies enviados automaticamente em toda requisição.

## Chaves e duração

rua7.cart.v1: produto, tamanho e quantidade; rua7.favorites.v1: produtos favoritos; rua7.catalog.v1: catálogo demonstrativo local. Permanecem até a limpeza ou remoção pelo navegador. rua7.demo-orders: até 100 resumos de demonstração, limitados à sessão. Não há marketing nessas chaves.

## Autenticação e plataforma

Quando o Firebase estiver ativo, o SDK de autenticação poderá usar armazenamento de sessão para a conta. A plataforma de hospedagem também pode usar tecnologias próprias, inclusive para o acesso privado da versão anterior. O inventário da aplicação não afirma ausência de cookies em toda a infraestrutura do provedor. A publicação pública e seus cabeçalhos precisam ser verificados após autorização.

## Preferências e consentimento

Como não há ferramentas opcionais de rastreamento ativas, não é exibido um banner com um consentimento fictício para ferramentas inexistentes. Se forem adicionadas, deverão permanecer bloqueadas até a escolha adequada, com opção de rejeitar e revisar preferências. As funções solicitadas pelo visitante são analisadas por sua finalidade, sem transformar consentimento em base universal.

## Limpar dados

O controle abaixo limpa sacola, favoritos, edições do catálogo demonstrativo e resumos locais da loja. Dados públicos padrão podem reaparecer para permitir a navegação. Ele não elimina uma conta em servidor nem dados de outros serviços. Para uma solicitação ao responsável, use o canal de privacidade.

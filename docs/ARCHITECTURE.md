# Arquitetura e limites

Aplicação React 19 com JavaScript, Vite e React Router. Store em contexto mantém sacola, favoritos, catálogo local e recibos demonstrativos. Valores monetários são inteiros em centavos; estoque é agregado por produto, não uma reserva transacional. O checkout não é um sistema de pedidos comercial.

As páginas de produto, checkout, autenticação, administração e documentos são carregadas por demanda. O visualizador Three.js/React Three Fiber/Drei só é importado ao abrir o 3D. Geometria original em GLB autocontido, sem imagens embutidas. Há galeria alternativa e controles por teclado; giro automático inicia desligado.

`firebase.js` é a fronteira de configuração. Sem configuração, não importa SDK nem envia credenciais. Quando conectado, `firebaseClient.js` usa Authentication e Realtime Database. Escrita do catálogo exige claim administrativa booleana e e-mail confirmado no cliente e nas regras. O painel local de demonstração não concede privilégios remotos. As regras não são um backend de pagamento nem de estoque.

`assetPolicy.js` limita recursos à origem local por padrão. A configuração de origens HTTPS extras exige revisão coordenada da CSP e das regras do banco; não basta alterar uma variável. SVGs e modelos devem ser revisados antes de entrar no diretório público. GLB pode conter referências externas; a CSP restringe conexões, mas o editor não valida os bytes de um arquivo enviado por outro meio.

`site-info.json` centraliza autoria, contatos, versão, território e modo. `legalContent.js` contém o texto das páginas jurídicas. Atualize também os espelhos em docs/legal quando alterar a política. Formulários de contato apenas geram rascunho local ou arquivo TXT; envio e recebimento por e-mail dependem da ação do visitante e dos provedores.

Os cabeçalhos são definidos em scripts/security-headers.mjs e espelhados em firebase.json e public/_headers. Vite dev permite código inline do recarregamento; preview usa política de produção. A hospedagem real precisa demonstrar que aplica os cabeçalhos. HSTS e cache de arquivos versionados dependem do domínio e do provedor, sem ativação de preload presumida.

Não há servidor SQL, upload HTTP, integração de pagamento, monitoramento próprio, analytics ou mecanismo de publicidade implementados. Não há garantia de criptografia em repouso auditada na infraestrutura externa. Código-fonte e políticas não comprovam configuração efetiva de um provedor.

Os modelos atuais usam GLB sem compressão Draco/Meshopt. Decodificadores opcionais foram desativados para evitar inicialização de WebAssembly sob a CSP. Um modelo futuro com essas compressões exige revisão coordenada do carregador e da política; não ampliar `unsafe-eval` para contornar um erro sem necessidade.

# Inventário e direitos dos recursos

Data: 27/10/2026. Responsável pelo projeto: Carlos Eduardo. A escolha MIT aplica-se ao código original e documentação de software, preservadas licenças de terceiros. Não concede licença de marca nem certifica exclusividade de conteúdo gerado por IA. Os recursos visuais são fornecidos para esta aplicação Rua 7; não se declara aqui uma licença aberta geral de marca ou imagens. Os direitos sobre saídas de IA dependem dos termos aplicáveis e da lei.

| Arquivo/grupo | Origem e evidência | Condições, atribuição e uso comercial | Situação |
|---|---|---|---|
| `public/models/rua7-movimento-v2.glb` | Geometria procedural produzida para o projeto; gerador em scripts/build-original-model.mjs; teste verifica ausência de fotos/texturas externas | Conceito original da Rua 7 com assistência de código; bibliotecas mantêm licenças próprias. Não representa produto físico nem afirma registro de desenho | CORRIGIDO — substituiu o modelo com texturas sem autorização |
| `public/images/rua7-movimento-0.png` a `5.png` | Seis capturas do render local do mesmo GLB; lateral, perspectiva, interna, calcanhar, superior e solado | Sem fotos de terceiros incorporadas; finalidade ilustrativa informada ao visitante | CORRIGIDO — origem e processo identificados |
| `public/images/campaign.png`, `campaign-optimized.jpg`, `campaign-mobile.jpg` | Imagem de campanha produzida com image_gen na etapa anterior; JPG é compressão do mesmo original | Saída de IA; sem prova de exclusividade, registro ou busca exaustiva de similaridade. Uso no projeto condicionado aos termos do serviço e direitos de terceiros | PENDENTE — revisão humana de similaridade e registro de termos aplicáveis |
| `public/images/logo.png`, `logo-optimized.png` | Identidade criada com assistência de IA para Rua 7 na etapa anterior; versão otimizada mantém composição e transparência | Não presumir registro da marca Rua 7 nem inexistência de marcas semelhantes. Não coberta por licença de marca MIT | PENDENTE — busca de marca e confirmação de proveniência contratual |
| `public/favicon.svg` e desenhos em src/ui.jsx | Vetores da interface criados para o projeto: símbolo 7, blusa, calça, boné | Código dos desenhos integra o código original MIT; marca e produto ilustrativo permanecem identificados | APROVADO — fonte local inspecionável |
| Inter e Barlow Condensed, @fontsource 5.3.0 | Pacotes locais com arquivos LICENSE, hashes no inventário de dependências | SIL OFL-1.1; conservar aviso, cumprir restrições de nomes reservados e não vender a fonte isoladamente | APROVADO — evidência local de licença |
| Ícones lucide-react | Pacote instalado e licença local | ISC; preservar aviso de copyright e licença | APROVADO — evidência local |
| React, Motion, Three.js, Drei, Fiber, Firebase e transitivas | package-lock.json, audit/evidence/dependency-licenses.json, docs/licenses e avisos públicos | Licenças individuais MIT, ISC, Apache-2.0, BSD e demais declaradas; código Rua 7 não relicencia bibliotecas. Algumas versões têm só metadados ou texto upstream atual | PENDENTE — fechar evidência exata dos itens sinalizados antes de redistribuição integral |
| Capturas novas em qa | Capturas locais somente da versão com recursos originais | Não contêm fotos antigas nem dados reais de clientes | APROVADO quando presentes e revisadas |

## Recursos retirados

As seis fotos `air-floral-*`, o GLB `tenis-floral-v1.glb`, o gerador antigo e capturas com essas imagens foram retirados da árvore de trabalho com autorização expressa do usuário. Foram preservados fora do projeto para recuperação privada, e não entram no pacote limpo. Os arquivos anexados originalmente pelo usuário não foram alterados. O **histórico Git privado ainda contém cópias**; não foi reescrito. Não se concede qualquer autorização sobre as fotos ou marcas presentes nelas.

## Evidências e limites

O inventário automatizado lista arquivo, tamanho e SHA-256 dos recursos locais. `dependency-licenses.json` distingue arquivos locais, metadados, licença upstream não vinculada à versão e pacotes opcionais não instalados. Não confundir declaração no package.json com uma verificação jurídica completa. `webgl-constants` não declarava licença nos metadados, mas o LICENSE instalado contém MIT e o aviso de Tim van Scherpenzeel.

Os textos coletados de branches upstream estão identificados por URL, data e hash em docs/licenses/sources.json; não foram apresentados como a licença exata de cada versão publicada. Ausências e diferenças de versão continuam explícitas. Incluiu-se o texto conjunto Apache/BSD do Firebase, sem afirmar que todos os subcomponentes são exclusivamente Apache.

Os [Termos da OpenAI](https://openai.com/policies/terms-of-use/) atribuem ao usuário direitos sobre saídas na extensão permitida pela lei e alertam sobre semelhanças e direitos de terceiros. Isso não substitui autorização para entradas de terceiros ou busca de marca. Confirme a modalidade contratual e os termos efetivamente aplicáveis à conta usada na geração.

Prompt registrado da campanha: tênis original branco e lavanda sobre concreto lilás, composição editorial ampla, sem marcas, sem símbolo Nike e sem marca d’água. O texto completo de criação estava documentado no histórico privado anterior; não é prova de exclusividade da saída.

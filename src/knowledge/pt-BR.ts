import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'electronic-digital-wet-signatures',
    title: 'Assinaturas eletrônicas, digitais e de próprio punho',
    summary: 'Três coisas que chamamos de "assinatura", e qual delas este app cria.',
    group: 'O básico',
    body: `A palavra "assinatura" é usada para coisas bem diferentes. Vale a pena saber distingui-las.

## A assinatura de próprio punho

É a assinatura tradicional: você escreve seu nome à tinta no papel. Em inglês ela é chamada de assinatura "molhada", porque a tinta ainda está fresca na página.

## A assinatura eletrônica

Uma assinatura eletrônica é qualquer forma eletrônica de mostrar que você concorda com um documento. Pode ser tão simples quanto uma imagem da sua assinatura manuscrita colocada em um PDF, um nome digitado ou uma caixa marcada em um site. Muitos países reconhecem a assinatura eletrônica para uma grande variedade de acordos do dia a dia, embora alguns documentos, como certos atos imobiliários, de família ou judiciais, possam ter regras adicionais.

## A assinatura digital

Uma assinatura digital é um tipo técnico específico de assinatura eletrônica. Ela usa criptografia e um certificado, normalmente emitido por uma entidade confiável, para selar o documento. Se alguém alterar o arquivo depois, um programa como um leitor de PDF pode detectar isso e mostrar a assinatura como inválida.

## O que o Universal Signatures cria

O Universal Signatures cria **assinaturas eletrônicas**. Ele coloca uma imagem da sua assinatura desenhada ou digitada em uma página de um PDF. Ele não adiciona ao arquivo uma assinatura digital baseada em certificado.

Se você optar por adicionar um certificado de assinatura (veja "Certificados de assinatura e registros verificáveis"), também recebe um registro independente da impressão digital do documento, que ajuda a mostrar mais tarde que um arquivo é aquele que você assinou. É uma prova útil, mas não é o mesmo que uma assinatura digital baseada em certificado.

## Uma observação sobre a lei

Se uma assinatura eletrônica é aceitável depende de onde você está, do tipo de documento e do que as outras partes aceitam. Estas são informações gerais, não aconselhamento jurídico. Se um documento for realmente importante, confirme o que o destinatário aceita ou consulte um profissional qualificado.`,
  },
  {
    id: 'signature-image-formats',
    title: 'Por que sua assinatura é um PNG transparente',
    summary: 'Formatos de imagem explicados, e por que a transparência importa em uma assinatura.',
    group: 'O básico',
    body: `Toda assinatura criada neste app, seja desenhada, digitada ou desenhada no celular, é transformada em uma imagem PNG com fundo transparente. Veja por quê.

## Pixels e formatos

Uma imagem digital é uma grade de quadradinhos coloridos chamados pixels. Um formato de imagem é simplesmente uma forma combinada de guardar essa grade em um arquivo. Os mais comuns são:

- **JPEG** foi feito para fotos. Ele deixa os arquivos menores descartando detalhes que o olho mal percebe. Não tem transparência, então cada pixel tem uma cor sólida, geralmente branco em volta de uma assinatura.
- **PNG** guarda cada pixel exatamente como era (é "sem perdas") e aceita transparência, então os pixels podem ser total ou parcialmente transparentes.
- **WebP** é um formato mais novo que pode usar os dois tipos de compressão e também aceita transparência, mas programas mais antigos nem sempre o reconhecem.

## Por que a transparência importa

Documentos raramente são totalmente brancos. Pode haver uma linha de assinatura, uma caixa sombreada, um campo de formulário ou texto impresso bem onde você quer assinar. Uma assinatura em JPEG ficaria por cima como um retângulo branco, escondendo o que está embaixo. Um PNG transparente deixa só a tinta, e a página aparece em volta dos traços, como com uma caneta.

## Por que não ter perdas importa

Assinaturas são linhas finas com bordas nítidas. A compressão do JPEG costuma borrar essas bordas e deixar pequenas manchas em volta. O PNG mantém as linhas nítidas.

## Assinaturas digitadas também viram imagens

Quando você digita seu nome, o app o escreve na fonte cursiva escolhida e salva o resultado como PNG. Assim, uma assinatura digitada aparece igual em qualquer computador que abra o PDF, mesmo que a fonte não esteja instalada nele.`,
  },
  {
    id: 'how-signing-works',
    title: 'O que acontece quando você assina um PDF',
    summary: 'Tudo acontece no seu navegador, e o documento nunca é enviado.',
    group: 'Como funciona',
    body: `Assinar um PDF no Universal Signatures acontece inteiramente dentro do seu navegador, no seu próprio dispositivo.

## As etapas

1. Você cria uma assinatura desenhando com o mouse, o dedo ou uma caneta stylus, digitando seu nome em uma fonte cursiva ou desenhando no celular.
2. Você escolhe um PDF. O navegador lê o arquivo e mostra as páginas, sem enviá-lo para lugar nenhum.
3. Você escolhe a página, a posição e o tamanho. Dá para encaixar a assinatura em um canto, em uma borda ou no centro, ou escolher um ponto exato em uma prévia da página.
4. Se você adicionou um nome, uma data ou um horário, pode carimbá-los abaixo da assinatura.
5. O app coloca a imagem da assinatura na página e oferece um novo arquivo para você salvar, com "-signed" acrescentado ao nome original.

Seu arquivo original não é alterado. A cópia assinada é um arquivo novo.

## Funciona offline

Como assinar não depende de nenhum servidor, você pode assinar um PDF com a internet desligada. Só os recursos opcionais precisam de conexão: salvar uma assinatura na nuvem, assinar no celular e adicionar um certificado de assinatura.

## O que ele faz e o que não faz

- Ele coloca uma imagem da sua assinatura em uma página do documento. Não preenche campos de formulário nem junta vários documentos.
- Ele não bloqueia o PDF. Qualquer pessoa com o programa certo ainda poderia editar a cópia assinada. Um certificado de assinatura registra uma impressão digital do original sem assinatura. Ele permite mostrar depois qual documento você assinou, mas não detecta alterações feitas na cópia assinada.
- Assinaturas digitadas usam uma das fontes cursivas incluídas ou um arquivo de fonte que você mesmo importar. Uma fonte importada só é usada no seu dispositivo, durante aquela sessão.

## Dicas

- Assine com um traço firme. Você sempre pode tocar em "Clear" e tentar de novo.
- Use o controle de tamanho em vez do zoom da página, para que a assinatura fique proporcional ao documento.
- Guarde o original sem assinatura se pretende adicionar um certificado de assinatura, porque é esse original que a impressão digital do certificado descreve.`,
  },
  {
    id: 'sign-on-your-phone',
    title: 'Assinar no celular',
    summary: 'Como o QR code e o PIN levam uma assinatura do celular para o computador.',
    group: 'Como funciona',
    body: `Desenhar uma assinatura com o mouse é desconfortável. Assinar no celular permite usar o dedo na tela sensível ao toque, enquanto o documento continua no computador.

## Como funciona

1. No computador, escolha a opção de celular. O app mostra um QR code e um PIN de 6 dígitos.
2. Leia o QR code com a câmera do celular. Uma página de assinatura abre no navegador do celular.
3. Digite o PIN no celular e desenhe sua assinatura.
4. A assinatura aparece no computador, pronta para usar.

## Como a assinatura viaja

O celular e o computador não conseguem se comunicar diretamente, então a imagem da assinatura viaja pela internet através de um retransmissor ao vivo. O retransmissor repassa a mensagem assim que ela chega. Ela não é salva em nenhum banco de dados, e isso funciona da mesma forma com ou sem login.

Só a imagem da assinatura faz esse caminho. O PDF fica no computador o tempo todo.

## O que protege a transferência

- O QR code contém um código aleatório de uso único, difícil de adivinhar, então só quem vê sua tela consegue abrir a página certa.
- O computador só aceita uma assinatura que traga o PIN mostrado na própria tela. Qualquer outra coisa é ignorada.
- Se quiser recomeçar, você pode pedir um novo QR code e um novo PIN.

Trate o QR code e o PIN como qualquer código temporário: não compartilhe foto da sua tela enquanto eles estiverem visíveis.`,
  },
  {
    id: 'signing-certificates',
    title: 'Certificados de assinatura e registros verificáveis',
    summary: 'O que a página de certificado e o QR code opcionais registram, e o que eles comprovam.',
    group: 'Como funciona',
    body: `Quando você está conectado com um Universal ID, pode marcar **Add a signing certificate** (adicionar um certificado de assinatura) antes de assinar. É opcional e gratuito.

## O que você recebe

- Uma **página de certificado** adicionada ao final do PDF assinado.
- Um pequeno **QR code** ao lado da sua assinatura, com a legenda "Scan to verify".
- Um **registro** em nossos servidores que qualquer pessoa com o link pode consultar.

## O que o registro contém

- O endereço de e-mail do seu Universal ID.
- O nome do arquivo original.
- Uma impressão digital SHA-256 (um "hash") do documento como ele era antes de você assinar.
- O horário em que o registro foi criado, pelo relógio do nosso servidor.

O documento em si nunca é enviado. Um hash é uma sequência curta de letras e números calculada a partir do conteúdo do arquivo. O mesmo arquivo sempre gera o mesmo hash, um arquivo que difere em um único caractere gera um completamente diferente, e não é possível reconstruir o arquivo a partir do hash.

## A página de certificado

A página separa os dados registrados pelo nosso servidor (seu e-mail verificado, o horário e o ID do certificado) dos dados informados pelo seu próprio dispositivo (o relógio e o fuso horário dele). Esse segundo grupo aparece marcado como autodeclarado, porque o relógio de um computador pode ser ajustado para qualquer valor. Nenhuma localização é registrada.

## Conferir um documento

Ao ler o QR code, ou abrir o link impresso na página de certificado, aparece o registro: quem assinou, o nome do arquivo, quando foi registrado e a impressão digital. Para confirmar que uma cópia é a que foi assinada, calcule o hash SHA-256 do original sem assinatura e compare com o mostrado. Se forem iguais, o registro se refere exatamente àquele arquivo.

## O que ele não comprova

O registro mostra que um determinado Universal ID registrou a impressão digital daquele documento naquele momento. Ele não confirma a identidade de quem assinou além do endereço de e-mail, e não registra nada sobre onde a pessoa estava.

## Pense no nome do arquivo

O nome do arquivo é uma informação real. Um nome como "Carta de demissão.pdf" diz alguma coisa, mesmo que o conteúdo nunca saia do seu dispositivo. Se isso importar, renomeie o arquivo antes ou deixe a caixa desmarcada. A assinatura funciona exatamente igual sem ela.`,
  },
  {
    id: 'privacy-and-storage',
    title: 'Onde sua assinatura fica guardada',
    summary: 'Salvar neste dispositivo, salvar na nuvem e o que sai do seu dispositivo.',
    group: 'Privacidade e segurança',
    body: `Você pode usar o Universal Signatures sem conta, e sem que nada do que você assina saia do seu dispositivo. Veja exatamente o que é guardado, e onde.

## Salvas neste dispositivo

Você pode guardar até seis assinaturas neste navegador para reutilizá-las depois. Elas ficam no armazenamento do próprio navegador neste dispositivo, sem nenhuma conta. Limpar os dados do navegador para este site as apaga, e elas não acompanham você em outros dispositivos ou navegadores.

## Salvas na nuvem

Se você estiver conectado com um Universal ID, também pode salvar uma assinatura na nuvem para tê-la nos seus outros dispositivos.

- O que é guardado: a imagem da assinatura, o nome que você informou, se ela foi desenhada ou digitada e em qual fonte, uma impressão digital SHA-256 da imagem e a data.
- Quem pode ver: sua conta e os outros membros da sua organização do Universal ID, se você compartilhar uma.
- Uma assinatura salva recebe um link de certificado. Qualquer pessoa com esse link pode ver o nome de quem assinou, o nome da organização, a data e a impressão digital. O link não mostra a imagem da assinatura.
- Você pode remover uma assinatura salva a qualquer momento. Em uma conta gratuita, uma assinatura salva usa seu token gratuito do Signatures, que é devolvido quando você a remove.

O armazenamento na nuvem **não tem criptografia de ponta a ponta**. Os dados trafegam por uma conexão criptografada e são protegidos por regras de acesso, mas nossos sistemas conseguem tecnicamente lê-los. Se você preferir não fazer essa troca, salve neste dispositivo.

## O que sai do seu dispositivo, e quando

- **Nunca:** o PDF que você está assinando, em nenhum recurso deste app.
- **Quando você assina no celular:** a imagem da assinatura desenhada, repassada por um retransmissor ao vivo e não salva.
- **Quando você adiciona um certificado de assinatura:** seu endereço de e-mail, o nome do arquivo e a impressão digital do documento.
- **Quando você salva na nuvem:** a imagem da assinatura e os dados listados acima.
- **Quando você está conectado:** um aviso de que o app foi aberto, para que a página de atividade da sua conta fique correta. Ele não diz nada sobre seus documentos.
- **Enquanto o app está aberto:** um sinal periódico de que ele está em uso, com o nome do app e um ID aleatório criado neste dispositivo, além da sua conta se você estiver conectado.

O app não tem scripts de publicidade nem de rastreamento de terceiros.

## Seu Universal ID

Seu Universal ID é a conta única compartilhada pelos apps da UNI·SIM. Você só precisa dele para os recursos opcionais na nuvem. Assinar um PDF nunca exige um.`,
  },
]

export default articles
